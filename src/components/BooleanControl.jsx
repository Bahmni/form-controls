import React, { Component, PropTypes } from 'react';
import 'src/helpers/componentStore';
import { ObsMapper } from 'src/helpers/ObsMapper';
import { Obs } from 'src/helpers/Obs';

export class BooleanControl extends Component {
  constructor(props) {
    super(props);
    const obs = new Obs(props.formUuid, props.metadata, props.obs);
    this.mapper = new ObsMapper(obs);
    this.getValue = this.getValue.bind(this);
    this.storeChildRef = this.storeChildRef.bind(this);
  }

  getValue() {
    const childControlValue = this.childControl.getValue();
    this.mapper.setValue(childControlValue);
    return this.mapper.getObs();
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
      const initialValue = this.mapper.getValue();
      const childProps = {
        ref: this.storeChildRef,
        value: initialValue,
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
