import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { RadioButton } from 'components/RadioButton.jsx';

chai.use(chaiEnzyme());

describe('RadioButton Component', () => {
  const options = [
    { name: 'Yes', value: true },
    { name: 'No', value: false },
  ];

  it('should render the radio component', () => {
    const wrapper = shallow(<RadioButton hasErrors={false} id="someId" options={options} />);
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
    const wrapper = shallow(<RadioButton hasErrors={false} id="someId" options={options} value />);
    expect(wrapper.find('input').at(0).props().checked).to.eql(true);
    expect(wrapper.find('input').at(1).props().checked).to.eql(false);
  });

  it('should render the radio button with error if hasErrors is true', () => {
    const wrapper = shallow(<RadioButton hasErrors={true} id="someId" options={options} value />);
    expect(wrapper).to.have.className('form-builder-error');
  });

  it('should change the value on select', () => {
    const wrapper = shallow(<RadioButton hasErrors={false} id="someId" options={options} value />);
    wrapper.find('div').at(2).simulate('click');
    const instance = wrapper.instance();
    expect(instance.getValue()).to.eql(false);
  });

  it('should return the value as undefined if not selected', () => {
    const wrapper = shallow(<RadioButton hasErrors={false} id="someId" options={options} />);
    const instance = wrapper.instance();
    expect(instance.getValue()).to.eql(undefined);
  });
});
