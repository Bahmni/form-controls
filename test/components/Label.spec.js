import React from 'react';
import {shallow} from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, {expect} from 'chai';
import {Label} from 'components/Label.jsx';

chai.use(chaiEnzyme());

describe('Label', () => {
  it('should render the value of label', () => {
    const metadata = {value: 'History Notes', type: 'label'};

    const wrapper = shallow(<Label metadata={metadata}/>);
    expect(wrapper.find('label').text()).to.eql('History Notes');
  });

  it('should set label to class disable when the props of enabled is false', () => {
    const metadata = {value: 'History Notes', type: 'label'};

    const wrapper = shallow(<Label metadata={metadata} enabled={false}/>);
    expect(wrapper.find('.disable')).to.have.length(1);
    expect(wrapper.find('.disable').text()).to.eql('History Notes');
  });

  it('should not set label to class disable when the props of enabled is true', () => {
    const metadata = {value: 'History Notes', type: 'label'};

    const wrapper = shallow(<Label metadata={metadata} enabled={true}/>);
    expect(wrapper.find('.disable')).to.have.length(0);
  });
});
