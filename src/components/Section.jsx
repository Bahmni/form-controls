import React, { Component, PropTypes } from 'react';
import ComponentStore from 'src/helpers/componentStore';
import { getGroupedControls, displayRowControls } from '../helpers/controlsParser';
import { controlStateFactory, getErrors } from 'src/ControlState';
import each from 'lodash/each';

export class Section extends Component {

  constructor(props) {
    super(props);
    const { formName, formVersion, obs, metadata } = this.props;
    const data = controlStateFactory(metadata, obs.toArray(), formName, formVersion);
    this.state = { obs, errors: [], data };
    this.onChange = this.onChange.bind(this);
  }

  onChange(obs, errors) {
    const bahmniRecord = this.state.data.getRecord(obs.formFieldPath)
      .set('obs', obs)
      .set('errors', errors);
    const data = this.state.data.setRecord(bahmniRecord);
    const updatedObs = this.props.mapper.setValue(this.state.obs, obs);
    const updatedErrors = getErrors(data.getRecords());
    this.setState({ data, obs: updatedObs });
    this.props.onValueChanged(updatedObs, updatedErrors);
  }

  render() {
    const { formName, formVersion, metadata: { label }, validate } = this.props;
    const childProps = { formName, formVersion, validate, onValueChanged: this.onChange };
    const groupedRowControls = getGroupedControls(this.props.metadata.controls, 'row');
    const records = this.state.data.getRecords();
    return (
        <fieldset className="form-builder-fieldset">
          <legend>{label.value}</legend>
          <div className="obsGroup-controls">
            {displayRowControls(groupedRowControls, records, childProps)}
          </div>
        </fieldset>
    );
  }
}

Section.propTypes = {
  formName: PropTypes.string.isRequired,
  formVersion: PropTypes.string.isRequired,
  mapper: PropTypes.object.isRequired,
  metadata: PropTypes.shape({
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

ComponentStore.registerComponent('section', Section);
