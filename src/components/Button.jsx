import React, { PropTypes } from 'react';
import ComponentStore from 'src/helpers/componentStore';
import map from 'lodash/map';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import clone from 'lodash/clone';
import find from 'lodash/find';
import filter from 'lodash/filter';
import { BahmniInputComponent } from './BahmniInputComponent.jsx';

export class Button extends BahmniInputComponent {

  changeValue(valueSelected) {
    const value = this._getValue(valueSelected);
    const errors = this._getErrors(value);
    this.setState({ hasErrors: this._hasErrors(errors) });
    this.props.onChange(value, errors);
  }

  _getValue(valueSelected) {
    const { multiSelect } = this.props;
    let value = this._getValueFromProps() || [];
    if (this._isActive(valueSelected)) {
      if (multiSelect) {
        value = filter(value, (val) => val.value !== valueSelected.value);
      } else {
        value = [];
      }
    } else {
      value = multiSelect ? clone(value) : [];
      value.push(valueSelected);
    }
    return multiSelect ? value : value[0];
  }

  _isActive(option) {
    return find(this._getValueFromProps(), (value) => option.value === value.value);
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
        className={classNames('fl', { active: this._isActive(option) })}
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
  multiSelect: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  validate: PropTypes.bool.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.any,
};

ComponentStore.registerComponent('button', Button);
