import React, { Component, PropTypes } from 'react';
import { List } from 'immutable';
import classNames from 'classnames';
import ComponentStore from 'src/helpers/componentStore';
import { getGroupedControls, displayRowControls } from '../helpers/controlsParser';
import { controlStateFactory, getErrors } from 'src/ControlState';
import addMoreDecorator from './AddMoreDecorator';

export class Section extends addMoreDecorator(Component) {

  constructor(props) {
    super(props);
    const { collapse } = this.props;
    this.state = { errors: [], collapse };
    this.onChange = this.onChange.bind(this);
    this._onCollapse = this._onCollapse.bind(this);
    this.onControlAdd = this.onControlAdd.bind(this);
    this.onControlRemove = this.onControlRemove.bind(this);
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
    const obsUpdated = obs.cloneForAddMore(nextFormFieldPath);
    const clonedRecord = this.state.data
      .getRecord(obs.formFieldPath)
      .set('formFieldPath', nextFormFieldPath)
      .set('obs', obsUpdated);
    const data = this.state.data.setRecord(clonedRecord);
    const updatedState = data.prepareRecordsForAddMore(obs.formFieldPath);

    this.setState({data: updatedState.data});
  }

  onControlRemove(obs) {
    const obsVoid = obs.void();
    const updatedObs = this.props.mapper.setValue(this.props.obs, obsVoid);
    const data = this._changeValue(obs, []).deleteRecord(obs);
    const updatedState = data.prepareRecordsForAddMore(obs.formFieldPath);
    const updatedErrors = getErrors(data.getRecords());

    this.setState({ data: updatedState.data });
    this.props.onValueChanged(updatedObs, updatedErrors);
  }

  _onCollapse() {
    const collapse = !this.state.collapse;
    this.setState({ collapse });
  }

  render() {
    const { collapse, formName, formVersion, metadata: { label }, validate } = this.props;
    const childProps = {
      collapse,
      formName,
      formVersion,
      validate,
      onValueChanged: this.onChange,
      onControlAdd: this.onControlAdd,
      onControlRemove: this.onControlRemove,
    };
    const groupedRowControls = getGroupedControls(this.props.metadata.controls, 'row');
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
            {displayRowControls(groupedRowControls, this.props.children, childProps)}
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
  children: PropTypes.any,
};

Section.defaultProps = {
  children: List.of([]),
};



ComponentStore.registerComponent('section', Section);
