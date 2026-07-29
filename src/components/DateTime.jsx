import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
    const errors = this._getAllErrors();
    const hasErrors = this._isCreateByAddMore() ? this._hasErrors(errors) : false;
    this.state = { hasErrors };
  }

  componentDidMount() {
    const { value, validateForm } = this.props;
    if (this.state.hasErrors || typeof value !== 'undefined' || validateForm) {
      this.props.onChange({ value, errors: this._getAllErrors(), triggerControlEvent: false });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    this.isValueChanged = this.props.value !== nextProps.value;
    if (this.props.enabled !== nextProps.enabled ||
      this.isValueChanged ||
      this.state.hasErrors !== nextState.hasErrors ||
      this.props.hidden !== nextProps.hidden) {
      return true;
    }
    return false;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.hidden && !this.props.hidden && this.props.validateForm) {
      const errors = this._getAllErrors();
      const hasErrors = this._hasErrors(errors);
      this.setState({ hasErrors });
      this.props.onChange({ value: this.props.value, errors });
      return;
    }

    // Update internal values and state when props change (moved from componentWillReceiveProps)
    let needsUpdate = false;
    
    if (this.props.value !== prevProps.value) {
      this.dateValue = this.props.value ? this.props.value.split(' ')[0] : '';
      this.timeValue = this.props.value ? this.props.value.split(' ')[1] : '';
      needsUpdate = true;
    }
    
    if (this.props.validate !== prevProps.validate || needsUpdate) {
      if (this.props.validate) {
        const errors = this._getAllErrors();
        const hasErrors = this._hasErrors(errors);
        
        if (this.state.hasErrors !== hasErrors) {
          this.setState({ hasErrors });
          return; // State update will trigger another render
        }
      }
      
      // Force re-render when value changes but hasErrors doesn't change
      if (needsUpdate && this.props.validate) {
        this.forceUpdate();
      }
    }

    // Handle error callbacks
    const errors = this._getAllErrors();
    const dateTimeValue = !this.valueNotFilled() ?
      `${this.dateValue} ${this.timeValue}` : undefined;
    this.props.onChange({ value: dateTimeValue, errors });
    if (this.isValueChanged) {
      this.props.onChange({ value: this.props.value, errors });
    }
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
    this.props.onChange({ value: dateTimeValue, errors });
  }

  _hasErrors(errors) {
    return !isEmpty(errors);
  }

  _isCreateByAddMore() {
    return (this.props.formFieldPath.split('-')[1] !== '0');
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
          disabled={!this.props.enabled}
          id={this.props.conceptUuid}
          onChange={(e) => this.handleDateChange(e)}
          type="date"
          value={this.dateValue}
        />
        <input
          className={classNames({ 'form-builder-error': this.state.hasErrors })}
          disabled={!this.props.enabled}
          id={this.props.conceptUuid}
          onChange={(e) => this.handleTimeChange(e)}
          type="time"
          value={this.timeValue}
        />
      </div>
    );
  }
}

DateTime.propTypes = {
  conceptUuid: PropTypes.string,
  enabled: PropTypes.bool,
  formFieldPath: PropTypes.string,
  hidden: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  validate: PropTypes.bool.isRequired,
  validateForm: PropTypes.bool.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.string,
};

ComponentStore.registerComponent('dateTime', DateTime);
