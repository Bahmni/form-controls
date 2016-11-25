import React, { Component, PropTypes } from 'react';
import 'src/helpers/componentStore';
import map from 'lodash/map';
import classNames from 'classnames';
import { Validator } from 'src/helpers/Validator';
import isEmpty from 'lodash/isEmpty';

export class Button extends Component {
  constructor(props) {
    super(props);
    this.state = { value: props.value, hasErrors: false };
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.validate) {
      const errors = this._getErrors(nextProps.value);
      this.setState({ hasErrors: this._hasErrors(errors) });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.value !== nextProps.value ||
        this.state.value !== nextState.value ||
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
    const value = this.state.value === valueSelected ? undefined : valueSelected;
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
        onClick={() => this.changeValue(option.value)}
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
