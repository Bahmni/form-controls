import React, { PropTypes } from 'react';
import ComponentStore from 'src/helpers/componentStore';
import map from 'lodash/map';
import classNames from 'classnames';
import { BahmniInputComponent } from './BahmniInputComponent.jsx';

export class RadioButton extends BahmniInputComponent {

  changeValue(value) {
    const errors = this._getErrors(value);
    this.setState({ value, hasErrors: this._hasErrors(errors) });
    this.props.onChange(value, errors);
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
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  validate: PropTypes.bool.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.any,
};

ComponentStore.registerComponent('radio', RadioButton);
