/* eslint-disable react/prefer-stateless-function */
/* Needs this to attach refs as they cannot be attached to stateless functions. */

import React, { Component, PropTypes } from 'react';
import 'src/helpers/componentStore';

export class Label extends Component {
  render() {
    return <label>{this.props.metadata.value}</label>;
  }
}

Label.propTypes = {
  metadata: PropTypes.shape({
    type: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }),
};

window.componentStore.registerComponent('label', Label);
/* eslint-enable react/prefer-stateless-function */
