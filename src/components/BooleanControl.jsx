import React, { Component, PropTypes } from 'react';
import ComponentStore from 'src/helpers/componentStore';
import find from 'lodash/find';
import { UnSupportedComponent } from 'components/UnSupportedComponent.jsx';

export class BooleanControl extends Component {
  constructor(props) {
    super(props);
    this.onValueChange = this.onValueChange.bind(this);
  }

  onValueChange(value, errors, onActionDone) {
    const updatedValue = value ? value.value : undefined;
    this.props.onChange(updatedValue, errors, onActionDone);
  }

  _getValue(options, value) {
    return find(options, ['value', value]);
  }

  render() {
    const { enabled, options, validations, validate, onEventTrigger } = this.props;
    const registeredComponent = ComponentStore.getRegisteredComponent('button');
    if (registeredComponent) {
      const initialValue = this._getValue(options, this.props.value);
      const childProps = {
        enabled,
        value: initialValue,
        onEventTrigger,
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
  enabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onEventTrigger: PropTypes.func,
  options: PropTypes.array.isRequired,
  validate: PropTypes.bool.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.any,
};

BooleanControl.defaultProps = {
  enabled: true,
};

ComponentStore.registerComponent('boolean', BooleanControl);
