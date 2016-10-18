import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { Button } from 'components/Button.jsx';

chai.use(chaiEnzyme());

describe('Button Component', () => {
  const options = [
    { name: 'Yes', value: true },
    { name: 'No', value: false },
  ];
  it('should render button component', () => {
    const wrapper = shallow(<Button id="someId" options={options} />);
    expect(wrapper).to.have.exactly(2).descendants('button');

    expect(wrapper.find('button').at(0).text()).to.eql('Yes');
    expect(wrapper.find('button').at(1).text()).to.eql('No');

    expect(wrapper.find('button').at(0)).to.have.className('fl');
    expect(wrapper.find('button').at(1)).to.have.className('fl');
  });

  it('should render button with selected value', () => {
    const wrapper = shallow(<Button id="someId" options={options} value />);
    expect(wrapper.find('button').at(0)).to.have.className('fl active');
    expect(wrapper.find('button').at(1)).to.have.className('fl');
  });

  it('should change the value on click', () => {
    const wrapper = shallow(<Button id="someId" options={options} value />);
    wrapper.find('button').at(1).simulate('click');
    const instance = wrapper.instance();
    expect(instance.getValue()).to.eql(false);

    expect(wrapper.find('button').at(0)).to.have.className('fl');
    expect(wrapper.find('button').at(1)).to.have.className('fl active');
  });

  it('should return the value as undefined if not selected', () => {
    const wrapper = shallow(<Button id="someId" options={options} />);
    const instance = wrapper.instance();
    expect(instance.getValue()).to.eql(undefined);
  });
});
