import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { RadioButton } from 'components/RadioButton.jsx';

chai.use(chaiEnzyme());

describe('RadioButton', () => {
  it('should render the default options', () => {
    const wrapper = shallow(<RadioButton id="someId" />);
    expect(wrapper).to.have.exactly(2).descendants('input');
    expect(wrapper.find('div').at(1).text()).to.eql('Yes');
    expect(wrapper.find('input').at(0).props().checked).to.eql(false);
    expect(wrapper.find('div').at(2).text()).to.eql('No');
    expect(wrapper.find('input').at(1).props().checked).to.eql(false);
  });

  it('should render the default options with passed value', () => {
    const wrapper = shallow(<RadioButton id="someId" value />);
    expect(wrapper.find('input').at(0).props().checked).to.eql(true);
    expect(wrapper.find('input').at(1).props().checked).to.eql(false);
  });

  it('should change the value on select', () => {
    const wrapper = shallow(<RadioButton id="someId" value />);
    wrapper.find('div').at(2).simulate('click');
    const instance = wrapper.instance();
    expect(instance.getValue()).to.eql(false);
  });

  it('should return the value as undefined if not selected', () => {
    const wrapper = shallow(<RadioButton id="someId" />);
    const instance = wrapper.instance();
    expect(instance.getValue()).to.eql(undefined);
  });

  it('should render with custom options', () => {
    const options = [
      { name: 'Ha', value: 'Yes' },
      { name: 'Na', value: 'No' },
    ];
    const wrapper = shallow(<RadioButton id="someId" options={options} value={'Yes'} />);
    expect(wrapper).to.have.exactly(2).descendants('input');
    expect(wrapper.find('div').at(1).text()).to.eql('Ha');
    expect(wrapper.find('input').at(0).props().checked).to.eql(true);
    expect(wrapper.find('div').at(2).text()).to.eql('Na');
    expect(wrapper.find('input').at(1).props().checked).to.eql(false);
  });
});
