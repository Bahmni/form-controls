import React, { Component, PropTypes } from 'react';
import ComponentStore from 'src/helpers/componentStore';
import { Validator } from 'src/helpers/Validator';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import { Error } from 'src/Error';

export class DateTime extends Component {
  constructor(props) {
    super(props);
    this.dateValue = props.value ? props.value.split(' ')[0] : '';
    this.timeValue = props.value ? props.value.split(' ')[1] : '';
    this.state = { hasErrors: false };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.validate) {
      this.dateValue = nextProps.value ? nextProps.value.split(' ')[0] : '';
      this.timeValue = nextProps.value ? nextProps.value.split(' ')[1] : '';
      const errors = this._getAllErrors();
      this.setState({ hasErrors: this._hasErrors(errors) });
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
    const errors = this._getAllErrors();
    const dateTimeValue = !this.valueNotFilled() ?
      `${this.dateValue} ${this.timeValue}` : undefined;
    this.props.onChange(dateTimeValue, errors);
  }

  handleDateChange(e) {
    this.dateValue = e.target.value;
    this.updateParent();
  }

  handleTimeChange(e) {
    this.timeValue = e.target.value;
    this.updateParent();
  }

  updateParent() {
    const errors = this._getAllErrors();
    const dateTimeValue = !this.valueNotFilled() ?
      `${this.dateValue} ${this.timeValue}` : undefined;
    this.setState({ hasErrors: this._hasErrors(errors) });
    this.props.onChange(dateTimeValue, errors);
  }

  _hasErrors(errors) {
    return !isEmpty(errors);
  }

  _getAllErrors() {
    const allErrors = this._getDateErrors(this.dateValue);
    if (this.isValid()) {
      return allErrors;
    }
    allErrors.push(new Error({ message: 'Incorrect Date Time' }));
    return allErrors;
  }

  isValid() {
    return this.valueNotFilled() || this.valueCompletelyFilled();
  }

  valueNotFilled() {
    return this.dateValue === '' && this.timeValue === '';
  }

  valueCompletelyFilled() {
    return this.dateValue !== '' && this.timeValue !== '';
  }

  _getDateErrors(value) {
    const validations = this.props.validations;
    const controlDetails = { validations, value };
    return Validator.getErrors(controlDetails);
  }

  render() {
    return (
      <div>
        <input
          className={classNames({ 'form-builder-error': this.state.hasErrors })}
          defaultValue={this.dateValue}
          onChange={e => this.handleDateChange(e)}
          type="date"
        />
        <input
          className={classNames({ 'form-builder-error': this.state.hasErrors })}
          defaultValue={this.timeValue}
          onChange={e => this.handleTimeChange(e)}
          type="time"
        />
      </div>
    );
  }
}

DateTime.propTypes = {
  onChange: PropTypes.func.isRequired,
  validate: PropTypes.bool.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.string,
};

ComponentStore.registerComponent('dateTime', DateTime);
