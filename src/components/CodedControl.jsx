import React, { Component, PropTypes } from 'react';
import ComponentStore from 'src/helpers/componentStore';
import map from 'lodash/map';
import find from 'lodash/find';
import each from 'lodash/each';

export class CodedControl extends Component {
  constructor(props) {
    super(props);
    this.onValueChange = this.onValueChange.bind(this);
  }

  onValueChange(value, errors) {
    const updatedValue = this._getUpdatedValue(value);
    this.props.onChange(updatedValue, errors);
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
    each(values, (value) => {
      options.push(find(this.props.options, ['uuid', value.value]));
    });
    return multiSelect ? options : options[0];
  }

  _getOptionsRepresentation(options) {
    const optionsRepresentation = [];
    map(options, (option) =>
      optionsRepresentation.push({ name: option.name.display || option.name, value: option.uuid })
    );
    return optionsRepresentation;
  }

  _getValue(value, multiSelect) {
    if (value) {
      const updatedValue = multiSelect ? value : [value];
      const options = this._getOptionsRepresentation(updatedValue, multiSelect);
      return multiSelect ? options : options[0];
    }
    return undefined;
  }

  _getChildProps(displayType) {
    const { formFieldPath, value, validate, validations, properties: { multiSelect } } = this.props;
    const props = {
      formFieldPath,
      value: this._getValue(value, multiSelect),
      onValueChange: this.onValueChange,
      options: this._getOptionsRepresentation(this.props.options, multiSelect),
      validate,
      validations,
      multiSelect,
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
    const registeredComponent = ComponentStore.getRegisteredComponent(displayType);
    if (registeredComponent) {
      const childProps = this._getChildProps(displayType);
      return React.createElement(registeredComponent, childProps);
    }
    return null;
  }
}

CodedControl.propTypes = {
  formFieldPath: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  properties: PropTypes.object.isRequired,
  validate: PropTypes.bool.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.any,
};

ComponentStore.registerComponent('Coded', CodedControl);
