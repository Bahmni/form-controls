import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentStore from 'src/helpers/componentStore';
import map from 'lodash/map';
import cloneDeep from 'lodash/cloneDeep';
import TranslationKeyGenerator from 'src/services/TranslationKeyService';
import { httpInterceptor } from 'src/helpers/httpInterceptor';

export class CodedControlDesigner extends Component {
  constructor(props) {
    super(props);
    this.storeChildRef = this.storeChildRef.bind(this);
    this.state = {
      codedData: this._getOptionsRepresentation(
        this.props.metadata.concept.answers
      ),
    };
  }

  componentDidMount() {
    const { metadata, setError } = this.props;
    if (metadata.properties.URL) {
      httpInterceptor.get(metadata.properties.URL).then(response => {
        const answers = response.expansion.contains;
        const options = this._getOptionsRepresentation(answers);
        this.setState({ codedData: options });
      }).catch(() => {
        if (setError) {
          setError({ message: 'Invalid value set URL' });
        }
      });
    }
  }

  getJsonDefinition() {
    const metadataClone = cloneDeep(this.props.metadata);
    const { concept, id } = metadataClone;
    const answers = metadataClone.properties.URL
      ? this.state.codedData
      : concept.answers;
    map(answers, answer => {
      if (!answer.translationKey) {
        const name = metadataClone.properties.URL
          ? answer.name
          : answer.name.display;
        answer.translationKey = new TranslationKeyGenerator(name, id).build(); // eslint-disable-line no-param-reassign
      }
    });
    return Object.assign({}, this.props.metadata, { concept });
  }

  storeChildRef(ref) {
    this.childControl = ref;
  }

  _getOptionsRepresentation(options) {
    const optionsRepresentation = [];
    map(options, option =>
      optionsRepresentation.push({
        name: option.display || option.name.display || option.name,
        value: option.uuid || `${option.system}/${option.code}`,
      })
    );
    return optionsRepresentation;
  }

  _getDisplayType(properties) {
    if (properties.autoComplete || (properties.URL && this.state.codedData.length > 10)) {
      return 'autoComplete';
    } else if (properties.dropDown) {
      return 'dropDown';
    }
    return 'button';
  }

  render() {
    const { metadata } = this.props;
    const displayType = this._getDisplayType(metadata.properties);
    const registeredComponent = ComponentStore.getDesignerComponent(displayType);
    if (registeredComponent) {
      return React.createElement(registeredComponent.control, {
        asynchronous: false,
        labelKey: 'name',
        options: this.state.codedData,
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
  setError: PropTypes.func,
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
            name: 'URL',
            dataType: 'string',
            elementType: 'text',
            defaultValue: '',
          },
          {
            name: 'autoComplete',
            dataType: 'boolean',
            defaultValue: false,
          },
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
