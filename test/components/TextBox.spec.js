import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { TextBox } from 'components/TextBox';

chai.use(chaiEnzyme());

describe('TextBox', () => {
  it('should render TextBox when obs type is text', () => {
    const wrapper = shallow(<TextBox type="text" />);
    expect(wrapper.find('input').props().type).to.be.eql('text');
    expect(wrapper.find('input').props().defaultValue).to.be.eql(undefined);
  });

  it('should render TextBox with value when obs type is text', () => {
    const value = 'someValue';
    const wrapper = shallow(<TextBox type="text" value={value} />);
    expect(wrapper.find('input').props().type).to.be.eql('text');
    expect(wrapper.find('input').props().defaultValue).to.be.eql(value);
  });

  it('should render TextBox when obs type is numeric', () => {
    const wrapper = shallow(<TextBox type="numeric" />);
    expect(wrapper.find('input').props().type).to.be.eql('number');
    expect(wrapper.find('input').props().defaultValue).to.be.eql(undefined);
  });

  it('should render TextBox with value when obs type is numeric', () => {
    const value = '007';
    const wrapper = shallow(<TextBox type="numeric" value={value} />);
    expect(wrapper.find('input').props().type).to.be.eql('number');
    expect(wrapper.find('input').props().defaultValue).to.be.eql(value);
  });
});
