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

export class NumericBox extends Component {
  constructor(props) {
    super(props);
    this.value = props.obs && props.obs.value;
    const formNamespace = createFormNamespace(props.formUuid, props.metadata.id);
    const concept = props.metadata.concept;
    const obs = Object.assign({}, { concept }, props.obs, { formNamespace });
    this.mapper = new Mapper(obs);
    this.state = { hasErrors: false };
    this.observationDateTime = props.obs && props.obs.observationDateTime;
    this.getValue = this.getValue.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { errors, metadata: { id } } = nextProps;
    this.setState({ hasErrors: hasError(errors, id) });
  }

  getValue() {
    if (this.value) {
      const obs = {
        value: this.value,
        observationDateTime: this.observationDateTime,
      };
      return this.mapper.mapTo(obs);
    } else if (this.props.obs) {
      const voidedObs = Object.assign({}, this.props.obs, { voided: true, value: this.value });
      return this.mapper.mapTo(voidedObs);
    }
    return undefined;
  }

  getErrors() {
    const {
      concept: { properties: conceptProperties },
      id,
      properties: metadataProperties,
    } = this.props.metadata;

    const properties = Object.assign({}, conceptProperties, metadataProperties);
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
      <input
        className={classNames({ 'form-builder-error': this.state.hasErrors })}
        defaultValue={defaultValue}
        onChange={(e) => this.handleChange(e)}
        type="number"
      />
    );
  }
}

NumericBox.propTypes = {
  errors: PropTypes.array.isRequired,
  formUuid: PropTypes.string.isRequired,
  metadata: PropTypes.shape({
    concept: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    properties: PropTypes.object.isRequired,
  }),
  obs: PropTypes.object,
};

window.componentStore.registerComponent('numeric', NumericBox);
