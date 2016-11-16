import React, { Component, PropTypes } from 'react';
import 'src/helpers/componentStore';
import { Validator } from 'src/helpers/Validator';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';

export class TextBox extends Component {
  constructor(props) {
    super(props);
    this.state = { hasErrors: this._hasErrors(this.props.errors) };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.value !== nextProps.value ||
      this.props.errors !== nextProps.errors ||
      this.state.hasErrors !== nextState.hasErrors) {
      return true;
    }
    return false;
  }

  _hasErrors(errors) {
    return !isEmpty(errors);
  }

  _getErrors(value) {
    const validations = this.props.validations;
    const controlDetails = { validations, value };
    return Validator.getErrors(controlDetails);
  }

  handleChange(e) {
    let value = e.target.value;
    value = value && value.trim() !== '' ? value.trim() : undefined;
    const errors = this._getErrors(value);
    this.setState({ hasErrors: this._hasErrors(errors) });
    this.props.onChange(value, errors);
  }

  render() {
    return (
      <textarea
        className={classNames({ 'form-builder-error': this.state.hasErrors })}
        defaultValue={this.props.value}
        onChange={(e) => this.handleChange(e)}
      />
    );
  }
}

TextBox.propTypes = {
  errors: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.string,
};

window.componentStore.registerComponent('text', TextBox);
