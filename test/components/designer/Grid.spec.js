import React from 'react';
import { shallow, mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { GridDesigner } from 'components/designer/Grid.jsx';

chai.use(chaiEnzyme());

describe('GridDesigner', () => {
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

  it('should have a rows even if there are no controls', () => {
    const grid = mount(<GridDesigner controls={[]} />);
    const children = grid.find('.grid').children();

    expect(children).to.have.length(1);
  });

  it('should create rows based on existing controls', () => {
    const grid = shallow(<GridDesigner controls={ formResourceControls } />);
    const children = grid.find('.grid').children();

    expect(children).to.have.length(1);
    expect(children.prop('rowData')).to.deep.eql(formResourceControls);
  });

  it('should create as many rows as needed to fit all the controls', () => {
    const formControls = formResourceControls.slice(0);
    formControls[2].properties.location.row = 2;

    const grid = shallow(<GridDesigner controls={ formControls } />);
    const children = grid.find('.grid').children();

    expect(children).to.have.length(3);
    expect(children.at(0).prop('rowData')).to.deep.eql([formControls[0], formControls[1]]);
    expect(children.at(1).prop('rowData')).to.deep.eql([]);
    expect(children.at(2).prop('rowData')).to.deep.eql([formControls[2]]);
  });

  it('should pass appropriate props to children', () => {
    const formControls = formResourceControls.slice(0);
    formControls[2].properties.location.row = 2;
    const grid = shallow(<GridDesigner controls={ formControls } />);
    const rows = grid.find('RowDesigner');

    expect(rows).to.have.length(3);
    expect(rows.at(0).prop('rowPosition')).to.eql(0);
    expect(rows.at(1).prop('rowPosition')).to.eql(1);
    expect(rows.at(2).prop('rowPosition')).to.eql(2);
  });
});
