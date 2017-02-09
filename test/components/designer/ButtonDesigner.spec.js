import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { ButtonDesigner } from 'components/designer/ButtonDesigner.jsx';

chai.use(chaiEnzyme());

describe('Button Designer', () => {
  let wrapper;

  const options = [
    { name: 'Yes', value: true },
    { name: 'No', value: false },
  ];

  beforeEach(() => {
    wrapper = shallow(<ButtonDesigner options={options} />);
  });

  it('should render designer button', () => {
    expect(wrapper).to.have.exactly(2).descendants('button');

    expect(wrapper.find('button').at(0).text()).to.eql('Yes');
    expect(wrapper.find('button').at(1).text()).to.eql('No');
  });

  it('should return json definition', () => {
    const instance = wrapper.instance();
    expect(instance.getJsonDefinition()).to.deep.eql(options);
  });
});
