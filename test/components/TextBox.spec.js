import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { TextBox } from 'components/TextBox';

chai.use(chaiEnzyme());

describe('TextBox', () => {
  it('should render TextBox when obs type is text', () => {
    const obs = {
      id: 100,
      type: 'text',
    };

    const wrapper = shallow(<TextBox obs={obs} />);
    expect(wrapper.find('input').props().type).to.be.eql('text');
    expect(wrapper.find('input').props().defaultValue).to.be.eql(undefined);
  });

  it('should render TextBox with value when obs type is text', () => {
    const obs = {
      id: 100,
      type: 'text',
      value: 'someValue',
    };

    const wrapper = shallow(<TextBox obs={obs} />);
    expect(wrapper.find('input').props().type).to.be.eql('text');
    expect(wrapper.find('input').props().defaultValue).to.be.eql('someValue');
  });

  it('should render TextBox when obs type is numeric', () => {
    const obs = {
      id: 100,
      type: 'numeric',
    };

    const wrapper = shallow(<TextBox obs={obs} />);
    expect(wrapper.find('input').props().type).to.be.eql('number');
    expect(wrapper.find('input').props().defaultValue).to.be.eql(undefined);
  });

  it('should render TextBox with value when obs type is numeric', () => {
    const obs = {
      id: 100,
      type: 'numeric',
      value: '007',
    };

    const wrapper = shallow(<TextBox obs={obs} />);
    expect(wrapper.find('input').props().type).to.be.eql('number');
    expect(wrapper.find('input').props().defaultValue).to.be.eql('007');
  });
});
