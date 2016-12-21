import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { CodedControl } from 'components/CodedControl.jsx';
import sinon from 'sinon';
import constants from 'src/constants';
import ComponentStore from 'src/helpers/componentStore';

chai.use(chaiEnzyme());

describe('CodedControl', () => {
  const DummyControl = () => <input />;

  const options = [
    { name: { display: 'Answer1' }, uuid: 'answer1uuid' },
    { name: { display: 'Answer2' }, uuid: 'answer2uuid' },
    { name: { display: 'Answer3' }, uuid: 'answer3uuid' },
    { name: { display: 'Answer4' }, uuid: 'answer4uuid' },
    { name: { display: 'Answer5' }, uuid: 'answer5uuid' },
  ];

  const expectedOptions = [
    { name: 'Answer1', value: 'answer1uuid' },
    { name: 'Answer2', value: 'answer2uuid' },
    { name: 'Answer3', value: 'answer3uuid' },
    { name: 'Answer4', value: 'answer4uuid' },
    { name: 'Answer5', value: 'answer5uuid' },
  ];

  let onChangeSpy;
  before(() => {
    ComponentStore.registerComponent('button', DummyControl);
  });

  after(() => {
    ComponentStore.deRegisterComponent('button');
  });


  beforeEach(() => {
    onChangeSpy = sinon.spy();
  });

  const validations = [constants.validations.allowDecimal, constants.validations.mandatory];

  it('should render Dummy Control of displayType button by default', () => {
    const wrapper = shallow(
      <CodedControl
        onChange={onChangeSpy}
        options={options}
        properties={{}}
        validate={false}
        validations={validations}
      />
    );

    expect(wrapper).to.have.exactly(1).descendants('DummyControl');
    expect(Object.keys(wrapper.find('DummyControl').props())).to.have.length(6);

    expect(wrapper.find('DummyControl')).to.have.prop('validate').to.deep.eql(false);
    expect(wrapper.find('DummyControl')).to.have.prop('validations').to.deep.eql(validations);
    expect(wrapper.find('DummyControl')).to.have.prop('options').to.deep.eql(expectedOptions);
  });

  it('should render Dummy Control with default value', () => {
    const wrapper = shallow(
      <CodedControl
        onChange={onChangeSpy}
        options={options}
        properties={{}}
        validate={false}
        validations={validations}
        value={{ name: 'Answer1', uuid: 'answer1uuid' }}
      />
    );

    expect(wrapper).to.have.exactly(1).descendants('DummyControl');
    expect(Object.keys(wrapper.find('DummyControl').props())).to.have.length(6);

    expect(wrapper.find('DummyControl')).to.have.prop('validate').to.deep.eql(false);
    expect(wrapper.find('DummyControl')).to.have.prop('validations').to.deep.eql(validations);
    expect(wrapper.find('DummyControl')).to.have.prop('value').
        to.deep.eql({ name: 'Answer1', value: 'answer1uuid' });
  });


  it('should return null when registered component not found', () => {
    ComponentStore.deRegisterComponent('button');
    const wrapper = shallow(
      <CodedControl
        onChange={onChangeSpy}
        options={options}
        properties={{}}
        validate={false}
        validations={[]}
      />
    );
    expect(wrapper).to.be.blank();
    ComponentStore.registerComponent('button', DummyControl);
  });

  it('should return the coded button control value', () => {
    const wrapper = shallow(
      <CodedControl
        onChange={onChangeSpy}
        options={options}
        properties={{}}
        validate={false}
        validations={[]}
      />);
    const instance = wrapper.instance();
    instance.onValueChange({ value: 'answer1uuid' }, []);
    sinon.assert.calledOnce(onChangeSpy.withArgs(options[0], []));
  });

  it('should return the autoComplete control value', () => {
    ComponentStore.registerComponent('autoComplete', DummyControl);
    const wrapper = shallow(
      <CodedControl
        onChange={onChangeSpy}
        options={options}
        properties={{ autoComplete: true }}
        validate={false}
        validations={[]}
      />);
    expect(wrapper.find('DummyControl')).to.have.prop('asynchronous').to.eql(false);
    expect(wrapper.find('DummyControl')).to.have.prop('labelKey').to.eql('name');
    const instance = wrapper.instance();
    instance.onValueChange({ value: 'answer1uuid' }, []);
    sinon.assert.calledOnce(onChangeSpy.withArgs(options[0], []));
    ComponentStore.deRegisterComponent('autoComplete');
  });

  it('should validate in state on change of props', () => {
    const wrapper = shallow(
      <CodedControl
        onChange={onChangeSpy}
        options={options}
        properties={{}}
        validate={false}
        validations={[]}
      />);
    expect(wrapper.find('DummyControl')).to.have.prop('validate').to.deep.eql(false);
    wrapper.setProps({ validate: true });

    expect(wrapper.find('DummyControl')).to.have.prop('validate').to.deep.eql(true);
  });

  it('should not set errors in state if props are same', () => {
    const wrapper = shallow(
      <CodedControl
        onChange={onChangeSpy}
        options={options}
        properties={{}}
        validate={false}
        validations={[]}
      />);
    expect(wrapper.find('DummyControl')).to.have.prop('validate').to.deep.eql(false);
    wrapper.setProps({ validate: true });

    expect(wrapper.find('DummyControl')).to.have.prop('validate').to.deep.eql(true);
  });

  it('should render multiselect coded control with default values', () => {
    ComponentStore.registerComponent('autoComplete', DummyControl);
    const wrapper = shallow(
      <CodedControl
        onChange={onChangeSpy}
        options={options}
        properties={{ autoComplete: true, multiSelect: true }}
        validate={false}
        validations={validations}
        value={[options[0], options[1]]}
      />
    );

    expect(wrapper).to.have.exactly(1).descendants('DummyControl');
    expect(Object.keys(wrapper.find('DummyControl').props())).to.have.length(9);

    expect(wrapper.find('DummyControl')).to.have.prop('validate').to.deep.eql(false);
    expect(wrapper.find('DummyControl')).to.have.prop('validations').to.deep.eql(validations);
    expect(wrapper.find('DummyControl')).to.have.prop('value').
    to.deep.eql([expectedOptions[0], expectedOptions[1]]);

    expect(wrapper.find('DummyControl')).to.have.prop('options').to.deep.eql(expectedOptions);
    ComponentStore.deRegisterComponent('autoComplete');
  });

  it('should return multiselect values from coded control', () => {
    ComponentStore.registerComponent('autoComplete', DummyControl);
    const wrapper = shallow(
      <CodedControl
        onChange={onChangeSpy}
        options={options}
        properties={{ autoComplete: true, multiSelect: true }}
        validate={false}
        validations={[]}
      />);
    const instance = wrapper.instance();
    instance.onValueChange([expectedOptions[0], expectedOptions[2]], []);
    sinon.assert.calledOnce(onChangeSpy.withArgs([options[0], options[2]], []));
    ComponentStore.deRegisterComponent('autoComplete');
  });

  it('should return undefined if no value is selected', () => {
    const wrapper = shallow(
      <CodedControl
        onChange={onChangeSpy}
        options={options}
        properties={{}}
        validate={false}
        validations={[]}
      />);
    const instance = wrapper.instance();
    instance.onValueChange(undefined, []);
    sinon.assert.calledOnce(onChangeSpy.withArgs(undefined, []));
  });
});
