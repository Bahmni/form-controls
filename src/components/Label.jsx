/* eslint-disable react/prefer-stateless-function */
/* Needs this to attach refs as they cannot be attached to stateless functions. */

import React, { Component, PropTypes } from 'react';
import ComponentStore from 'src/helpers/componentStore';
import classNames from 'classnames';


export class Label extends Component {
    constructor(props) {
      super(props);
    }
    render() {
      return <label className={classNames({ 'disable': !this.props.enabled })}>{this.props.metadata.value}</label>;
  }
}

Label.propTypes = {
  enabled: PropTypes.bool,
  metadata: PropTypes.shape({
    type: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }),
};

Label.defaultProps = {
    enabled: true,
};

ComponentStore.registerComponent('label', Label);
/* eslint-enable react/prefer-stateless-function */
