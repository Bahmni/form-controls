/* eslint-disable react/prefer-stateless-function */

import React, { Component, PropTypes } from 'react';
import 'src/helpers/componentStore';
import { displayRowControls, getGroupedControls } from 'src/helpers/controlsParser';

export class Section extends Component {

  render() {
    const { formUuid, metadata: { controls, value }, obs, onValueChanged, validate } = this.props;
    const childProps = { formUuid, onValueChanged, validate };
    const groupedRowControls = getGroupedControls(controls, 'row');
    return (
      <fieldset className="form-builder-fieldset">
        <legend>{value}</legend>
        <div className="section-controls">
          {displayRowControls(groupedRowControls, obs, childProps)}
        </div>
      </fieldset>
    );
  }
}

Section.propTypes = {
  formUuid: PropTypes.string.isRequired,
  metadata: PropTypes.shape({
    controls: PropTypes.array.isRequired,
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    properties: PropTypes.shape({
      visualOnly: PropTypes.bool.isRequired,
    }),
  }),
  obs: PropTypes.array.isRequired,
  onValueChanged: PropTypes.func.isRequired,
  validate: PropTypes.bool.isRequired,
};

window.componentStore.registerComponent('section', Section);
/* eslint-disable react/prefer-stateless-function */

