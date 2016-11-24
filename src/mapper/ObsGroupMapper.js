import constants from 'src/constants';
import find from 'lodash/find';

export class ObsGroupMapper {
  setValue(obsGroup, obs, errors) {
    return obsGroup.addGroupMember(obs);
  }
}
