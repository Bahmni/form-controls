/* eslint-disable react/prefer-stateless-function */
/* Needs this to attach refs as they cannot be attached to stateless functions. */

import React, { Component, PropTypes } from 'react';
import ComponentStore from 'src/helpers/componentStore';
import { FormattedMessage } from 'react-intl';


export class Label extends Component {
  render() {
    const disableClass = this.props.enabled ? '' : 'disabled-label';
    return (<label
      className={`${disableClass}`}
    >
      <FormattedMessage
        defaultMessage={this.props.metadata.value}
        id={this.props.metadata.translation_key || 'defaultId'}
      />
    </label>);
  }
}

Label.propTypes = {
  enabled: PropTypes.bool,
  hidden: PropTypes.bool,
  metadata: PropTypes.shape({
    type: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    translation_key: PropTypes.string,
  }),
};

Label.defaultProps = {
  hidden: false,
  enabled: true,
};

ComponentStore.registerComponent('label', Label);
/* eslint-enable react/prefer-stateless-function */
