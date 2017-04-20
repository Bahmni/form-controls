import React from 'react';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { TextBox } from 'src/components/TextBox.jsx';
import sinon from 'sinon';
import constants from 'src/constants';
import { Error } from 'src/Error';

chai.use(chaiEnzyme());

describe('TextBox', () => {
  let onChangeSpy;

  beforeEach(() => {
    onChangeSpy = sinon.spy();
  });

  it('should render TextBox', () => {
    const wrapper = mount(
      <TextBox
        formFieldPath="test1.1/1-0"
        onChange={onChangeSpy}
        validate={false}
        validations={[]}
      />
    );
    expect(wrapper).to.have.descendants('textarea');
    expect(wrapper.find('textarea').props().defaultValue).to.eql(undefined);
  });

  it('should render TextBox with default value', () => {
    const wrapper = mount(
      <TextBox
        formFieldPath="test1.1/1-0"
        onChange={onChangeSpy}
        validate={false}
        validations={[]}
        value={'defaultText'}
      />
    );
    expect(wrapper.find('textarea').props().value).to.be.eql('defaultText');
  });

  it('should get user entered value of the text box', () => {
    const wrapper = mount(
      <TextBox
        formFieldPath="test1.1/1-0"
        onChange={onChangeSpy}
        validate={false}
        validations={[]}
        value={'defalutText'}
      />
    );
    wrapper.find('textarea').simulate('change', { target: { value: 'My new value' } });
    sinon.assert.called(onChangeSpy.withArgs('My new value', []));
  });

  it('should return undefined when value is empty string', () => {
    const wrapper = mount(
      <TextBox
        formFieldPath="test1.1/1-0"
        onChange={onChangeSpy}
        validate={false}
        validations={[]}
      />
    );
    wrapper.find('textarea').simulate('change', { target: { value: '  ' } });

    sinon.assert.called(onChangeSpy.withArgs(undefined, []));
  });

  it('should return whole value when given value with spaces but not empty string', () => {
    const wrapper = mount(
      <TextBox
        formFieldPath="test1.1/1-0"
        onChange={onChangeSpy}
        validate={false}
        validations={[]}
      />
    );
    const valueWithSpaces = ' abc efg ';
    wrapper.find('textarea').simulate('change', { target: { value: valueWithSpaces } });

    sinon.assert.called(onChangeSpy.withArgs(valueWithSpaces, []));
  });

  it('should throw error on fail of validations', () => {
    const validations = [constants.validations.mandatory];

    const wrapper = mount(
      <TextBox
        formFieldPath="test1.1/1-0"
        onChange={onChangeSpy}
        validate={false}
        validations={validations}
        value={'defalutText'}
      />
    );
    const mandatoryError = new Error({ message: validations[0] });
    wrapper.find('textarea').simulate('change', { target: { value: undefined } });
    sinon.assert.called(onChangeSpy.withArgs(undefined, [mandatoryError]));
    expect(wrapper.find('textarea')).to.have.className('form-builder-error');
  });

  it('should throw error on fail of validations during component update', () => {
    const validations = [constants.validations.mandatory];

    const wrapper = mount(
      <TextBox
        formFieldPath="test1.1/1-0"
        onChange={onChangeSpy}
        validate={false}
        validations={validations}
        value={'defalutText'}
      />
    );
    const mandatoryError = new Error({ message: validations[0] });
    wrapper.setProps({ validate: true, value: undefined });
    sinon.assert.called(onChangeSpy.withArgs(undefined, [mandatoryError]));
    expect(wrapper.find('textarea')).to.have.className('form-builder-error');
  });

  it('should render TextBox on change of props', () => {
    const wrapper = mount(
      <TextBox
        formFieldPath="test1.1/1-0"
        onChange={onChangeSpy}
        validate={false}
        validations={[]}
        value={'defalutText'}
      />
    );
    wrapper.setProps({ value: 'someText' });
    expect(wrapper.find('textarea').props().value).to.be.eql('someText');
  });

  it('should check errors after mount if the formFieldPath suffix is not 0', () => {
    const validations = [constants.validations.mandatory];
    const wrapper = mount(
      <TextBox
        formFieldPath="test1.1/1-1"
        onChange={onChangeSpy}
        validate={false}
        validations={validations}
      />
    );

    expect(wrapper.find('textarea')).to.have.className('form-builder-error');
  });

  it('should not check errors after mount if the formFieldPath suffix is 0', () => {
    const validations = [constants.validations.mandatory];
    const wrapper = mount(
      <TextBox
        formFieldPath="test1.1/1-0"
        onChange={onChangeSpy}
        validate={false}
        validations={validations}
      />
    );

    expect(wrapper.find('textarea')).to.not.have.className('form-builder-error');
  });

  it('should check disabled attribute when enabled prop is false', () => {
    const wrapper = mount(
      <TextBox
        enabled={false}
        formFieldPath="test1.1/1-0"
        onChange={onChangeSpy}
        validate={false}
        validations={[]}
      />
    );

    expect(wrapper.find('textarea').props().disabled).to.equal(true);
  });

  it('should not check disabled attribute when enabled prop is true', () => {
    const wrapper = mount(
      <TextBox
        enabled
        formFieldPath="test1.1/1-0"
        onChange={onChangeSpy}
        validate={false}
        validations={[]}
      />
    );

    expect(wrapper.find('textarea').props().disabled).to.equal(false);
  });

  it('should trigger onChange when mounting component and the value is not undefined', () => {
    const wrapper = mount(
      <TextBox
        enabled
        formFieldPath="test1.1-0"
        onChange={onChangeSpy}
        validate={false}
        validations={[]}
        value={'defaultText'}
      />
    );
    wrapper.instance();
    sinon.assert.calledOnce(onChangeSpy);
  });
});
