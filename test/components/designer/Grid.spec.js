import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { GridDesigner } from 'components/designer/Grid.jsx';
import Constants from 'src/constants';


chai.use(chaiEnzyme());

describe('GridDesigner', () => {
  it('should have default number of cells', () => {
    const grid = shallow(<GridDesigner />);
    const children = grid.find('.grid').children();

    expect(children).to.have.length(Constants.Grid.defaultRowWidth);
  });

  it('should render given number of cells', () => {
    const grid = shallow(<GridDesigner columns={4} />);
    const children = grid.find('.grid').children();

    expect(children).to.have.length(4);
  });
});

