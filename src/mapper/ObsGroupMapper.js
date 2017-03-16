import { createObsFromControl } from 'src/helpers/Obs';
import isEmpty from 'lodash/isEmpty';
import { cloneDeep } from 'lodash';
import ObservationMapper from '../helpers/ObservationMapper';

export class ObsGroupMapper {

  getInitialObject(formName, formVersion, control, bahmniObservations) {
    return createObsFromControl(formName, formVersion, control, bahmniObservations);
  }

  setValue(obsGroup, obs) {
    let updatedObsGroup = obsGroup.addGroupMember(obs);

    const filteredMembers = this.areAllChildObsVoided(updatedObsGroup.getGroupMembers());
    const voided = updatedObsGroup.getGroupMembers().every((groupMember) => groupMember.isVoided());

    if (filteredMembers.size === 0 || voided) {
      updatedObsGroup = updatedObsGroup.setValue(undefined).void();
    } else {
      updatedObsGroup = updatedObsGroup.setValue(obs.value).set('voided', false);
    }

    return updatedObsGroup;
  }

  areAllChildObsVoided(observations) {
    return observations.filter((obs) => {
      if (!isEmpty(obs.groupMembers)) {
        return this.areAllChildObsVoided(obs.groupMembers);
      }
      return !obs.voided;
    });
  }

  getObject(obsGroup) {
    return obsGroup.getObject(obsGroup);
  }

  getValue() {
    return {};
  }

  getData(record) {
    const obsGroup = cloneDeep(record.dataSource);
    if (obsGroup.formFieldPath !== record.formFieldPath) {
      obsGroup.uuid = undefined;
      obsGroup.formFieldPath = record.formFieldPath;
    }
    obsGroup.groupMembers = (new ObservationMapper()).from(record);
    obsGroup.voided = obsGroup.groupMembers &&
                      obsGroup.groupMembers.filter(child => !child.voided).length === 0;
    obsGroup.inactive = !record.active;

    return obsGroup;
  }

  getChildren(obs) {
    return obs.groupMembers;
  }
}
