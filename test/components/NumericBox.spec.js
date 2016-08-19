import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { NumericBox } from 'components/NumericBox.jsx';

chai.use(chaiEnzyme());

describe('NumericBox', () => {
  before(() => {
    window.componentStore.registerComponent('numeric', NumericBox);
  });

  after(() => {
    window.componentStore.deRegisterComponent('numeric');
  });

  const metadata = {
    type: 'numeric',
  };
  const obs = {
    value: '007',
  };

  it('should render NumericBox', () => {
    const wrapper = shallow(<NumericBox metadata={metadata} />);
    expect(wrapper.find('input').props().type).to.be.eql('number');
    expect(wrapper.find('input').props().defaultValue).to.be.eql(undefined);
  });

  it('should render NumericBox with default value', () => {
    const wrapper = shallow(<NumericBox metadata={metadata} obs={obs} />);
    expect(wrapper.find('input').props().type).to.be.eql('number');
    expect(wrapper.find('input').props().defaultValue).to.be.eql('007');
  });

  it('should get the default value of the NumericBox if there is no change', () => {
    const wrapper = shallow(<NumericBox metadata={metadata} obs={obs} />);
    const instance = wrapper.instance();
    expect(instance.getValue()).to.eql({ value: '007' });
  });

  it('should get user entered value of the NumericBox', () => {
    const wrapper = shallow(<NumericBox metadata={metadata} obs={obs} />);
    const instance = wrapper.instance();
    wrapper.find('input').simulate('change', { target: { value: 'My new value' } });
    expect(instance.getValue()).to.eql({ value: 'My new value' });
  });

  it('should return value only if there was initial value or if the value was changed', () => {
    const wrapper = shallow(<NumericBox metadata={metadata} />);
    const instance = wrapper.instance();
    expect(instance.getValue()).to.eql(undefined);
  });
});
