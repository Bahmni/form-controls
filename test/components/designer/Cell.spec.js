import React from 'react';
import { shallow, mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { CellDesigner } from 'components/designer/Cell.jsx';
import sinon from 'sinon';

chai.use(chaiEnzyme());

describe('Cell', () => {
  let eventData;
  const testContext = { type: 'someType', data: { id: 123 } };
  const fakeComponent = () => (<span>TestComponent</span>);
  before(() => {
    eventData = {
      preventDefault: () => {},
      dataTransfer: {
        getData: () => JSON.stringify(testContext),
      },
    };
    window.componentStore.registerDesignerComponent('someType', {
      control: fakeComponent,
    });
  });

  after(() => {
    window.componentStore.deRegisterDesignerComponent('someType');
  });

  it('should be a drop target', () => {
    const cellDesigner = shallow(<CellDesigner />);

    const cell = cellDesigner.find('.cell0');
    expect(cell).to.have.prop('onDrop');

    sinon.spy(eventData, 'preventDefault');
    cell.props().onDrop(eventData);
    sinon.assert.calledOnce(eventData.preventDefault);
    eventData.preventDefault.restore();
  });

  it('Should call appropriate processDrop when a component is dropped', () => {
    const cellDesigner = shallow(<CellDesigner />);
    const cell = cellDesigner.find('.cell0');

    const cellDesignerInstance = cellDesigner.instance();

    sinon.spy(cellDesignerInstance, 'processDrop');
    cell.props().onDrop(eventData);
    sinon.assert.calledOnce(cellDesignerInstance.processDrop);
    sinon.assert.calledWith(cellDesignerInstance.processDrop, testContext);
    cellDesignerInstance.processDrop.restore();
  });

  it('should render the dropped component', () => {
    const cellDesigner = mount(<CellDesigner />);
    const cell = cellDesigner.find('.cell0');

    cell.props().onDrop(eventData);

    expect(cellDesigner.text()).to.eql('TestComponent');
  });

  it('Should render multiple components that get dropped on it', () => {
    const otherComponent = () => (<span>otherComponent</span>);
    const otherContext = { type: 'otherType' };
    window.componentStore.registerDesignerComponent('otherType', {
      control: otherComponent,
    });
    const otherData = {
      preventDefault: () => {},
      dataTransfer: {
        getData: () => JSON.stringify(otherContext),
      },
    };
    const cellDesigner = mount(<CellDesigner />);
    const cell = cellDesigner.find('.cell0');
    expect(cellDesigner.text()).to.eql('cell0');

    cell.props().onDrop(eventData);
    expect(cellDesigner.text()).to.eql('TestComponent');

    cell.props().onDrop(otherData);
    expect(cellDesigner.text()).to.eql('TestComponent' + 'otherComponent');

    window.componentStore.deRegisterDesignerComponent('otherType');
  });

  it('should remove the dropped component when moved to different cell', () => {
    const cellDesigner = mount(<CellDesigner />);
    const cell = cellDesigner.find('.cell0');

    cell.props().onDrop(eventData);

    cellDesigner.instance().processMove(testContext);

    expect(cellDesigner.text()).to.eql('cell0');
  });

  it('should remove only the dragged out component', () => {
    const otherComponent = () => (<span>otherComponent</span>);
    const otherContext = { type: 'someType', data: { id: 345 } };
    window.componentStore.registerDesignerComponent('someType', {
      control: otherComponent,
    });
    const otherData = {
      preventDefault: () => {},
      dataTransfer: {
        getData: () => JSON.stringify(otherContext),
      },
    };
    const cellDesigner = mount(<CellDesigner />);
    const cell = cellDesigner.find('.cell0');

    cell.props().onDrop(eventData);
    cell.props().onDrop(otherData);

    cellDesigner.instance().processMove(testContext);

    expect(cellDesigner.text()).to.eql('otherComponent');
  });
});
