import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { RadioButton } from 'components/RadioButton.jsx';
import sinon from 'sinon';
import constants from 'src/constants';

chai.use(chaiEnzyme());

describe('RadioButton Component', () => {
  const value = true;
  const options = [
    { name: 'Yes', value: true },
    { name: 'No', value: false },
  ];

  let valueChangeSpy;

  beforeEach(() => {
    valueChangeSpy = sinon.spy();
  });

  it('should render the radio component', () => {
    const wrapper = shallow(
      <RadioButton
        onValueChange={valueChangeSpy}
        options={options}
        validations={[]}
      />
    );
    expect(wrapper).to.have.exactly(2).descendants('input');

    expect(wrapper.find('.options-list').at(0).text()).to.eql('Yes');
    expect(wrapper.find('input').at(0).props().checked).to.eql(false);
    expect(wrapper.find('input').at(0).props().value).to.eql(true);

    expect(wrapper.find('.options-list').at(1).text()).to.eql('No');
    expect(wrapper.find('input').at(1).props().checked).to.eql(false);
    expect(wrapper.find('input').at(1).props().value).to.eql(false);

    expect(wrapper).to.not.have.className('form-builder-error');
  });

  it('should render the radio button with selected value', () => {
    const wrapper = shallow(
      <RadioButton
        onValueChange={valueChangeSpy}
        options={options}
        validations={[]}
        value={value}
      />
    );
    expect(wrapper.find('input').at(0).props().checked).to.eql(true);
    expect(wrapper.find('input').at(1).props().checked).to.eql(false);
  });

  it('should change the value on select', () => {
    const wrapper = shallow(
      <RadioButton
        onValueChange={valueChangeSpy}
        options={options}
        validations={[]}
      />
    );
    wrapper.find('div').at(2).simulate('click');
    expect(wrapper.find('input').at(1).props().checked).to.eql(true);
  });

  it('should render the radio button with error if hasErrors is true', () => {
    const wrapper = shallow(
      <RadioButton
        onValueChange={valueChangeSpy}
        options={options}
        validations={[constants.validations.mandatory]}
        value={value}
      />
    );
    wrapper.setProps({ value: undefined });
    expect(wrapper).to.have.className('form-builder-error');
  });

  it('should not reRender if value is same', () => {
    const wrapper = shallow(
      <RadioButton
        onValueChange={valueChangeSpy}
        options={options}
        validations={[]}
        value={value}
      />
    );
    expect(wrapper.find('input').at(0).props().checked).to.eql(true);
    expect(wrapper.find('input').at(1).props().checked).to.eql(false);

    wrapper.setProps({ value: true });

    expect(wrapper.find('input').at(0).props().checked).to.eql(true);
    expect(wrapper.find('input').at(1).props().checked).to.eql(false);
  });
});
