import React, { PropTypes } from 'react';

export const Label = ({ obs }) => <span>{obs.value}</span>;

Label.propTypes = {
  obs: PropTypes.object.isRequired,
};
