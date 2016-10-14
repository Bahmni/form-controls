import React from 'react';
import { shallow, mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { CellDesigner } from 'components/designer/Cell.jsx';
import sinon from 'sinon';

chai.use(chaiEnzyme());

describe('Cell', () => {
  let eventData;
  const metadata = { id: 123 };

  before(() => {
    eventData = {
      preventDefault: () => {},
      dataTransfer: { getData: () => JSON.stringify(metadata) },
    };
    sinon.stub(React, 'cloneElement', e => e);
  });

  after(() => {
    React.cloneElement.restore();
  });

  const location = {
    column: 0,
    row: 0,
  };

  it('should be a drop target', () => {
    const cellDesigner = shallow(
      <CellDesigner
        cellData={[]}
        location={location}
        onChange={() => {}}
      />
    );

    const cell = cellDesigner.find('.cell-container');
    expect(cell).to.have.prop('onDrop');

    sinon.spy(eventData, 'preventDefault');
    cell.props().onDrop(eventData);
    sinon.assert.calledOnce(eventData.preventDefault);
    eventData.preventDefault.restore();
  });

  it('should call appropriate processDrop when a component is dropped', () => {
    const cellDesigner = shallow(
      <CellDesigner
        cellData={[]}
        location={location}
        onChange={() => {}}
      />
    );

    const cell = cellDesigner.find('.cell-container');
    const cellDesignerInstance = cellDesigner.instance();

    sinon.spy(cellDesignerInstance, 'processDrop');
    cell.props().onDrop(eventData);
    sinon.assert.calledOnce(cellDesignerInstance.processDrop);
    sinon.assert.calledWith(cellDesignerInstance.processDrop, metadata);
    cellDesignerInstance.processDrop.restore();
  });

  it('should render the dropped component', () => {
    const cellDesigner = mount(
      <CellDesigner
        cellData={[]}
        location={location}
        onChange={() => {}}
      >
        TestComponent
      </CellDesigner>);

    const cell = cellDesigner.find('.cell-container');

    cell.props().onDrop(eventData);
    expect(cellDesigner.text()).to.eql('TestComponent');
  });

  it('should render multiple copies of child component when components get dropped on it', () => {
    const otherMetadata = {
      id: 999,
      properties: {
        location: {
          row: 0,
          column: 0,
        },
      },
    };

    const otherEvent = {
      preventDefault: () => {},
      dataTransfer: { getData: () => JSON.stringify(otherMetadata) },
    };

    const cellDesigner = mount(
      <CellDesigner
        cellData={[]}
        location={location}
        onChange={() => {}}
      >
        TestComponent
      </CellDesigner>);

    const cell = cellDesigner.find('.cell-container');
    expect(cellDesigner.text()).to.eql('');
    cell.props().onDrop(eventData);
    expect(cellDesigner.text()).to.eql('TestComponent');
    cell.props().onDrop(otherEvent);
    expect(cellDesigner.text()).to.eql('TestComponent' + 'TestComponent');
  });

  it('should remove the dropped component when moved to different cell', () => {
    const cellDesigner = mount(
      <CellDesigner
        cellData={[]}
        location={location}
        onChange={() => {}}
      />
    );
    const cell = cellDesigner.find('.cell-container');
    cell.props().onDrop(eventData);
    cellDesigner.instance().processMove(metadata);
    expect(cellDesigner.text()).to.eql('');
  });

  it('should remove only the dragged out component', () => {
    const otherMetadata = {
      id: 345,
      properties: {
        location: {
          row: 0,
          column: 0,
        },
      },
    };

    const otherData = {
      preventDefault: () => {},
      dataTransfer: { getData: () => JSON.stringify(otherMetadata) },
    };
    const cellDesigner = mount(
      <CellDesigner
        cellData={[]}
        location={location}
        onChange={() => {}}
      >
        Wrapper
      </CellDesigner>);

    const cell = cellDesigner.find('.cell-container');

    cell.props().onDrop(eventData);
    cell.props().onDrop(otherData);
    cellDesigner.instance().processMove(metadata);
    expect(cellDesigner.text()).to.eql('Wrapper');
  });

  it('should update the components location to that of cells when dropped', () => {
    const cellDesigner = mount(
      <CellDesigner
        cellData={[]}
        location={{ column: 10, row: 1 }}
        onChange={() => {}}
      >
        Wrapper
      </CellDesigner>);

    const cell = cellDesigner.find('.cell-container');

    cell.props().onDrop(eventData);
    const cellDefinition = cellDesigner.instance().getCellDefinition();
    expect(cellDefinition[0].properties.location).to.deep.eql({ row: 1, column: 10 });
  });
});
