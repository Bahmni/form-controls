import React, { PureComponent, PropTypes } from 'react';
import 'src/helpers/componentStore';

export class UnSupportedComponent extends PureComponent {
  render() {
    return <label>{this.props.message}</label>;
  }
}

UnSupportedComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

window.componentStore.registerComponent('unsupported', UnSupportedComponent);
