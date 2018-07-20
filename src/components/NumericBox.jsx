import React, { Component, PropTypes } from 'react';
import ComponentStore from 'src/helpers/componentStore';
import { Validator } from 'src/helpers/Validator';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import constants from 'src/constants';
import { NumericBoxDesigner } from 'src/components/designer/NumericBoxDesigner.jsx';

export class NumericBox extends Component {
  constructor(props) {
    super(props);
    this.defaultValidations = [constants.validations.allowRange, constants.validations.minMaxRange];
    const errors = this._getErrors(props.value) || [];
    const hasWarnings = this._hasErrors(errors, constants.errorTypes.warning);
    const hasErrors = this._isCreateByAddMore() ?
      this._hasErrors(errors, constants.errorTypes.error) : false;
    this.state = { hasErrors, hasWarnings };
  }

  componentDidMount() {
    const { value, validateForm } = this.props;
    this.input.value = this.props.value;
    if (this.state.hasErrors || typeof value !== 'undefined' || validateForm) {
      this.props.onChange(value, this._getErrors(value), true);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.validate) {
      const errors = this._getErrors(nextProps.value);
      const hasErrors = this._hasErrors(errors, constants.errorTypes.error);
      const hasWarnings = this._hasErrors(errors, constants.errorTypes.warning);
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
    const errors = this._getErrors(this.props.value);
    if (this._hasErrors(errors, constants.errorTypes.error)) {
      this.props.onChange(this.props.value, errors);
    }
    let valueToString;
    if (this.props.value !== undefined) {
      valueToString = this.props.value.toString();
    }
    if (this.input.value !== valueToString) {
      this.updateInputByPropsValue();
      this.props.onChange(this.props.value, errors);
    }
  }

  updateInputByPropsValue() {
    this.input.value = this.props.value;
  }

  handleChange(e) {
    let value = e.target.value;
    value = value && value.trim() !== '' ? value.trim() : undefined;
    const errors = this._getErrors(value);
    const hasErrors = this._hasErrors(errors, constants.errorTypes.error);
    const hasWarnings = this._hasErrors(errors, constants.errorTypes.warning);
    this.setState({ hasErrors, hasWarnings });
    this.props.onChange(value, errors);
  }

  _isCreateByAddMore() {
    return (this.props.formFieldPath.split('-')[1] !== '0');
  }

  _hasErrors(errors, errorType) {
    return !isEmpty(errors.filter((error) => error.type === errorType));
  }

  _getErrors(value) {
    const validations = this.defaultValidations.concat(this.props.validations);
    const params = {
      minNormal: this.props.lowNormal,
      maxNormal: this.props.hiNormal,
      minAbsolute: this.props.lowAbsolute,
      maxAbsolute: this.props.hiAbsolute,
    };
    const controlDetails = { validations, value, params };
    return Validator.getErrors(controlDetails);
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
