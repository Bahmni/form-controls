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

  const concept = {
    uuid: '70645842-be6a-4974-8d5f-45b52990e132',
    name: 'Pulse',
    dataType: 'Text',
  };

  const metadata = {
    type: 'numeric',
    concept,
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
    const expectedObs = {
      concept,
      value: '007',
    };
    const wrapper = shallow(<NumericBox metadata={metadata} obs={obs} />);
    const instance = wrapper.instance();
    expect(instance.getValue()).to.eql(expectedObs);
  });

  it('should get user entered value of the NumericBox', () => {
    const expectedObs = {
      concept,
      value: '999',
    };
    const wrapper = shallow(<NumericBox metadata={metadata} obs={obs} />);
    const instance = wrapper.instance();
    wrapper.find('input').simulate('change', { target: { value: '999' } });
    expect(instance.getValue()).to.eql(expectedObs);
  });

  it('should return value only if there was initial value or if the value was changed', () => {
    const wrapper = shallow(<NumericBox metadata={metadata} />);
    const instance = wrapper.instance();
    expect(instance.getValue()).to.eql(undefined);
  });
});
