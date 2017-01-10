import React from 'react';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { AddMoreDesigner } from 'src/components/designer/AddMore.jsx';

chai.use(chaiEnzyme());

describe('AddMore', () => {
  it('should render AddMore designer component', () => {
    const wrapper = mount(<AddMoreDesigner />);

    expect(wrapper.find('button').at(0).text()).to.be.eql('+');
    expect(wrapper.find('button').at(1).text()).to.be.eql('-');
  });
});
