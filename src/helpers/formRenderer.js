import { FormControlsContainer } from 'components/FormControlsContainer.jsx';
import React from 'react';
import ReactDOM from 'react-dom';
import map from 'lodash/fp/map';
import flow from 'lodash/fp/flow';
import reject from 'lodash/fp/reject';
import isNull from 'lodash/fp/isNull';


function getControls(formDetails) {
  return flow(
    map((control) => {
      const component = componentStore.getRegisteredComponent(control.type); // eslint-disable-line no-undef
      if (component) return React.createElement(component, { metadata: control });
      return null;
    }), reject(isNull)
  )(formDetails.controls);
}

window.renderWithControls = function renderWithControls(formDetails, nodeId) {
  const controls = getControls(formDetails);
  const container = React.createElement(FormControlsContainer, { controls });
  return ReactDOM.render(container, document.getElementById(nodeId));
};
