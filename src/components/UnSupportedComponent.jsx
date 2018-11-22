import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ComponentStore from 'src/helpers/componentStore';

export class UnSupportedComponent extends PureComponent {
  render() {
    return <label>{this.props.message}</label>;
  }
}

UnSupportedComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

ComponentStore.registerComponent('unsupported', UnSupportedComponent);
