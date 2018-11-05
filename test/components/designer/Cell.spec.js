import React from 'react';
import { shallow, mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import { CellDesigner } from 'components/designer/Cell.jsx';
import { IDGenerator } from 'src/helpers/idGenerator';
import Constants from 'src/constants';

chai.use(chaiEnzyme());

describe('Cell', () => {
  let eventData;
  const defaultProps = {
    allowMultipleControls: true,
    supportedControlTypes: Constants.Grid.supportedControlTypes,
    unsupportedProperties: [],
  };
  const metadata = { id: '123', properties: {}, type: 'obsControl', unsupportedProperties: [] };
  const TestComponent = () => <div>TestComponent</div>;

  before(() => {
    eventData = {
      stopPropagation() {
      },
      preventDefault: () => {
      },
      dataTransfer: { getData: () => JSON.stringify(metadata) },
    };
    sinon.stub(React, 'cloneElement').callsFake(e => e);
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
              {...defaultProps}
              cellData={[]}
              idGenerator={idGenerator}
              location={location}
              onChange={() => {
              }}
              wrapper={ TestComponent }

            />
        );

    const cell = cellDesigner.find('.form-builder-column');
    expect(cell).to.have.prop('onDrop');

    sinon.spy(eventData, 'preventDefault');
    cell.props().onDrop(eventData);
    sinon.assert.calledOnce(eventData.preventDefault);
    eventData.preventDefault.restore();
  });

  it('should set data to null when deleteControl called', () => {
    const idGenerator = new IDGenerator();
    const cellDesigner = shallow(
            <CellDesigner
              {...defaultProps}
              cellData={[]}
              idGenerator={idGenerator}
              location={location}
              onChange={() => {
              }}
              wrapper={ TestComponent }
            />
        );

    cellDesigner.instance().deleteControl();

    expect(cellDesigner.state('data')).to.eql([]);
  });

  it('should call appropriate processDrop when a component is dropped', () => {
    const idGenerator = new IDGenerator();
    const cellDesigner = shallow(
            <CellDesigner
              {...defaultProps}
              cellData={[]}
              idGenerator={idGenerator}
              location={location}
              onChange={() => {
              }}
              wrapper={ TestComponent }
            />
        );

    const cell = cellDesigner.find('.form-builder-column');
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
              {...defaultProps}
              cellData={[]}
              idGenerator={idGenerator}
              location={location}
              onChange={() => {
              }}
              wrapper={ TestComponent }
            />
        );

    const cell = cellDesigner.find('.form-builder-column');

    cell.props().onDrop(eventData);
    expect(cellDesigner.text()).to.eql('TestComponent');
  });


  it('should remove the dropped component when moved to different cell', () => {
    const idGenerator = new IDGenerator();
    const cell1 = mount(
            <CellDesigner
              {...defaultProps}
              cellData={[metadata]}
              idGenerator={idGenerator}
              location={ { row: 0, column: 0 } }
              onChange={() => {
              }}
              wrapper={ TestComponent }
            />
        );
    const cell2 = mount(
            <CellDesigner
              {...defaultProps}
              cellData={[]}
              idGenerator={idGenerator}
              location={{ row: 0, column: 1 }}
              onChange={() => {
              }}
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

    cell1.find('.form-builder-column').props().onDrop(eventDataClone);
    cell2.instance().processMove(metadataClone);
    cell1.update();
    cell2.update();
    expect(cell1.find('.form-builder-column')).to.have.exactly(2).descendants('TestComponent');
    expect(cell2.find('.form-builder-column')).to.not.have.descendants('TestComponent');
  });

  it('should update the components location to that of cells when dropped', () => {
    const idGenerator = new IDGenerator();
    const cellDesigner = mount(
            <CellDesigner
              {...defaultProps}
              cellData={[]}
              idGenerator={idGenerator}
              location={{ column: 10, row: 1 }}
              onChange={() => {
              }}
              wrapper={ TestComponent }
            />
        );
    const cell = cellDesigner.find('.form-builder-column');

    cell.props().onDrop(eventData);
    const instance = cellDesigner.instance();
    const expectedProperties = { properties: { location: { row: 1, column: 10 } } };
    sinon.stub(instance, 'getCellDefinition').callsFake(() => [expectedProperties]);
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
              {...defaultProps}
              cellData={[]}
              idGenerator={idGenerator}
              location={location}
              onChange={onChange.onChange}
              wrapper={ TestComponent }
            />
        );

    const cell = cellDesigner.find('.form-builder-column');
    cell.props().onDrop(eventData);

    mockOnChange.verify();
  });

  it('should not remove the dropped component when moved to the same cell', () => {
    const idGenerator = new IDGenerator();
    const cellDesigner = mount(
            <CellDesigner
              {...defaultProps}
              cellData={[]}
              idGenerator={idGenerator}
              location={location}
              onChange={() => {
              }}
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
    const cell = cellDesigner.find('.form-builder-column');
    cell.props().onDrop(eventDataClone);
    cellDesigner.instance().processMove(metadataClone);
    expect(cellDesigner.text()).to.eql('TestComponent');
  });

  it('should pass appropriate props to children', () => {
    const idGenerator = new IDGenerator();
    const cellDesigner = mount(
            <CellDesigner
              {...defaultProps}
              cellData={[metadata]}
              idGenerator={idGenerator}
              location={location}
              onChange={() => {
              }}
              wrapper={ TestComponent }
            />
        );

    const child = cellDesigner.find('.form-builder-column').children().at(0);
    expect(child.prop('idGenerator')).to.equal(idGenerator); // reference equality
    expect(child.prop('wrapper')).to.eql(TestComponent);
    expect(child.prop('metadata')).to.eql(metadata);
    expect(child.prop('metadata')).to.eql(metadata);
  });

  it('should fail when try to drag and drop controls to obsGroup', () => {
    const context =
      {
        id: '4',
        label: {
          type: 'label',
          value: 'Label',
        },
        properties: {
          addMore: false,
          hideLabel: false,
          mandatory: false,
          notes: false,
        },
        type: 'obsControl',
      };
    const idGenerator = new IDGenerator();
    const wrapper = mount(
            <CellDesigner
              {...defaultProps}
              cellData={[]}
              dragAllowed = { false }
              idGenerator={idGenerator}
              location={location}
              onChange={() => {
              }}
              wrapper={ TestComponent }
            />
        );
    wrapper.instance().processDrop(context);

    expect(wrapper.state('data')).to.eql([]);
  });

  it('should allow only one control when allowMultipleControls prop passed as false', () => {
    const idGenerator = new IDGenerator();
    const context =
      {
        id: '4',
        label: {
          type: 'label',
          value: 'Label',
        },
        properties: {
          addMore: false,
          hideLabel: false,
          mandatory: false,
          notes: false,
        },
        type: 'obsControl',
      };
    const wrapper = shallow(
            <CellDesigner
              allowMultipleControls = {false}
              cellData={[]}
              idGenerator={idGenerator}
              location={location}
              onChange={() => {
              }}
              supportedControlTypes = {defaultProps.supportedControlTypes}
              wrapper={ TestComponent }
            />
        );

    wrapper.instance().processDrop(context);
    expect(wrapper.state('data').length).to.eql(1);

    wrapper.instance().processDrop(context);
    expect(wrapper.state('data').length).to.eql(1);
  });

  it('should allow only supported controls, that are passed as props', () => {
    const idGenerator = new IDGenerator();
    const context =
      {
        id: '4',
        label: {
          type: 'label',
          value: 'Label',
        },
        properties: {
          addMore: false,
          hideLabel: false,
          mandatory: false,
          notes: false,
        },
        type: 'obsControl',
      };
    const wrapper = shallow(
           <CellDesigner
             allowMultipleControls = {false}
             cellData={[]}
             idGenerator={idGenerator}
             location={location}
             onChange={() => {}}
             supportedControlTypes = {defaultProps.supportedControlTypes}
             wrapper={ TestComponent }
           />
        );

    wrapper.instance().processDrop(context);
    expect(wrapper.state('data').length).to.eql(1);
  });

  it('should not allow controls that are not passed as supportedControls', () => {
    const idGenerator = new IDGenerator();
    const context =
      {
        id: '4',
        label: {
          type: 'label',
          value: 'Label',
        },
        properties: {
          addMore: false,
          hideLabel: false,
          mandatory: false,
          notes: false,
        },
        type: 'obsControl',
      };
    const wrapper = shallow(
           <CellDesigner
             allowMultipleControls = {false}
             cellData={[]}
             idGenerator={idGenerator}
             location={location}
             onChange={() => {}}
             supportedControlTypes = {['obsGroupControls']}
             wrapper={ TestComponent }
           />
        );

    wrapper.instance().processDrop(context);
    expect(wrapper.state('data').length).to.eql(0);
  });

  it('should add unsupportedProperties to metadata ', () => {
    const idGenerator = new IDGenerator();
    const context =
      {
        id: '4',
        label: {
          type: 'label',
          value: 'Label',
        },
        properties: {
          addMore: false,
          hideLabel: false,
          mandatory: false,
          notes: false,
        },
        type: 'obsControl',
      };
    const unsupportedProperties = ['addMore'];
    const wrapper = shallow(
      <CellDesigner
        allowMultipleControls = {false}
        cellData={[]}
        idGenerator={idGenerator}
        location={location}
        onChange={() => {}}
        supportedControlTypes = {['obsControl']}
        unsupportedProperties={unsupportedProperties}
        wrapper={ TestComponent }
      />
    );

    wrapper.instance().processDrop(context);
    expect(context.unsupportedProperties).to.eql(unsupportedProperties);
  });
});
