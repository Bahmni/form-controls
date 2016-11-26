import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { UnSupportedComponent } from 'components/UnSupportedComponent.jsx';

chai.use(chaiEnzyme());

describe('UnSupportedComponent', () => {
  it('should render the value of label', () => {
    const wrapper = shallow(<UnSupportedComponent message={'Component is not supported'} />);
    expect(wrapper.find('label').text()).to.eql('Component is not supported');
  });
});
