import React from 'react';
import { shallow, mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { GridDesigner } from 'components/designer/Grid.jsx';
import constants from 'src/constants';

chai.use(chaiEnzyme());

describe('GridDesigner', () => {
  const wrapper = () => <div>Test</div>;
  const label = {
    id: 'someId',
    value: 'someLabelName',
    type: 'label',
  };

  const textBoxConcept = {
    uuid: '70645842-be6a-4974-8d5f-45b52990e132',
    name: 'Pulse',
    datatype: 'Text',
  };

  const numericBoxConcept = {
    uuid: '216861e7-23d8-468f-9efb-672ce427a14b',
    name: 'Temperature',
    datatype: 'Numeric',
  };

  const formResourceControls = [
    {
      id: '100',
      type: 'label',
      value: 'Pulse',
      properties: {
        location: {
          row: 0,
          column: 0,
        },
      },
    },
    {
      id: '101',
      type: 'obsControl',
      concept: textBoxConcept,
      label,
      properties: {
        location: {
          row: 0,
          column: 1,
        },
      },
    },
    {
      id: '102',
      type: 'obsControl',
      concept: numericBoxConcept,
      label,
      properties: {
        location: {
          row: 0,
          column: 2,
        },
      },
    },
  ];

  it('should have min rows even if there are no controls', () => {
    const grid = mount(<GridDesigner controls={[]} wrapper={ wrapper } />);
    const children = grid.find('.grid').children();

    expect(children).to.have.length(constants.Grid.minRows);
  });

  it('should create rows based on existing controls', () => {
    const grid = shallow(<GridDesigner controls={ formResourceControls } wrapper={ wrapper } />);
    const children = grid.find('.grid').children();
    const dataRow = grid.find('.grid').childAt(0);

    expect(children).to.have.length(constants.Grid.minRows);
    expect(dataRow.prop('rowData')).to.deep.eql(formResourceControls);
  });

  it('should create an extra row to saved number of rows', () => {
    const formControls = formResourceControls.slice(0);
    formControls[2].properties.location.row = 4;

    const grid = shallow(<GridDesigner controls={ formControls } wrapper={ wrapper } />);
    const children = grid.find('.grid').children();

    expect(children).to.have.length(6);
    expect(children.at(0).prop('rowData')).to.deep.eql([formControls[0], formControls[1]]);
    expect(children.at(1).prop('rowData')).to.deep.eql([]);
    expect(children.at(4).prop('rowData')).to.deep.eql([formControls[2]]);
    expect(children.at(5).prop('rowData')).to.deep.eql([]);
  });

  it('should pass appropriate props to children', () => {
    const formControls = formResourceControls.slice(0);
    formControls[2].properties.location.row = 2;
    const grid = shallow(<GridDesigner controls={ formControls } wrapper={ wrapper } />);
    const rows = grid.find('RowDesigner');

    expect(rows).to.have.length(4);
    expect(rows.at(0).prop('rowPosition')).to.eql(0);
    expect(rows.at(1).prop('rowPosition')).to.eql(1);
    expect(rows.at(2).prop('rowPosition')).to.eql(2);
  });
});
