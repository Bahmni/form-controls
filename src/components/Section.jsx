import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import ComponentStore from 'src/helpers/componentStore';
import { getGroupedControls, displayRowControls } from '../helpers/controlsParser';
import { controlStateFactory, getErrors } from 'src/ControlState';


export class Section extends Component {

  constructor(props) {
    super(props);
    const { formName, formVersion, obs, metadata, collapse } = this.props;
    const observations = props.mapper.getObject(obs);
    const data = controlStateFactory(metadata, observations, formName, formVersion);
    this.state = { obs, errors: [], data, collapse };
    this.onChange = this.onChange.bind(this);
    this._onCollapse = this._onCollapse.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.collapse !== this.props.collapse &&
      nextProps.collapse !== this.state.collapse) {
      this.setState({ collapse: nextProps.collapse });
    }
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

  _onCollapse() {
    const collapse = !this.state.collapse;
    this.setState({ collapse });
  }

  render() {
    const { collapse, formName, formVersion, metadata: { label }, validate } = this.props;
    const childProps = { collapse, formName, formVersion, validate, onValueChanged: this.onChange };
    const groupedRowControls = getGroupedControls(this.props.metadata.controls, 'row');
    const records = this.state.data.getRecords();
    const sectionClass =
      this.state.collapse ? 'closing-group-controls' : 'active-group-controls';
    const toggleClass = `form-builder-toggle ${classNames({ active: !this.state.collapse })}`;

    return (
        <fieldset className="form-builder-fieldset">
          <legend className={toggleClass} onClick={ this._onCollapse}>
            <i className="fa fa-caret-down"></i>
            <i className="fa fa-caret-right"></i>
            <strong>{label.value}</strong>
          </legend>
          <div className={`obsGroup-controls ${sectionClass}`} >
            {displayRowControls(groupedRowControls, records, childProps)}
          </div>
        </fieldset>
    );
  }
}

Section.propTypes = {
  collapse: PropTypes.bool,
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

Section.defaultProps = {
  collapse: false,
};

ComponentStore.registerComponent('section', Section);
