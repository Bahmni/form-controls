import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { RowDesigner } from 'components/designer/RowDesigner.jsx';
import Constants from 'src/constants';
import sinon from 'sinon';
import { IDGenerator } from 'src/helpers/idGenerator';


chai.use(chaiEnzyme());

describe('Row', () => {
  const testComponent = () => <div>Test</div>;

  it('should render the default number of cells', () => {
    const idGenerator = new IDGenerator();

    const rowDesigner = shallow(
      <RowDesigner
        idGenerator={idGenerator}
        onChange={() => {}}
        rowData={[]}
        rowPosition={0}
        wrapper={ testComponent }
      />);

    const row = rowDesigner.find('.row0');

    expect(row.children()).to.have.length(Constants.Grid.defaultRowWidth);
  });

  it('should render specified number of cells', () => {
    const idGenerator = new IDGenerator();
    const rowDesigner = shallow(
      <RowDesigner
        columns={2}
        idGenerator={idGenerator}
        onChange={() => {}}
        rowData={[]}
        rowPosition={1}
        wrapper={ testComponent }
      />);

    const row = rowDesigner.find('.row1');

    expect(row.children()).to.have.length(2);
  });

  it('should register onChange handler with the cell', () => {
    const idGenerator = new IDGenerator();
    const onChange = { onChange: () => {} };
    const mockOnChange = sinon.mock(onChange);
    mockOnChange.expects('onChange').once();

    const rowDesigner = shallow(
      <RowDesigner
        idGenerator={idGenerator}
        onChange={onChange.onChange}
        rowData={[]}
        rowPosition={0}
        wrapper={ testComponent }
      />);

    const row = rowDesigner.find('.row0');
    const cell = row.childAt(0);

    expect(cell).to.have.prop('onChange');

    cell.props().onChange();

    mockOnChange.verify();
  });

  it('should pass appropriate props to children', () => {
    const rowData = {
      properties: {
        location: { row: 0, column: 0 },
      },
    };
    const idGenerator = new IDGenerator();
    const rowDesigner = shallow(
      <RowDesigner
        idGenerator={idGenerator}
        onChange={() => {}}
        rowData={[rowData]}
        rowPosition={0}
        wrapper={ testComponent }
      />);

    const child = rowDesigner.find('CellDesigner').at(0);
    expect(child.prop('idGenerator')).to.equal(idGenerator);
    expect(child.prop('location')).to.eql({ row: 0, column: 0 });
    expect(child.prop('cellData')).to.eql([rowData]);
    expect(child.prop('wrapper')).to.eql(testComponent);
    expect(child).to.have.prop('onChange');
  });
});
