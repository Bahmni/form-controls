import { Container } from 'components/Container.jsx';
import React from 'react';
import ReactDOM from 'react-dom';

window.renderWithControls = function renderWithControls(formDetails, observations, nodeId) {
  const container = React.createElement(Container, { metadata: formDetails, observations,  validate: true });
  return ReactDOM.render(container, document.getElementById(nodeId));
};
