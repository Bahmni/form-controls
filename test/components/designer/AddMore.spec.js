import React from 'react';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { AddMoreDesigner } from 'src/components/designer/AddMore.jsx';

chai.use(chaiEnzyme());

describe('AddMore', () => {
  it('should render AddMore designer component', () => {
    const wrapper = mount(<AddMoreDesigner />);

    expect(wrapper.find('button').at(0).find('.fa-plus')).to.have.exactly(1).descendants('i');
    expect(wrapper.find('button').at(1).find('.fa-remove')).to.have.exactly(1).descendants('i');
  });
});
