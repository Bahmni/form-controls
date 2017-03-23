import React from 'react';
import { mount, shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { NumericBox } from 'components/NumericBox.jsx';
import sinon from 'sinon';
import constants from 'src/constants';
import { Error } from 'src/Error';

chai.use(chaiEnzyme());

describe('NumericBox', () => {
  const onChangeSpy = sinon.spy();

  const validations = [constants.validations.allowDecimal, constants.validations.mandatory];

  it('should render NumericBox', () => {
    const concept = {};
    const wrapper = shallow(
      <NumericBox
        concept={concept}
        onChange={onChangeSpy}
        validate={false}
        validations={[]}
      />
    );
    expect(wrapper.find('input').props().type).to.be.eql('number');
    expect(wrapper.find('input')).to.have.value(undefined);
  });


  it('should render NumericBox with default value', () => {
    const concept = {};
    const wrapper = mount(
      <NumericBox
        concept={concept}
        onChange={onChangeSpy}
        validate={false} validations={[]}
        value={'50'}
      />
    );
    expect(wrapper.find('input').props().type).to.be.eql('number');
    expect(wrapper.find('input')).to.have.value('50');
  });

  it('should get user entered value of the NumericBox', () => {
    const concept = {};
    const wrapper = mount(
      <NumericBox
        concept={concept}
        onChange={onChangeSpy}
        validate={false}
        validations={[]}
        value={'50'}
      />
    );
    wrapper.find('input').simulate('change', { target: { value: '999' } });
    sinon.assert.calledOnce(onChangeSpy.withArgs('999', []));
  });

  it('should throw error on fail of validations', () => {
    const concept = {};
    const wrapper = mount(
      <NumericBox
        concept={concept}
        onChange={onChangeSpy}
        validate={false}
        validations={validations}
      />
    );
    const allowDecimalError = new Error({ message: validations[0] });
    wrapper.find('input').simulate('change', { target: { value: '50.32' } });
    sinon.assert.calledOnce(onChangeSpy.withArgs('50.32', [allowDecimalError]));
    expect(wrapper.find('input')).to.have.className('form-builder-error');
  });

  it('should validate Numeric box when validate is set to true', () => {
    const concept = {};
    const wrapper = mount(
      <NumericBox
        concept={concept}
        onChange={onChangeSpy}
        validate={false}
        validations={validations}
      />
    );
    wrapper.setProps({ validate: true, value: '98.6' });
    expect(wrapper.find('input')).to.have.className('form-builder-error');
  });

  it('should check errors after mount if the formFieldPath suffix is not 0', () => {
    const concept = {};
    const wrapper = mount(
      <NumericBox
        concept={concept}
        onChange={onChangeSpy}
        validate={false}
        validations={validations}
        formFieldPath="testForm.1/1-1"
      />
    );

    expect(wrapper.find('input')).to.have.className('form-builder-error');
  });

  it('should not check errors after mount if the formFieldPath suffix is 0', () => {
    const concept = {};
    const wrapper = mount(
      <NumericBox
        concept={concept}
        onChange={onChangeSpy}
        validate={false}
        validations={validations}
        formFieldPath="testForm.1/1-0"
      />
    );
    expect(wrapper.find('input')).to.not.have.className('form-builder-error');
  });

  it('should throw warning when the value is not in correct range', () => {
    const numericContext = { hiNormal: 50, lowNormal: 20 };
    const wrapper = mount(
        <NumericBox
          {...numericContext}
          onChange={onChangeSpy}
          validate={false}
          validations={validations}
        />
    );
    const allowRangeWarning = new Error({
      type: constants.errorTypes.warning,
      message: constants.validations.allowRange,
    });
    wrapper.find('input').simulate('change', { target: { value: '51' } });
    sinon.assert.calledOnce(onChangeSpy.withArgs('51', [allowRangeWarning]));
  });

  it('should throw error when the value is not in correct range and the ' +
    'values for hiAbsolute and lowAbsolute is provided', () => {
    const numericContext = { hiAbsolute: 50, lowAbsolute: 20 };
    const wrapper = mount(
      <NumericBox
        {...numericContext}
        onChange={onChangeSpy}
        validate={false}
        validations={validations}
        value={'21'}
      />
    );
    const allowRangeError = new Error({
      type: constants.errorTypes.error,
      message: constants.validations.minMaxRange,
    });

    wrapper.find('input').simulate('change', { target: { value: '51' } });
    sinon.assert.calledOnce(onChangeSpy.withArgs('51', [allowRangeError]));
  });

  it('should set the input value when the value of the numeric box is calculated', () => {
    const wrapper = mount(
      <NumericBox
        onChange={onChangeSpy}
        validate={false}
        validations={validations}
        value={'22'}
      />
    );

    wrapper.setProps({ value: '10' });
    expect(wrapper.find('input')).to.have.value('10');
  });

  it('should not set the input value when the value of the numeric box is not calculated', () => {
    const wrapper = mount(
      <NumericBox
        onChange={onChangeSpy}
        validate={false}
        validations={validations}
        value={'23'}
      />
    );
    const instance = wrapper.instance();
    const spy = sinon.spy(instance, 'updateInputByPropsValue');
    wrapper.find('input').simulate('change', { target: { value: '23.5' } });
    wrapper.find('input').simulate('change', { target: { value: '23.' } });

    sinon.assert.notCalled(spy);
  });

  it('should not update component when the decimal point is input after a integer', () => {
    const wrapper = mount(
      <NumericBox
        onChange={onChangeSpy}
        validate={false}
        validations={validations}
        value={'22'}
      />
    );
    const instance = wrapper.instance();
    const spy = sinon.spy(instance, 'componentDidUpdate');
    wrapper.find('input').simulate('change', { target: { value: '22.' } });

    sinon.assert.notCalled(spy);
  });
});
