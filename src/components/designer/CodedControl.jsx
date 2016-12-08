import React, { Component, PropTypes } from 'react';
import ComponentStore from 'src/helpers/componentStore';
import map from 'lodash/map';

export class CodedControlDesigner extends Component {
  constructor(props) {
    super(props);
    this.storeChildRef = this.storeChildRef.bind(this);
  }

  getJsonDefinition() {
    const updatedMetadata = Object.assign({}, this.props.metadata);
    return updatedMetadata;
  }

  storeChildRef(ref) {
    this.childControl = ref;
  }

  _getOptionsRepresentation(options) {
    const optionsRepresentation = [];
    map(options, (option) =>
      optionsRepresentation.push({ name: option.display, value: option.uuid })
    );
    return optionsRepresentation;
  }

  render() {
    const { metadata, metadata: { concept } } = this.props;
    const displayType = metadata.properties.autoComplete ? 'autoComplete' : 'button';
    const registeredComponent = ComponentStore.getDesignerComponent(displayType);
    if (registeredComponent) {
      return React.createElement(registeredComponent.control, {
        asynchronous: false,
        labelKey: 'name',
        options: this._getOptionsRepresentation(concept.answers),
        ref: this.storeChildRef,
      });
    }
    return null;
  }
}

CodedControlDesigner.propTypes = {
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
  control: CodedControlDesigner,
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
            name: 'autoComplete',
            dataType: 'boolean',
            defaultValue: false,
          },
        ],
      },
    ],
  },
};


ComponentStore.registerDesignerComponent('Coded', descriptor);
