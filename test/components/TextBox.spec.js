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

  const concept = {
    uuid: '70645842-be6a-4974-8d5f-45b52990e132',
    name: 'Pulse',
    dataType: 'Text',
  };

  const metadata = {
    id: '100',
    type: 'text',
    concept,
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
    const expectedObs = {
      concept,
      value: 'someValue',
    };

    const wrapper = shallow(<TextBox metadata={metadata} obs={obs} />);
    const instance = wrapper.instance();

    expect(instance.getValue()).to.eql(expectedObs);
  });

  it('should get user entered value of the text box', () => {
    const expectedObs = {
      concept,
      value: 'My new value',
    };

    const wrapper = shallow(<TextBox metadata={metadata} obs={obs} />);
    const instance = wrapper.instance();
    wrapper.find('input').simulate('change', { target: { value: 'My new value' } });

    expect(instance.getValue()).to.eql(expectedObs);
  });

  it('should return value only if there was initial value or if the value was changed', () => {
    const wrapper = shallow(<TextBox metadata={metadata} />);
    const instance = wrapper.instance();
    expect(instance.getValue()).to.eql(undefined);
  });
});
