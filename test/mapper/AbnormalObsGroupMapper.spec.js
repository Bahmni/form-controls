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
    value: false,
  }, formNamespace: 'formUuid/5', uuid: 'childObs2Uuid' });

  const pulseNumericObs = new Obs({ concept: {
    name: 'Pulse',
    uuid: 'pulseUuid',
    datatype: 'Numeric',
    conceptClass: 'Misc',
    value: 10,
  }, formNamespace: 'formUuid/6', uuid: 'childObs1Uuid' });

  const pulseDataObs = new Obs({ concept: {
    name: 'Pulse Data',
    uuid: 'pulseDataUuid',
    datatype: 'Misc',
  },
    groupMembers: List.of(pulseNumericObs, pulseAbnormalObs),
    formNamespace: 'formUuid/4', uuid: 'pulseDataObsUuid' });

  it('should handle abnormal observations when the numeric observation is in invalid range', () => {
    const mapper = new AbnormalObsGroupMapper();
    const pulseDataObsUpdated = mapper.setValue(pulseDataObs,
        pulseNumericObs, [{ errorType: constants.validations.allowRange }]);
    expect(true).to.be.eql(pulseDataObsUpdated.getAbnormalChildObs().getValue());
  });

  it('should update abnormal observation when numeric observation is still in valid range', () => {
    const pulseAbnormalObsUpdated = pulseAbnormalObs.setValue(true);
    const mapper = new AbnormalObsGroupMapper();
    const pulseDataObsUpdated = mapper.setValue(pulseDataObs,
        pulseAbnormalObsUpdated, []);
    expect(pulseAbnormalObsUpdated).to.be.eql(pulseDataObsUpdated.getAbnormalChildObs());
  });
});
