import { expect } from 'chai';
import { List } from 'immutable';
import { AbnormalObsGroupMapper } from 'src/mapper/AbnormalObsGroupMapper';
import constants from 'src/constants';
import * as Obs from 'src/helpers/Obs';
import sinon from 'sinon';

describe('AbnormalObsGroupMapper', () => {
  const pulseAbnormalObs = new Obs.Obs({ concept: {
    name: 'PulseAbnormal',
    uuid: 'pulseAbnormalUuid',
    datatype: 'Boolean',
    conceptClass: 'Abnormal',
  }, value: false, formNamespace: 'formUuid/5', uuid: 'childObs2Uuid' });

  const pulseNumericObs = new Obs.Obs({ concept: {
    name: 'Pulse',
    uuid: 'pulseUuid',
    datatype: 'Numeric',
    conceptClass: 'Misc',
  }, value: 10, formNamespace: 'formUuid/6', uuid: 'childObs1Uuid' });

  const pulseDataObs = new Obs.Obs({ concept: {
    name: 'Pulse Data',
    uuid: 'pulseDataUuid',
    datatype: 'Misc',
  },
    groupMembers: List.of(pulseNumericObs, pulseAbnormalObs),
    formNamespace: 'formUuid/4', uuid: 'pulseDataObsUuid' });

  const mapper = new AbnormalObsGroupMapper();
  it('should handle abnormal observations when the numeric observation is in invalid range', () => {
    const pulseDataObsUpdated = mapper.setValue(pulseDataObs,
        pulseNumericObs, [{ type: 'warning', message: constants.validations.allowRange }]);
    expect(true).to.be.eql(pulseDataObsUpdated.getAbnormalChildObs().getValue());
  });

  it('should update abnormal observation when numeric observation is in valid range', () => {
    const pulseDataObsUpdated = mapper.setValue(pulseDataObs, pulseNumericObs, []);
    expect(false).to.be.eql(pulseDataObsUpdated.getAbnormalChildObs().getValue());
  });

  it('should void abnormal observation and obsGroup if numeric observation is voided', () => {
    const pulseNumericUpdated = pulseNumericObs.void();
    const pulseDataObsUpdated = mapper.setValue(pulseDataObs, pulseNumericUpdated, []);

    expect(true).to.be.eql(pulseDataObsUpdated.isVoided());
    expect(true).to.be.eql(pulseDataObsUpdated.getAbnormalChildObs().isVoided());
  });

  it('should void obsGroup and numericObs if just abnormalObs has value', () => {
    const pulseAbnormalUpdated = pulseAbnormalObs.setValue(true);
    const pulseNumericUpdated = pulseNumericObs.setValue(undefined).void();
    const pulseDataObsUpdated = new Obs.Obs({ concept: {
      name: 'Pulse Data',
      uuid: 'pulseDataUuid',
      datatype: 'Misc',
    },
      groupMembers: List.of(pulseNumericUpdated, pulseAbnormalUpdated),
      formNamespace: 'formUuid/4', uuid: 'pulseDataObsUuid' });
    const voidedObs = mapper.setValue(pulseDataObsUpdated, pulseAbnormalUpdated, []);
    const voidedNumericObs = voidedObs.getGroupMembers().filter((o) => o.isNumeric()).get(0);

    expect(true).to.be.eql(voidedObs.isVoided());
    expect(true).to.be.eql(voidedObs.getAbnormalChildObs().isVoided());
    expect(true).to.be.eql(voidedNumericObs.isVoided());
  });

  it('should explicitly update abnormal observation if numeric obs has value', () => {
    let pulseDataObsUpdated = mapper.setValue(pulseDataObs, pulseNumericObs, []);
    expect(false).to.be.eql(pulseDataObsUpdated.getAbnormalChildObs().getValue());

    const pulseAbnormalUpdated = pulseAbnormalObs.setValue(true);
    pulseDataObsUpdated = mapper.setValue(pulseDataObs, pulseAbnormalUpdated, []);

    expect(false).to.be.eql(pulseDataObsUpdated.isVoided());
    expect(true).to.be.eql(pulseDataObsUpdated.getAbnormalChildObs().getValue());
  });

  it('should void obsGroup if all of it`s groupMembers has no value', () => {
    const pulseNumericUpdated = pulseNumericObs.setValue(undefined);
    const pulseAbnormalUpdated = pulseAbnormalObs.setValue(undefined);
    let pulseDataObsGroup = mapper.setValue(pulseDataObs, pulseNumericUpdated, []);
    pulseDataObsGroup = mapper.setValue(pulseDataObsGroup, pulseAbnormalUpdated, []);

    expect(pulseDataObsGroup.isVoided()).to.be.eql(true);
  });

  it('should return final object', () => {
    const observationGroup = mapper.getObject(pulseDataObs);
    expect(observationGroup.groupMembers.length).to.eql(2);
    expect(observationGroup.formNamespace).to.eql('formUuid/4');
    expect(observationGroup.groupMembers[0].value).to.eql(10);
    expect(observationGroup.groupMembers[1].value).to.eql(false);
  });

  it('should return initial object', () => {
    const obs = { name: 'someName', uuid: 'someUuid', groupMembers: [] };
    const createObsStub = sinon.stub(Obs, 'createObsFromControl');
    createObsStub.withArgs('someUuid', { id: 1 }, []).returns(obs);
    expect(mapper.getInitialObject('someUuid', { id: 1 }, [])).to.deep.eql(obs);
  });
});
