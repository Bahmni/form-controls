import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { BooleanControl } from 'components/BooleanControl.jsx';
import sinon from 'sinon';
import constants from 'src/constants';

chai.use(chaiEnzyme());

describe('BooleanControl', () => {
  const DummyControl = () => <input />;

  const options = [
    { name: 'Yes', value: true },
    { name: 'No', value: false },
  ];

  let displayType;
  before(() => {
    window.componentStore.registerComponent('button', DummyControl);
  });

  after(() => {
    window.componentStore.deRegisterComponent('button');
  });


  beforeEach(() => {
    displayType = 'button';
  });
  const onChangeSpy = sinon.spy();

  const validations = [constants.validations.allowDecimal, constants.validations.mandatory];

  it('should render Dummy Control of displayType button by default', () => {
    const wrapper = shallow(
      <BooleanControl
        displayType={displayType}
        errors={[]}
        onChange={onChangeSpy}
        options={options}
        validations={validations}
      />
    );

    expect(wrapper).to.have.exactly(1).descendants('DummyControl');
    expect(Object.keys(wrapper.find('DummyControl').props())).to.have.length(5);

    expect(wrapper.find('DummyControl')).to.have.prop('errors').to.deep.eql([]);
    expect(wrapper.find('DummyControl')).to.have.prop('validations').to.deep.eql(validations);
    expect(wrapper.find('DummyControl')).to.have.prop('options').to.deep.eql(options);
  });

  it('should render Dummy Control of specified displayType', () => {
    window.componentStore.registerComponent('radio', DummyControl);
    const spy = sinon.spy(window.componentStore, 'getRegisteredComponent');
    displayType = 'radio';

    const wrapper = shallow(
      <BooleanControl
        displayType={displayType}
        errors={[]}
        onChange={onChangeSpy}
        options={options}
        validations={[]}
      />
    );

    sinon.assert.calledWith(spy, 'radio');
    expect(wrapper).to.have.exactly(1).descendants('DummyControl');
    expect(wrapper.find('DummyControl')).to.have.prop('errors').to.deep.eql([]);
    expect(wrapper.find('DummyControl')).to.have.prop('validations').to.deep.eql([]);
    expect(wrapper.find('DummyControl')).to.have.prop('options').to.deep.eql(options);

    window.componentStore.deRegisterComponent('radio');
  });

  it('should return UnSupportedComponent when registered component not found', () => {
    displayType = 'random';
    const wrapper = shallow(
      <BooleanControl
        displayType={displayType}
        errors={[]}
        onChange={onChangeSpy}
        options={options}
        validations={[]}
      />
    );
    expect(wrapper).to.have.exactly(1).descendants('div');
    expect(wrapper.find('div').at(0).text()).to.eql('<UnSupportedComponent />');
  });

  it('should return the boolean control value', () => {
    const wrapper = shallow(
      <BooleanControl
        displayType={displayType}
        errors={[]}
        onChange={onChangeSpy}
        options={options}
        validations={[]}
      />);
    const instance = wrapper.instance();
    instance.onValueChange(true, []);
    sinon.assert.calledOnce(onChangeSpy.withArgs(true, []));
  });

  it('should set errors in state on change of props', () => {
    const wrapper = shallow(
      <BooleanControl
        displayType={displayType}
        errors={[]}
        onChange={onChangeSpy}
        options={options}
        validations={[]}
      />);
    const errors = [constants.validations.mandatory];
    expect(wrapper.find('DummyControl')).to.have.prop('errors').to.deep.eql([]);
    wrapper.setProps({ errors });

    expect(wrapper.find('DummyControl')).to.have.prop('errors').to.deep.eql(errors);
  });

  it('should not set errors in state if props are same', () => {
    const wrapper = shallow(
      <BooleanControl
        displayType={displayType}
        errors={[]}
        onChange={onChangeSpy}
        options={options}
        validations={[]}
      />);
    expect(wrapper.find('DummyControl')).to.have.prop('errors').to.deep.eql([]);
    wrapper.setProps({ errors: [] });

    expect(wrapper.find('DummyControl')).to.have.prop('errors').to.deep.eql([]);
  });
});
