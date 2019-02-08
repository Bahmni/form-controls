import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentStore from 'src/helpers/componentStore';
import map from 'lodash/map';
import cloneDeep from 'lodash/cloneDeep';
import TranslationKeyGenerator from 'src/services/TranslationKeyService';

export class CodedControlDesigner extends Component {
  constructor(props) {
    super(props);
    this.storeChildRef = this.storeChildRef.bind(this);
  }

  getJsonDefinition() {
    const metadataClone = cloneDeep(this.props.metadata);
    const { concept, id } = metadataClone;
    map(concept.answers, (answer) => {
      if (!answer.translationKey) {
        answer.translationKey = new TranslationKeyGenerator(answer.name.display, id).build(); // eslint-disable-line no-param-reassign
      }
    });
    return Object.assign({}, this.props.metadata, { concept });
  }

  storeChildRef(ref) {
    this.childControl = ref;
  }

  _getOptionsRepresentation(options) {
    const optionsRepresentation = [];
    map(options, (option) =>
        optionsRepresentation.push({ name: option.name.display || option.name, value: option.uuid })
    );
    return optionsRepresentation;
  }

  _getDisplayType(properties) {
    if (properties.autoComplete) {
      return 'autoComplete';
    } else if (properties.dropDown) {
      return 'dropDown';
    }
    return 'button';
  }

  render() {
    const { metadata, metadata: { concept } } = this.props;
    const displayType = this._getDisplayType(metadata.properties);
    const registeredComponent = ComponentStore.getDesignerComponent(displayType);
    if (registeredComponent) {
      return (
        <registeredComponent.control
          asynchronous={false}
          labelKey="name"
          options={this._getOptionsRepresentation(concept.answers)}
          ref={this.storeChildRef}
        />
      );
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
          {
            name: 'multiSelect',
            dataType: 'boolean',
            defaultValue: false,
          },
          {
            name: 'dropDown',
            dataType: 'boolean',
            defaultValue: false,
          },
        ],
      },
    ],
  },
};

ComponentStore.registerDesignerComponent('Coded', descriptor);
