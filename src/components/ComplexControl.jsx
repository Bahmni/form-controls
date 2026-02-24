/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ComponentStore from 'src/helpers/componentStore';

export class ComplexControl extends PureComponent {
  render() {
    const { conceptHandler } = this.props;
    const registeredComplexControl = ComponentStore.getRegisteredComponent(conceptHandler);

    if (registeredComplexControl) {
      return React.createElement(registeredComplexControl, {
        ...this.props,
      });
    }
    return null;
  }
}


ComplexControl.propTypes = {
  addMore: PropTypes.bool,
  conceptHandler: PropTypes.string.isRequired,
  enabled: PropTypes.bool,
  formFieldPath: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onControlAdd: PropTypes.func.isRequired,
  patientUuid: PropTypes.string,
  properties: PropTypes.object.isRequired,
  showNotification: PropTypes.func.isRequired,
  validate: PropTypes.bool.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.string,
};

ComplexControl.defaultProps = {
  enabled: true,
  addMore: false,
};

ComponentStore.registerComponent('complex', ComplexControl);
