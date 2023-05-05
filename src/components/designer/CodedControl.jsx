import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentStore from 'src/helpers/componentStore';
import map from 'lodash/map';
import cloneDeep from 'lodash/cloneDeep';
import TranslationKeyGenerator from 'src/services/TranslationKeyService';
import { Util } from '../../helpers/Util';

export class CodedControlDesigner extends Component {
  constructor(props) {
    super(props);
    this.storeChildRef = this.storeChildRef.bind(this);
    this.state = {
      codedData: this._getOptionsRepresentation(
        this.props.metadata.concept.answers
      ),
      success: false,
    };
  }

  componentDidMount() {
    this.getAnswers();
  }

  componentDidUpdate(prevProps) {
    const { metadata } = this.props;
    if (metadata.properties !== prevProps.metadata.properties) {
      this.getAnswers();
    }
  }

  getAnswers() {
    const { metadata, setError } = this.props;

    if (!metadata.properties.url || metadata.properties.autoComplete) {
      this.setState({ success: true });
      return;
    }

    Util.getAnswers(metadata.properties.url)
      .then(response => {
        const options = this._getOptionsRepresentation(response);
        this.setState({ codedData: options, success: true });
      })
      .catch(() => {
        if (setError) {
          setError({ message: 'Something unexpected happened.' });
        }
      });
  }

  getJsonDefinition() {
    const metadataClone = cloneDeep(this.props.metadata);
    const { concept, id } = metadataClone;
    const answers = metadataClone.properties.url
      ? this.state.codedData
      : concept.answers;
    map(answers, answer => {
      if (!answer.translationKey) {
        const name = metadataClone.properties.url
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
        name: option.conceptName || option.name.display || option.name,
        value: option.uuid || `${option.conceptSystem}/${option.conceptUuid}`,
      })
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
    const { metadata } = this.props;
    const displayType = this._getDisplayType(metadata.properties);
    const registeredComponent =
      ComponentStore.getDesignerComponent(displayType);
    if (registeredComponent) {
      return this.state.success && React.createElement(registeredComponent.control, {
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
            name: 'url',
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
