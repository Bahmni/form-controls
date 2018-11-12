/* eslint-disable react/prefer-stateless-function */
/* Needs this to attach refs as they cannot be attached to stateless functions. */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentStore from 'src/helpers/componentStore';
import { FormattedMessage } from 'react-intl';


export class Label extends Component {

  _getUnits(units) {
    return units ? ` ${units}` : '';
  }

  render() {
    const { enabled, metadata: { value, units } } = this.props;
    const disableClass = enabled ? '' : 'disabled-label';
    return (<label
      className={`${disableClass}`}
    >
      <FormattedMessage
        defaultMessage={value}
        id={this.props.metadata.translationKey || 'defaultId'}
      />
     {this._getUnits(units)}
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
    translationKey: PropTypes.string,
  }),
};

Label.defaultProps = {
  hidden: false,
  enabled: true,
};

ComponentStore.registerComponent('label', Label);
/* eslint-enable react/prefer-stateless-function */
