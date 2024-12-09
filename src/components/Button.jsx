import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentStore from 'src/helpers/componentStore';
import map from 'lodash/map';
import classNames from 'classnames';
import { Validator } from 'src/helpers/Validator';
import isEmpty from 'lodash/isEmpty';
import clone from 'lodash/clone';
import find from 'lodash/find';
import filter from 'lodash/filter';
import isEqual from 'lodash/isEqual';

export class Button extends Component {
  constructor(props) {
    super(props);
    const errors = this._getErrors(props.value) || [];
    const hasErrors = this._isCreateByAddMore() ? this._hasErrors(errors) : false;
    this.state = { hasErrors };
  }

  componentDidMount() {
    const { value, validateForm } = this.props;
    if (this.state.hasErrors || value !== undefined || validateForm) {
      this.props.onValueChange(value, this._getErrors(value), true);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.validate || !isEqual(this.props.value, nextProps.value)) {
      const errors = this._getErrors(nextProps.value);
      this.setState({ hasErrors: this._hasErrors(errors) });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    this.isValueChanged = !isEqual(this.props.value, nextProps.value);
    if (this.isValueChanged ||
      this.state.hasErrors !== nextState.hasErrors ||
      this.props.enabled !== nextProps.enabled) {
      return true;
    }
    return false;
  }

  componentDidUpdate() {
    const errors = this._getErrors(this.props.value);
    if (this._hasErrors(errors)) {
      this.props.onValueChange(this.props.value, errors);
    }
    if (this.isValueChanged) {
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
    const { multiSelect } = this.props;
    let value = this._getValueFromProps() || [];
    if (this._isActive(valueSelected)) {
      if (multiSelect) {
        const valueKey = this.props.valueKey;
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

  _hasErrors(errors) {
    return !isEmpty(errors);
  }

  _getErrors(value) {
    const validations = this.props.validations;
    const controlDetails = { validations, value };
    return Validator.getErrors(controlDetails);
  }

  _isActive(option) {
    const valueKey = this.props.valueKey;
    return find(this._getValueFromProps(), (value) => option[valueKey] === value[valueKey]);
  }

  _getValueFromProps() {
    const { multiSelect, value } = this.props;
    if (value) {
      return multiSelect ? value : [value];
    }
    return undefined;
  }

  _isCreateByAddMore() {
    return (this.props.formFieldPath.split('-')[1] !== '0');
  }

  displayButtons() {
    return map(this.props.options, (option, index) =>
      <button
        className={classNames('fl', { active: this._isActive(option) })}
        disabled={!this.props.enabled}
        id={option[this.props.nameKey]}
        key={index}
        name={this.props.conceptUuid}
        onClick={() => this.changeValue(option)}
        title={option[this.props.nameKey]}
      >
        <i className="fa fa-ok"></i>{option[this.props.nameKey]}
      </button>
    );
  }

  render() {
    const className =
      classNames('form-control-buttons', { 'form-builder-error': this.state.hasErrors });
    return <div className={className} id={this.props.conceptUuid}>{this.displayButtons()}</div>;
  }


}

Button.propTypes = {
  conceptUuid: PropTypes.string,
  enabled: PropTypes.bool,
  formFieldPath: PropTypes.string,
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
};

ComponentStore.registerComponent('button', Button);
