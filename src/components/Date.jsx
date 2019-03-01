import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentStore from 'src/helpers/componentStore';
import { Validator } from 'src/helpers/Validator';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';

export class Date extends Component {

  static getErrors(value, props) {
    const validations = props.validations;
    const controlDetails = { validations, value };
    return Validator.getErrors(controlDetails);
  }

  static hasErrors(errors) {
    return !isEmpty(errors);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.validate) {
      const hasErrors = Date.hasErrors(Date.getErrors(nextProps.value, nextProps));

      if (prevState.hasErrors !== hasErrors) {
        return { hasErrors };
      }
    }
    return null;
  }

  constructor(props) {
    super(props);
    const errors = Date.getErrors(props.value, props) || [];
    const hasErrors = this._isCreateByAddMore() ? Date.hasErrors(errors) : false;
    this.state = { hasErrors };
  }

  componentDidMount() {
    const { value, validateForm, onChange } = this.props;
    if (this.state.hasErrors || typeof value !== 'undefined' || validateForm) {
      onChange(value, Date.getErrors(value, this.props));
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
    const errors = Date.getErrors(this.props.value, this.props);
    if (Date.hasErrors(errors)) {
      this.props.onChange(this.props.value, errors);
    }
    if (this.isValueChanged) {
      this.props.onChange(this.props.value, errors);
    }
  }

  handleChange(e) {
    let value = e.target.value;
    value = (value === '') ? undefined : value;

    const errors = Date.getErrors(value, this.props);
    this.setState({ hasErrors: Date.hasErrors(errors) });
    this.props.onChange(value, errors);
  }

  _isCreateByAddMore() {
    return (this.props.formFieldPath.split('-')[1] !== '0');
  }

  render() {
    const defaultValue = this.props.value || '';
    return (
      <input
        className={classNames({ 'form-builder-error': this.state.hasErrors })}
        disabled={!this.props.enabled}
        onChange={(e) => this.handleChange(e)}
        type="date"
        value={defaultValue}
      />
    );
  }
}

Date.propTypes = {
  enabled: PropTypes.bool,
  formFieldPath: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  validate: PropTypes.bool.isRequired,
  validateForm: PropTypes.bool.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.string,
};

ComponentStore.registerComponent('date', Date);
