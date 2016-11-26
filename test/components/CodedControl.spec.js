import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { CodedControl } from 'components/CodedControl.jsx';
import sinon from 'sinon';
import constants from 'src/constants';

chai.use(chaiEnzyme());

describe('CodedControl', () => {
  const DummyControl = () => <input />;

  const options = [
    { display: 'Answer1', uuid: 'answer1uuid' },
    { display: 'Answer2', uuid: 'answer2uuid' },
  ];

  let onChangeSpy;
  before(() => {
    window.componentStore.registerComponent('button', DummyControl);
  });

  after(() => {
    window.componentStore.deRegisterComponent('button');
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
    expect(Object.keys(wrapper.find('DummyControl').props())).to.have.length(5);

    expect(wrapper.find('DummyControl')).to.have.prop('validate').to.deep.eql(false);
    expect(wrapper.find('DummyControl')).to.have.prop('validations').to.deep.eql(validations);
    expect(wrapper.find('DummyControl')).to.have.prop('options').to.deep.eql(
      [{ name: 'Answer1', value: 'answer1uuid' }, { name: 'Answer2', value: 'answer2uuid' }]);
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
    expect(Object.keys(wrapper.find('DummyControl').props())).to.have.length(5);

    expect(wrapper.find('DummyControl')).to.have.prop('validate').to.deep.eql(false);
    expect(wrapper.find('DummyControl')).to.have.prop('validations').to.deep.eql(validations);
    expect(wrapper.find('DummyControl')).to.have.prop('value').
        to.deep.eql({ name: 'Answer1', value: 'answer1uuid' });
    expect(wrapper.find('DummyControl')).to.have.prop('options').to.deep.eql(
      [{ name: 'Answer1', value: 'answer1uuid' }, { name: 'Answer2', value: 'answer2uuid' }]);
  });


  it('should return null when registered component not found', () => {
    window.componentStore.deRegisterComponent('button');
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
    window.componentStore.registerComponent('button', DummyControl);
  });

  it('should return the boolean control value', () => {
    const wrapper = shallow(
      <CodedControl
        onChange={onChangeSpy}
        options={options}
        properties={{}}
        validate={false}
        validations={[]}
      />);
    const instance = wrapper.instance();
    instance.onValueChange('answer1uuid', []);
    sinon.assert.calledOnce(onChangeSpy.withArgs(options[0], []));
  });

  it('should return the autoComplete control value', () => {
    window.componentStore.registerComponent('autoComplete', DummyControl);
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
    instance.onValueChange('answer1uuid', []);
    sinon.assert.calledOnce(onChangeSpy.withArgs(options[0], []));
    window.componentStore.deRegisterComponent('autoComplete');
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
});
