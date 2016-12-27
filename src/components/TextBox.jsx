import React, { PropTypes } from 'react';
import ComponentStore from 'src/helpers/componentStore';
import classNames from 'classnames';
import { BahmniInputComponent } from './BahmniInputComponent.jsx';

export class TextBox extends BahmniInputComponent {

  handleChange(e) {
    console.log("Modified!!!");
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
  onChange: PropTypes.func.isRequired,
  validate: PropTypes.bool.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.string,
};

ComponentStore.registerComponent('text', TextBox);
