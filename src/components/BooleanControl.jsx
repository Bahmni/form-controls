import React, { Component, PropTypes } from 'react';
import ComponentStore from 'src/helpers/componentStore';
import find from 'lodash/find';
import { UnSupportedComponent } from 'components/UnSupportedComponent.jsx';

export class BooleanControl extends Component {
  constructor(props) {
    super(props);
    this.onValueChange = this.onValueChange.bind(this);
  }

  onValueChange(value, errors) {
    this.props.onChange(value, errors);
  }

  _getValue(options, value) {
    return find(options, ['value', value]);
  }

  render() {
    const { options, validations, validate } = this.props;
    const registeredComponent = ComponentStore.getRegisteredComponent('button');
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
    return (
        <div>
          <UnSupportedComponent
            message={ 'Button component is not supported' }
          />
        </div>
    );
  }
}

BooleanControl.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  validate: PropTypes.bool.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.any,
};

ComponentStore.registerComponent('boolean', BooleanControl);
