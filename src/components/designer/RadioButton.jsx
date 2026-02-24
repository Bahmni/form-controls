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

export class RadioButtonDesigner extends Component {
  getJsonDefinition() {
    return this.props.metadata;
  }

  displayRadioButtons() {
    return map(this.props.metadata.options, (option, index) =>
      <div className="option-list" key={index}>
        <input
          key={index}
          name={this.props.metadata.id}
          type="radio"
          value={option.value}
        />
        {option.name}
      </div>
    );
  }

  render() {
    return <div>{this.displayRadioButtons()}</div>;
  }
}

RadioButtonDesigner.propTypes = {
  metadata: PropTypes.shape({
    concept: PropTypes.object.isRequired,
    displayType: PropTypes.string,
    id: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    properties: PropTypes.object.isRequired,
    type: PropTypes.string,
  }),
};

const descriptor = {
  control: RadioButtonDesigner,
  designProperties: {
    isTopLevelComponent: false,
  },
  metadata: {
    attributes: [],
  },
};

ComponentStore.registerDesignerComponent('radio', descriptor);
