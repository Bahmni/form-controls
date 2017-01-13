import React, { Component, PropTypes } from 'react';
import ComponentStore from 'src/helpers/componentStore';
import { getGroupedControls, displayRowControls } from '../helpers/controlsParser';
import { controlStateFactory, getErrors } from 'src/ControlState';
import each from 'lodash/each';
import classNames from 'classnames';

export class ObsGroupControl extends Component {

  constructor(props) {
    super(props);
    const { formName, formVersion, obs, metadata, collapse } = this.props;
    const groupMembers = obs.getGroupMembers() || [];
    const data = controlStateFactory(metadata, groupMembers, formName, formVersion);
    this.state = { obs: this._getObsGroup(obs, data), errors: [], data, collapse };
    this.onChange = this.onChange.bind(this);
    this._onCollapse = this._onCollapse.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.collapse !== this.props.collapse ||
        nextProps.collapse !== this.state.collapse) {
      this.setState({ collapse: nextProps.collapse });
    }
  }

  onChange(obs, errors) {
    const bahmniRecord = this.state.data.getRecord(obs.formFieldPath)
      .set('obs', obs)
      .set('errors', errors);
    const data = this.state.data.setRecord(bahmniRecord);
    const updatedObs = this.props.mapper.setValue(this.state.obs, obs, errors);
    const updatedErrors = getErrors(data.getRecords());
    this.setState({ data, obs: updatedObs });
    this.props.onValueChanged(updatedObs, updatedErrors);
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
    const childProps = { collapse, formName, formVersion, validate, onValueChanged: this.onChange };
    const groupedRowControls = getGroupedControls(this.props.metadata.controls, 'row');
    const records = this.state.data.getRecords();
    const toggleClass = `form-builder-toggle ${classNames({ active: !this.state.collapse })}`;
    const obsGroupClass =
      this.state.collapse ? 'closing-obsGroup-controls' : 'active-obsGroup-controls';
    return (
        <fieldset className="form-builder-fieldset">
          <legend className={toggleClass} onClick={ this._onCollapse}>
            <i className="fa fa-caret-down"></i>
            <i className="fa fa-caret-right"></i>
          {label.value}
        </legend>
          <div className={`obsGroup-controls ${obsGroupClass}`}>
            { displayRowControls(groupedRowControls, records, childProps) }
          </div>
        </fieldset>
    );
  }
}

ObsGroupControl.propTypes = {
  collapse: PropTypes.bool,
  formName: PropTypes.string.isRequired,
  formVersion: PropTypes.string.isRequired,
  mapper: PropTypes.object.isRequired,
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
  obs: PropTypes.any.isRequired,
  onValueChanged: PropTypes.func.isRequired,
  validate: PropTypes.bool.isRequired,
};

ObsGroupControl.defaultProps = {
  collapse: false,
};

ComponentStore.registerComponent('obsGroupControl', ObsGroupControl);
