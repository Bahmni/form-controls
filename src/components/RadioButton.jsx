import React, { Component, PropTypes } from 'react';
import 'src/helpers/componentStore';
import map from 'lodash/map';
import classNames from 'classnames';
import { Validator } from 'src/helpers/Validator';
import isEmpty from 'lodash/isEmpty';

export class RadioButton extends Component {
  constructor(props) {
    super(props);
    this.state = { value: props.value, hasErrors: this._hasErrors(this.props.errors) };
  }

  componentWillReceiveProps(nextProps) {
    const { errors } = nextProps;
    this.setState({ hasErrors: this._hasErrors(errors) });
  }

  changeValue(value) {
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

  displayRadioButtons() {
    const name = (Math.random() * 1e32).toString(36);
    return map(this.props.options, (option, index) =>
      <div className="options-list" key={index} onClick={() => this.changeValue(option.value)}>
        <input
          checked={this.state.value === option.value}
          key={index}
          name={name}
          type="radio"
          value={option.value}
        />
        {option.name}
      </div>
    );
  }

  render() {
    const className =
      classNames('form-builder-radio', { 'form-builder-error': this.state.hasErrors });
    return <div className={className}>{this.displayRadioButtons()}</div>;
  }
}

RadioButton.propTypes = {
  errors: PropTypes.array.isRequired,
  onValueChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.any,
};

window.componentStore.registerComponent('radio', RadioButton);
