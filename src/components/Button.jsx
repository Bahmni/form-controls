import React, { Component, PropTypes } from 'react';
import 'src/helpers/componentStore';
import map from 'lodash/map';
import classNames from 'classnames';
import { Validator } from 'src/helpers/Validator';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';

export class Button extends Component {
  constructor(props) {
    super(props);
    const value = props.value ? props.value.value : undefined;
    this.state = { value, hasErrors: false };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.validate || !isEqual(this.props.value, nextProps.value)) {
      const errors = this._getErrors(nextProps.value);
      const value = nextProps.value ? nextProps.value.value : undefined;
      this.setState({ value, hasErrors: this._hasErrors(errors) });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!isEqual(this.props.value, nextProps.value) ||
      !isEqual(this.state.value, nextState.value) ||
      this.state.hasErrors !== nextState.hasErrors) {
      return true;
    }
    return false;
  }

  componentDidUpdate() {
    const errors = this._getErrors(this.state.value);
    if (this._hasErrors(errors)) {
      this.props.onValueChange(this.state.value, errors);
    }
  }

  changeValue(valueSelected) {
    const value = this.state.value === valueSelected.value ? undefined : valueSelected.value;
    const errors = this._getErrors(value);
    this.setState({ value, hasErrors: this._hasErrors(errors) });
    this.props.onValueChange(value, errors);
  }

  _hasErrors(errors) {
    return !isEmpty(errors);
  }

  _getErrors(value) {
    const validations = this.props.validations;
    const controlDetails = { validations, value };
    return Validator.getErrors(controlDetails);
  }

  displayButtons() {
    return map(this.props.options, (option, index) =>
      <button
        className={classNames('fl', { active: this.state.value === option.value })}
        key={index}
        onClick={() => this.changeValue(option)}
      >
        <i className="fa fa-ok"></i>{option.name}
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
  onValueChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  validate: PropTypes.bool.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.any,
};

window.componentStore.registerComponent('button', Button);
