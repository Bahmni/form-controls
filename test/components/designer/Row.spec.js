import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { RowDesigner } from 'components/designer/Row.jsx';
import Constants from 'src/constants';


chai.use(chaiEnzyme());

describe('Row', () => {
  it('should render the default number of cells', () => {
    const rowDesigner = shallow(<RowDesigner onChange={() => {}} />);

    const row = rowDesigner.find('.row0');

    expect(row.children()).to.have.length(Constants.Grid.defaultRowWidth);
  });

  it('should render specified number of cells', () => {
    const rowDesigner = shallow(<RowDesigner columns={2} onChange={() => {}} rowPosition={1} />);

    const row = rowDesigner.find('.row1');

    expect(row.children()).to.have.length(2);
  });
});
