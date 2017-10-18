/* eslint-disable react/prefer-stateless-function */
/* Needs this to attach refs as they cannot be attached to stateless functions. */

import React, { Component, PropTypes } from 'react';
import ComponentStore from 'src/helpers/componentStore';


export class Label extends Component {
  render() {
    const { enabled, metadata: { value, units } } = this.props;
    const disableClass = enabled ? '' : 'disabled-label';
    const labelValue = units ? `${value} ${units}` : value;
    return (<label
      className={`${disableClass}`}
    >
      {labelValue}
    </label>);
  }
}

Label.propTypes = {
  enabled: PropTypes.bool,
  hidden: PropTypes.bool,
  metadata: PropTypes.shape({
    type: PropTypes.string.isRequired,
    units: PropTypes.string,
    value: PropTypes.string.isRequired,
  }),
};

Label.defaultProps = {
  hidden: false,
  enabled: true,
};

ComponentStore.registerComponent('label', Label);
/* eslint-enable react/prefer-stateless-function */
