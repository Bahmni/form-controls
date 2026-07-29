import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Validator } from 'src/helpers/Validator';
import isEmpty from 'lodash/isEmpty';
import { TextArea } from '@bahmni/design-system';
import isEqual from 'lodash/isEqual';
import constants from 'src/constants';

export class TextBox extends Component {
  constructor(props) {
    super(props);
    const errors = this._getErrors(props.value) || [];
    const hasErrors = this._isCreateByAddMore() ? this._hasErrors(errors) : false;
    this.state = { hasErrors, hasWarnings: false };
  }

  componentDidMount() {
    const { value, validateForm } = this.props;
    if (this.state.hasErrors || typeof value !== 'undefined' || validateForm) {
      this.props.onChange({ value, errors: this._getErrors(value), triggerControlEvent: false });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    this.isValueChanged = this.props.value !== nextProps.value;
    if (this.props.enabled !== nextProps.enabled ||
      this.props.validate !== nextProps.validate ||
      this.isValueChanged ||
      this.state.hasErrors !== nextState.hasErrors ||
      this.state.hasWarnings !== nextState.hasWarnings ||
      this.props.hidden !== nextProps.hidden) {
      return true;
    }
    return false;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.hidden && !this.props.hidden && this.props.validateForm) {
      const errors = this._getErrors(this.props.value);
      const hasErrors = this._hasErrors(errors);
      const hasWarnings = this._hasWarnings(errors);
      this.setState({ hasErrors, hasWarnings });
      this.props.onChange({ value: this.props.value, errors });
      return;
    }

    if (this.props.validate !== prevProps.validate ||
        !isEqual(this.props.value, prevProps.value)) {
      const errors = this._getErrors(this.props.value);
      const hasErrors = this._hasErrors(errors);
      const hasWarnings = this._hasWarnings(errors);
      if (this.state.hasErrors !== hasErrors || this.state.hasWarnings !== hasWarnings) {
        this.setState({ hasErrors, hasWarnings });
      }
    }

    if (this.isValueChanged) {
      const errors = this._getErrors(this.props.value);
      this.props.onChange({ value: this.props.value, errors });
    }
  }

  _hasErrors(errors) {
    return !isEmpty(errors.filter(e => e.type !== constants.errorTypes.warning));
  }

  _hasWarnings(errors) {
    return !isEmpty(errors.filter(e => e.type === constants.errorTypes.warning));
  }

  _getErrors(value) {
    const validations = this.props.validations;
    const controlDetails = { validations, value };
    return Validator.getErrors(controlDetails);
  }

  _isCreateByAddMore() {
    return (this.props.formFieldPath.split('-')[1] !== '0');
  }

  handleChange(e) {
    const value = e.target.value;
    const errors = this._getErrors(value);
    this.setState({ hasErrors: this._hasErrors(errors), hasWarnings: this._hasWarnings(errors) });
    this.props.onChange({ value, errors });
  }

  render() {
    const defaultValue = this.props.value || '';
    return (
      <div className="obs-comment-section-wrap">
        <TextArea
          disabled={!this.props.enabled}
          id={this.props.conceptUuid}
          invalid={this.state.hasErrors}
          warn={this.state.hasWarnings}
          labelText=""
          onChange={(e) => this.handleChange(e)}
          rows={3}
          value={defaultValue}
        />
      </div>
    );
  }
}

TextBox.propTypes = {
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

TextBox.defaultProps = {
  enabled: true,
};
