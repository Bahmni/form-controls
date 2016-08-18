import React, { Component, PropTypes } from 'react';

export class TextBox extends Component {

  constructor(props) {
    super(props);
    this.value = props.value;
    this.getValue = this.getValue.bind(this);
  }

  getTextBoxType(type) {
    switch (type) {
      case 'numeric':
        return 'number';
      default:
        return 'text';
    }
  }

  getValue() {
    return {
      id: this.props.id,
      value: this.value,
    };
  }

  handleChange(e) {
    this.value = e.target.value;
  }

  render() {
    const textBoxType = this.getTextBoxType(this.props.type);
    return (
      <input
        defaultValue={this.props.value}
        onChange={(e) => this.handleChange(e)}
        type={textBoxType}
      />
    );
  }
}

TextBox.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string,
};
