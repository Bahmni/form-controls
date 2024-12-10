import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentStore from 'src/helpers/componentStore';
import find from 'lodash/find';
import each from 'lodash/each';
import { IntlShape } from 'react-intl';
import constants from 'src/constants';
import { Util } from '../helpers/Util';
export class CodedControl extends Component {
  constructor(props) {
    super(props);
    this.onValueChange = this.onValueChange.bind(this);
    this.state = {
      codedData: this.props.options,
      success: false,
      terminologyServiceConfig: {
        limit: 30,
      },
    };
  }

  componentDidMount() {
    this.getAnswers();
  }

  onValueChange(value, errors, triggerControlEvent) {
    const updatedValue = this._getUpdatedValue(value);
    this.props.onChange({ value: updatedValue, errors, triggerControlEvent });
  }

  getAnswers() {
    const { properties } = this.props;
    const { getConfig, getAnswers, formatConcepts } = Util;

    if (!properties.url) {
      this.setState({ success: true });
      return;
    }

    getConfig(properties.url)
    .then(response => {
      const { terminologyService } = response.config || {};

      if (terminologyService) {
        this.setState(prevState => ({
          terminologyServiceConfig: {
            ...prevState.terminologyServiceConfig,
            ...terminologyService,
          },
        }));
      }

      if (properties.autoComplete) {
        this.setState({ success: true });
        return Promise.resolve([]);
      }

      return getAnswers(properties.url, '', this.state.terminologyServiceConfig.limit);
    })
    .then(data => {
      if (!data) return;
      const options = formatConcepts(data);
      this.setState({ codedData: options, success: true });
    })
    .catch(() => {
      this.props.showNotification(
        'Something unexpected happened.',
        constants.messageType.error
      );
    });
  }

  _getUpdatedValue(value) {
    const multiSelect = this.props.properties.multiSelect;
    if (value) {
      const updatedValue = multiSelect ? value : [value];
      return this._getOptionsFromValues(updatedValue, multiSelect);
    }
    return undefined;
  }

  _getOptionsFromValues(values, multiSelect) {
    const options = [];
    if (this.props.properties.url) return multiSelect ? values : values[0];
    each(values, value => {
      options.push(find(this.state.codedData, ['uuid', value.value]));
    });
    return multiSelect ? options : options[0];
  }

  _getOptionsRepresentation(options) {
    return options.map(option => {
      const message = {
        id: option.translationKey || 'defaultId',
        defaultMessage: option.name.display || option.name,
      };
      const formattedMessage = this.props.intl.formatMessage(message);
      const result = {
        name: formattedMessage,
        value: option.uuid,
      };
      if (this.props.properties.url) {
        result.codedAnswer = option.codedAnswer;
        result.uuid = option.uuid || option.value;
      }
      return result;
    });
  }

  _getValue(value, multiSelect) {
    if (!value) return undefined;

    const getMapping = val => (val.mappings && !this.props.properties.autoComplete ?
    find(val.mappings, ['source', this.state.terminologyServiceConfig.source]) : null);

    const codedAnswer = val => {
      const mapping = getMapping(val);
      if (mapping) {
        return this.state.codedData.find(option => option.uuid.replace(/\D/g, '') === mapping.code);
      }
      return find(this.state.codedData, option => option.uuid === (val.uuid || val.value));
    };

    const createAnswer = val => {
      const coded = codedAnswer(val);
      return coded || { ...val, name: val.name, uuid: val.uuid || val.value, translationKey: '' };
    };

    const options = multiSelect ? value.map(createAnswer) : [createAnswer(value)];

    const optionsRepresentation = this._getOptionsRepresentation(options, multiSelect);
    return multiSelect ? optionsRepresentation : optionsRepresentation[0];
  }

  _getChildProps(displayType) {
    const {
      conceptUuid,
      enabled,
      formFieldPath,
      value,
      validate,
      validateForm,
      validations,
      properties: { multiSelect },
    } = this.props;
    const props = {
      conceptUuid,
      enabled,
      formFieldPath,
      value: this._getValue(value, multiSelect),
      onValueChange: this.onValueChange,
      options: this._getOptionsRepresentation(
        this.state.codedData,
        multiSelect
      ),
      validate,
      validateForm,
      validations,
      multiSelect,
      url: this.props.properties.url,
      terminologyServiceConfig: this.state.terminologyServiceConfig,
    };
    if (displayType === 'autoComplete' || displayType === 'dropDown') {
      props.asynchronous = false;
      props.labelKey = 'name';
      props.valueKey = 'value';
    }
    return props;
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
    const { properties } = this.props;
    const displayType = this._getDisplayType(properties);
    const registeredComponent =
      ComponentStore.getRegisteredComponent(displayType);
    if (registeredComponent) {
      const childProps = this._getChildProps(displayType);
      return (
        this.state.success &&
        React.createElement(registeredComponent, childProps)
      );
    }
    return null;
  }
}

CodedControl.propTypes = {
  conceptUuid: PropTypes.string,
  enabled: PropTypes.bool,
  formFieldPath: PropTypes.string,
  intl: IntlShape,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  properties: PropTypes.object.isRequired,
  showNotification: PropTypes.func.isRequired,
  validate: PropTypes.bool.isRequired,
  validateForm: PropTypes.bool.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.any,
};

ComponentStore.registerComponent('Coded', CodedControl);
