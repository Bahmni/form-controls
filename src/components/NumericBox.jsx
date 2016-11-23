import React, { Component, PropTypes } from 'react';
import 'src/helpers/componentStore';
import { Validator } from 'src/helpers/Validator';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';

export class NumericBox extends Component {
  constructor(props) {
    super(props);
    this.state = { hasErrors: false };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.validate) {
      const errors = this._getErrors(nextProps.value);
      this.setState({ hasErrors: this._hasErrors(errors) });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.value !== nextProps.value ||
      this.state.hasErrors !== nextState.hasErrors) {
      return true;
    }
    return false;
  }


  handleChange(e) {
    const value = e.target.value;
    const errors = this._getErrors(value);
    this.setState({ hasErrors: this._hasErrors(errors) });
    this.props.onChange(value, errors);
  }

  _hasErrors(errors) {
    return !isEmpty(errors);
  }

  _getErrors(value) {
    const validations = this.defaultValidations.concat(this.props.validations);
    const controlDetails = { validations, value, params: this.props };
    return Validator.getErrors(controlDetails);
  }

  render() {
    return (
      <input
        className={classNames({ 'form-builder-error': this.state.hasErrors })}
        defaultValue={ this.props.value }
        onChange={(e) => this.handleChange(e)}
        type="number"
      />
    );
  }
}

NumericBox.propTypes = {
  maxNormal: PropTypes.string,
  minNormal: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  validate: PropTypes.bool.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.string,
};

window.componentStore.registerComponent('numeric', NumericBox);
