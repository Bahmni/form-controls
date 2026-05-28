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
import map from 'lodash/map';

export class ButtonDesigner extends Component {
  getJsonDefinition() {
    return this.props.options;
  }

  displayButtons() {
    return map(this.props.options, (option, index) =>
      <button key={index} title={option.name}>{option.name}</button>
    );
  }

  render() {
    return <div className="form-control-buttons">{this.displayButtons()}</div>;
  }
}

ButtonDesigner.propTypes = {
  options: PropTypes.array.isRequired,
};

const descriptor = {
  control: ButtonDesigner,
  designProperties: {
    isTopLevelComponent: false,
  },
  metadata: {
    attributes: [],
  },
};

ComponentStore.registerDesignerComponent('button', descriptor);
