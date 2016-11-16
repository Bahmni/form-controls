import React, { Component, PropTypes } from 'react';
import 'src/helpers/componentStore';
import isEqual from 'lodash/isEqual';

export class BooleanControl extends Component {
  constructor(props) {
    super(props);
    this.onValueChange = this.onValueChange.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.value !== nextProps.value || !isEqual(this.props.errors, nextProps.errors)) {
      return true;
    }
    return false;
  }

  onValueChange(value, errors) {
    this.props.onChange(value, errors);
  }

  render() {
    const { displayType, errors, options, validations } = this.props;
    const registeredComponent = window.componentStore.getRegisteredComponent(displayType);
    if (registeredComponent) {
      const initialValue = this.props.value;
      const childProps = {
        errors,
        value: initialValue,
        onValueChange: this.onValueChange,
        options,
        validations,
      };
      return React.createElement(registeredComponent, childProps);
    }
    return null;
  }
}

BooleanControl.propTypes = {
  displayType: PropTypes.string.isRequired,
  errors: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.any,
};

window.componentStore.registerComponent('boolean', BooleanControl);
