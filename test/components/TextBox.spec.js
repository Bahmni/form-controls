import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { TextBox } from 'src/components/TextBox.jsx';
import sinon from 'sinon';
import constants from 'src/constants';

chai.use(chaiEnzyme());

describe.skip('TextBox', () => {
  before(() => {
    window.componentStore.registerComponent('text', TextBox);
  });

  after(() => {
    window.componentStore.deRegisterComponent('text');
  });

  const onChangeSpy = sinon.spy();

  it('should render TextBox', () => {
    const wrapper = shallow(
      <TextBox errors={[]} onChange={onChangeSpy} validations={[]} />
    );
    expect(wrapper).to.have.descendants('textarea');
    expect(wrapper.find('textarea').props().defaultValue).to.eql(undefined);
  });

  it('should render TextBox with errors if error is present', () => {
    const errors = [constants.validations.mandatory];
    const wrapper = shallow(
      <TextBox errors={errors} onChange={onChangeSpy} validations={[]} />
    );
    expect(wrapper.find('textarea')).to.have.className('form-builder-error');
  });

  it('should render TextBox with default value', () => {
    const wrapper = shallow(
      <TextBox errors={[]} onChange={onChangeSpy} validations={[]} value={'defaultText'} />
    );
    expect(wrapper.find('textarea').props().defaultValue).to.be.eql('defaultText');
  });

  it('should get user entered value of the text box', () => {
    const wrapper = shallow(
      <TextBox errors={[]} onChange={onChangeSpy} validations={[]} value={'defalutText'} />
    );
    wrapper.find('textarea').simulate('change', { target: { value: 'My new value' } });

    sinon.assert.calledOnce(onChangeSpy.withArgs('My new value', []));
  });

  it('should return undefined when value is empty string', () => {
    const wrapper = shallow(
      <TextBox errors={[]} onChange={onChangeSpy} validations={[]} />
    );
    wrapper.find('textarea').simulate('change', { target: { value: '  ' } });

    sinon.assert.calledOnce(onChangeSpy.withArgs(undefined, []));
  });

  it('should throw error on fail of validations', () => {
    const validations = [constants.validations.mandatory];

    const wrapper = shallow(
      <TextBox errors={[]} onChange={onChangeSpy} validations={validations} value={'defalutText'} />
    );
    wrapper.find('textarea').simulate('change', { target: { value: undefined } });
    sinon.assert.calledOnce(onChangeSpy.withArgs(undefined, [{ errorType: validations[0] }]));
    expect(wrapper.find('textarea')).to.have.className('form-builder-error');
  });
});
