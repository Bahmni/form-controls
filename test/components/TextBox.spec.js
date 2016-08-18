import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { TextBox } from '../../src/components/TextBox.jsx';

chai.use(chaiEnzyme());

describe('TextBox', () => {
  describe('with type text', () => {
    it('should render TextBox', () => {
      const wrapper = shallow(<TextBox id="textBox1" type="text" />);
      expect(wrapper.find('input').props().type).to.be.eql('text');
      expect(wrapper.find('input').props().defaultValue).to.be.eql(undefined);
    });

    it('should render TextBox with default-value', () => {
      const defaultValue = 'someValue';
      const wrapper = shallow(<TextBox id="textBox1" type="text" value={defaultValue} />);
      expect(wrapper.find('input').props().type).to.be.eql('text');
      expect(wrapper.find('input').props().defaultValue).to.be.eql(defaultValue);
    });

    it('should return the default value of the text box if there is no change', () => {
      const value = 'someValue';
      const wrapper = shallow(<TextBox id="textBox1" type="text" value={value} />);
      const instance = wrapper.instance();
      expect(instance.getValue()).to.eql({ id: 'textBox1', value: 'someValue' });
    });

    it('should get user entered value of the text box', () => {
      const value = 'someValue';
      const wrapper = shallow(<TextBox id="textBox1" type="text" value={value} />);
      const instance = wrapper.instance();
      wrapper.find('input').simulate('change', { target: { value: 'My new value' } });
      expect(instance.getValue()).to.eql({ id: 'textBox1', value: 'My new value' });
    });
  });

  describe('with type numeric', () => {
    it('should render TextBox', () => {
      const wrapper = shallow(<TextBox id="textBox1" type="numeric" />);
      expect(wrapper.find('input').props().type).to.be.eql('number');
      expect(wrapper.find('input').props().defaultValue).to.be.eql(undefined);
    });

    it('should render TextBox with default-value', () => {
      const defaultValue = '007';
      const wrapper = shallow(<TextBox id="textBox1" type="numeric" value={defaultValue} />);
      expect(wrapper.find('input').props().type).to.be.eql('number');
      expect(wrapper.find('input').props().defaultValue).to.be.eql(defaultValue);
    });
  });

  it('should get the default value of the text box if there is no change', () => {
    const value = '007';
    const wrapper = shallow(<TextBox id="textBox1" type="numeric" value={value} />);
    const instance = wrapper.instance();
    expect(instance.getValue()).to.eql({ id: 'textBox1', value: '007' });
  });

  it('should get user entered value of the text box', () => {
    const wrapper = shallow(<TextBox id="textBox1" type="numeric" value="007" />);
    const instance = wrapper.instance();
    wrapper.find('input').simulate('change', { target: { value: 'My new value' } });
    expect(instance.getValue()).to.eql({ id: 'textBox1', value: 'My new value' });
  });
});
