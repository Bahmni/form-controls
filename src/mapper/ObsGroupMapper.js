import { createObsFromControl } from 'src/helpers/Obs';
import isEmpty from 'lodash/isEmpty';
import flattenDeep from 'lodash/flattenDeep';
import MapperStore from 'src/helpers/MapperStore';
import { List } from 'immutable';

export class ObsGroupMapper {

  getInitialObject(formName, formVersion, control, bahmniObservations) {
    const obsGroup = createObsFromControl(formName, formVersion, control, bahmniObservations)[0];
    if (obsGroup.groupMembers !== undefined) {
      let groupMembers = new List();
      for (const ctrl of control.controls) {
        const mapper = MapperStore.getMapper(ctrl);
        groupMembers = groupMembers.concat(mapper.getInitialObject(formName, formVersion,
          ctrl, obsGroup.groupMembers));
      }
      return [obsGroup.set('groupMembers', groupMembers)];
    }
    return [obsGroup];
  }

  setValue(obsGroup, obs) {
    let updatedObsGroup = obsGroup.addGroupMember(obs);

    const filteredMembers = this.areAllChildObsVoided(updatedObsGroup.getGroupMembers());
    const voided = updatedObsGroup.getGroupMembers().every((groupMember) => groupMember.isVoided());

    if (filteredMembers.size === 0 || voided) {
      updatedObsGroup = updatedObsGroup.setValue(undefined).void();
    } else {
      updatedObsGroup = updatedObsGroup.set('voided', false);
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

  getGroupMembers(obsGroup) {
    const observations = [];
    if (obsGroup.groupMembers !== undefined) {
      obsGroup.groupMembers.forEach((obs) => {
        observations.push(obs.getObject(obs));
      });
    }
    return flattenDeep(observations);
  }

  getObject(obsGroup) {
    const groupMembers = this.getGroupMembers(obsGroup);
    return obsGroup.set('groupMembers', groupMembers).toJS();
  }
}
