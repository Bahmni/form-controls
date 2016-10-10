import React, { Component, PropTypes } from 'react';
import 'src/helpers/componentStore';

export class BooleanControlDesigner extends Component {
  constructor() {
    super();
    this.childControl = undefined;
    this.storeChildRef = this.storeChildRef.bind(this);
  }

  getJsonDefinition() {
    return this.childControl.getJsonDefinition();
  }

  storeChildRef(ref) {
    this.childControl = ref;
  }

  render() {
    const defaultOptions = [
      { name: 'Yes', value: true },
      { name: 'No', value: false },
    ];
    const { metadata, metadata: { displayType = 'radio' } } = this.props;
    const metadataWithOptions = Object.assign({}, { options: defaultOptions }, metadata);
    const registeredComponent = window.componentStore.getDesignerComponent(displayType);
    if (registeredComponent) {
      return React.createElement(registeredComponent.control, {
        metadata: metadataWithOptions,
        ref: this.storeChildRef,
      });
    }
    return null;
  }
}

BooleanControlDesigner.propTypes = {
  metadata: PropTypes.shape({
    concept: PropTypes.object.isRequired,
    displayType: PropTypes.string,
    id: PropTypes.string.isRequired,
    options: PropTypes.array,
    properties: PropTypes.object,
    type: PropTypes.string.isRequired,
  }),
};

const descriptor = {
  control: BooleanControlDesigner,
  designProperties: {
    isTopLevelComponent: false,
  },
  metadata: {
    attributes: [],
  },
};


window.componentStore.registerDesignerComponent('boolean', descriptor);
