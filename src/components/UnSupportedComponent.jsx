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

export class UnSupportedComponent extends PureComponent {
  render() {
    return <label>{this.props.message}</label>;
  }
}

UnSupportedComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

ComponentStore.registerComponent('unsupported', UnSupportedComponent);
