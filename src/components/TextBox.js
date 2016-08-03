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
    const textBoxType = this.getTextBoxType(this.props.obs.type);
    return (<input defaultValue={this.props.obs.value} type={textBoxType} />);
  }
}

TextBox.propTypes = {
  obs: PropTypes.object.isRequired,
};
