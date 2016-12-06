import { expect } from 'chai';
import { Obs } from 'src/helpers/Obs';
import { List } from 'immutable';
import { ObsGroupMapper } from 'src/mapper/ObsGroupMapper';

describe('ObsGroupMapper', () => {
  const booleanObs = new Obs({
    concept: {
      name: 'Smoking history',
      uuid: 'uuid',
      dataType: 'Boolean',
      conceptClass: 'Misc',
    },
    value: undefined,
    formNamespace: 'formUuid/5',
    uuid: 'booleanUuid',
  });
  const numericObs = new Obs({ concept: {
    name: 'Pulse',
    uuid: 'pulseUuid',
    datatype: 'Numeric',
    conceptClass: 'Misc',
  }, value: 10, formNamespace: 'formUuid/6', uuid: 'childObs1Uuid' });

  const obsGroup = new Obs({ concept: {
    name: 'Pulse Data',
    uuid: 'pulseDataUuid',
    datatype: 'Misc',
  },
    groupMembers: List.of(numericObs, booleanObs),
    formNamespace: 'formUuid/4', uuid: 'pulseDataObsUuid' });

  const mapper = new ObsGroupMapper();

  it('should set value for obs group member', () => {
    const booleanObsUpdated = booleanObs.setValue(true);
    const obsGroupUpdated = mapper.setValue(obsGroup, booleanObsUpdated);

    expect(obsGroupUpdated.getGroupMembers().get(1).getValue()).to.be.eql(true);
  });

  it('should void obsGroup if child obs are not having any value', () => {
    const numericObsUpdated = numericObs.setValue(undefined);
    const obsGroupWithOutValue = new Obs({ concept: {
      name: 'Pulse Data',
      uuid: 'pulseDataUuid',
      datatype: 'Misc',
    },
      groupMembers: List.of(numericObsUpdated, booleanObs),
      formNamespace: 'formUuid/4', uuid: 'pulseDataObsUuid' });
    const obsGroupUpdated = mapper.setValue(obsGroupWithOutValue, booleanObs);

    expect(obsGroupUpdated.isVoided()).to.be.eql(true);
  });

  it('should void obsGroup if child obs are voided', () => {
    const numericObsUpdated = numericObs.void();
    const booleanObsUpdated = booleanObs.void();
    const obsGroupWithChildVoided = new Obs({ concept: {
      name: 'Pulse Data',
      uuid: 'pulseDataUuid',
      datatype: 'Misc',
    },
      groupMembers: List.of(numericObsUpdated, booleanObsUpdated),
      formNamespace: 'formUuid/4', uuid: 'pulseDataObsUuid' });
    const obsGroupUpdated = mapper.setValue(obsGroupWithChildVoided, numericObsUpdated);

    expect(obsGroupUpdated.isVoided()).to.be.eql(true);
  });

  it('should not void obsGroup if any of child obs has value', () => {
    const numericObsUpdated = numericObs.setValue(20);
    const obsGroupUpdated = mapper.setValue(obsGroup, numericObsUpdated);

    expect(obsGroupUpdated.isVoided()).to.be.eql(false);
    expect(obsGroupUpdated.getGroupMembers().get(0).getValue()).to.be.eql(20);
    expect(obsGroupUpdated.getGroupMembers().get(1).getValue()).to.be.eql(undefined);
  });
});
