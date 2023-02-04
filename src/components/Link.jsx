/* eslint-disable react/prefer-stateless-function */
/* Needs this to attach refs as they cannot be attached to stateless functions. */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentStore from 'src/helpers/componentStore';
import { IntlShape } from 'react-intl';

export class Link extends Component {

  render() {
    const { intl, enabled, metadata: { label: { value: displayName}, link: { value: url } } } = this.props;
    
    return (
      <div class="link-container">
        <a class="fa link" href={url} target="_blank">
          {displayName}
          <i class="fa fa-external-link"></i>
        </a>
      </div>
    );

  }
}

Link.propTypes = {
  intl: IntlShape,
  metadata: PropTypes.shape({
    type: PropTypes.string.isRequired,
    label: PropTypes.object,
    link: PropTypes.object,
    translationKey: PropTypes.string,
    properties: PropTypes.object,
  }),
};

Link.defaultProps = {
};

ComponentStore.registerComponent('link', Link);
/* eslint-enable react/prefer-stateless-function */
