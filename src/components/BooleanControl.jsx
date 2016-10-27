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
    } else if (this.props.obs) {
      const voidedObs = Object.assign({}, this.props.obs, { voided: true });
      return this.mapper.mapTo(voidedObs);
    }
    return undefined;
  }

  getErrors() {
    return this.childControl.getErrors();
  }

  storeChildRef(ref) {
    this.childControl = ref;
  }

  render() {
    const { displayType } = this.props.metadata;
    const registeredComponent = window.componentStore.getRegisteredComponent(displayType);
    if (registeredComponent) {
      const childProps = {
        ref: this.storeChildRef,
        ...this.props,
      };
      return React.createElement(registeredComponent, childProps);
    }
    return null;
  }
}

BooleanControl.propTypes = {
  errors: PropTypes.array.isRequired,
  formUuid: PropTypes.string.isRequired,
  metadata: PropTypes.shape({
    concept: PropTypes.object.isRequired,
    displayType: PropTypes.string,
    id: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    properties: PropTypes.object,
    type: PropTypes.string.isRequired,
  }),
  obs: PropTypes.object,
};

window.componentStore.registerComponent('boolean', BooleanControl);
