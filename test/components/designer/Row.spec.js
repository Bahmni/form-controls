import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { RowDesigner } from 'components/designer/Row.jsx';
import Constants from 'src/constants';
import sinon from 'sinon';


chai.use(chaiEnzyme());

describe('Row', () => {
  const testComponent = () => <div>Test</div>;

  it('should render the default number of cells', () => {
    const rowDesigner = shallow(
      <RowDesigner onChange={() => {}}
        rowData={[]}
        rowPosition={0}
        wrapper={ testComponent }
      />);

    const row = rowDesigner.find('.row0');

    expect(row.children()).to.have.length(Constants.Grid.defaultRowWidth);
  });

  it('should render specified number of cells', () => {
    const rowDesigner = shallow(
      <RowDesigner
        columns={2}
        onChange={() => {}}
        rowData={[]}
        rowPosition={1}
        wrapper={ testComponent }
      />);

    const row = rowDesigner.find('.row1');

    expect(row.children()).to.have.length(2);
  });

  it('should register onChange handler with the cell', () => {
    const onChange = { onChange: () => {} };
    const mockOnChange = sinon.mock(onChange);
    mockOnChange.expects('onChange').once();

    const rowDesigner = shallow(
      <RowDesigner onChange={onChange.onChange}
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
});
