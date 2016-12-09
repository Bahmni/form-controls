import React from 'react';
import { shallow, mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';

import { CellDesigner } from 'components/designer/Cell.jsx';
import { IDGenerator } from 'src/helpers/idGenerator';

chai.use(chaiEnzyme());

describe('Cell', () => {
  let eventData;
  const metadata = { id: '123', properties: {} };
  const TestComponent = () => <div>TestComponent</div>;

  before(() => {
    eventData = {
      stopPropagation() {
      },
      preventDefault: () => {
      },
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
    const idGenerator = new IDGenerator();
    const cellDesigner = shallow(
      <CellDesigner
        cellData={[]}
        idGenerator={idGenerator}
        location={location}
        onChange={() => {}}
        wrapper={ TestComponent }
      />
    );

    const cell = cellDesigner.find('.gridCell');
    expect(cell).to.have.prop('onDrop');

    sinon.spy(eventData, 'preventDefault');
    cell.props().onDrop(eventData);
    sinon.assert.calledOnce(eventData.preventDefault);
    eventData.preventDefault.restore();
  });

  it('should call appropriate processDrop when a component is dropped', () => {
    const idGenerator = new IDGenerator();
    const cellDesigner = shallow(
      <CellDesigner
        cellData={[]}
        idGenerator={idGenerator}
        location={location}
        onChange={() => {}}
        wrapper={ TestComponent }
      />
    );

    const cell = cellDesigner.find('.gridCell');
    const cellDesignerInstance = cellDesigner.instance();

    sinon.spy(cellDesignerInstance, 'processDrop');
    cell.props().onDrop(eventData);
    sinon.assert.calledOnce(cellDesignerInstance.processDrop);
    sinon.assert.calledWith(cellDesignerInstance.processDrop, metadata);
    cellDesignerInstance.processDrop.restore();
  });

  it('should render the dropped component', () => {
    const idGenerator = new IDGenerator();
    const cellDesigner = mount(
      <CellDesigner
        cellData={[]}
        idGenerator={idGenerator}
        location={location}
        onChange={() => {}}
        wrapper={ TestComponent }
      />
    );

    const cell = cellDesigner.find('.gridCell');

    cell.props().onDrop(eventData);
    expect(cellDesigner.text()).to.eql('TestComponent');
  });

  it.skip('should render multiple copies of child ' +
    'component when components get dropped on it', () => {
    const otherMetadata = {
      id: 999,
      properties: {
        location: {
          row: 0,
          column: 1,
        },
      },
    };

    const otherEvent = {
      preventDefault: () => {
      },
      dataTransfer: { getData: () => JSON.stringify(otherMetadata) },
    };

    const cellDesigner = mount(
      <CellDesigner
        cellData={[]}
        location={location}
        onChange={() => {}}
        wrapper={ TestComponent }
      />
    );

    const cell = cellDesigner.find('.gridCell');
    expect(cell).to.not.have.descendants('TestComponent');
    cell.props().onDrop(eventData);
    expect(cell).to.have.exactly(1).descendants('TestComponent');
    cell.props().onDrop(otherEvent);
    expect(cell).to.have.exactly(2).descendants('TestComponent');
  });

  it('should remove the dropped component when moved to different cell', () => {
    const idGenerator = new IDGenerator();
    const cell1 = mount(
      <CellDesigner
        cellData={[metadata]}
        idGenerator={idGenerator}
        location={ { row: 0, location: 0 } }
        onChange={() => {}}
        wrapper={ TestComponent }
      />
    );
    const cell2 = mount(
      <CellDesigner
        cellData={[]}
        idGenerator={idGenerator}
        location={{ row: 0, location: 1 }}
        onChange={() => {}}
        wrapper={ TestComponent }
      />
    );

    const metadataClone = Object.assign({}, metadata, {
      id: '1234',
      properties: {
        location: { row: 0, column: 1 },
      },
    });
    const eventDataClone = Object.assign({}, eventData, {
      dataTransfer: { getData: () => JSON.stringify(metadataClone) },
    });

    cell1.find('.gridCell').props().onDrop(eventDataClone);
    cell2.instance().processMove(metadataClone);
    expect(cell1.find('.gridCell')).to.have.exactly(2).descendants('TestComponent');
    expect(cell2.find('.gridCell')).to.not.have.descendants('TestComponent');
  });

  it.skip('should remove only the dragged out component', () => {
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
      preventDefault: () => {
      },
      dataTransfer: { getData: () => JSON.stringify(otherMetadata) },
    };
    const cellDesigner = mount(
      <CellDesigner
        cellData={[]}
        location={location}
        onChange={() => {}}
        wrapper={ TestComponent }
      />
    );
    const cell = cellDesigner.find('.gridCell');

    cell.props().onDrop(eventData);
    cell.props().onDrop(otherData);
    cellDesigner.instance().processMove(metadata);
    expect(cellDesigner.text()).to.eql('TestComponent');
  });

  it('should update the components location to that of cells when dropped', () => {
    const idGenerator = new IDGenerator();
    const cellDesigner = mount(
      <CellDesigner
        cellData={[]}
        idGenerator={idGenerator}
        location={{ column: 10, row: 1 }}
        onChange={() => {}}
        wrapper={ TestComponent }
      />
    );
    const cell = cellDesigner.find('.gridCell');

    cell.props().onDrop(eventData);
    const instance = cellDesigner.instance();
    const expectedProperties = { properties: { location: { row: 1, column: 10 } } };
    sinon.stub(instance, 'getCellDefinition', () => [expectedProperties]);
    const cellDefinition = instance.getCellDefinition();
    expect(cellDesigner.text()).to.eql('TestComponent');
    expect(cellDefinition[0].properties.location).to.deep.eql({ row: 1, column: 10 });
  });

  it('should raise onChange event when a new control gets dropped', () => {
    const onChange = {
      onChange: () => {
      },
    };
    const mockOnChange = sinon.mock(onChange);
    mockOnChange.expects('onChange').once();

    const idGenerator = new IDGenerator();
    const cellDesigner = shallow(
      <CellDesigner
        cellData={[]}
        idGenerator={idGenerator}
        location={location}
        onChange={onChange.onChange}
        wrapper={ TestComponent }
      />
    );

    const cell = cellDesigner.find('.gridCell');
    cell.props().onDrop(eventData);

    mockOnChange.verify();
  });

  it('should not remove the dropped component when moved to the same cell', () => {
    const idGenerator = new IDGenerator();
    const cellDesigner = mount(
      <CellDesigner
        cellData={[]}
        idGenerator={idGenerator}
        location={location}
        onChange={() => {}}
        wrapper={ TestComponent }
      />
    );
    const metadataClone = Object.assign({}, metadata, {
      properties: {
        location: { row: 0, column: 1 },
      },
    });
    const eventDataClone = Object.assign({}, eventData, {
      dataTransfer: { getData: () => JSON.stringify(metadataClone) },
    });
    const cell = cellDesigner.find('.gridCell');
    cell.props().onDrop(eventDataClone);
    cellDesigner.instance().processMove(metadataClone);
    expect(cellDesigner.text()).to.eql('TestComponent');
  });

  it('should pass appropriate props to children', () => {
    const idGenerator = new IDGenerator();
    const cellDesigner = mount(
      <CellDesigner
        cellData={[metadata]}
        idGenerator={idGenerator}
        location={location}
        onChange={() => {}}
        wrapper={ TestComponent }
      />
    );

    const child = cellDesigner.find('.gridCell').children().at(0);
    expect(child.prop('idGenerator')).to.equal(idGenerator); // reference equality
    expect(child.prop('wrapper')).to.eql(TestComponent);
    expect(child.prop('metadata')).to.eql(metadata);
    expect(child.prop('metadata')).to.eql(metadata);
  });
});
