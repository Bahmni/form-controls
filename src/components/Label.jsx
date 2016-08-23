import React, { PropTypes } from 'react';
import 'src/helpers/componentStore';

export const Label = ({ metadata }) => <span>{metadata.value}</span>;

Label.propTypes = {
  metadata: PropTypes.shape({
    value: PropTypes.string.isRequired,
  }),
};

window.componentStore.registerComponent('label', Label);
