import constants from 'src/constants';
import find from 'lodash/find';
import { createObsFromControl } from 'src/helpers/Obs';


export class AbnormalObsGroupMapper {
  getInitialObject(formUuid, control, bahmniObservations) {
    return createObsFromControl(formUuid, control, bahmniObservations);
  }

  setValue(obsGroup, obs, errors) {
    let updatedObsGroup = obsGroup.addGroupMember(obs);
    const abnormalChildObs = updatedObsGroup.getAbnormalChildObs();
    const error = find(errors, e => e.message === constants.validations.allowRange);
    if (obs.isNumeric()) {
      if (!obs.getValue()) {
        updatedObsGroup = updatedObsGroup.addGroupMember(abnormalChildObs.void());
      } else {
        const abnormalValue = (error !== undefined);
        updatedObsGroup = updatedObsGroup.addGroupMember(abnormalChildObs.setValue(abnormalValue));
      }
    }
    if (abnormalChildObs === obs) {
      const numericObs = updatedObsGroup.getGroupMembers().filter((o) => o.isNumeric()).get(0);
      if (!numericObs.getValue()) {
        updatedObsGroup = updatedObsGroup.addGroupMember(abnormalChildObs.void());
      }
    }

    const filteredMembers = updatedObsGroup.getGroupMembers()
      .filter(groupMember => groupMember.getValue() !== undefined);
    const voided = updatedObsGroup.getGroupMembers().every((groupMember) => groupMember.isVoided());

    if (filteredMembers.size === 0 || voided) {
      updatedObsGroup = updatedObsGroup.setValue(undefined).void();
    } else {
      updatedObsGroup = updatedObsGroup.set('voided', false);
    }

    return updatedObsGroup;
  }
}
