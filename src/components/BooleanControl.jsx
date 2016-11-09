import React, { Component, PropTypes } from 'react';
import 'src/helpers/componentStore';

export class BooleanControl extends Component {
  constructor(props) {
    super(props);
    this.getValue = this.getValue.bind(this);
    this.storeChildRef = this.storeChildRef.bind(this);
  }

  getValue() {
    const childControlValue = this.childControl.getValue();
    this.props.mapper.setValue(childControlValue);
    return this.props.mapper.getObs();
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
      const initialValue = this.props.mapper.getValue();
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
  mapper: PropTypes.object.isRequired,
  metadata: PropTypes.shape({
    concept: PropTypes.object.isRequired,
    displayType: PropTypes.string,
    id: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    properties: PropTypes.object,
    type: PropTypes.string.isRequired,
  }),
};

window.componentStore.registerComponent('boolean', BooleanControl);
