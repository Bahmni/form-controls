import React, { Component, PropTypes } from 'react';
import 'src/helpers/componentStore';
import { Validator } from 'src/helpers/Validator';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import constants from 'src/constants';

export class NumericBox extends Component {
  constructor(props) {
    super(props);
    this.defaultValidations = [constants.validations.allowRange];
    const errors = this._getErrors(props.value);
    const hasWarnings = this._hasErrors(errors, constants.errorTypes.warning);
    this.state = { hasErrors: false, hasWarnings };
  }

  componentDidMount() {
    this.input.value = this.props.value;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.validate) {
      const errors = this._getErrors(nextProps.value);
      const hasErrors = this._hasErrors(errors, constants.errorTypes.error);
      const hasWarnings = this._hasErrors(errors, constants.errorTypes.warning);
      this.setState({ hasErrors, hasWarnings });
    }
    if (this.props.value !== nextProps.value) {
      this.input.value = nextProps.value;
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.value !== nextProps.value ||
      this.state.hasErrors !== nextState.hasErrors) {
      return true;
    }
    return false;
  }

  componentDidUpdate() {
    const errors = this._getErrors(this.props.value);
    if (this._hasErrors(errors, constants.errorTypes.error)) {
      this.props.onChange(this.props.value, errors);
    }
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

  _hasErrors(errors, errorType) {
    return !isEmpty(errors.filter((error) => error.type === errorType));
  }

  _getErrors(value) {
    const validations = this.defaultValidations.concat(this.props.validations);
    const controlDetails = { validations, value, params: this.props };
    return Validator.getErrors(controlDetails);
  }

  render() {
    return (
      <input
        className={ classNames({ 'form-builder-error': this.state.hasErrors }) }
        onChange={ (e) => this.handleChange(e) }
        ref={(elem) => { this.input = elem; }}
        type="number"
      />
    );
  }
}

NumericBox.propTypes = {
  maxNormal: PropTypes.string,
  minNormal: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  validate: PropTypes.bool.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.string,
};

window.componentStore.registerComponent('numeric', NumericBox);
