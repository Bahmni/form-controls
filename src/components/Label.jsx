/* eslint-disable react/prefer-stateless-function */
/* Needs this to attach refs as they cannot be attached to stateless functions. */

import React, { Component, PropTypes } from 'react';
import ComponentStore from 'src/helpers/componentStore';
import classNames from 'classnames';


export class Label extends Component {
  render() {
    const disableClass = this.props.enabled ? '' : 'disabled-label';
    const hiddenClass = this.props.hidden ? 'hidden': '';
    return (<label
      className={`${hiddenClass}${disableClass}`}
    >
      {this.props.metadata.value}
    </label>);
  }
}

Label.propTypes = {
  enabled: PropTypes.bool,
  hidden: PropTypes.bool,
  metadata: PropTypes.shape({
    type: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }),
};

Label.defaultProps = {
  hidden: false,
  enabled: true,
};

ComponentStore.registerComponent('label', Label);
/* eslint-enable react/prefer-stateless-function */
