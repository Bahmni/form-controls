import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { Label } from 'components/Label.jsx';
import { mountWithIntl } from 'src/helpers/intlEnzymeTest.js';
chai.use(chaiEnzyme());

describe('Label', () => {
  it('should render value of label by related translation key', () => {
    const metadata = { value: 'History Notes', type: 'label', translation_key: 'TEST_KEY' };

    const wrapper = mountWithIntl(<Label metadata={metadata} />);
    expect(wrapper.find('span').text()).to.eql('test value');
  });

  it('should render the value of label by default language', () => {
    const metadata = { value: 'History Notes', type: 'label' };

    const wrapper = shallow(<Label metadata={metadata} />);
    expect(wrapper.find('FormattedMessage')).to.have.prop('defaultMessage').to.eql('History Notes');
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
});
