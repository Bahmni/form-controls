import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { Label } from 'components/Label.jsx';

chai.use(chaiEnzyme());

describe('Label', () => {
  it('should render the value of label', () => {
    const metadata = { value: 'History Notes', type: 'label' };

    const wrapper = shallow(<Label metadata={metadata} />);
    expect(wrapper.find('label').text()).to.eql('History Notes');
  });

  it('should set label to class disable when the props of enabled is false', () => {
    const metadata = { value: 'History Notes', type: 'label' };

    const wrapper = shallow(<Label enabled={false} metadata={metadata} />);
    expect(wrapper.find('label')).to.have.className('disabled-label');
  });

  it('should not set label to class disable when the props of enabled is true', () => {
    const metadata = { value: 'History Notes', type: 'label' };

    const wrapper = shallow(<Label enabled metadata={metadata} />);
    expect(wrapper.find('label')).to.not.have.className('disabled-label');
  });

  it('should set label to class hidden when the props of hidden is true', () => {
    const metadata = { value: 'History Notes', type: 'label' };

    const wrapper = shallow(<Label hidden metadata={metadata} />);
    expect(wrapper.find('label')).to.have.className('hidden');
  });

  it('should not set label to class hidden when the props of hidden is false', () => {
    const metadata = { value: 'History Notes', type: 'label' };

    const wrapper = shallow(<Label hidden={false} metadata={metadata} />);
    expect(wrapper.find('label')).to.not.have.className('hidden');
  });
});
