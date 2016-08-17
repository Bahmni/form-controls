/* eslint-disable no-undef */
import { TextBox } from 'components/TextBox';
import { ObsControl } from 'components/ObsControl';
import { FormControlsContainer } from 'components/FormControlsContainer';
import 'src/helpers/FormRenderer';
import sinon from 'sinon';
import React from 'react';
import ReactDOM from 'react-dom';

describe('FormRenderer', () => {
  const formDetails = {
    name: 'Vitals',
    controls: [
      {
        id: '200',
        type: 'obsControl',
        controls: [
          {
            id: '100',
            type: 'label',
            value: 'Pulse',
          },
          {
            id: '101',
            type: 'text',
            properties: {
              mandatory: true,
              concept: {
                fullySpecifiedName: 'Pulse',
              },
            },
          },
        ],
      },
      {
        id: '201',
        type: 'obsControl',
        controls: [
          {
            id: '103',
            type: 'numeric',
            properties: {
              mandatory: true,
              concept: {
                fullySpecifiedName: 'Temperature',
              },
            },
          },
        ],
      },
      {
        id: '202',
        type: 'textBox',
        controls: [],
      },
    ],
  };
  beforeEach(() => {
    sinon.stub(React, 'createElement');
    sinon.stub(ReactDOM, 'render');
  });

  afterEach(() => {
    React.createElement.restore();
    ReactDOM.render.restore();
    componentStore.deRegisterComponent('textBox');
    componentStore.deRegisterComponent('obsControl');
  });

  it('should renderWithControls', () => {
    componentStore.registerComponent('textBox', TextBox);
    componentStore.registerComponent('obsControl', ObsControl);

    renderWithControls(formDetails, 'someNodeId');

    sinon.assert.callCount(React.createElement, 4);
    sinon.assert.callCount(ReactDOM.render, 1);
  });

  it('should call createElement with appropriate arguments', () => {
    componentStore.registerComponent('textBox', TextBox);

    React.createElement.withArgs(TextBox, sinon.match.object).returns('textBoxElement');
    React.createElement.withArgs(FormControlsContainer,
      sinon.match({ controls: ['textBoxElement'] })).returns('formControlsContainer');

    renderWithControls(formDetails, 'someNodeId');

    sinon.assert.callCount(React.createElement, 2);
    sinon.assert.calledWith(ReactDOM.render, 'formControlsContainer', 'someNodeId');
  });

  it('should not call getControls for child components when formDetails is empty', () => {
    renderWithControls({}, 'someNodeId');
    sinon.assert.callCount(React.createElement, 1);
  });

  it('should not call getControls for children when they are not registered components', () => {
    renderWithControls(formDetails, 'someNodeId');
    sinon.assert.callCount(React.createElement, 1);
  });
});

/* eslint-enable no-undef */
