import React, { PropTypes } from 'react';
import 'src/helpers/componentStore';

export const Label = ({ metadata }) => <label>{metadata.value}</label>;

Label.propTypes = {
  metadata: PropTypes.shape({
    type: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }),
};

window.componentStore.registerComponent('label', Label);
