export class ObsMapper {
  constructor(obs) {
    this.obs = obs;
  }

  _isNewVoidedObs() {
    return !this.obs.getUuid() && this.obs.isVoided();
  }

  _hasNoValue() {
    const value = this.obs.getValue();
    return value === '' || value === undefined;
  }

  getValue() {
    return ((this._hasNoValue() || this.obs.isVoided()) ? undefined : this.obs.getValue());
  }

  getObs() {
    if (this._hasNoValue() || this._isNewVoidedObs()) {
      return undefined;
    }
    return this.obs;
  }

  setValue(value) {
    if (value !== '' && value !== undefined) {
      this.obs.setValue(value);
    } else {
      this.obs.void();
    }
  }

  equals(finalObs) {
    return this.obs.equals(finalObs);
  }
}
