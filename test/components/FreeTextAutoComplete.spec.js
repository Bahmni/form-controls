import React from 'react';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { FreeTextAutoComplete } from '../../src/components/FreeTextAutoComplete.jsx';
import sinon from 'sinon';

chai.use(chaiEnzyme());

describe('FreeTextAutoComplete', () => {
  const options = [
    { label: 'one', value: 'One' },
    { label: 'two', value: 'Two' },
    { label: 'three', value: 'Three' },
  ];

  const onChangeSpy = sinon.spy();

  it('should render FreeTextAutoComplete', () => {
    const wrapper = mount(
      <FreeTextAutoComplete
        onChange={onChangeSpy}
        options={options}
        value={undefined}
      />);
    const instance = wrapper.instance();

    expect(instance.state.options).to.be.eql(options);
    expect(instance.state.value).to.be.eql(undefined);
    const props = wrapper.find('Select').props();
    expect(props.options).to.be.eql(options);
    expect(props.value).to.be.eql(undefined);
    expect(props.clearable).to.be.eql(false);
    expect(props.backspaceRemoves).to.be.eql(false);
    expect(props.deleteRemoves).to.be.eql(false);
    expect(props.multi).to.be.eql(false);
  });

  it('should render FreeTextAutoComplete with default value', () => {
    const wrapper = mount(
      <FreeTextAutoComplete
        onChange={onChangeSpy}
        options={options}
        value={'One'}
      />);
    expect(wrapper.find('Select').props().value).to.be.eql('One');
  });

  it('should call onChange method onChange of value', () => {
    const wrapper = mount(
      <FreeTextAutoComplete
        locale={'en'}
        onChange={onChangeSpy}
        options={options}
        translationKey={'SOME_KEY'}
        type={'label'}
        value={'One'}
      />);
    const onChange = wrapper.find('Select').props().onChange;
    onChange('One');
    sinon.assert.calledOnce(onChangeSpy.withArgs('One', 'label', 'SOME_KEY', 'en'));
  });

  it('should update options and value on change of options', () => {
    const wrapper = mount(
      <FreeTextAutoComplete
        onChange={onChangeSpy}
        options={options}
        value={'One'}
      />);
    const instance = wrapper.instance();
    expect(instance.state.options).to.be.eql(options);
    expect(instance.state.value).to.be.eql('One');

    const newOptions = [
      { label: '1', value: 'One' },
      { label: '2', value: 'Two' },
    ];
    wrapper.setProps({ options: newOptions, value: 'Two' });

    expect(instance.state.options).to.be.eql(newOptions);
    expect(instance.state.value).to.be.eql('Two');
  });

  it('should not update options and value on change of other props', () => {
    const wrapper = mount(
      <FreeTextAutoComplete
        onChange={onChangeSpy}
        options={options}
        value={'One'}
      />);
    const instance = wrapper.instance();
    expect(instance.state.options).to.be.eql(options);
    expect(instance.state.value).to.be.eql('One');

    wrapper.setProps({ clearable: true });

    expect(instance.state.options).to.be.eql(options);
    expect(instance.state.value).to.be.eql('One');
  });
});
