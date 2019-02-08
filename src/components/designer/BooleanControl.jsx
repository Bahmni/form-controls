import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentStore from 'src/helpers/componentStore';

export class BooleanControlDesigner extends Component {
  getJsonDefinition() {
    return this.updatedMetadata;
  }

  render() {
    const defaultOptions = [
      { name: 'Yes', translationKey: 'BOOLEAN_YES', value: true },
      { name: 'No', translationKey: 'BOOLEAN_NO', value: false },
    ];
    const { metadata, metadata: { options = defaultOptions } } = this.props;
    this.updatedMetadata = Object.assign({}, { options }, metadata);
    const RegisteredComponent = ComponentStore.getDesignerComponent('button');
    if (RegisteredComponent) {
      return <RegisteredComponent.control options={options} />;
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
