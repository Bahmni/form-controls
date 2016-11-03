import React, { Component, PropTypes } from 'react';
import 'src/helpers/componentStore';
import { Validator } from 'src/helpers/Validator';
import { hasError } from 'src/helpers/controlsHelper';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import { ObsMapper } from 'src/helpers/ObsMapper';
import { Obs } from 'src/helpers/Obs';


export class TextBox extends Component {
  constructor(props) {
    super(props);
    // TODO: This will be moved to the place where obs is created originally
    this.obs = new Obs(props.formUuid, props.metadata, props.obs);
    this.mapper = new ObsMapper();
    this.initialValue = this.mapper.getValue(this.obs);
    this.state = { value: this.initialValue, hasErrors: false };
    this.getValue = this.getValue.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { errors, metadata: { id } } = nextProps;
    this.setState({ hasErrors: hasError(errors, id) });
  }

  getValue() {
    if (this.isDirty()) {
      const value = this.state.value ? this.state.value.trim() : undefined;
      return this.mapper.setValue(this.obs, value);
    }
    return (this.initialValue ? this.obs : undefined);
  }

  getErrors() {
    const { id, properties } = this.props.metadata;
    const controlDetails = { id, properties, value: this.state.value };
    return Validator.getErrors(controlDetails);
  }

  isDirty() {
    return this.initialValue !== this.state.value;
  }

  handleChange(e) {
    const value = e.target.value.trim() !== '' ? e.target.value.trim() : undefined;
    this.setState({
      value,
      hasErrors: !isEmpty(this.getErrors()) });
  }

  render() {
    const defaultValue = this.state.value;
    return (
      <input
        className={classNames({ 'form-builder-error': this.state.hasErrors })}
        defaultValue={defaultValue}
        onChange={(e) => this.handleChange(e)}
        type="text"
      />
    );
  }
}

TextBox.propTypes = {
  errors: PropTypes.array.isRequired,
  formUuid: PropTypes.string.isRequired,
  metadata: PropTypes.shape({
    concept: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    properties: PropTypes.object.isRequired,
    type: PropTypes.string,
  }),
  obs: PropTypes.object,
  //Change the obs props to value
};

window.componentStore.registerComponent('text', TextBox);
