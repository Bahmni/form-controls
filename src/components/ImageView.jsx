/* eslint-disable react/prefer-stateless-function */
/* Needs this to attach refs as they cannot be attached to stateless functions. */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentStore from 'src/helpers/componentStore';
import { IntlShape } from 'react-intl';

export class ImageView extends Component {

  _computeImageViewContainerStyle(position) {

    let textAlignPosition;

    switch(position) {
      case "center":
        textAlignPosition = "center";
        break;
      case "right":
        textAlignPosition = "right";
        break;
      case "left":
      default: 
        textAlignPosition = "left";
        break;
    }

    return {
      textAlign: textAlignPosition,
      padding: '15px',
    };
  }

  _computeImageViewStyle(maxHeight, maxWidth) {

    const maxHeightPercentage = isNaN(maxHeight) ? 100 : maxHeight;
    const maxWidthPercentage = isNaN(maxWidth) ? 100 : maxWidth;

    return {
      maxHeight: maxHeightPercentage + 'vh',
      maxWidth: maxWidthPercentage + '%'
    };
  }

  render() {
    const { intl, enabled, metadata: { label: { value }, properties: { maxHeight, maxWidth, position } } } = this.props;

    const imageUrl = `/bahmni/images/clinical_forms/${value}`;

    const disableClass = enabled ? '' : 'disabled-label';
    return (<div
      className={`image-view-container ${disableClass}`} style={this._computeImageViewContainerStyle(position)}
    >
      <img className="image-view" src={imageUrl} style={this._computeImageViewStyle(maxHeight, maxWidth)} />
    </div>
    );
  }
}

ImageView.propTypes = {
  intl: IntlShape,
  metadata: PropTypes.shape({
    type: PropTypes.string.isRequired,
    label: PropTypes.object,
    translationKey: PropTypes.string,
    properties: PropTypes.object,
  }),
};

ImageView.defaultProps = {
};

ComponentStore.registerComponent('imageView', ImageView);
/* eslint-enable react/prefer-stateless-function */
