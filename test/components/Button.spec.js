import React from 'react';
import { shallow, mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { Button } from 'components/Button.jsx';
import sinon from 'sinon';
import constants from 'src/constants';

chai.use(chaiEnzyme());

describe('Button Component', () => {
  const value = { name: 'Yes', value: true };
  const options = [
    { name: 'Yes', value: true },
    { name: 'No', value: false },
  ];

  let valueChangeSpy;

  beforeEach(() => {
    valueChangeSpy = sinon.spy();
  });

  it('should render button component', () => {
    const wrapper = shallow(
      <Button
        formFieldPath="test1.1/1-0"
        onValueChange={valueChangeSpy}
        options={options}
        validate={false}
        validations={[]}
      />
    );
    expect(wrapper).to.have.exactly(2).descendants('button');

    expect(wrapper.find('button').at(0).text()).to.eql('Yes');
    expect(wrapper.find('button').at(1).text()).to.eql('No');

    expect(wrapper.find('button').at(0)).to.have.className('fl');
    expect(wrapper.find('button').at(1)).to.have.className('fl');

    expect(wrapper).to.have.className('form-control-buttons');
  });

  it('should render button with default value', () => {
    const wrapper = shallow(
     <Button
       formFieldPath="test1.1/1-0"
       onValueChange={valueChangeSpy}
       options={options}
       validate={false}
       validations={[]}
       value={value}
     />
    );
    expect(wrapper.find('button').at(0)).to.have.className('fl active');
    expect(wrapper.find('button').at(1)).to.have.className('fl');
  });

  it('should check errors after mount if the formFieldPath suffix is not 0', () => {
    const wrapper = shallow(
      <Button
        formFieldPath="test1.1/1-1"
        onValueChange={valueChangeSpy}
        options={options}
        validate
        validations={[constants.validations.mandatory]}
      />
    );

    expect(wrapper.find('div')).to.have.className('form-builder-error');
  });

  it('should not check errors after mount if the formFieldPath suffix is 0', () => {
    const wrapper = shallow(
      <Button
        formFieldPath="test1.1/1-0"
        onValueChange={valueChangeSpy}
        options={options}
        validate={false}
        validations={[]}
      />
    );

    expect(wrapper.find('div')).to.not.have.className('form-builder-error');
  });

  it('should change the value on click', () => {
    const wrapper = shallow(
      <Button
        formFieldPath="test1.1/1-0"
        onValueChange={valueChangeSpy}
        options={options}
        validate={false}
        validations={[]}
        value={value}
      />
    );
    expect(wrapper.find('button').at(0)).to.have.className('fl active');
    expect(wrapper.find('button').at(1)).to.have.className('fl');

    wrapper.find('button').at(1).simulate('click');
    sinon.assert.calledOnce(valueChangeSpy.withArgs(options[1], []));

    wrapper.setProps({ value: options[1] });
    expect(wrapper.find('button').at(0)).to.have.className('fl');
    expect(wrapper.find('button').at(1)).to.have.className('fl active');
  });

  it('should change the value to undefined if double clicked', () => {
    const wrapper = shallow(
      <Button
        formFieldPath="test1.1/1-0"
        onValueChange={valueChangeSpy}
        options={options}
        validate={false}
        validations={[]}
      />
    );
    wrapper.find('button').at(1).simulate('click');
    sinon.assert.calledOnce(valueChangeSpy.withArgs(options[1], []));

    wrapper.setProps({ value: options[1] });

    wrapper.find('button').at(1).simulate('click');
    sinon.assert.calledOnce(valueChangeSpy.withArgs(undefined, []));
  });

  it('should throw validation error on change if present', () => {
    const validations = [constants.validations.mandatory];
    const wrapper = shallow(
      <Button
        formFieldPath="test1.1/1-0"
        onValueChange={valueChangeSpy}
        options={options}
        validate={false}
        validations={validations}
      />
    );
    wrapper.find('button').at(1).simulate('click');
    expect(wrapper).to.have.className('form-control-buttons');

    wrapper.setProps({ value: options[1] });

    wrapper.find('button').at(1).simulate('click');
    expect(wrapper).to.have.className('form-control-buttons form-builder-error');
  });

  it('should not reRender if value is same', () => {
    const wrapper = shallow(
      <Button
        formFieldPath="test1.1/1-0"
        onValueChange={valueChangeSpy}
        options={options}
        validate={false}
        validations={[]}
        value={value}
      />
    );
    expect(wrapper.find('button').at(0)).to.have.className('fl active');
    expect(wrapper.find('button').at(1)).to.have.className('fl');

    wrapper.setProps({ value: { name: 'Yes', value: true } });

    expect(wrapper.find('button').at(0)).to.have.className('fl active');
    expect(wrapper.find('button').at(1)).to.have.className('fl');
  });

  it('should validate Button when validate is set to true', () => {
    const validations = [constants.validations.mandatory];
    const onChangeMockObj = { onValueChange: () => {} };
    const onChangeMock = sinon.mock(onChangeMockObj);
    onChangeMock.expects('onValueChange').once().withArgs(undefined, [{ errorType: 'mandatory' }]);
    const wrapper = mount(
      <Button
        formFieldPath="test1.1/1-0"
        onValueChange={valueChangeSpy}
        options={options}
        validate={false}
        validations={validations}
        value
      />
    );
    wrapper.setProps({ validate: true, value: undefined });
    expect(wrapper).to.have.className('form-control-buttons');
    expect(wrapper).to.have.className('form-builder-error');
  });

  it('should reRender on change of value', () => {
    const wrapper = shallow(
      <Button
        formFieldPath="test1.1/1-0"
        onValueChange={valueChangeSpy}
        options={options}
        validate={false}
        validations={[]}
        value={value}
      />
    );
    expect(wrapper.find('button').at(0)).to.have.className('fl active');
    expect(wrapper.find('button').at(1)).to.have.className('fl');

    wrapper.setProps({ value: undefined });

    expect(wrapper.find('button').at(0)).to.have.className('fl');
    expect(wrapper.find('button').at(1)).to.have.className('fl');

    wrapper.setProps({ value: { name: 'No', value: false } });

    expect(wrapper.find('button').at(0)).to.have.className('fl');
    expect(wrapper.find('button').at(1)).to.have.className('fl active');
  });

  it('should render button with multiple values', () => {
    const wrapper = shallow(
      <Button
        formFieldPath="test1.1/1-0"
        multiSelect
        onValueChange={valueChangeSpy}
        options={options}
        validate={false}
        validations={[]}
        value={options}
      />
    );
    expect(wrapper.find('button').at(0)).to.have.className('fl active');
    expect(wrapper.find('button').at(1)).to.have.className('fl active');
  });

  it('should change the value on click for multiselect', () => {
    const wrapper = shallow(
      <Button
        formFieldPath="test1.1/1-0"
        multiSelect
        onValueChange={valueChangeSpy}
        options={options}
        validate={false}
        validations={[]}
        value={undefined}
      />
    );
    expect(wrapper.find('button').at(0)).to.have.className('fl');
    expect(wrapper.find('button').at(1)).to.have.className('fl');

    wrapper.find('button').at(1).simulate('click');
    sinon.assert.calledOnce(valueChangeSpy.withArgs([options[1]], []));

    wrapper.setProps({ value: [options[1]] });
    expect(wrapper.find('button').at(0)).to.have.className('fl');
    expect(wrapper.find('button').at(1)).to.have.className('fl active');
  });

  it('should return empty array when chosen value is deselected', () => {
    const wrapper = shallow(
      <Button
        formFieldPath="test1.1/1-0"
        multiSelect
        onValueChange={valueChangeSpy}
        options={options}
        validate={false}
        validations={[]}
        value={[options[0]]}
      />
    );
    expect(wrapper.find('button').at(0)).to.have.className('fl active');
    expect(wrapper.find('button').at(1)).to.have.className('fl');

    wrapper.find('button').at(0).simulate('click');
    sinon.assert.calledOnce(valueChangeSpy.withArgs([], []));
  });

  it('should take value based on the valueKey specified', () => {
    const optionsWithoutValueKey = [
      { name: 'Yes' },
      { name: 'No' },
    ];

    const wrapper = shallow(
        <Button
          formFieldPath="test1.1/1-0"
          onValueChange={valueChangeSpy}
          options={optionsWithoutValueKey}
          validate={false}
          validations={[]}
          value={{ name: 'Yes' }}
          valueKey={'name' }
        />
    );
    expect(wrapper.find('button').at(0)).to.have.className('fl active');
    expect(wrapper.find('button').at(1)).to.have.className('fl');

    wrapper.find('button').at(1).simulate('click');
    sinon.assert.calledOnce(valueChangeSpy.withArgs(optionsWithoutValueKey[1], []));
  });

  it('should update component when the value of enable is changed', () => {
    const wrapper = mount(
      <Button
        enabled
        formFieldPath="test1.1-0"
        onChange={() => {}}
        onValueChange={() => {}}
        options={[]}
        validate={false}
        validations={[]}
      />
    );
    const instance = wrapper.instance();
    const componentUpdatedSpy = sinon.spy(instance, 'componentDidUpdate');

    wrapper.setProps({ enabled: false });

    sinon.assert.calledOnce(componentUpdatedSpy);
  });

  it('should trigger onChange when mounting component and the value is not undefined', () => {
    const onChangeSpy = sinon.spy();
    const wrapper = mount(
      <Button
        enabled
        formFieldPath="test1.1-0"
        onValueChange={onChangeSpy}
        validate={false}
        validations={[]}
        value={value}
      />
    );
    wrapper.instance();
    sinon.assert.calledOnce(onChangeSpy);
  });
});
