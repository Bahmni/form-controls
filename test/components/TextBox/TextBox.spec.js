import React from 'react';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { TextBox } from 'src/components/TextBox/TextBox.jsx';
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
      <TextBox onChange={onChangeSpy} validate={false} validations={[]} />
    );
    expect(wrapper).to.have.descendants('textarea');
    expect(wrapper.find('textarea').props().defaultValue).to.eql(undefined);
  });

  it('should render TextBox with default value', () => {
    const wrapper = mount(
      <TextBox onChange={onChangeSpy} validate={false} validations={[]} value={'defaultText'} />
    );
    expect(wrapper.find('textarea').props().defaultValue).to.be.eql('defaultText');
  });

  it('should get user entered value of the text box', () => {
    const wrapper = mount(
      <TextBox onChange={onChangeSpy} validate={false} validations={[]} value={'defalutText'} />
    );
    wrapper.find('textarea').simulate('change', { target: { value: 'My new value' } });

    sinon.assert.calledOnce(onChangeSpy.withArgs('My new value', []));
  });

  it('should return undefined when value is empty string', () => {
    const wrapper = mount(
      <TextBox onChange={onChangeSpy} validate={false} validations={[]} />
    );
    wrapper.find('textarea').simulate('change', { target: { value: '  ' } });

    sinon.assert.calledOnce(onChangeSpy.withArgs(undefined, []));
  });

  it('should throw error on fail of validations', () => {
    const validations = [constants.validations.mandatory];

    const wrapper = mount(
      <TextBox
        onChange={onChangeSpy}
        validate={false}
        validations={validations}
        value={'defalutText'}
      />
    );
    const mandatoryError = new Error({ message: validations[0] });
    wrapper.find('textarea').simulate('change', { target: { value: undefined } });
    sinon.assert.calledOnce(onChangeSpy.withArgs(undefined, [mandatoryError]));
    expect(wrapper.find('textarea')).to.have.className('form-builder-error');
  });

  it('should throw error on fail of validations during component update', () => {
    const validations = [constants.validations.mandatory];

    const wrapper = mount(
      <TextBox
        onChange={onChangeSpy}
        validate={false}
        validations={validations}
        value={'defalutText'}
      />
    );
    const mandatoryError = new Error({ message: validations[0] });
    wrapper.setProps({ validate: true, value: undefined });
    sinon.assert.calledOnce(onChangeSpy.withArgs(undefined, [mandatoryError]));
    expect(wrapper.find('textarea')).to.have.className('form-builder-error');
  });

  it('should render TextBox on change of props', () => {
    const wrapper = mount(
      <TextBox
        onChange={onChangeSpy}
        validate={false}
        validations={[]}
        value={'defalutText'}
      />
    );
    wrapper.setProps({ value: 'someText' });
    expect(wrapper.find('textarea').props().defaultValue).to.be.eql('someText');
  });
});
