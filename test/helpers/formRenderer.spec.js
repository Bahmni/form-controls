import { Container } from 'components/Container.jsx';
import 'src/helpers/formRenderer';
import sinon from 'sinon';
import React from 'react';
import ReactDOM from 'react-dom';

describe('FormRenderer', () => {
  const formDetails = {
    id: '100',
    name: 'Vitals',
    controls: [
      {
        id: '100',
        type: 'label',
        value: 'Pulse',
      },
      {
        id: '200',
        type: 'obsControl',
        displayType: 'text',
        concept: {
          fullySpecifiedName: 'Pulse',
        },
      },
      {
        id: '300',
        type: 'obsControl',
        displayType: 'numeric',
        concept: {
          fullySpecifiedName: 'Temperature',
        },
      },
    ],
  };
  beforeEach(() => {
    sinon.stub(React, 'createElement');
    sinon.stub(ReactDOM, 'render');
    sinon.stub(document, 'getElementById');
  });

  afterEach(() => {
    React.createElement.restore();
    ReactDOM.render.restore();
    document.getElementById.restore();
  });

  it('should create container component with the supplied form details', () => {
    React.createElement.withArgs(Container, sinon
      .match({ metadata: formDetails })).returns('formControlsContainer');

    document.getElementById.withArgs('someNodeId').returns('someOtherNodeId');

    renderWithControls(formDetails, [], 'someNodeId'); // eslint-disable-line no-undef

    sinon.assert.callCount(React.createElement, 1);
    sinon.assert.calledWith(ReactDOM.render, 'formControlsContainer', 'someOtherNodeId');
  });
});
