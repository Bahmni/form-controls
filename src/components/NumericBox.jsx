import React, { PropTypes } from 'react';
import ComponentStore from 'src/helpers/componentStore';
import { Validator } from 'src/helpers/Validator';
import classNames from 'classnames';
import constants from 'src/constants';
import { NumericBoxDesigner } from 'src/components/designer/NumericBoxDesigner.jsx';
import { BahmniInputComponent } from './BahmniInputComponent.jsx';

export class NumericBox extends BahmniInputComponent {
  constructor(props) {
    super(props);
    this.defaultValidations = [constants.validations.allowRange, constants.validations.minMaxRange];
    const errors = this._getErrors(props.value) || [];
    const hasWarnings = this._hasErrors(errors, constants.errorTypes.warning);
    this.state.hasWarnings = hasWarnings;
  }

  componentDidMount() {
    this.input.value = this.props.value;
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);
    if (nextProps.validate) {
      const errors = this._getErrors(nextProps.value);
      const hasWarnings = this._hasErrors(errors, constants.errorTypes.warning);
      this.setState({ hasWarnings });
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
    return (
      <div>
        <input
          className={ classNames({ 'form-builder-error': this.state.hasErrors }) }
          onChange={ (e) => this.handleChange(e) }
          ref={(elem) => { this.input = elem; }}
          type="number"
        />
        <label>{NumericBoxDesigner.getRange(lowNormal, hiNormal)}</label>
      </div>
    );
  }
}

NumericBox.propTypes = {
  hiAbsolute: PropTypes.number,
  hiNormal: PropTypes.number,
  lowAbsolute: PropTypes.number,
  lowNormal: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  validate: PropTypes.bool.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.string,
};

ComponentStore.registerComponent('numeric', NumericBox);
