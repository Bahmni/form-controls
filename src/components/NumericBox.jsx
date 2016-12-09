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
    const concept = this.props.concept || {};
    const params = { minNormal: concept.lowNormal, maxNormal: concept.hiNormal,
      minAbsolute: concept.lowAbsolute, maxAbsolute: concept.hiAbsolute };
    const controlDetails = { validations, value, params };
    return Validator.getErrors(controlDetails);
  }

  render() {
    const concept = this.props.concept || {};
    return (
      <div>
        <input
          className={ classNames({ 'form-builder-error': this.state.hasErrors }) }
          onChange={ (e) => this.handleChange(e) }
          ref={(elem) => { this.input = elem; }}
          type="number"
        />
        <label>{NumericBoxDesigner.getRange(concept.lowNormal, concept.hiNormal)}</label>
      </div>
    );
  }
}

NumericBox.propTypes = {
  concept: PropTypes.shape({
    hiNormal: PropTypes.string,
    lowNormal: PropTypes.string,
    hiAbsolute: PropTypes.string,
    lowAbsolute: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  validate: PropTypes.bool.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.string,
};

ComponentStore.registerComponent('numeric', NumericBox);
