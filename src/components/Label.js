import React, { PropTypes } from 'react';

export const Label = ({ value }) => <span>{value}</span>;

Label.propTypes = {
  value: PropTypes.string.isRequired,
};
