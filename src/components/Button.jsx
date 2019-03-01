import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentStore from 'src/helpers/componentStore';
import map from 'lodash/map';
import classNames from 'classnames';
import { Validator } from 'src/helpers/Validator';
import isEmpty from 'lodash/isEmpty';
import clone from 'lodash/clone';
import find from 'lodash/find';
import filter from 'lodash/filter';
import isEqual from 'lodash/isEqual';

export class Button extends Component {
  static getErrors(value, validations) {
    const controlDetails = { validations, value };
    return Validator.getErrors(controlDetails);
  }

  static hasErrors(errors) {
    return !isEmpty(errors);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.validate || !isEqual(prevState.value, nextProps.value)) {
      const errors = Button.getErrors(nextProps.value, nextProps.validations);
      return { hasErrors: Button.hasErrors(errors), value: nextProps.value };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const value = props.value;
    const errors = Button.getErrors(value, props.validations) || [];
    const hasErrors = this._isCreateByAddMore() ? Button.hasErrors(errors) : false;
    this.state = { hasErrors, value };
  }

  componentDidMount() {
    const { value, validateForm, validations } = this.props;
    if (this.state.hasErrors || value !== undefined || validateForm) {
      this.props.onValueChange(value, Button.getErrors(value, validations));
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    this.isValueChanged = !isEqual(this.props.value, nextProps.value);
    if (this.isValueChanged ||
      this.state.hasErrors !== nextState.hasErrors ||
      this.props.enabled !== nextProps.enabled) {
      return true;
    }
    return false;
  }

  componentDidUpdate() {
    const { value, validations, onValueChange } = this.props;

    const errors = Button.getErrors(value, validations);
    if (Button.hasErrors(errors)) {
      onValueChange(this.props.value, errors);
    }
    if (this.isValueChanged) {
      onValueChange(this.props.value, errors);
    }
  }

  changeValue(valueSelected) {
    const value = this._getValue(valueSelected);
    const errors = Button.getErrors(value, this.props.validations);
    this.setState({ hasErrors: Button.hasErrors(errors) });
    this.props.onValueChange(value, errors);
  }

  _getValue(valueSelected) {
    const { multiSelect } = this.props;
    let value = this._getValueFromProps() || [];
    if (this._isActive(valueSelected)) {
      if (multiSelect) {
        const valueKey = this.props.valueKey;
        value = filter(value, (val) => val[valueKey] !== valueSelected[valueKey]);
      } else {
        value = [];
      }
    } else {
      value = multiSelect ? clone(value) : [];
      value.push(valueSelected);
    }
    return multiSelect ? value : value[0];
  }

  _isActive(option) {
    const valueKey = this.props.valueKey;
    return find(this._getValueFromProps(), (value) => option[valueKey] === value[valueKey]);
  }

  _getValueFromProps() {
    const { multiSelect, value } = this.props;
    if (value) {
      return multiSelect ? value : [value];
    }
    return undefined;
  }

  _isCreateByAddMore() {
    return (this.props.formFieldPath.split('-')[1] !== '0');
  }

  displayButtons() {
    return map(this.props.options, (option, index) =>
      <button
        className={classNames('fl', { active: this._isActive(option) })}
        disabled={!this.props.enabled}
        key={index}
        onClick={() => this.changeValue(option)}
      >
        <i className="fa fa-ok"></i>{option[this.props.nameKey]}
      </button>
    );
  }

  render() {
    const className =
      classNames('form-control-buttons', { 'form-builder-error': this.state.hasErrors });
    return <div className={className}>{this.displayButtons()}</div>;
  }


}

Button.propTypes = {
  enabled: PropTypes.bool,
  formFieldPath: PropTypes.string,
  multiSelect: PropTypes.bool,
  nameKey: PropTypes.string,
  onValueChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  validate: PropTypes.bool.isRequired,
  validateForm: PropTypes.bool.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.any,
  valueKey: PropTypes.string,
};

Button.defaultProps = {
  enabled: true,
  valueKey: 'value',
  nameKey: 'name',
};

ComponentStore.registerComponent('button', Button);
