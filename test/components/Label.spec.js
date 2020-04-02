import React from 'react';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { Label } from 'components/Label.jsx';
import { mountWithIntl } from '../intlEnzymeTest.js';
import { shallowWithIntl } from '../intlEnzymeTest';

chai.use(chaiEnzyme());

describe('Label', () => {
  it('should render the value of label by related translated key', () => {
    const metadata = { value: 'History Notes', type: 'label', translationKey: 'TEST_KEY' };
    const wrapper = mountWithIntl(<Label metadata={metadata} />);
    expect(wrapper.find('label').text()).to.eql('test value');
  });

  it('should render the value of label by default language', () => {
    const metadata = { value: 'History Notes', type: 'label' };

    const wrapper = shallowWithIntl(<Label metadata={metadata} />);
    expect(wrapper.find('label').text()).to.eql('History Notes');
  });

  it('should set label to class disable when the props of enabled is false', () => {
    const metadata = { value: 'History Notes', type: 'label' };

    const wrapper = shallowWithIntl(<Label enabled={false} metadata={metadata} />);
    expect(wrapper.find('label')).to.have.className('disabled-label');
  });

  it('should not set label to class disable when the props of enabled is true', () => {
    const metadata = { value: 'History Notes', type: 'label' };

    const wrapper = shallowWithIntl(<Label enabled metadata={metadata} />);
    expect(wrapper.find('label')).to.not.have.className('disabled-label');
  });

  it('should render the value of label with units', () => {
    const metadata = { value: 'Pulse', type: 'label', units: '(/min)' };

    const wrapper = mountWithIntl(<Label metadata={metadata} />);
    expect(wrapper.find('label').text()).to.eql('Pulse (/min)');
  });
});
