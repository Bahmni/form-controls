import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ComponentStore from 'src/helpers/componentStore';
import map from 'lodash/map';
import classNames from 'classnames';
import { Validator } from 'src/helpers/Validator';
import isEmpty from 'lodash/isEmpty';

export class RadioButton extends Component {
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
  onValueChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  validate: PropTypes.bool.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.any,
};

ComponentStore.registerComponent('radio', RadioButton);
