import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { SelectableTag } from '@bahmni/design-system';
import { spacing03 } from '@carbon/layout';
import { Validator } from 'src/helpers/Validator';
import isEmpty from 'lodash/isEmpty';
import constants from 'src/constants';

export class BooleanControl extends Component {
  constructor(props) {
    super(props);
    const errors = this._getErrors(props.value) || [];
    const hasErrors = this._isCreateByAddMore() ? this._hasErrors(errors) : false;
    this.state = { hasErrors };
    this.changeValue = this.changeValue.bind(this);
  }

  componentDidMount() {
    const { value, validateForm } = this.props;
    if (this.state.hasErrors || value !== undefined || validateForm) {
      this.props.onChange({ value, errors: this._getErrors(value) });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.value !== nextProps.value ||
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
      this.props.onChange({ value: this.props.value, errors });
      return;
    }

    const isValueChanged = prevProps.value !== this.props.value;
    if (this.props.validate !== prevProps.validate || isValueChanged) {
      const errors = this._getErrors(this.props.value);
      const hasErrors = this._hasErrors(errors);
      if (this.state.hasErrors !== hasErrors) {
        this.setState({ hasErrors });
      }
    }
    if (isValueChanged && !this._userInitiated) {
      this.props.onChange({ value: this.props.value, errors: this._getErrors(this.props.value) });
    }
    this._userInitiated = false;
  }

  changeValue(option) {
    const value = this.props.value === option.value ? undefined : option.value;
    const errors = this._getErrors(value);
    this.setState({ hasErrors: this._hasErrors(errors) });
    this._userInitiated = true;
    this.props.onChange({ value, errors });
  }

  _getOptionsRepresentation() {
    return this.props.options.map((option) => ({
      name: this.props.intl.formatMessage({
        id: option.translationKey || 'defaultId',
        defaultMessage: option.name,
      }),
      value: option.value,
    }));
  }

  _hasErrors(errors) {
    return !isEmpty(errors.filter(e => e.type !== constants.errorTypes.warning));
  }

  _getErrors(value) {
    return Validator.getErrors({ validations: this.props.validations, value });
  }

  _isCreateByAddMore() {
    return !!this.props.formFieldPath && this.props.formFieldPath.split('-')[1] !== '0';
  }

  render() {
    const { enabled, conceptUuid } = this.props;
    const options = this._getOptionsRepresentation();
    return (
      <div
        id={conceptUuid}
        className={this.state.hasErrors ? 'form-builder-error' : ''}
        style={{ display: 'inline-flex', flexWrap: 'wrap', gap: spacing03 }}
      >
        {options.map((option) => (
          <SelectableTag
            key={String(option.value)}
            size="lg"
            text={option.name}
            selected={this.props.value === option.value}
            disabled={!enabled}
            onChange={() => this.changeValue(option)}
          />
        ))}
      </div>
    );
  }
}

BooleanControl.propTypes = {
  conceptUuid: PropTypes.string,
  enabled: PropTypes.bool,
  formFieldPath: PropTypes.string,
  hidden: PropTypes.bool,
  intl: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  validate: PropTypes.bool.isRequired,
  validateForm: PropTypes.bool.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.any,
};

BooleanControl.defaultProps = {
  enabled: true,
};

export const BooleanControlWithIntl = injectIntl(BooleanControl, { forwardRef: true });
