import constants from 'src/constants';
import find from 'lodash/find';

export class AbnormalObsGroupMapper {
  setValue(obsGroup, obs, errors) {
    let updatedObsGroup = obsGroup.addGroupMember(obs);
    const error = find(errors, e => e.errorType === constants.validations.allowRange);
    if (obs.isNumeric() && error) {
      const abnormalChildObs = updatedObsGroup.getAbnormalChildObs();
      updatedObsGroup = updatedObsGroup.addGroupMember(abnormalChildObs.setValue(true));
    }
    return updatedObsGroup;
  }
}
