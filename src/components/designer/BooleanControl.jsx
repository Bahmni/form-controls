import React, { Component, PropTypes } from 'react';
import ComponentStore from 'src/helpers/componentStore';
import find from 'lodash/find';

export class BooleanControlDesigner extends Component {
  getJsonDefinition() {
    return this.updatedMetadata;
  }

  getOptions() {
    const { properties, concept } = this.props.metadata;
    const toggleSelect = find(properties, (value, key) => (key === 'toggleSelect' && value));
    if (toggleSelect) {
      return [{ name: concept.name, value: true }];
    }
    return [{ name: 'yes', value: true }, { name: 'No', value: false }];
  }

  render() {
    const options = this.getOptions();
    this.updatedMetadata = Object.assign({}, this.props.metadata);
    this.updatedMetadata.options = options;
    const registeredComponent = ComponentStore.getDesignerComponent('button');
    if (registeredComponent) {
      return React.createElement(registeredComponent.control, {
        options,
      }
      );
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
        attributes: [
          {
            name: 'toggleSelect',
            dataType: 'boolean',
            defaultValue: false,
          },
        ],
      },
    ],
  },
};


ComponentStore.registerDesignerComponent('boolean', descriptor);
