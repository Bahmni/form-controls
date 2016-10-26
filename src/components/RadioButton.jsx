import React, { Component, PropTypes } from 'react';
import 'src/helpers/componentStore';
import map from 'lodash/map';
import classNames from 'classnames';

export class RadioButton extends Component {
  constructor(props) {
    super(props);
    this.state = { value: props.value };
    this.changeValue = this.changeValue.bind(this);
  }

  getValue() {
    return this.state.value;
  }

  changeValue(value) {
    this.setState({ value });
  }

  displayRadioButtons() {
    return map(this.props.options, (option, index) =>
      <div className="options-list" key={index} onClick={() => this.changeValue(option.value)}>
        <input
          checked={this.state.value === option.value}
          key={index}
          name={this.props.id}
          type="radio"
          value={option.value}
        />
        {option.name}
      </div>
    );
  }

  render() {
    const className = classNames({ 'form-builder-error': this.props.hasErrors });
    return <div className={className}>{this.displayRadioButtons()}</div>;
  }
}

RadioButton.propTypes = {
  hasErrors: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  value: PropTypes.any,
};

window.componentStore.registerComponent('radio', RadioButton);
