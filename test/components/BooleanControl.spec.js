import React from 'react';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { BooleanControl } from 'components/BooleanControl.jsx';
import sinon from 'sinon';
import constants from 'src/constants';
import ComponentStore from 'src/helpers/componentStore';
import { shallowWithIntl } from '../intlEnzymeTest.js';

chai.use(chaiEnzyme());

describe('BooleanControl', () => {
  const DummyControl = () => <input />;

  const options = [
    { translationKey: 'BOOLEAN_YES', name: 'Yes', value: true },
    { translationKey: 'BOOLEAN_NO', name: 'No', value: false },
  ];

  before(() => {
    ComponentStore.registerComponent('button', DummyControl);
  });

  after(() => {
    ComponentStore.deRegisterComponent('button');
  });

  const onChangeSpy = sinon.spy();

  const validations = [constants.validations.allowDecimal, constants.validations.mandatory];

  it('should render Dummy Control of displayType button by default', () => {
    const wrapper = shallowWithIntl(
      <BooleanControl
        onChange={onChangeSpy}
        options={options}
        validate={false}
        validateForm={false}
        validations={validations}
      />
    );

    const expectedOptions = [
      { name: 'Yes', value: true },
      { name: 'No', value: false },
    ];

    expect(wrapper).to.have.exactly(1).descendants('DummyControl');

    expect(wrapper.find('DummyControl')).to.have.prop('validations').to.deep.eql(validations);
    expect(wrapper.find('DummyControl')).to.have.prop('options').to.deep.eql(expectedOptions);
  });

  it('should return null when registered component not found', () => {
    ComponentStore.deRegisterComponent('button');
    const wrapper = shallowWithIntl(
      <BooleanControl
        onChange={onChangeSpy}
        options={options}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );
    expect(wrapper).to.have.exactly(1).descendants('div');
    expect(wrapper.find('div').at(0).text()).to.eql('<UnSupportedComponent />');
    expect(wrapper.find('div').at(0).text()).to.eql('<UnSupportedComponent />');

    ComponentStore.registerComponent('button', DummyControl);
  });

  it('should return the boolean control value', () => {
    const wrapper = shallowWithIntl(
      <BooleanControl
        onChange={onChangeSpy}
        options={options}
        validate={false}
        validateForm={false}
        validations={[]}
      />);
    const instance = wrapper.instance();
    instance.onValueChange(options[0], []);
    sinon.assert.calledOnce(onChangeSpy.withArgs({ value: true, errors: [] }));
  });

  it('should reRender on change of value in props', () => {
    const wrapper = shallowWithIntl(
      <BooleanControl
        onChange={onChangeSpy}
        options={options}
        validate={false}
        validateForm={false}
        validations={[]}
        value
      />);
    expect(wrapper.find('DummyControl')).to.have.prop('value')
      .to.deep.eql({ name: 'Yes', value: true });
    wrapper.setProps({ value: false });
    expect(wrapper.find('DummyControl')).to.have.prop('value')
      .to.deep.eql({ name: 'No', value: false });
  });

  it('should not reRender if value is not changed', () => {
    const wrapper = shallowWithIntl(
      <BooleanControl
        onChange={onChangeSpy}
        options={options}
        validate={false}
        validateForm={false}
        validations={[]}
        value
      />);
    expect(wrapper.find('DummyControl')).to.have.prop('value')
      .to.deep.eql({ name: 'Yes', value: true });
    wrapper.setProps({ value: true });
    expect(wrapper.find('DummyControl')).to.have.prop('value')
      .to.deep.eql({ name: 'Yes', value: true });
  });

  it('should return undefined if no value is selected', () => {
    const wrapper = shallowWithIntl(
      <BooleanControl
        onChange={onChangeSpy}
        options={options}
        validate={false}
        validateForm={false}
        validations={[]}
      />);
    const instance = wrapper.instance();
    instance.onValueChange(undefined, []);
    sinon.assert.calledOnce(onChangeSpy.withArgs({ value: undefined, errors: [] }));
  });
});
