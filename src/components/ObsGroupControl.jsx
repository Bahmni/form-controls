import React, { Component, PropTypes } from 'react';
import ComponentStore from 'src/helpers/componentStore';
import { getGroupedControls, displayRowControls } from '../helpers/controlsParser';
import { ObsGroupMapper } from 'src/mapper/ObsGroupMapper';
import { AbnormalObsGroupMapper } from 'src/mapper/AbnormalObsGroupMapper';
import { controlStateFactory, getErrors, getObsList } from 'src/ControlState';
import each from 'lodash/each';

export class ObsGroupControl extends Component {

  constructor(props) {
    super(props);
    const { formUuid, obs, metadata } = this.props;
    const groupMembers = obs.getGroupMembers() || [];
    const data = controlStateFactory(metadata, groupMembers, formUuid);
    this.state = { obs: this._getObsGroup(obs, data), errors: [], data };
    this.onChange = this.onChange.bind(this);
    const isAbnormal = props.metadata.properties.isAbnormal;
    this.mapper = isAbnormal ? new AbnormalObsGroupMapper() : new ObsGroupMapper();
  }

  onChange(obs, errors) {
    const bahmniRecord = this.state.data.getRecord(obs.formNamespace)
      .set('obs', obs)
      .set('errors', errors);
    const data = this.state.data.setRecord(bahmniRecord);
    const updatedObs = this.mapper.setValue(this.state.obs, obs, errors);
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

  render() {
    const { formUuid, metadata: { concept }, validate } = this.props;
    const childProps = { formUuid, validate, onValueChanged: this.onChange };
    const groupedRowControls = getGroupedControls(this.props.metadata.controls, 'row');
    const records = this.state.data.getRecords();
    const obsList = getObsList(records);
    return (
        <fieldset className="form-builder-fieldset">
          <legend>{concept.name}</legend>
          <div className="obsGroup-controls">
            {displayRowControls(groupedRowControls, obsList, childProps)}
          </div>
        </fieldset>
    );
  }
}

ObsGroupControl.propTypes = {
  formUuid: PropTypes.string.isRequired,
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

ComponentStore.registerComponent('obsGroupControl', ObsGroupControl);
