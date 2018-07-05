import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ComponentStore from 'src/helpers/componentStore';

export class ComplexControlDesigner extends Component {
  getJsonDefinition() {
    return this.props.metadata;
  }

  render() {
    const { metadata: { concept: { conceptHandler } } } = this.props;
    const registeredComponent = ComponentStore.getDesignerComponent(conceptHandler);
    if (registeredComponent) {
      return React.createElement(registeredComponent.control, { ...this.props });
    }
    return null;
  }
}

ComplexControlDesigner.propTypes = {
  metadata: PropTypes.shape({
    concept: PropTypes.object.isRequired,
    displayType: PropTypes.string,
    id: PropTypes.string.isRequired,
    properties: PropTypes.object.isRequired,
    type: PropTypes.string,
  }),
  setError: PropTypes.func,
};

const descriptor = {
  control: ComplexControlDesigner,
  designProperties: {
    isTopLevelComponent: false,
  },
  metadata: {
    attributes: [
      {
        name: 'properties',
        dataType: 'complex',
        attributes: [
          {
            name: 'mandatory',
            dataType: 'boolean',
            defaultValue: false,
            disabled: true,
          },
        ],
      },
    ],
  },
};

ComponentStore.registerDesignerComponent('Complex', descriptor);
