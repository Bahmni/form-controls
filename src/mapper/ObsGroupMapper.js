export class ObsGroupMapper {
  setValue(obsGroup, obs) {
    return obsGroup.addGroupMember(obs);
  }
}
