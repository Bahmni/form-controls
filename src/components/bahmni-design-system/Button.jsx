import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SelectableTag } from '@bahmni/design-system';
import { spacing03 } from '@carbon/layout';
import { Validator } from 'src/helpers/Validator';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import find from 'lodash/find';
import filter from 'lodash/filter';
import clone from 'lodash/clone';
import constants from 'src/constants';

export class Button extends Component {
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
      this.props.onValueChange(value, this._getErrors(value), true);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    this.isValueChanged = !isEqual(this.props.value, nextProps.value);
    return (
      this.isValueChanged ||
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
      this.props.onValueChange(this.props.value, errors);
    }
  }

  changeValue(valueSelected) {
    const value = this._getValue(valueSelected);
    const errors = this._getErrors(value);
    this.setState({ hasErrors: this._hasErrors(errors) });
    this.props.onValueChange(value, errors);
  }

  _getValue(valueSelected) {
    const { multiSelect, valueKey } = this.props;
    let value = this._getValueFromProps() || [];
    if (this._isActive(valueSelected)) {
      if (multiSelect) {
        value = filter(value, (val) => val[valueKey] !== valueSelected[valueKey]);
      } else {
        value = [];
      }
    } else {
      value = multiSelect ? clone(value) : [];
      value.push(valueSelected);
    }
    return multiSelect ? value : value[0];
  }

  _isActive(option) {
    const { valueKey } = this.props;
    return find(this._getValueFromProps(), (val) => option[valueKey] === val[valueKey]);
  }

  _getValueFromProps() {
    const { multiSelect, value } = this.props;
    if (value) {
      return multiSelect ? value : [value];
    }
    return undefined;
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
    const { options, enabled, conceptUuid } = this.props;
    return (
      <div
        id={conceptUuid}
        className={`form-builder-selectable-tag-group${this.state.hasErrors ? ' form-builder-error' : ''}`}
        style={{ display: 'inline-flex', flexWrap: 'wrap', gap: spacing03 }}
      >
        {options.map((option) => (
          <SelectableTag
            key={option[this.props.valueKey]}
            size="lg"
            text={option[this.props.nameKey]}
            selected={!!this._isActive(option)}
            disabled={!enabled}
            onChange={() => this.changeValue(option)}
          />
        ))}
      </div>
    );
  }
}

Button.propTypes = {
  conceptUuid: PropTypes.string,
  enabled: PropTypes.bool,
  formFieldPath: PropTypes.string,
  hidden: PropTypes.bool,
  multiSelect: PropTypes.bool,
  nameKey: PropTypes.string,
  onValueChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  validate: PropTypes.bool.isRequired,
  validateForm: PropTypes.bool.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.any,
  valueKey: PropTypes.string,
};

Button.defaultProps = {
  enabled: true,
  nameKey: 'name',
  valueKey: 'value',
  validate: false,
  validateForm: false,
  validations: [],
};
