import { createObsFromControl } from 'src/helpers/Obs';
import isEmpty from 'lodash/isEmpty';
import { cloneDeep } from 'lodash';
import ObservationMapper from '../helpers/ObservationMapper';
import { getUpdatedFormFieldPath } from 'src/helpers/formNamespace';
import { isAnyAncestorOrControlHasAddMore } from 'src/helpers/ControlUtil';

export class ObsGroupMapper {

  getInitialObject(formName, formVersion, control, bahmniObservations, allObs,
                   parentFormFieldPath) {
    this.updateOldObsGroupFormFieldPathForBackwardCompatibility(control, allObs);
    return createObsFromControl(formName, formVersion, control, bahmniObservations,
        parentFormFieldPath);
  }

  updateOldObsGroupFormFieldPathForBackwardCompatibility(control, bahmniObservations) {
    if (isEmpty(bahmniObservations) || !isAnyAncestorOrControlHasAddMore(control)) return;
    const controlPrefix = `/${control.id}`;
    const filteredControlObs = bahmniObservations
        .filter(obs => obs.formFieldPath.includes(controlPrefix));
    filteredControlObs.forEach(obs => {
      this.updateToLatestFormFieldPath(obs, '');
    });
  }

  updateToLatestFormFieldPath(observation, parentFormFieldPath) {
    // eslint-disable-next-line no-param-reassign
    observation.formFieldPath = getUpdatedFormFieldPath(observation, parentFormFieldPath);
      // eslint-disable-next-line no-unused-expressions
    observation.groupMembers && observation.groupMembers.forEach(obs => {
      this.updateToLatestFormFieldPath(obs, observation.formFieldPath);
    });
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
    obsGroup.voided = !record.active || obsGroup.groupMembers &&
                      obsGroup.groupMembers.filter(child => !child.voided).length === 0;
    obsGroup.inactive = !record.active;

    return (obsGroup.uuid === undefined && isEmpty(obsGroup.groupMembers)) ? null : obsGroup;
  }

  getChildren(obs) {
    return obs.groupMembers;
  }
}
