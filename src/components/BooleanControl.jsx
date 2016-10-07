import React, { Component, PropTypes } from 'react';
import 'src/helpers/componentStore';
import { createFormNamespace } from 'src/helpers/formNamespace';

class Mapper {
  constructor(obs) {
    this.obs = obs;
  }

  mapTo(obs) {
    return Object.assign({}, this.obs, obs);
  }
}

export class BooleanControl extends Component {
  constructor(props) {
    super(props);
    this.value = props.obs && props.obs.value;
    const formNamespace = createFormNamespace(props.formUuid, props.metadata.id);
    const concept = props.metadata.concept;
    const obs = Object.assign({}, { concept }, props.obs, { formNamespace });
    this.mapper = new Mapper(obs);
    this.observationDateTime = props.obs && props.obs.observationDateTime;
    this.childControl = undefined;
    this.getValue = this.getValue.bind(this);
    this.storeChildRef = this.storeChildRef.bind(this);
  }

  getValue() {
    const childControlValue = this.childControl.getValue();
    if (childControlValue !== undefined) {
      const obs = {
        value: childControlValue,
        observationDateTime: this.observationDateTime,
      };
      return this.mapper.mapTo(obs);
    }
    return undefined;
  }

  storeChildRef(ref) {
    this.childControl = ref;
  }

  render() {
    const { id, displayType = 'radio' } = this.props.metadata;
    const registeredComponent = window.componentStore.getRegisteredComponent(displayType);
    if (registeredComponent) {
      return React.createElement(registeredComponent, {
        id,
        value: this.value,
        ref: this.storeChildRef,
      });
    }
    return null;
  }
}

BooleanControl.propTypes = {
  formUuid: PropTypes.string.isRequired,
  metadata: PropTypes.shape({
    concept: PropTypes.object.isRequired,
    displayType: PropTypes.string,
    id: PropTypes.string.isRequired,
    properties: PropTypes.object,
    type: PropTypes.string.isRequired,
  }),
  obs: PropTypes.object,
};

window.componentStore.registerComponent('boolean', BooleanControl);
