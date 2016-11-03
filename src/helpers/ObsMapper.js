export class ObsMapper {
  getValue(obs) {
    return obs.get();
  }

  setValue(obs, value) {
    if (value) {
      return obs.set(value);
    }
    return obs.void();
  }

  equals(initialObs, finalObs) {
    return initialObs.equals(finalObs);
  }
}
