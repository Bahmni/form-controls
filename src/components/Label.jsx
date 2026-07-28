/* eslint-disable react/prefer-stateless-function */
/* Needs this to attach refs as they cannot be attached to stateless functions. */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentStore from 'src/helpers/componentStore';
import { IntlShape } from 'react-intl';
import { validateHyperlink } from 'src/helpers/hyperlinkValidator';
import { Util } from 'src/helpers/Util';
export class Label extends Component {

  _getUnits(units) {
    return units ? ` ${units}` : '';
  }

  _getText() {
    const { intl, metadata: { value, units, translationKey } } = this.props;
    return intl.formatMessage({
      defaultMessage: value,
      id: translationKey || 'defaultId',
    }) + this._getUnits(units);
  }

  _getHyperlinkResult() {
    const { metadata: { properties }, allowedDomains } = this.props;
    const rawUrl = ((properties && properties.hyperlinkUrl) || '').trim();
    if (!rawUrl) {
      return null;
    }
    return validateHyperlink(rawUrl, Array.isArray(allowedDomains) ? allowedDomains : []);
  }

  render() {
    const { enabled, patientUuid, showValidationErrors } = this.props;
    const disableClass = enabled ? '' : 'disabled-label';
    const text = this._getText();
    const result = this._getHyperlinkResult();
    if (!result) {
      return (
        <label className={`${disableClass}`} htmlFor={this.props.metadata.uuid}>
          {text}
        </label>
      );
    }
    if (!result.valid) {
      if (showValidationErrors) {
        return (
          <label className={`${disableClass}`} htmlFor={this.props.metadata.uuid}>
            <span className="hyperlink-error">{result.error}</span>
          </label>
        );
      }
      return (
        <label className={`${disableClass}`} htmlFor={this.props.metadata.uuid}>
          {text}
        </label>
      );
    }
    const resolvedUrl = result.type === 'internal'
      ? Util.resolveUrlTokens(result.sanitizedUrl, { patientUuid: patientUuid || '' })
      : result.sanitizedUrl;
    const linkProps = result.type === 'external'
      ? { referrerPolicy: 'no-referrer', rel: 'noopener noreferrer', target: '_blank' }
      : { rel: 'noopener', target: '_blank' };
    return (
      <label className={`${disableClass}`} htmlFor={this.props.metadata.uuid}>
        <a data-bahmni-hyperlink="true" href={resolvedUrl} {...linkProps}>{text}</a>
      </label>
    );
  }
}

Label.propTypes = {
  allowedDomains: PropTypes.arrayOf(PropTypes.string),
  enabled: PropTypes.bool,
  hidden: PropTypes.bool,
  intl: IntlShape,
  metadata: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    units: PropTypes.string,
    value: PropTypes.string.isRequired,
    translationKey: PropTypes.string,
    properties: PropTypes.shape({
      hyperlinkUrl: PropTypes.string,
    }),
  }),
  patientUuid: PropTypes.string,
  showValidationErrors: PropTypes.bool,
};

Label.defaultProps = {
  allowedDomains: [],
  hidden: false,
  enabled: true,
  showValidationErrors: false,
};

ComponentStore.registerComponent('label', Label);
/* eslint-enable react/prefer-stateless-function */
