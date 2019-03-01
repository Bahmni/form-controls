import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentStore from 'src/helpers/componentStore';
import { Validator } from 'src/helpers/Validator';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import { Error } from 'src/Error';

export class DateTime extends Component {
  static valueNotFilled({ dateValue, timeValue }) {
    return dateValue === '' && timeValue === '';
  }

  static valueCompletelyFilled({ dateValue, timeValue }) {
    return dateValue !== '' && timeValue !== '';
  }

  static isValid(state) {
    return DateTime.valueNotFilled(state) || DateTime.valueCompletelyFilled(state);
  }

  static getAllErrors(state, props) {
    const allErrors = DateTime.getDateErrors(state.dateValue, props);
    if (DateTime.isValid(state)) {
      return allErrors;
    }
    allErrors.push(new Error({ message: 'Incorrect Date Time' }));
    return allErrors;
  }

  static getDateErrors(value, props) {
    const validations = props.validations;
    const controlDetails = { validations, value };
    return Validator.getErrors(controlDetails);
  }

  static getDateTimeValue(state) {
    return !DateTime.valueNotFilled(state) ? `${state.dateValue} ${state.timeValue}` : undefined;
  }

  static getTimeValue(props) {
    return props.value ? props.value.split(' ')[1] : '';
  }

  static getDateValue(props) {
    return props.value ? props.value.split(' ')[0] : '';
  }

  static hasErrors(errors) {
    return !isEmpty(errors);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { dateValue, timeValue } = prevState;
    const updatedDateValue = DateTime.getDateValue(nextProps);
    const updatedTimeValue = DateTime.getTimeValue(nextProps);

    if (dateValue === updatedDateValue && timeValue === updatedTimeValue) {
      return null;
    }

    if (nextProps.validate) {
      const state = {
        dateValue: updatedDateValue,
        timeValue: updatedTimeValue,
      };

      const hasErrors = DateTime.hasErrors(DateTime.getAllErrors(state, nextProps));
      return { ...state, hasErrors };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const initState = {
      dateValue: DateTime.getDateValue(props),
      timeValue: DateTime.getTimeValue(props),
    };

    const errors = DateTime.getAllErrors(initState, props);
    const hasErrors = this._isCreateByAddMore() ? DateTime.hasErrors(errors) : false;
    this.state = { ...initState, hasErrors };
  }

  componentDidMount() {
    const { value, validateForm } = this.props;
    if (this.state.hasErrors || typeof value !== 'undefined' || validateForm) {
      this.props.onChange(value, DateTime.getAllErrors(this.state, this.props));
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    this.isValueChanged = this.props.value !== nextProps.value;
    if (this.props.enabled !== nextProps.enabled ||
      this.isValueChanged ||
      this.state.hasErrors !== nextState.hasErrors) {
      return true;
    }
    return false;
  }

  componentDidUpdate() {
    const errors = DateTime.getAllErrors(this.state, this.props);
    const dateTimeValue = DateTime.getDateTimeValue(this.state);

    this.props.onChange(dateTimeValue, errors);
    if (this.isValueChanged) {
      this.props.onChange(this.props.value, errors);
    }
  }

  handleDateChange(e) {
    const dateValue = e.target.value;
    this.setState({ dateValue }, this.updateParent);
  }

  handleTimeChange(e) {
    const timeValue = e.target.value;
    this.setState({ timeValue }, this.updateParent);
  }

  updateParent() {
    const errors = DateTime.getAllErrors(this.state, this.props);
    const dateTimeValue = DateTime.getDateTimeValue(this.state);
    this.setState({ hasErrors: DateTime.hasErrors(errors) });
    this.props.onChange(dateTimeValue, errors);
  }

  _isCreateByAddMore() {
    return (this.props.formFieldPath.split('-')[1] !== '0');
  }

  render() {
    const { dateValue, timeValue } = this.state;

    return (
      <div>
        <input
          className={classNames({ 'form-builder-error': this.state.hasErrors })}
          disabled={!this.props.enabled}
          onChange={(e) => this.handleDateChange(e)}
          type="date"
          value={dateValue}
        />
        <input
          className={classNames({ 'form-builder-error': this.state.hasErrors })}
          disabled={!this.props.enabled}
          onChange={(e) => this.handleTimeChange(e)}
          type="time"
          value={timeValue}
        />
      </div>
    );
  }
}

DateTime.propTypes = {
  enabled: PropTypes.bool,
  formFieldPath: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  validate: PropTypes.bool.isRequired,
  validateForm: PropTypes.bool.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.string,
};

ComponentStore.registerComponent('dateTime', DateTime);
