import React from 'react';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { DropDown } from '../../src/components/DropDown.jsx';
import sinon from 'sinon';
import constants from 'src/constants';
import { Error } from 'src/Error';

chai.use(chaiEnzyme());

describe('DropDown', () => {
  const options = [
    { name: 'one', value: 'One' },
    { name: 'two', value: 'Two' },
    { name: 'three', value: 'Three' },
  ];

  const onValueChangeSpy = sinon.spy();

  it('should render DropDown', () => {
    const wrapper = mount(
      <DropDown
        formFieldPath="test1.1/1-0"
        onValueChange={onValueChangeSpy}
        options={options}
      />);
    expect(wrapper.find('Select').props().valueKey).to.be.eql('uuid');
    expect(wrapper.find('Select').props().labelKey).to.be.eql('display');
    expect(wrapper.find('Select').props().options).to.be.eql(options);
  });

  it('should render DropDown with default value', () => {
    const wrapper = mount(
      <DropDown
        formFieldPath="test1.1/1-0"
        onValueChange={onValueChangeSpy}
        options={options}
        value={options[0]}
      />);
    expect(wrapper.find('Select').props().options).to.be.eql(options);
    expect(wrapper.find('Select').props().value).to.be.eql(options[0]);
  });

  it('should return the selected value from the DropDown', () => {
    const onSelectSpy = sinon.spy();
    const wrapper = mount(
      <DropDown
        formFieldPath="test1.1/1-0"
        onValueChange={onSelectSpy}
        options={options}
      />);

    const onChange = wrapper.find('Select').props().onChange;
    onChange(options[1]);
    wrapper.update();
    expect(wrapper.find('Select').props().value).to.eql(options[1]);
  });

  it('should call onSelect method of props on change', () => {
    const onValueChange = sinon.spy();
    const wrapper = mount(
      <DropDown
        formFieldPath="test1.1/1-0"
        onValueChange={onValueChange}
        options={options}
      />);
    const onChange = wrapper.find('Select').props().onChange;
    onChange(options[0]);
    sinon.assert.calledOnce(onValueChange.withArgs(options[0], []));
  });

  it('should change value on change of props', () => {
    const wrapper = mount(
      <DropDown
        formFieldPath="test1.1/1-0"
        onValueChange={onValueChangeSpy}
        options={options}
        value={options[0]}
      />);
    wrapper.setProps({ value: options[1] });
    expect(wrapper.find('Select').props().value).to.eql(options[1]);
  });

  it('should pass enable value from props to the Select Component', () => {
    const wrapper = mount(
      <DropDown
        enabled
        formFieldPath="test1.1/1-0"
        onValueChange={onValueChangeSpy}
        options={options}
        value={options[0]}
      />);
    expect(wrapper.find('Select').props().disabled).to.be.eql(false);
  });

  it('should run the validations for DropDown', () => {
    const onValueChange = sinon.spy();
    const validations = [constants.validations.mandatory];
    const wrapper = mount(
      <DropDown
        formFieldPath="test1.1/1-0"
        onValueChange={onValueChange}
        options={options}
        validations={validations}
        value={options[0]}
      />);

    const onChange = wrapper.find('Select').props().onChange;
    onChange(undefined);
    const mandatoryError = new Error({ message: constants.validations.mandatory });
    sinon.assert.calledTwice(onValueChange.withArgs(undefined, [mandatoryError]));
  });
});
