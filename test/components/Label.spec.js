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

  it.only('should render the value of label as grey when the label is belong to disable class', () => {
    const metadata = {value: 'History Notes', type: 'label'};

    const wrapper = shallow(<Label metadata={metadata} enabled={false}/>);
    expect(wrapper.find('.disable').text()).to.eql('History Notes')
  });
});
