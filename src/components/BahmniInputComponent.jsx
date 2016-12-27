import React, { Component, PropTypes } from 'react';
import { Validator } from 'src/helpers/Validator';
import isEmpty from 'lodash/isEmpty';

export class BahmniInputComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { hasErrors: false };
  }

  componentWillReceiveProps(nextProps) {
    console.log("componentWillReceiveProps");
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

  componentDidUpdate() {
    const errors = this._getErrors(this.props.value);
    if (this._hasErrors(errors)) {
      this.props.onChange(this.props.value, errors);
    }
  }

  _hasErrors(errors) {
    return !isEmpty(errors);
  }

  _hasErrors(errors, errorType) {
    return !isEmpty(errors.filter((error) => error.type === errorType));
  }

  _getErrors(value) {
    const validations = this.props.validations;
    const controlDetails = { validations, value };
    return Validator.getErrors(controlDetails);
  }
}

BahmniInputComponent.propTypes = {
  onChange: PropTypes.func.isRequired,
  validate: PropTypes.bool.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.string,
};
