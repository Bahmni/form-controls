/* eslint-disable no-undef */
import { TextBox } from 'components/TextBox.jsx';
import { NumericBox } from 'components/NumericBox.jsx';
import { ObsControl } from 'components/ObsControl.jsx';
import { Label } from 'components/Label.jsx';
import { FormControlsContainer } from 'components/FormControlsContainer.jsx';
import 'src/helpers/formRenderer';
import sinon from 'sinon';
import React from 'react';
import ReactDOM from 'react-dom';

describe('FormRenderer', () => {
  const formDetails = {
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
    componentStore.deRegisterComponent('label');
    componentStore.deRegisterComponent('text');
    componentStore.deRegisterComponent('numeric');
    componentStore.deRegisterComponent('obsControl');
  });

  it('should renderWithControls', () => {
    componentStore.registerComponent('label', Label);
    componentStore.registerComponent('text', TextBox);
    componentStore.registerComponent('obsControl', ObsControl);
    componentStore.registerComponent('numeric', NumericBox);

    renderWithControls(formDetails, 'someNodeId');

    sinon.assert.callCount(React.createElement, 4);
    sinon.assert.callCount(ReactDOM.render, 1);
  });

  it('should call createElement with appropriate arguments', () => {
    componentStore.registerComponent('obsControl', ObsControl);

    React.createElement.withArgs(ObsControl, sinon.match.object).returns('someObsControl');
    React.createElement.withArgs(FormControlsContainer, sinon
      .match({ controls: ['someObsControl', 'someObsControl'] })).returns('formControlsContainer');

    document.getElementById.withArgs('someNodeId').returns('someOtherNodeId');

    renderWithControls(formDetails, 'someNodeId');

    sinon.assert.callCount(React.createElement, 3);
    sinon.assert.calledWith(ReactDOM.render, 'formControlsContainer', 'someOtherNodeId');
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
