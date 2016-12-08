import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { BooleanControl } from 'components/BooleanControl.jsx';
import sinon from 'sinon';
import constants from 'src/constants';
import ComponentStore from 'src/helpers/componentStore';

chai.use(chaiEnzyme());

describe('BooleanControl', () => {
  const DummyControl = () => <input />;

  const options = [
    { name: 'Yes', value: true },
    { name: 'No', value: false },
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
    const wrapper = shallow(
      <BooleanControl
        onChange={onChangeSpy}
        options={options}
        validate={false}
        validations={validations}
      />
    );

    expect(wrapper).to.have.exactly(1).descendants('DummyControl');
    expect(Object.keys(wrapper.find('DummyControl').props())).to.have.length(5);

    expect(wrapper.find('DummyControl')).to.have.prop('validations').to.deep.eql(validations);
    expect(wrapper.find('DummyControl')).to.have.prop('options').to.deep.eql(options);
  });

  it('should return null when registered component not found', () => {
    ComponentStore.deRegisterComponent('button');
    const wrapper = shallow(
      <BooleanControl
        onChange={onChangeSpy}
        options={options}
        validate={false}
        validations={[]}
      />
    );
    expect(wrapper).to.have.exactly(1).descendants('div');
    expect(wrapper.find('div').at(0).text()).to.eql('<UnSupportedComponent />');
    expect(wrapper.find('div').at(0).text()).to.eql('<UnSupportedComponent />');

    ComponentStore.registerComponent('button', DummyControl);
  });

  it('should return the boolean control value', () => {
    const wrapper = shallow(
      <BooleanControl
        onChange={onChangeSpy}
        options={options}
        validate={false}
        validations={[]}
      />);
    const instance = wrapper.instance();
    instance.onValueChange(true, []);
    sinon.assert.calledOnce(onChangeSpy.withArgs(true, []));
  });

  it('should reRender on change of value in props', () => {
    const wrapper = shallow(
      <BooleanControl
        onChange={onChangeSpy}
        options={options}
        validate={false}
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
    const wrapper = shallow(
      <BooleanControl
        onChange={onChangeSpy}
        options={options}
        validate={false}
        validations={[]}
        value
      />);
    expect(wrapper.find('DummyControl')).to.have.prop('value')
      .to.deep.eql({ name: 'Yes', value: true });
    wrapper.setProps({ value: true });
    expect(wrapper.find('DummyControl')).to.have.prop('value')
      .to.deep.eql({ name: 'Yes', value: true });
  });
});
