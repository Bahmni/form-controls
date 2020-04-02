import React from 'react';
import { mount, shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { DateTime } from 'src/components/DateTime.jsx';
import sinon from 'sinon';
import constants from 'src/constants';
import { Error } from 'src/Error';

chai.use(chaiEnzyme());

describe('DateTime', () => {
  let onChangeSpy;

  beforeEach(() => {
    onChangeSpy = sinon.spy();
  });

  it('should render DateTime', () => {
    const wrapper = shallow(
      <DateTime
        formFieldPath="test1.1/1-0"
        onChange={onChangeSpy}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );
    expect(wrapper).to.have.exactly(2).descendants('input');
    expect(wrapper.find('input').at(0).props().type).to.eql('date');
    expect(wrapper.find('input').at(1).props().type).to.eql('time');
  });

  it('should render Datetime with default value', () => {
    const wrapper = shallow(
      <DateTime
        formFieldPath="test1.1/1-0"
        onChange={onChangeSpy}
        validate={false}
        validateForm={false}
        validations={[]}
        value={'2016-12-29 22:30'}
      />
    );
    expect(wrapper.find('input').at(0).props().value).to.be.eql('2016-12-29');
    expect(wrapper.find('input').at(1).props().value).to.be.eql('22:30');
  });

  it('should get user entered value of the date time', () => {
    const wrapper = mount(
      <DateTime
        formFieldPath="test1.1/1-0"
        onChange={onChangeSpy}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );
    const error = new Error({ message: 'Incorrect Date Time' });
    wrapper.find('input').at(0).simulate('change', { target: { value: '2016-12-31' } });
    wrapper.find('input').at(1).simulate('change', { target: { value: '22:10' } });

    sinon.assert.callCount(onChangeSpy, 4);
    sinon.assert.calledWithMatch(onChangeSpy, { value: '2016-12-31 ', errors: [error] });
    sinon.assert.calledTwice(onChangeSpy.withArgs({ value: '2016-12-31 22:10', errors: [] }));
  });

  it('should return undefined when value is empty string', () => {
    const wrapper = shallow(
      <DateTime
        formFieldPath="test1.1/1-0"
        onChange={onChangeSpy}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );
    wrapper.find('input').at(0).simulate('change', { target: { value: '' } });
    wrapper.find('input').at(1).simulate('change', { target: { value: '' } });

    sinon.assert.calledTwice(onChangeSpy.withArgs({ value: undefined, errors: [] }));
  });

  it('should throw error on fail of validations', () => {
    const validations = [constants.validations.mandatory];

    const wrapper = shallow(
      <DateTime
        formFieldPath="test1.1/1-0"
        onChange={onChangeSpy}
        validate={false}
        validateForm={false}
        validations={validations}
        value={'2016-12-29 22:10'}
      />
    );
    const mandatoryError = new Error({ message: validations[0] });
    const dateTimeError = new Error({ message: 'Incorrect Date Time' });
    wrapper.find('input').at(0).simulate('change', { target: { value: '' } });

    sinon.assert.callCount(onChangeSpy, 1);

    sinon.assert.calledWithMatch(onChangeSpy, { value: ' 22:10',
      errors: [mandatoryError, dateTimeError] });
    expect(wrapper.find('input').at(0)).to.have.className('form-builder-error');
    expect(wrapper.find('input').at(1)).to.have.className('form-builder-error');
  });

  it('should throw error on fail of validations during component update', () => {
    const validations = [constants.validations.mandatory];

    const wrapper = mount(
      <DateTime
        formFieldPath="test1.1/1-0"
        onChange={onChangeSpy}
        validate={false}
        validateForm={false}
        validations={validations}
        value={'2016-12-29 22:10'}
      />
    );
    const mandatoryError = new Error({ message: validations[0] });
    wrapper.setProps({ validate: true, value: undefined });
    sinon.assert.called(onChangeSpy.withArgs({ value: undefined, errors: [mandatoryError] }));
    expect(wrapper.find('input').at(0)).to.have.className('form-builder-error');
    expect(wrapper.find('input').at(1)).to.have.className('form-builder-error');
  });

  it('should render DateTime on change of props', () => {
    const wrapper = shallow(
      <DateTime
        formFieldPath="test1.1/1-0"
        onChange={onChangeSpy}
        validate={false}
        validateForm={false}
        validations={[]}
        value={'2016-12-29 22:10'}
      />
    );
    wrapper.setProps({ validate: true, value: '2016-12-31 10:10' });
    expect(wrapper.find('input').at(0).props().value).to.be.eql('2016-12-31');
    expect(wrapper.find('input').at(1).props().value).to.be.eql('10:10');
  });

  it('should check errors after mount if the formFieldPath suffix is not 0', () => {
    const validations = [constants.validations.mandatory];
    const wrapper = mount(
      <DateTime
        formFieldPath="test1.1/1-1"
        onChange={onChangeSpy}
        validate={false}
        validateForm={false}
        validations={validations}
      />
    );

    expect(wrapper.find('input').at(0)).to.have.className('form-builder-error');
  });

  it('should not check errors after mount if the formFieldPath suffix is 0', () => {
    const validations = [constants.validations.mandatory];
    const wrapper = mount(
      <DateTime
        formFieldPath="test1.1/1-0"
        onChange={onChangeSpy}
        validate={false}
        validateForm={false}
        validations={validations}
      />
    );

    expect(wrapper.find('input').at(0)).to.not.have.className('form-builder-error');
  });

  it('should show as disabled when datetime is set to be disabled', () => {
    const wrapper = shallow(
      <DateTime
        enabled={false}
        formFieldPath="test1.1/1-0"
        onChange={() => {}}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );

    expect(wrapper.find('input').at(0).props().disabled).to.eql(true);
    expect(wrapper.find('input').at(1).props().disabled).to.eql(true);
  });

  it('should show as enabled when datetime is set to be enabled', () => {
    const wrapper = shallow(
      <DateTime
        enabled
        formFieldPath="test1.1/1-0"
        onChange={() => {}}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );

    expect(wrapper.find('input').at(0).props().disabled).to.eql(false);
    expect(wrapper.find('input').at(1).props().disabled).to.eql(false);
  });

  it('should trigger onChange when mounting component and the value is not undefined', () => {
    const wrapper = mount(
      <DateTime
        enabled
        formFieldPath="test1.1-0"
        onChange={onChangeSpy}
        validate={false}
        validateForm={false}
        validations={[]}
        value={'2016-12-29 22:10'}
      />
    );
    wrapper.instance();
    sinon.assert.calledOnce(onChangeSpy);
  });

  it('should trigger onChange when the value is changed', () => {
    const wrapper = mount(
      <DateTime
        formFieldPath="test1.1-0"
        onChange={onChangeSpy}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );

    wrapper.setProps({ value: '2016-12-29 22:10' });
    sinon.assert.calledOnce(onChangeSpy.withArgs({ value: '2016-12-29 22:10', errors: [] }));
  });
});
