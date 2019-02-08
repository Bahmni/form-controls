import React from 'react';
import PropTypes from 'prop-types';
import ComponentStore from 'src/helpers/componentStore';

export const UnSupportedComponent = (props) => <label>{props.message}</label>;

UnSupportedComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

ComponentStore.registerComponent('unsupported', UnSupportedComponent);
