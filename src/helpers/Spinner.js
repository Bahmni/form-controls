import PropTypes from 'prop-types';
import React from 'react';

const Spinner = (props) => {
  if (props.show) {
    return (<div className="overlay"></div>);
  }
  return null;
};

Spinner.propTypes = {
  show: PropTypes.bool.isRequired,
};

export default Spinner;
