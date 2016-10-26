import React, { Component, PropTypes } from 'react';
import 'src/helpers/componentStore';
import map from 'lodash/map';
import classNames from 'classnames';

export class Button extends Component {
  constructor(props) {
    super(props);
    this.state = { value: props.value };
    this.changeValue = this.changeValue.bind(this);
  }

  getValue() {
    return this.state.value;
  }

  changeValue(valueSelected) {
    const value = this.state.value === valueSelected ? undefined : valueSelected;
    this.setState({ value });
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
      classNames('form-control-buttons', { 'form-builder-error': this.props.hasErrors });
    return <div className={className}>{this.displayButtons()}</div>;
  }
}

Button.propTypes = {
  hasErrors: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  value: PropTypes.any,
};

window.componentStore.registerComponent('button', Button);
