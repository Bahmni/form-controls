import React, { Component, PropTypes } from 'react';
import ComponentStore from 'src/helpers/componentStore';
import './style/BooleanControl.scss';

export class BooleanControlDesigner extends Component {
  getJsonDefinition() {
    return this.updatedMetadata;
  }

  render() {
    const defaultOptions = [{ name: 'Yes', value: true }, { name: 'No', value: false }];
    const { metadata, metadata: { options = defaultOptions } } = this.props;
    this.updatedMetadata = Object.assign({}, { options }, metadata);
    const registeredComponent = ComponentStore.getDesignerComponent('button');
    if (registeredComponent) {
      return React.createElement(registeredComponent.control, {
        options,
      });
    }
    return null;
  }
}

BooleanControlDesigner.propTypes = {
  metadata: PropTypes.shape({
    concept: PropTypes.object.isRequired,
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
    attributes: [
      {
        name: 'properties',
        dataType: 'complex',
        attributes: [],
      },
    ],
  },
};


ComponentStore.registerDesignerComponent('boolean', descriptor);
