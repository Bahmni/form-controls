import React, { Component, PropTypes } from 'react';
import ComponentStore from 'src/helpers/componentStore';
import find from 'lodash/find';
import map from 'lodash/map';
import { UnSupportedComponent } from 'components/UnSupportedComponent.jsx';

export class BooleanControl extends Component {
  constructor(props) {
    super(props);
    this.onValueChange = this.onValueChange.bind(this);
  }

  onValueChange(value, errors) {
    const updatedValue = value ? value.value : undefined;
    this.props.onChange(updatedValue, errors);
  }

  _getOptionsRepresentation(options) {
    const optionsRepresentation = [];
    map(options, (option) => {
      const message = {
        id: option.translationKey,
        defaultMessage: option.name,
      };
      const formattedMessage = this.context.intl.formatMessage(message);
      optionsRepresentation.push({ name: formattedMessage, value: option.value });
    });
    return optionsRepresentation;
  }

  _getValue(options, value) {
    const updatedValue = find(options, ['value', value]);
    return updatedValue ? this._getOptionsRepresentation([updatedValue])[0] : undefined;
  }

  render() {
    const { formFieldPath, enabled, options, validations, validate, validateForm } = this.props;
    const registeredComponent = ComponentStore.getRegisteredComponent('button');
    if (registeredComponent) {
      const initialValue = this._getValue(options, this.props.value);
      const childProps = {
        enabled,
        formFieldPath,
        value: initialValue,
        onValueChange: this.onValueChange,
        options: this._getOptionsRepresentation(options),
        validate,
        validateForm,
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
  formFieldPath: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  validate: PropTypes.bool.isRequired,
  validateForm: PropTypes.bool.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.any,
};

BooleanControl.defaultProps = {
  enabled: true,
};

BooleanControl.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

ComponentStore.registerComponent('boolean', BooleanControl);
