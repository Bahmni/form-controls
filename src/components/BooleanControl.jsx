import React, { Component, PropTypes } from 'react';
import 'src/helpers/componentStore';

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

  render() {
    const { displayType, options, validations, validate } = this.props;
    const registeredComponent = window.componentStore.getRegisteredComponent(displayType);
    if (registeredComponent) {
      const initialValue = this.props.value;
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
  displayType: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  validate: PropTypes.bool.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.any,
};

window.componentStore.registerComponent('boolean', BooleanControl);
