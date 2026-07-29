import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
    // Show errors on mount if validate is true or if created by add more
    const hasErrors = (this._isCreateByAddMore() || props.validate) ?
      this._hasErrors(errors, constants.errorTypes.error) : false;
    this.state = { hasErrors, hasWarnings };
  }

  componentDidMount() {
    const { value, validateForm } = this.props;
    this.input.value = this.props.value;
    if (this.state.hasErrors || typeof value !== 'undefined' || validateForm) {
      this.props.onChange({ value, errors: this._getErrors(value), triggerControlEvent: false,
        calledOnMount: true });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    let valueToString;
    if (this.props.value !== undefined) {
      valueToString = this.props.value.toString();
    }
    return valueToString !== nextProps.value ||
      this.state.hasErrors !== nextState.hasErrors ||
      this.props.enabled !== nextProps.enabled ||
      this.props.hidden !== nextProps.hidden;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.hidden && !this.props.hidden && this.props.validateForm) {
      const errors = this._getErrors(this.props.value);
      const hasErrors = this._hasErrors(errors, constants.errorTypes.error);
      const hasWarnings = this._hasErrors(errors, constants.errorTypes.warning);
      this.setState({ hasErrors, hasWarnings });
      this.props.onChange({ value: this.props.value, errors, calledOnMount: true });
      return;
    }

    // Update state when props change (moved from componentWillReceiveProps)
    if (this.props.validate !== prevProps.validate ||
        this.props.value !== prevProps.value) {
      if (this.props.validate) {
        const errors = this._getErrors(this.props.value);
        const hasErrors = this._hasErrors(errors, constants.errorTypes.error);
        const hasWarnings = this._hasErrors(errors, constants.errorTypes.warning);
        
        if (this.state.hasErrors !== hasErrors || this.state.hasWarnings !== hasWarnings) {
          this.setState({ hasErrors, hasWarnings });
        }
      }
    }

    // Handle error callbacks
    const errors = this._getErrors(this.props.value);
    if (this._hasErrors(errors, constants.errorTypes.error)) {
      this.props.onChange({ value: this.props.value, errors });
    }
    let valueToString;
    if (this.props.value !== undefined) {
      valueToString = this.props.value.toString();
    }
    if (this.input.value !== valueToString) {
      this.updateInputByPropsValue();
      this.props.onChange({ value: this.props.value, errors });
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
    this.props.onChange({ value, errors });
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

  isComputed() {
    const { conceptClass } = this.props;
    return conceptClass === 'Computed';
  }

  render() {
    const { lowNormal, hiNormal, conceptUuid } = this.props;
    if (NumericBoxDesigner.getRange(lowNormal, hiNormal) !== '') {
      return (
        <div className="fl">
          <input
            className={ classNames({ 'form-builder-error': this.state.hasErrors },
              { 'form-builder-warning': this.state.hasWarnings }) }
            disabled={ !this.props.enabled }
            id={conceptUuid}
            onChange={ (e) => this.handleChange(e) }
            ref={(elem) => {
              this.input = elem;
            }}
            step="any"
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
          className={ classNames({ 'form-builder-error': this.state.hasErrors,
            'computed-value': this.isComputed() }) }
          disabled={ !this.props.enabled }
          id={conceptUuid}
          onChange={ (e) => this.handleChange(e) }
          ref={(elem) => {
            this.input = elem;
          }}
          step="any"
          type="number"
        />
      </div>
    );
  }
}

NumericBox.propTypes = {
  conceptClass: PropTypes.string,
  conceptUuid: PropTypes.string,
  enabled: PropTypes.bool,
  formFieldPath: PropTypes.string.isRequired,
  hiAbsolute: PropTypes.number,
  hiNormal: PropTypes.number,
  hidden: PropTypes.bool,
  lowAbsolute: PropTypes.number,
  lowNormal: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  validate: PropTypes.bool.isRequired,
  validateForm: PropTypes.bool.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.string,
};

ComponentStore.registerComponent('numeric', NumericBox);
