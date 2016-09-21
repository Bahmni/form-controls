import React from 'react';
import { shallow, mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { CellDesigner } from 'components/designer/Cell.jsx';
import sinon from 'sinon';

chai.use(chaiEnzyme());

describe('Cell', () => {
  let eventData;
  let fakeComponent = () => (<span>TestComponent</span>);
  before(() => {
    eventData = {
      preventDefault: () => {},
      dataTransfer: {
        getData: () => 'someType',
      },
    };
    window.componentStore.registerDesignerComponent('someType', {
      control: fakeComponent,
    });
  });

  after(() => {
    window.componentStore.deRegisterDesignerComponent('someType')
  });



  it('should render with the default position', () => {
    const cellDesigner = shallow(<CellDesigner />);
    const cell = cellDesigner.find('.cell0');

    expect(cell.props().pos).to.eql(0);
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

  it('Should call appropriate postDropProcess when a component is dropped', () => {
    const cellDesigner = shallow(<CellDesigner />);
    const cell = cellDesigner.find('.cell0');

    const cellDesignerInstance = cellDesigner.instance();

    sinon.spy(cellDesignerInstance, 'postDropProcess');
    cell.props().onDrop(eventData);
    sinon.assert.calledOnce(cellDesignerInstance.postDropProcess);
    sinon.assert.calledWith(cellDesignerInstance.postDropProcess, 'someType');
    cellDesignerInstance.postDropProcess.restore();
  });

  it('should render the dropped component', () => {
    const cellDesigner = mount(<CellDesigner />);
    const cell = cellDesigner.find('.cell0');

    cell.props().onDrop(eventData);

    expect(cellDesigner.text()).to.eql('TestComponent');
  });

  it('Should render multiple components that get dropped on it', () => {
    let otherComponent = () => (<span>otherComponent</span>);
    window.componentStore.registerDesignerComponent('otherType', {
      control: otherComponent,
    });
    const otherData = {
      preventDefault: () => {},
      dataTransfer: {
        getData: () => 'otherType',
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
});
