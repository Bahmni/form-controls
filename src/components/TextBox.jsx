import React, { Component, PropTypes } from 'react';
import 'src/helpers/componentStore';
import { createFormNamespace } from 'src/helpers/formNamespace';
import { Validator } from 'src/helpers/Validator';
import { hasError } from 'src/helpers/controlsHelper';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';

class Mapper {
  constructor(obs) {
    this.obs = obs;
  }

  mapTo(obs) {
    return Object.assign({}, this.obs, obs);
  }
}

export class TextBox extends Component {
  constructor(props) {
    super(props);
    const formNamespace = createFormNamespace(props.formUuid, props.metadata.id);
    const concept = props.metadata.concept;
    const obs = Object.assign({}, { concept }, props.obs, { formNamespace });
    this.mapper = new Mapper(obs);
    this.value = props.obs && props.obs.value;
    this.observationDateTime = props.obs && props.obs.observationDateTime;
    this.state = { hasErrors: false };
    this.getValue = this.getValue.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { errors, metadata: { id } } = nextProps;
    this.setState({ hasErrors: hasError(errors, id) });
  }

  getValue() {
    const value = this.value ? this.value.trim() : undefined;
    if (value) {
      const obs = {
        observationDateTime: this.observationDateTime,
        value,
        voided: false,
      };
      return this.mapper.mapTo(obs);
    } else if (this.props.obs) {
      const voidedObs = Object.assign({}, this.props.obs, { voided: true, value });
      return this.mapper.mapTo(voidedObs);
    }
    return undefined;
  }

  getErrors() {
    const { id, properties } = this.props.metadata;
    const controlDetails = { id, properties, value: this.value };
    return Validator.getErrors(controlDetails);
  }

  handleChange(e) {
    this.value = e.target.value;
    this.observationDateTime = null;
    this.setState({ hasErrors: !isEmpty(this.getErrors()) });
  }

  render() {
    const defaultValue = this.props.obs && this.props.obs.value;
    return (
      <textarea
        className={classNames({ 'form-builder-error': this.state.hasErrors })}
        defaultValue={defaultValue}
        onChange={(e) => this.handleChange(e)}
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
};

window.componentStore.registerComponent('text', TextBox);
