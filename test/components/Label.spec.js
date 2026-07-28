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

  it('should not render a hyperlink when hyperlinkUrl property is absent', () => {
    const metadata = { value: 'History Notes', type: 'label' };
    const wrapper = mountWithIntl(<Label metadata={metadata} />);
    expect(wrapper.find('a')).to.have.length(0);
  });

  it('should render a clickable hyperlink for a valid, allowed external url ' +
    '(Label hyperlink is not gated by any feature toggle)', () => {
    const metadata = { value: 'History Notes', type: 'label', properties: { hyperlinkUrl: 'https://who.int' } };
    const wrapper = mountWithIntl(
      <Label allowedDomains={['who.int']} metadata={metadata} />
    );
    expect(wrapper.find('a')).to.have.length(1);
    expect(wrapper.find('a').prop('href')).to.eql('https://who.int');
    expect(wrapper.find('a').text()).to.eql('History Notes');
  });

  it('should silently render plain text (no error) for a disallowed domain by default', () => {
    const metadata = { value: 'History Notes', type: 'label', properties: { hyperlinkUrl: 'https://evil.com' } };
    const wrapper = mountWithIntl(
      <Label allowedDomains={['who.int']} metadata={metadata} />
    );
    expect(wrapper.find('a')).to.have.length(0);
    expect(wrapper.find('.hyperlink-error')).to.have.length(0);
    expect(wrapper.find('label').text()).to.eql('History Notes');
  });

  it('should show the validation error when showValidationErrors is true', () => {
    const metadata = { value: 'History Notes', type: 'label', properties: { hyperlinkUrl: 'https://evil.com' } };
    const wrapper = mountWithIntl(
      <Label allowedDomains={['who.int']} metadata={metadata} showValidationErrors />
    );
    expect(wrapper.find('.hyperlink-error')).to.have.length(1);
  });
});
