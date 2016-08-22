import { FormControlsContainer } from 'components/FormControlsContainer.jsx';
import React from 'react';
import ReactDOM from 'react-dom';

window.renderWithControls = function renderWithControls(formDetails, nodeId) {
  const container = React.createElement(FormControlsContainer, { metadata: formDetails });
  return ReactDOM.render(container, document.getElementById(nodeId));
};
