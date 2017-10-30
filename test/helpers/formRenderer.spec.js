import { Container } from 'components/Container.jsx';
import 'src/helpers/formRenderer';
import sinon from 'sinon';
import React from 'react';
import ReactDOM from 'react-dom';
import { expect } from 'chai';

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
    sinon.stub(ReactDOM, 'unmountComponentAtNode');
    sinon.stub(document, 'getElementById');
  });

  afterEach(() => {
    React.createElement.restore();
    ReactDOM.render.restore();
    ReactDOM.unmountComponentAtNode.restore();
    document.getElementById.restore();
  });

  it('should create container component with the supplied form details', () => {
    React.createElement.withArgs(Container, sinon
      .match({ metadata: formDetails, collapse: false })).returns('formControlsContainer');

    document.getElementById.withArgs('someNodeId').returns('someOtherNodeId');

    renderWithControls(formDetails, [], 'someNodeId', false); // eslint-disable-line no-undef

    sinon.assert.callCount(React.createElement, 1);
    sinon.assert.calledWith(ReactDOM.render, 'formControlsContainer', 'someOtherNodeId');
  });

  it('should call unmountComponentAtNode with container', () => {
    const container = {};
    ReactDOM.unmountComponentAtNode.returns(true);
    const val = unMountForm(container); // eslint-disable-line no-undef
    sinon.assert.callCount(ReactDOM.unmountComponentAtNode, 1);
    sinon.assert.calledWith(ReactDOM.unmountComponentAtNode, {});
    expect(val).to.eql(true);
  });

  it('should return false if there is no container', () => {
    expect(unMountForm()).to.eql(false); // eslint-disable-line no-undef
  });
});
