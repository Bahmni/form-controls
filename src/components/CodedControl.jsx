import React, { Component, PropTypes } from 'react';
import ComponentStore from 'src/helpers/componentStore';
import map from 'lodash/map';
import find from 'lodash/find';
import get from 'lodash/get';

export class CodedControl extends Component {
  constructor(props) {
    super(props);
    this.onValueChange = this.onValueChange.bind(this);
  }

  onValueChange(value, errors) {
    const updatedValue = get(value, 'value') || value;
    const valueObj = this._getValueObject(updatedValue);
    this.props.onChange(valueObj, errors);
  }

  _getValueObject(value) {
    return find(this.props.options, { uuid: value });
  }

  _getOptionsRepresentation(options) {
    const optionsRepresentation = [];
    map(options, (option) =>
      optionsRepresentation.push({ name: option.display || option.name, value: option.uuid })
    );
    return optionsRepresentation;
  }

  _getChildProps(displayType) {
    const { validate, validations } = this.props;
    const initialValue = this.props.value ?
      this._getOptionsRepresentation([this.props.value]) : [];
    const props = {
      value: initialValue[0],
      onValueChange: this.onValueChange,
      options: this._getOptionsRepresentation(this.props.options),
      validate,
      validations,
    };
    if (displayType === 'autoComplete') {
      props.asynchronous = false;
      props.labelKey = 'name';
      props.value = initialValue;
    }
    return props;
  }

  render() {
    const { properties } = this.props;
    const displayType = properties.autoComplete ? 'autoComplete' : 'button';
    const registeredComponent = ComponentStore.getRegisteredComponent(displayType);
    if (registeredComponent) {
      const childProps = this._getChildProps(displayType);
      return React.createElement(registeredComponent, childProps);
    }
    return null;
  }
}

CodedControl.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  properties: PropTypes.object.isRequired,
  validate: PropTypes.bool.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.any,
};

ComponentStore.registerComponent('Coded', CodedControl);
