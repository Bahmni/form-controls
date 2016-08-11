import React, { Component, PropTypes } from 'react';

export class TextBox extends Component {

  getTextBoxType(type) {
    switch (type) {
      case 'numeric':
        return 'number';
      default:
        return 'text';
    }
  }

  render() {
    const textBoxType = this.getTextBoxType(this.props.type);
    return (<input defaultValue={this.props.value} type={textBoxType} />);
  }
}

TextBox.propTypes = {
  type: PropTypes.string.isRequired,
  value: PropTypes.string,
};
