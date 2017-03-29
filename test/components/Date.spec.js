import React from 'react';
import { mount, shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { Date } from 'src/components/Date.jsx';
import sinon from 'sinon';
import constants from 'src/constants';
import { Error } from 'src/Error';

chai.use(chaiEnzyme());

describe('Date', () => {
  let onChangeSpy;

  beforeEach(() => {
    onChangeSpy = sinon.spy();
  });

  it('should render Date', () => {
    const wrapper = shallow(
      <Date
        formFieldPath="test1.1/1-0"
        onChange={onChangeSpy}
        validate={false}
        validations={[]}
      />
    );
    expect(wrapper).to.have.descendants('input');
    expect(wrapper.find('input').props().type).to.eql('date');
  });

  it('should render Date with default value', () => {
    const wrapper = shallow(
      <Date
        formFieldPath="test1.1/1-0"
        onChange={onChangeSpy}
        validate={false}
        validations={[]}
        value={'2016-12-29'}
      />
    );
    expect(wrapper.find('input').props().defaultValue).to.be.eql('2016-12-29');
  });

  it('should get user entered value of the date', () => {
    const wrapper = shallow(
      <Date
        formFieldPath="test1.1/1-0"
        onChange={onChangeSpy}
        validate={false}
        validations={[]}
        value={'2016-12-29'}
      />
    );
    wrapper.find('input').simulate('change', { target: { value: '2016-12-31' } });

    sinon.assert.calledOnce(onChangeSpy.withArgs('2016-12-31', []));
  });

  it('should return undefined when value is undefined', () => {
    const wrapper = shallow(
      <Date
        formFieldPath="test1.1/1-0"
        onChange={onChangeSpy}
        validate={false}
        validations={[]}
      />
    );
    wrapper.find('input').simulate('change', { target: { value: undefined } });

    sinon.assert.calledOnce(onChangeSpy.withArgs(undefined, []));
  });

  it('should return undefined when value is empty string', () => {
    const wrapper = shallow(
      <Date
        formFieldPath="test1.1/1-0"
        onChange={onChangeSpy}
        validate={false}
        validations={[]}
      />
    );
    wrapper.find('input').simulate('change', { target: { value: '' } });

    sinon.assert.calledOnce(onChangeSpy.withArgs(undefined, []));
  });

  it('should throw error on fail of validations', () => {
    const validations = [constants.validations.mandatory];

    const wrapper = shallow(
      <Date
        formFieldPath="test1.1/1-0"
        onChange={onChangeSpy}
        validate={false}
        validations={validations}
        value={'2016-12-29'}
      />
    );
    const mandatoryError = new Error({ message: validations[0] });
    wrapper.find('input').simulate('change', { target: { value: undefined } });
    sinon.assert.calledOnce(onChangeSpy.withArgs(undefined, [mandatoryError]));
    expect(wrapper.find('input')).to.have.className('form-builder-error');
  });

  it('should throw error on fail of validations during component update', () => {
    const validations = [constants.validations.mandatory];

    const wrapper = mount(
      <Date
        formFieldPath="test1.1/1-0"
        onChange={onChangeSpy}
        validate={false}
        validations={validations}
        value={'2016-12-29'}
      />
    );
    const mandatoryError = new Error({ message: validations[0] });
    wrapper.setProps({ validate: true, value: undefined });
    sinon.assert.calledOnce(onChangeSpy.withArgs(undefined, [mandatoryError]));
    expect(wrapper.find('input')).to.have.className('form-builder-error');
  });

  it('should check errors after mount if the formFieldPath suffix is not 0', () => {
    const validations = [constants.validations.mandatory];

    const wrapper = mount(
      <Date
        formFieldPath="test1.1/1-1"
        onChange={onChangeSpy}
        validate={false}
        validations={validations}
      />
    );

    expect(wrapper.find('input')).to.have.className('form-builder-error');
  });

  it('should not check errors after mount if the formFieldPath suffix is 0', () => {
    const validations = [constants.validations.mandatory];

    const wrapper = mount(
      <Date
        formFieldPath="test1.1/1-0"
        onChange={onChangeSpy}
        validate={false}
        validations={validations}
        value={'2016-12-29'}
      />
    );

    expect(wrapper.find('input')).to.not.have.className('form-builder-error');
  });

  it('should render Date on change of props', () => {
    const wrapper = shallow(
      <Date
        formFieldPath="test1.1/1-0"
        onChange={onChangeSpy}
        validate={false}
        validations={[]}
        value={'2016-12-29'}
      />
    );
    wrapper.setProps({ value: '2016-12-31' });
    expect(wrapper.find('input').props().defaultValue).to.be.eql('2016-12-31');
  });

  it('should show as disabled when date is set to be disabled', () => {
    const wrapper = shallow(
      <Date
        enabled={false}
        formFieldPath="test1.1/1-0"
        onChange={() => {}}
        validate={false}
        validations={[]}
      />
    );

    expect(wrapper.find('input').props().disabled).to.eql(true);
  });

  it('should show as enabled when date is set to be enabled', () => {
    const wrapper = shallow(
      <Date
        enabled={true}
        formFieldPath="test1.1/1-0"
        onChange={() => {}}
        validate={false}
        validations={[]}
      />
    );

    expect(wrapper.find('input').props().disabled).to.eql(false);
  });
});
