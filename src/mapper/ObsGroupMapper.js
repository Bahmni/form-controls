import { createObsFromControl } from 'src/helpers/Obs';
import isEmpty from 'lodash/isEmpty';
import { cloneDeep } from 'lodash';
import ObservationMapper from '../helpers/ObservationMapper';
import { getUpdatedFormFieldPath } from 'src/helpers/formNamespace';
import { isAnyAncestorOrControlHasAddMore } from 'src/helpers/ControlUtil';

export class ObsGroupMapper {

  getInitialObject(formName, formVersion, control, currentLayerObservations, allObs,
                   parentFormFieldPath) {
    const updatedObservations = this.updateOldObsGroupFormFieldPathForBackwardCompatibility(control,
      currentLayerObservations, parentFormFieldPath);
    return createObsFromControl(formName, formVersion, control, updatedObservations,
        parentFormFieldPath);
  }
  updateOldObsGroupFormFieldPathForBackwardCompatibility(control, bahmniObservations
    , parentFormFieldPath) {
    if (isEmpty(bahmniObservations) || !isAnyAncestorOrControlHasAddMore(control)) {
      return bahmniObservations;
    }
    const controlPrefix = `/${control.id}`;
    const newObservations = bahmniObservations.map((observation) => {
      if (observation.formFieldPath.includes(controlPrefix)) {
        return this.updateToLatestFormFieldPath(observation, parentFormFieldPath);
      }
      return observation;
    });
    return newObservations;
  }

  updateToLatestFormFieldPath(observation, parentFormFieldPath) {
    let updatedObservation = observation.set('formFieldPath',
      getUpdatedFormFieldPath(observation, parentFormFieldPath));
    if (observation.groupMembers) {
      updatedObservation = updatedObservation.set('groupMembers',
        updatedObservation.groupMembers.map((gm) =>
          this.updateToLatestFormFieldPath(gm, updatedObservation.formFieldPath)));
    }
    return updatedObservation;
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
    const obsGroup = cloneDeep(record.dataSource).toJS();
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
