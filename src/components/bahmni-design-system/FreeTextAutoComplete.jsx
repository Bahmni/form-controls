import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ComboBox } from '@bahmni/design-system';
import { Validator } from 'src/helpers/Validator';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';

export class FreeTextAutoComplete extends Component {
  constructor(props) {
    super(props);
    const errors = this._getErrors(props.value) || [];
    const hasErrors = this._isCreateByAddMore() ? this._hasErrors(errors) : false;
    this.state = { hasErrors, value: props.value || null };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { value, validateForm } = this.props;
    if (this.state.hasErrors || value !== undefined || validateForm) {
      this.props.onChange({ value, errors: this._getErrors(value), triggerControlEvent: false });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    this.isValueChanged = !isEqual(this.props.value, nextProps.value);
    return (
      this.isValueChanged ||
      this.state.hasErrors !== nextState.hasErrors ||
      !isEqual(this.state.value, nextState.value) ||
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
      this.props.onChange({ value: this.props.value, errors });
      return;
    }

    if (!isEqual(prevProps.value, this.props.value)) {
      this.setState({ value: this.props.value || null });
    }

    if (this.props.validate !== prevProps.validate ||
        !isEqual(this.props.value, prevProps.value)) {
      const errors = this._getErrors(this.props.value);
      const hasErrors = this._hasErrors(errors);
      if (this.state.hasErrors !== hasErrors) {
        this.setState({ hasErrors });
      }
    }

    if (this.isValueChanged) {
      const errors = this._getErrors(this.props.value);
      this.props.onChange({ value: this.props.value, errors });
    }
  }

  _hasErrors(errors) {
    return !isEmpty(errors);
  }

  _getErrors(value) {
    return Validator.getErrors({ validations: this.props.validations, value });
  }

  _isCreateByAddMore() {
    return !!this.props.formFieldPath && this.props.formFieldPath.split('-')[1] !== '0';
  }

  handleChange({ selectedItem, inputValue }) {
    // selectedItem is null for custom-typed values; use inputValue in that case
    const value = selectedItem !== null && selectedItem !== undefined
      ? selectedItem
      : (inputValue || null);
    const errors = this._getErrors(value);
    this.setState({ hasErrors: this._hasErrors(errors), value });
    this.props.onChange({ value, errors });
  }

  render() {
    const { conceptUuid, enabled, options } = this.props;
    return (
      <ComboBox
        id={conceptUuid || 'free-text-autocomplete'}
        allowCustomValue
        disabled={!enabled}
        invalid={this.state.hasErrors}
        items={options}
        itemToString={(item) => (typeof item === 'string' ? item
          : item?.label || item?.name?.display || item?.name || '')}
        onChange={this.handleChange}
        selectedItem={this.state.value}
        titleText=""
      />
    );
  }
}

FreeTextAutoComplete.propTypes = {
  conceptUuid: PropTypes.string,
  enabled: PropTypes.bool,
  formFieldPath: PropTypes.string,
  hidden: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  validate: PropTypes.bool.isRequired,
  validateForm: PropTypes.bool.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.any,
};

FreeTextAutoComplete.defaultProps = {
  enabled: true,
  options: [],
  validate: false,
  validateForm: false,
  validations: [],
};
