import React, { PropTypes, Component } from 'react';
import { displayRowControls, getGroupedControls } from 'src/helpers/controlsParser';
import { getErrorsFromChildControls, getObsFromChildControls } from 'src/helpers/controlsHelper';
import isEmpty from 'lodash/isEmpty';
import { List, Map } from 'immutable';
import { BahmniRecord, ControlState, controlStateFactory } from "src/ControlState";

export class Container extends Component {
  constructor(props) {
    super(props);
    this.childControls = {};
    const { observations, metadata } = this.props;
    const data = controlStateFactory(metadata, observations);
    this.state = { errors: [], data };
    this.storeChildRef = this.storeChildRef.bind(this);
    this.onValueChanged = this.onValueChanged.bind(this);
  }

  onValueChanged(obs,errors){
    const data = this.state.data;
    const bahmniRecord = data.getRecord(obs.formNamespace)
      .set('obs', obs)
      .set('errors', errors);
    this.setState({ data: data.setRecord(bahmniRecord) });
  }

  getValue() {
    const records = this.state.data.getRecords();
    const observations = records.filter((record) => {
      return this._isValidObs(record.obs)
    }).map((record) => {
      return record.obs.toJS();
    });

    const errors = this.getErrors();
    if (isEmpty(observations) || this.areAllVoided(observations) || isEmpty(errors)) {
      return { observations };
    }

    return { errors };
  }

  areAllVoided(observations) {
    return observations.every((obs) => obs.voided);
  }

  _isValidObs(obs) {
    return !this._isNewVoidedObs(obs)
  }

  _isNewVoidedObs(obs) {
    return !obs.getUuid() && obs.isVoided();
  }

  //deprecated
  storeChildRef(ref) {
    if (ref) this.childControls[ref.props.id] = ref;
  }

  getObsList(){
    const records = this.state.data.getRecords();
    return records.map( record => record.get('obs'));
  }

  getErrors() {
    const records = this.state.data.getRecords();
    return [].concat(...records.map((record) => record.get('errors'))
      .filter((error) => !isEmpty(error)));
  }

  render() {
    const { metadata: { controls, uuid: formUuid } } = this.props;
    const childProps = {
      formUuid,
      ref: this.storeChildRef,
      onValueChanged: this.onValueChanged,
    };
    const groupedRowControls = getGroupedControls(controls, 'row');
    const obsList = this.getObsList();
    return (
      <div>{displayRowControls(groupedRowControls, obsList, childProps)}</div>
    );
  }
}

Container.propTypes = {
  metadata: PropTypes.shape({
    controls: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        type: PropTypes.string.isRequired,
      })).isRequired,
    id: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
  }),
  observations: PropTypes.array.isRequired,
};
