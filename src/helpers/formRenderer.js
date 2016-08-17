import { FormControlsContainer } from 'components/FormControlsContainer';
import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

function getControls(formDetails) {
  return (
    _.chain(formDetails.controls)
      .map((control) => {
        const component = componentStore.getRegisteredComponent(control.type); // eslint-disable-line no-undef
        if (component) return React.createElement(component, { controls: control.controls });
        return null;
      })
      .reject(_.isNull)
      .value()
  );
}

window.renderWithControls = function renderWithControls(formDetails, nodeId) {
  const controls = getControls(formDetails);
  const container = React.createElement(FormControlsContainer, { controls });
  return ReactDOM.render(container, nodeId);
};
