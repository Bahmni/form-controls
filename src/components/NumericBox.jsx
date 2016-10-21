import React, { Component, PropTypes } from 'react';
import 'src/helpers/componentStore';
import { createFormNamespace } from 'src/helpers/formNamespace';
import { Validator } from 'src/helpers/Validator';

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
    this.observationDateTime = props.obs && props.obs.observationDateTime;
    this.getValue = this.getValue.bind(this);
  }

  getValue() {
    if (this.value) {
      const obs = {
        value: this.value,
        observationDateTime: this.observationDateTime,
      };
      return this.mapper.mapTo(obs);
    }
    return undefined;
  }

  getErrors() {
    const { properties } = this.props.metadata;
    return Validator.getErrors(properties, this.value);
  }

  handleChange(e) {
    this.value = e.target.value;
    this.observationDateTime = null;
  }

  render() {
    const defaultValue = this.props.obs && this.props.obs.value;
    return (
      <input
        defaultValue={defaultValue}
        onChange={(e) => this.handleChange(e)}
        type="number"
      />
    );
  }
}

NumericBox.propTypes = {
  formUuid: PropTypes.string.isRequired,
  metadata: PropTypes.shape({
    concept: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    properties: PropTypes.object.isRequired,
  }),
  obs: PropTypes.object,
};

window.componentStore.registerComponent('numeric', NumericBox);
