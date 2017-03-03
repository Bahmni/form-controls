import React, { PropTypes, Component } from 'react';
import { displayRowControls, getGroupedControls } from '../helpers/controlsParser';
import isEmpty from 'lodash/isEmpty';
import filter from 'lodash/filter';
import { controlStateFactory, getErrors } from 'src/ControlState';
import ControlRecordTreeBuilder from 'src/helpers/ControlRecordTreeBuilder';
import ControlRecordTreeMgr from 'src/helpers/ControlRecordTreeMgr';
import addMoreDecorator from './AddMoreDecorator';
import ObservationMapper from "../helpers/ObservationMapper";

export class Container extends addMoreDecorator(Component) {
  constructor(props) {
    super(props);
    this.childControls = {};
    const { observations, metadata } = this.props;
    const controlRecordTree = new ControlRecordTreeBuilder().build(metadata, observations);
    this.state = { errors: [], data: controlRecordTree, collapse: props.collapse };
    this.storeChildRef = this.storeChildRef.bind(this);
    this.onValueChanged = this.onValueChanged.bind(this);
    this.onControlAdd = this.onControlAdd.bind(this);
    this.onControlRemove = this.onControlRemove.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ collapse: nextProps.collapse });
  }

  onValueChanged(formFieldPath, value, errors) {
    const data = this.state.data.update(formFieldPath, value, errors);
    // const data = this._changeValue(obs, errors);
    this.setState({ data, collapse: undefined });
  }

  onControlAdd(formFieldPath) {
    const updatedRecordTree = ControlRecordTreeMgr.add(this.state.data, formFieldPath);
    this.setState({ data: updatedRecordTree });
  }

  onControlRemove(formFieldPath) {
    // const data = this._changeValue(obs, []).deleteRecord(obs);
    // const updatedState = data.prepareRecordsForAddMore(obs.formFieldPath);
    // this.setState({ data: updatedState.data });
  }

  getValue() {
    const records = this.state.data;
    const observations = (new ObservationMapper()).from(records);
    const errors = records.getErrors();

    if (isEmpty(observations) || this.areAllVoided(observations) || isEmpty(errors)) {
      return { observations };
    }
    return { errors }
  }

  /* eslint-disable no-param-reassign */
  _getObservations(observations) {
    return filter([].concat(...observations), (obs) => {
      if (!isEmpty(obs.groupMembers)) {
        obs.groupMembers = this._getObservations(obs.groupMembers);
      }
      return this._isValidObs(obs);
    });
  }
  /* eslint-disable no-param-reassign */

  // deprecated
  storeChildRef(ref) {
    if (ref) this.childControls[ref.props.id] = ref;
  }

  _isNewVoidedObs(obs) {
    return !obs.uuid && obs.voided;
  }

  _isValidObs(obs) {
    return !this._isNewVoidedObs(obs);
  }

  areAllVoided(observations) {
    return observations.every((obs) => obs.voided);
  }

  render() {
    const { metadata: { controls, name: formName, version: formVersion }, validate } = this.props;
    const childProps = {
      collapse: this.state.collapse,
      errors: this.state.errors,
      formName,
      formVersion,
      ref: this.storeChildRef,
      onValueChanged: this.onValueChanged,
      onControlAdd: this.onControlAdd,
      onControlRemove: this.onControlRemove,
      validate,
    };
    const groupedRowControls = getGroupedControls(controls, 'row');
    const records = this.state.data.children.toArray();
    return (
      <div>{displayRowControls(groupedRowControls, records, childProps)}</div>
    );
  }
}

Container.propTypes = {
  collapse: PropTypes.bool.isRequired,
  metadata: PropTypes.shape({
    controls: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        type: PropTypes.string.isRequired,
      })).isRequired,
    id: PropTypes.number.isRequired,
    uuid: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    version: PropTypes.string.isRequired,
  }),
  observations: PropTypes.array.isRequired,
  validate: PropTypes.bool.isRequired,
};

