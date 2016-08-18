import React, { PropTypes } from 'react';
import 'src/helpers/componentStore';

export const Label = ({ value }) => <span>{value}</span>;

Label.propTypes = {
  value: PropTypes.string.isRequired,
};

window.componentStore.registerComponent('label', Label);
