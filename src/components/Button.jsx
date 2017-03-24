import React, { Component, PropTypes } from 'react';
import ComponentStore from 'src/helpers/componentStore';
import map from 'lodash/map';
import classNames from 'classnames';
import { Validator } from 'src/helpers/Validator';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import clone from 'lodash/clone';
import find from 'lodash/find';
import filter from 'lodash/filter';

export class Button extends Component {
  constructor(props) {
    super(props);
    this.state = { hasErrors: false };
    this.completedFunc = this.completedFunc.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.validate || !isEqual(this.props.value, nextProps.value)) {
      const errors = this._getErrors(nextProps.value);
      this.setState({ hasErrors: this._hasErrors(errors) });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!isEqual(this.props.value, nextProps.value) ||
      this.state.hasErrors !== nextState.hasErrors) {
      return true;
    }
    return false;
  }

  componentDidUpdate() {
    const errors = this._getErrors(this.props.value);
    if (this._hasErrors(errors)) {
      this.props.onValueChange(this.props.value, errors);
    }
  }

  completedFunc() {
    if (this.props.onEventTrigger && this.props.events) {
      this.props.onEventTrigger('onClick', this.props.events);
    }
  }

  changeValue(valueSelected) {
    const value = this._getValue(valueSelected);
    const errors = this._getErrors(value);
    this.setState({ hasErrors: this._hasErrors(errors) });
    this.props.onValueChange(value, errors, this.completedFunc);
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

  displayButtons() {
    return map(this.props.options, (option, index) =>
      <button
        disabled={!this.props.enabled}
        className={classNames('fl', { active: this._isActive(option) })}
        key={index}
        onClick={() => this.changeValue(option)}
      >
        <i className="fa fa-ok"></i>{option[this.props.nameKey]}
      </button>
    );
  }

  render() {
    const className =
      classNames('form-control-buttons', { 'form-builder-error': this.state.hasErrors });
    return <div className={className}>{this.displayButtons()}</div>;
  }


}

Button.propTypes = {
  enabled: PropTypes.bool,
  events: PropTypes.object,
  multiSelect: PropTypes.bool,
  nameKey: PropTypes.string,
  onEventTrigger: PropTypes.func,
  onValueChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  validate: PropTypes.bool.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.any,
  valueKey: PropTypes.string,
};

Button.defaultProps = {
  valueKey: 'value',
  nameKey: 'name',
};

ComponentStore.registerComponent('button', Button);
