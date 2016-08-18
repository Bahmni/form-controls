import React, { PropTypes } from 'react';

export const FormControlsContainer = ({ controls }) => <div>{controls}</div>;

FormControlsContainer.propTypes = {
  controls: PropTypes.array.isRequired,
};
