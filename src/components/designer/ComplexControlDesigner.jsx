/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentStore from 'src/helpers/componentStore';

export class ComplexControlDesigner extends Component {
  getJsonDefinition() {
    return this.props.metadata;
  }

  render() {
    const { metadata: { concept: { conceptHandler } } } = this.props;
    const registeredComponent = ComponentStore.getDesignerComponent(conceptHandler);
    if (registeredComponent) {
      return React.createElement(registeredComponent.control, { ...this.props });
    }
    return null;
  }
}

ComplexControlDesigner.propTypes = {
  metadata: PropTypes.shape({
    concept: PropTypes.object.isRequired,
    displayType: PropTypes.string,
    id: PropTypes.string.isRequired,
    properties: PropTypes.object.isRequired,
    type: PropTypes.string,
  }),
  setError: PropTypes.func,
};

const descriptor = {
  control: ComplexControlDesigner,
  designProperties: {
    isTopLevelComponent: false,
  },
  metadata: {
    attributes: [
      {
        name: 'properties',
        dataType: 'complex',
      },
    ],
  },
};

ComponentStore.registerDesignerComponent('Complex', descriptor);
