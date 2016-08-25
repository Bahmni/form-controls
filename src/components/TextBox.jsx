import React, { Component, PropTypes } from 'react';
import 'src/helpers/componentStore';
import { createFormNamespace } from 'src/helpers/formNamespace';

class Mapper {
  constructor(obs){
    this.obs = obs;
  }

  mapTo(value) {
    return Object.assign({}, this.obs, {value})
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
    this.getValue = this.getValue.bind(this);
  }

  getValue() {
    if (this.value) {
      return this.mapper.mapTo(this.value);
    }
    return undefined;
  }

  handleChange(e) {
    this.value = e.target.value;
  }

  render() {
    const defaultValue = this.props.obs && this.props.obs.value;
    return (
      <input
        defaultValue={defaultValue}
        onChange={(e) => this.handleChange(e)}
        type="text"
      />
    );
  }
}

TextBox.propTypes = {
  formUuid: PropTypes.string.isRequired,
  metadata: PropTypes.shape({
    concept: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
  }),
  obs: PropTypes.object,
};

window.componentStore.registerComponent('text', TextBox);
