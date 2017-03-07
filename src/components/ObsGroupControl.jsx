import React, { Component, PropTypes } from 'react';
import ComponentStore from 'src/helpers/componentStore';
import { getGroupedControls, displayRowControls } from '../helpers/controlsParser';
import { controlStateFactory, getErrors } from 'src/ControlState';
import each from 'lodash/each';
import classNames from 'classnames';
import addMoreDecorator from './AddMoreDecorator';
import { List } from 'immutable';

export class ObsGroupControl extends addMoreDecorator(Component) {

  constructor(props) {
    super(props);
    const { collapse } = this.props;
    this.state = { errors: [], collapse };
    this.onChange = this.onChange.bind(this);
    this.onControlAdd = this.onControlAdd.bind(this);
    this.onControlRemove = this.onControlRemove.bind(this);
    this._onCollapse = this._onCollapse.bind(this);
    this.onAddControl = this.onAddControl.bind(this);
    this.onRemoveControl = this.onRemoveControl.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.collapse !== undefined && (nextProps.collapse !== this.props.collapse ||
        nextProps.collapse !== this.state.collapse)) {
      this.setState({ collapse: nextProps.collapse });
    }
  }

  onChange(formFieldPath, value, errors) {
    this.props.onValueChanged(formFieldPath, value, errors);
  }

  onControlAdd(obs) {
    const nextFormFieldPath = this.state.data.generateFormFieldPath(obs.formFieldPath);
    const nextGroupMembers = this.updateGroupMembers(obs.groupMembers, nextFormFieldPath);
    const obsUpdated = obs.cloneForAddMore(nextFormFieldPath, nextGroupMembers);
    const clonedRecord = this.state.data
      .getRecord(obs.formFieldPath)
      .set('formFieldPath', nextFormFieldPath)
      .set('obs', obsUpdated);
    const data = this.state.data.setRecord(clonedRecord);
    const updatedState = data.prepareRecordsForAddMore(obs.formFieldPath);
    const updatedObs = this._getObsGroup(this.props.obs, updatedState.data);
    this.setState({ data: updatedState.data });

    this.props.onValueChanged(updatedObs);
  }

  onControlRemove(obs) {
    const updatedObs = this.props.mapper.setValue(this.props.obs, obs.void());
    const data = this._changeValue(obs, []).deleteRecord(obs);
    const updatedState = data.prepareRecordsForAddMore(obs.formFieldPath);
    this.setState({ data: updatedState.data });

    this.props.onValueChanged(updatedObs);
  }

  _getObsGroup(obs, data) {
    let observations = obs.removeGroupMembers();
    each(data.getRecords(), (record) => {
      observations = observations.addGroupMember(record.obs);
    });
    return observations;
  }

  _onCollapse() {
    const collapse = !this.state.collapse;
    this.setState({ collapse });
  }

  render() {
    const { collapse, formName, formVersion, metadata: { label }, validate } = this.props;
    const childProps = { collapse, formName, formVersion, validate,
      onValueChanged: this.onChange, onControlAdd: this.onControlAdd, onControlRemove: this.onControlRemove };
    const groupedRowControls = getGroupedControls(this.props.metadata.controls, 'row');
    const toggleClass = `form-builder-toggle ${classNames({ active: !this.state.collapse })}`;
    const obsGroupClass =
      this.state.collapse ? 'closing-group-controls' : 'active-group-controls';
    return (
        <fieldset className="form-builder-fieldset">
          <legend className={toggleClass} onClick={ this._onCollapse}>
            <i className="fa fa-caret-down"></i>
            <i className="fa fa-caret-right"></i>
          <strong>{label.value}</strong>
        </legend>
          {this.showAddMore()}
          <div className={`obsGroup-controls ${obsGroupClass}`}>
            { displayRowControls(groupedRowControls, this.props.children, childProps) }
          </div>
        </fieldset>
    );
  }
}

ObsGroupControl.propTypes = {
  metadata: PropTypes.shape({
    concept: PropTypes.object.isRequired,
    displayType: PropTypes.string,
    id: PropTypes.string.isRequired,
    label: PropTypes.shape({
      type: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }).isRequired,
    properties: PropTypes.object,
    type: PropTypes.string.isRequired,
    controls: PropTypes.array,
  }),
  collapse: PropTypes.bool,
  onControlAdd: PropTypes.func,
  onControlRemove: PropTypes.func,
  onValueChanged: PropTypes.func.isRequired,
  showAddMore: PropTypes.bool.isRequired,
  showRemove: PropTypes.bool.isRequired,
  validate: PropTypes.bool.isRequired,
  formName: PropTypes.string.isRequired,
  formVersion: PropTypes.string.isRequired,
  value: PropTypes.object.isRequired,
  children: PropTypes.any,
};

ObsGroupControl.defaultProps = {
  showAddMore: false,
  showRemove: false,
  children: List.of([]),
};

ComponentStore.registerComponent('obsGroupControl', ObsGroupControl);
