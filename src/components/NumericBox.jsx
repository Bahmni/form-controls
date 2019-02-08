import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentStore from 'src/helpers/componentStore';
import { Validator } from 'src/helpers/Validator';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import constants from 'src/constants';
import { NumericBoxDesigner } from 'src/components/designer/NumericBoxDesigner.jsx';

export class NumericBox extends Component {
  static getDefaultValidations() {
    return [constants.validations.allowRange, constants.validations.minMaxRange];
  }

  static getErrors(value, props) {
    const validations = NumericBox.getDefaultValidations().concat(props.validations);
    const params = {
      minNormal: props.lowNormal,
      maxNormal: props.hiNormal,
      minAbsolute: props.lowAbsolute,
      maxAbsolute: props.hiAbsolute,
    };
    const controlDetails = { validations, value, params };
    return Validator.getErrors(controlDetails);
  }

  static hasErrors(errors, errorType) {
    return !isEmpty(errors.filter((error) => error.type === errorType));
  }

  constructor(props) {
    super(props);
    const errors = NumericBox.getErrors(props.value, props) || [];
    const hasWarnings = NumericBox.hasErrors(errors, constants.errorTypes.warning);
    const hasErrors = this._isCreateByAddMore() ?
      NumericBox.hasErrors(errors, constants.errorTypes.error) : false;
    this.state = { hasErrors, hasWarnings };
  }

  componentDidMount() {
    const { value, validateForm, onChange } = this.props;
    this.input.value = this.props.value;
    if (this.state.hasErrors || typeof value !== 'undefined' || validateForm) {
      onChange(value, NumericBox.getErrors(value, this.props), true);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.validate) {
      const errors = NumericBox.getErrors(nextProps.value, nextProps);
      const hasErrors = NumericBox.hasErrors(errors, constants.errorTypes.error);
      const hasWarnings = NumericBox.hasErrors(errors, constants.errorTypes.warning);
      this.setState({ hasErrors, hasWarnings });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    let valueToString;
    if (this.props.value !== undefined) {
      valueToString = this.props.value.toString();
    }
    return valueToString !== nextProps.value ||
      this.state.hasErrors !== nextState.hasErrors ||
      this.props.enabled !== nextProps.enabled;
  }

  componentDidUpdate() {
    const { value, onChange } = this.props;

    const errors = NumericBox.getErrors(value, this.props);
    if (NumericBox.hasErrors(errors, constants.errorTypes.error)) {
      onChange(value, errors);
    }
    let valueToString;
    if (value !== undefined) {
      valueToString = value.toString();
    }
    if (this.input.value !== valueToString) {
      this.updateInputByPropsValue();
      onChange(value, errors);
    }
  }

  updateInputByPropsValue() {
    this.input.value = this.props.value;
  }

  handleChange(e) {
    let value = e.target.value;
    value = value && value.trim() !== '' ? value.trim() : undefined;
    const errors = NumericBox.getErrors(value, this.props);
    const hasErrors = NumericBox.hasErrors(errors, constants.errorTypes.error);
    const hasWarnings = NumericBox.hasErrors(errors, constants.errorTypes.warning);
    this.setState({ hasErrors, hasWarnings });
    this.props.onChange(value, errors);
  }

  _isCreateByAddMore() {
    return (this.props.formFieldPath.split('-')[1] !== '0');
  }

  render() {
    const { lowNormal, hiNormal } = this.props;
    if (NumericBoxDesigner.getRange(lowNormal, hiNormal) !== '') {
      return (
        <div className="fl">
          <input
            className={ classNames({ 'form-builder-error': this.state.hasErrors },
              { 'form-builder-warning': this.state.hasWarnings }) }
            disabled={ !this.props.enabled }
            onChange={ (e) => this.handleChange(e) }
            ref={(elem) => {
              this.input = elem;
            }}
            type="number"
          />
          <span className="form-builder-valid-range">
            {NumericBoxDesigner.getRange(lowNormal, hiNormal)}
          </span>
        </div>
      );
    }
    return (
      <div className="fl">
        <input
          className={ classNames({ 'form-builder-error': this.state.hasErrors }) }
          disabled={ !this.props.enabled }
          onChange={ (e) => this.handleChange(e) }
          ref={(elem) => {
            this.input = elem;
          }}
          type="number"
        />
      </div>
    );
  }
}

NumericBox.propTypes = {
  enabled: PropTypes.bool,
  formFieldPath: PropTypes.string.isRequired,
  hiAbsolute: PropTypes.number,
  hiNormal: PropTypes.number,
  lowAbsolute: PropTypes.number,
  lowNormal: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  validate: PropTypes.bool.isRequired,
  validateForm: PropTypes.bool.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.string,
};

ComponentStore.registerComponent('numeric', NumericBox);
