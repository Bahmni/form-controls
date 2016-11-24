import React from 'react';
import { shallow, mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { TextBox } from 'src/components/TextBox.jsx';
import sinon from 'sinon';
import constants from 'src/constants';

chai.use(chaiEnzyme());

describe('TextBox', () => {
  before(() => {
    window.componentStore.registerComponent('text', TextBox);
  });

  after(() => {
    window.componentStore.deRegisterComponent('text');
  });

  const onChangeSpy = sinon.spy();

  it('should render TextBox', () => {
    const wrapper = shallow(
      <TextBox onChange={ onChangeSpy } validations={ [] } />
    );
    expect(wrapper).to.have.descendants('textarea');
    expect(wrapper.find('textarea').props().defaultValue).to.eql(undefined);
  });

  it('should render TextBox with default value', () => {
    const wrapper = shallow(
      <TextBox onChange={ onChangeSpy } validations={ [] } value={'defaultText'} />
    );
    expect(wrapper.find('textarea').props().defaultValue).to.be.eql('defaultText');
  });

  it('should get user entered value of the text box', () => {
    const wrapper = shallow(
      <TextBox onChange={ onChangeSpy } validations={ [] } value={'defalutText'} />
    );
    wrapper.find('textarea').simulate('change', { target: { value: 'My new value' } });

    sinon.assert.calledOnce(onChangeSpy.withArgs('My new value', []));
  });

  it('should return undefined when value is empty string', () => {
    const wrapper = shallow(
      <TextBox onChange={ onChangeSpy } validations={ [] } />
    );
    wrapper.find('textarea').simulate('change', { target: { value: '  ' } });

    sinon.assert.calledOnce(onChangeSpy.withArgs(undefined, []));
  });

  it('should throw error on fail of validations', () => {
    const validations = [constants.validations.mandatory];

    const wrapper = shallow(
      <TextBox
        onChange={onChangeSpy}
        validations={validations}
        value={'defaultText'}
      />
    );
    wrapper.find('textarea').simulate('change', { target: { value: undefined } });
    sinon.assert.calledOnce(onChangeSpy.withArgs(undefined, [{ errorType: validations[0] }]));
    expect(wrapper.find('textarea')).to.have.className('form-builder-error');
  });

  it('should throw error on fail of validations during component update', () => {
    const onChangeMockObj = { onChange: () => {}};
    const onChangeMock = sinon.mock(onChangeMockObj);

    const validations = [constants.validations.mandatory];
    onChangeMock.expects('onChange').once().withArgs(undefined, [{ errorType: validations[0] }]);

    const wrapper = mount(
      <TextBox
        onChange={onChangeMockObj.onChange}
        validations={validations}
        value={'defaultText'}
      />
    );
    wrapper.setProps({ value: undefined });
    onChangeMock.verify();
    expect(wrapper.find('textarea')).to.have.className('form-builder-error');
  });

  it('should render TextBox on change of props', () => {
    const wrapper = shallow(
      <TextBox
        onChange={onChangeSpy}
        validations={[]}
        value={'defalutText'}
      />
    );
    wrapper.setProps({ value: 'someText' });
    expect(wrapper.find('textarea').props().defaultValue).to.be.eql('someText');
  });
});
