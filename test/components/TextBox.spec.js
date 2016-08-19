import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { TextBox } from '../../src/components/TextBox.jsx';

chai.use(chaiEnzyme());

describe('TextBox', () => {
  before(() => {
    window.componentStore.registerComponent('text', TextBox);
  });

  after(() => {
    window.componentStore.deRegisterComponent('text');
  });

  const metadata = {
    type: 'text',
  };
  const obs = {
    value: 'someValue',
  };

  it('should render TextBox', () => {
    const wrapper = shallow(<TextBox metadata={metadata} />);
    expect(wrapper.find('input').props().type).to.be.eql('text');
    expect(wrapper.find('input').props().defaultValue).to.eql(undefined);
  });

  it('should render TextBox with default value', () => {
    const wrapper = shallow(<TextBox metadata={metadata} obs={obs} />);
    expect(wrapper.find('input').props().type).to.be.eql('text');
    expect(wrapper.find('input').props().defaultValue).to.be.eql('someValue');
  });

  it('should return the default value of the text box if there is no change', () => {
    const wrapper = shallow(<TextBox metadata={metadata} obs={obs} />);
    const instance = wrapper.instance();
    expect(instance.getValue()).to.eql({ value: 'someValue' });
  });

  it('should get user entered value of the text box', () => {
    const wrapper = shallow(<TextBox metadata={metadata} obs={obs} />);
    const instance = wrapper.instance();
    wrapper.find('input').simulate('change', { target: { value: 'My new value' } });
    expect(instance.getValue()).to.eql({ value: 'My new value' });
  });

  it('should return value only if there was initial value or if the value was changed', () => {
    const wrapper = shallow(<TextBox metadata={metadata} />);
    const instance = wrapper.instance();
    expect(instance.getValue()).to.eql(undefined);
  });
});
