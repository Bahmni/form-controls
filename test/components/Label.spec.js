import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { Label } from 'components/Label';

chai.use(chaiEnzyme());

describe('Label', () => {
  it('should render the value of label', () => {
    const wrapper = shallow(<Label value="History Notes" />);
    expect(wrapper.find('span').text()).to.eql('History Notes');
  });
});
