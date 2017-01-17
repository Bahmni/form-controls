import { Container } from 'components/Container.jsx';
import React from 'react';
import ReactDOM from 'react-dom';

window.renderWithControls =
  function renderWithControls(formDetails, observations, nodeId, collapse) {
    const container = React.createElement(Container,
      { metadata: formDetails, observations, validate: true, collapse });
    return ReactDOM.render(container, document.getElementById(nodeId));
  };

window.unMountForm = (container) => {
  if (container) return ReactDOM.unmountComponentAtNode(container);
  return false;
};
