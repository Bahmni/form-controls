export class ObsMapper {

  constructor(obs) {
    this.obs = obs;
  }

  _isNewVoidedObs() {
    return !this.obs.getUuid() && this.obs.isVoided();
  }

  _hasNoValue() {
    const value = this.obs.getValue();
    return value === '' || value === undefined || value === null;
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
      this.obs = this.obs.setValue(value);
      return this.obs;
    }
    this.obs = this.obs.void();
    return this.obs;
  }

  setComment(comment) {
    this.obs = this.obs.setComment(comment);
    return this.obs;
  }

  getComment() {
    return this.obs.getComment();
  }

  equals(finalObs) {
    this.obs = this.obs.equals(finalObs);
    return this.obs;
  }
}
