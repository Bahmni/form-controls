import React, { Component, PropTypes } from 'react';
import 'src/helpers/componentStore';
import find from 'lodash/find';

export class BooleanControl extends Component {
  constructor(props) {
    super(props);
    this.onValueChange = this.onValueChange.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.value !== nextProps.value) {
      return true;
    }
    return false;
  }

  onValueChange(value, errors) {
    this.props.onChange(value, errors);
  }

  _getValue(options, value) {
    return find(options, ['value', value]);
  }

  render() {
    const { options, validations, validate } = this.props;
    const registeredComponent = window.componentStore.getRegisteredComponent('button');
    if (registeredComponent) {
      const initialValue = this._getValue(options, this.props.value);
      const childProps = {
        value: initialValue,
        onValueChange: this.onValueChange,
        options,
        validate,
        validations,
      };
      return React.createElement(registeredComponent, childProps);
    }
    return null;
  }
}

BooleanControl.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  validate: PropTypes.bool.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.any,
};

window.componentStore.registerComponent('boolean', BooleanControl);
