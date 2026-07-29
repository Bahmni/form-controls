import React, { Component } from "react";

import PropTypes from "prop-types";
import {
  RadioButton as CarbonRadioButton,
  RadioButtonGroup,
} from "@carbon/react";
import { Validator } from "src/helpers/Validator";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";

export class RadioButton extends Component {
  constructor(props) {
    super(props);
    const errors = this._getErrors(props.value) || [];
    const hasErrors = this._isCreateByAddMore()
      ? this._hasErrors(errors)
      : false;
    this.state = { hasErrors };
    this.changeValue = this.changeValue.bind(this);
  }

  componentDidMount() {
    const { value, validateForm } = this.props;
    if (this.state.hasErrors || value !== undefined || validateForm) {
      this.props.onValueChange(value, this._getErrors(value), true);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !isEqual(this.props.value, nextProps.value) ||
      this.state.hasErrors !== nextState.hasErrors ||
      this.props.enabled !== nextProps.enabled ||
      this.props.validate !== nextProps.validate ||
      this.props.hidden !== nextProps.hidden
    );
  }

  componentDidUpdate(prevProps) {
    if (prevProps.hidden && !this.props.hidden && this.props.validateForm) {
      const errors = this._getErrors(this.props.value);
      const hasErrors = this._hasErrors(errors);
      this.setState({ hasErrors });
      this.props.onValueChange(this.props.value, errors, true);
      return;
    }

    const isValueChanged = !isEqual(prevProps.value, this.props.value);

    if (this.props.validate !== prevProps.validate || isValueChanged) {
      const errors = this._getErrors(this.props.value);
      const hasErrors = this._hasErrors(errors);
      if (this.state.hasErrors !== hasErrors) {
        this.setState({ hasErrors });
      }
    }

    const errors = this._getErrors(this.props.value);
    if (this._hasErrors(errors) || isValueChanged) {
      this.props.onValueChange(this.props.value, errors);
    }
  }
  changeValue(option) {
    const errors = this._getErrors(option);
    this.setState({ hasErrors: this._hasErrors(errors) });
    this.props.onValueChange(option, errors);
  }

  _hasErrors(errors) {
    return !isEmpty(errors);
  }

  _getErrors(value) {
    return Validator.getErrors({ validations: this.props.validations, value });
  }

  _isCreateByAddMore() {
    return (
      !!this.props.formFieldPath &&
      this.props.formFieldPath.split("-")[1] !== "0"
    );
  }

  render() {
    const { options, enabled, conceptUuid } = this.props;
    const name = `radio-${conceptUuid}`;

    return (
      <RadioButtonGroup
        id={conceptUuid}
        legendText=""
        name={name}
        valueSelected={
          this.props.value ? this.props.value[this.props.valueKey] : ""
        }
        onChange={(selectedValue) => {
          const option = options.find(
            (o) => o[this.props.valueKey] === selectedValue,
          );
          this.changeValue(option);
        }}
        onBlur={this.props.onBlur}
        disabled={!enabled}
        invalid={this.state.hasErrors}
        className={
          this.state.hasErrors
            ? "form-builder-error form-builder-radio-wrapper"
            : "form-builder-radio-wrapper"
        }
      >
        {options.map((option) => (
          <CarbonRadioButton
            key={option[this.props.valueKey]}
            id={`${conceptUuid}-${option[this.props.valueKey]}`}
            labelText={option[this.props.nameKey]}
            value={option[this.props.valueKey]}
          />
        ))}
      </RadioButtonGroup>
    );
  }
}

RadioButton.propTypes = {
  conceptUuid: PropTypes.string,
  enabled: PropTypes.bool,
  formFieldPath: PropTypes.string,
  hidden: PropTypes.bool,
  nameKey: PropTypes.string,
  onBlur: PropTypes.func,
  onValueChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  validate: PropTypes.bool,
  validateForm: PropTypes.bool,
  validations: PropTypes.array,
  value: PropTypes.any,
  valueKey: PropTypes.string,
};

RadioButton.defaultProps = {
  enabled: true,
  nameKey: "name",
  onBlur: () => {},
  valueKey: "value",
  validate: false,
  validateForm: false,
  validations: [],
};
