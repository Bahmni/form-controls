import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentStore from 'src/helpers/componentStore';
import map from 'lodash/map';
import find from 'lodash/find';
import each from 'lodash/each';
import { IntlShape } from 'react-intl';
import constants from 'src/constants';
import { httpInterceptor } from 'src/helpers/httpInterceptor';

export class CodedControl extends Component {
  constructor(props) {
    super(props);
    this.onValueChange = this.onValueChange.bind(this);
    this.state = {
      codedData: this.props.options,
      success: false,
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
    if (properties.URL) {
      httpInterceptor
        .get(properties.URL)
        .then(response => {
          const answers = response.expansion.contains;
          const options = this.formatConcepts(answers);
          this.setState({ codedData: options, success: true });
        })
        .catch(() => {
          this.props.showNotification(
            'Failed to fetch answers',
            constants.messageType.error
          );
        });
    } else {
      this.setState({ success: true });
    }
  }

  formatConcepts(concepts) {
    const formattedConcepts = concepts.map(concept => ({
      uuid: `${concept.system}/${concept.code}`,
      name: concept.display,
      displayString: concept.display,
      codedAnswer: {
        uuid: `${concept.system}/${concept.code}`,
      },
    }));
    return formattedConcepts;
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
    each(values, value => {
      options.push(find(this.state.codedData, ['uuid', value.value]));
    });
    return multiSelect ? options : options[0];
  }

  _getOptionsRepresentation(options) {
    const optionsRepresentation = [];
    map(options, option => {
      const message = {
        id: option.translationKey || 'defaultId',
        defaultMessage: option.name.display || option.name,
      };
      const formattedMessage = this.props.intl.formatMessage(message);
      optionsRepresentation.push({
        name: formattedMessage,
        value: option.uuid,
      });
    });
    return optionsRepresentation;
  }

  _getValue(value, multiSelect) {
    if (value) {
      const updatedValue = multiSelect ? value : [value];
      updatedValue.map(val => {
        const updatedVal = val;
        const codedAnswer = find(
          this.state.codedData,
          option => option.uuid === val.uuid
        );
        updatedVal.translationKey = codedAnswer
          ? codedAnswer.translationKey
          : '';
        return updatedVal;
      });
      const options = this._getOptionsRepresentation(updatedValue, multiSelect);
      return multiSelect ? options : options[0];
    }
    return undefined;
  }

  _getChildProps(displayType) {
    const {
      enabled,
      formFieldPath,
      value,
      validate,
      validateForm,
      validations,
      properties: { multiSelect },
    } = this.props;
    const props = {
      enabled,
      formFieldPath,
      value: this._getValue(value, multiSelect),
      onValueChange: this.onValueChange,
      options: this._getOptionsRepresentation(this.state.codedData, multiSelect),
      validate,
      validateForm,
      validations,
      multiSelect,
      URL: this.props.properties.URL,
    };
    if (displayType === 'autoComplete' || displayType === 'dropDown') {
      props.asynchronous = false;
      props.labelKey = 'name';
      props.valueKey = 'value';
    }
    return props;
  }

  _getDisplayType(properties) {
    if (
      properties.autoComplete ||
      (properties.URL && this.state.codedData.length > 10)
    ) {
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
