import { expect } from 'chai';
import { Obs } from 'src/helpers/Obs';
import { List } from 'immutable';
import { AbnormalObsGroupMapper } from 'src/mapper/AbnormalObsGroupMapper';
import constants from 'src/constants';

describe('AbnormalObsGroupMapper', () => {
  const pulseAbnormalObs = new Obs({ concept: {
    name: 'PulseAbnormal',
    uuid: 'pulseAbnormalUuid',
    datatype: 'Boolean',
    conceptClass: 'Abnormal',
  }, value: false, formNamespace: 'formUuid/5', uuid: 'childObs2Uuid' });

  const pulseNumericObs = new Obs({ concept: {
    name: 'Pulse',
    uuid: 'pulseUuid',
    datatype: 'Numeric',
    conceptClass: 'Misc',
  }, value: 10, formNamespace: 'formUuid/6', uuid: 'childObs1Uuid' });

  const pulseDataObs = new Obs({ concept: {
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

  it.skip('should update abnormal observation when numeric observation is in valid range', () => {
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
    const pulseDataObsUpdated = new Obs({ concept: {
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

  it.skip('should explicitly update abnormal observation if numeric obs has value', () => {
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
});
