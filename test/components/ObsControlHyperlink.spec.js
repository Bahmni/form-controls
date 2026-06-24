

import React from 'react';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { ObsControl } from 'components/ObsControl.jsx';
import ComponentStore from 'src/helpers/componentStore';
import { mountWithIntl } from '../intlEnzymeTest.js';

chai.use(chaiEnzyme());

describe('ObsControl - hyperlink rendering', () => {
  const DummyControl = () => <input />;

  before(() => {
    ComponentStore.componentList = {};
    ComponentStore.registerComponent('text', DummyControl);
  });

  after(() => {
    ComponentStore.deRegisterComponent('text');
  });

  function getConcept(datatype) {
    return {
      uuid: '70645842-be6a-4974-8d5f-45b52990e132',
      datatype,
      name: 'Pulse',
      conceptClass: 'Misc',
      conceptHandler: undefined,
    };
  }

  const label = {
    id: 'someId',
    value: 'someLabelName',
    type: 'label',
  };

  const onChangeSpy = () => {};
  const showNotificationSpy = () => {};

  function makeWrapper(properties, extraProps) {
    const metadata = {
      id: '100',
      type: 'obsControl',
      concept: getConcept('text'),
      label,
      properties: properties || {},
    };
    return mountWithIntl(
      <ObsControl
        metadata={metadata}
        onValueChanged={onChangeSpy}
        showNotification={showNotificationSpy}
        validate={false}
        validateForm={false}
        value={{}}
        {...extraProps}
      />
    );
  }

  it('should NOT render an anchor when hyperlinkUrl property is absent', () => {
    const wrapper = makeWrapper({});
    expect(wrapper.find('a[data-bahmni-hyperlink]')).to.have.length(0);
  });

  it('should NOT render an anchor when hyperlinkUrl property is empty string', () => {
    const wrapper = makeWrapper({ hyperlinkUrl: '' });
    expect(wrapper.find('a[data-bahmni-hyperlink]')).to.have.length(0);
  });

  it('should render external <a> with target _blank and rel for valid https url', () => {
    const wrapper = makeWrapper({ hyperlinkUrl: 'https://example.com/resource' });
    const anchor = wrapper.find('a[data-bahmni-hyperlink]');
    expect(anchor).to.have.length(1);
    expect(anchor.prop('href')).to.equal('https://example.com/resource');
    expect(anchor.prop('target')).to.equal('_blank');
    expect(anchor.prop('rel')).to.equal('noopener noreferrer');
    expect(anchor.prop('referrerPolicy')).to.equal('no-referrer');
  });

  it('should render internal <a> with target _blank and noopener for valid relative url', () => {
    const wrapper = makeWrapper({ hyperlinkUrl: '/bahmni/patient/summary' });
    const anchor = wrapper.find('a[data-bahmni-hyperlink]');
    expect(anchor).to.have.length(1);
    expect(anchor.prop('href')).to.equal('/bahmni/patient/summary');
    expect(anchor.prop('target')).to.equal('_blank');
    expect(anchor.prop('rel')).to.equal('noopener');
  });

  it('should use hyperlinkLabel as anchor text when provided', () => {
    const wrapper = makeWrapper({
      hyperlinkUrl: 'https://example.com/resource',
      hyperlinkLabel: 'Click here',
    });
    const anchor = wrapper.find('a[data-bahmni-hyperlink]');
    expect(anchor).to.have.length(1);
    expect(anchor.text()).to.equal('Click here');
  });

  it('should use sanitizedUrl as anchor text when hyperlinkLabel is absent', () => {
    const wrapper = makeWrapper({ hyperlinkUrl: 'https://example.com/resource' });
    const anchor = wrapper.find('a[data-bahmni-hyperlink]');
    expect(anchor.text()).to.equal('https://example.com/resource');
  });

  it('should render error span (not anchor) for invalid url scheme', () => {
    const wrapper = makeWrapper({ hyperlinkUrl: 'javascript:alert(1)' }); // eslint-disable-line no-script-url
    expect(wrapper.find('a[data-bahmni-hyperlink]')).to.have.length(0);
    expect(wrapper.find('span.hyperlink-error')).to.have.length(1);
  });

  it('should render error span for http (non-https) url', () => {
    const wrapper = makeWrapper({ hyperlinkUrl: 'http://example.com' });
    expect(wrapper.find('a[data-bahmni-hyperlink]')).to.have.length(0);
    expect(wrapper.find('span.hyperlink-error')).to.have.length(1);
  });

  it('should render error span when domain not in allowedDomains', () => {
    const wrapper = makeWrapper(
      { hyperlinkUrl: 'https://evil.com/page' },
      { allowedDomains: ['*.example.com'] }
    );
    expect(wrapper.find('a[data-bahmni-hyperlink]')).to.have.length(0);
    expect(wrapper.find('span.hyperlink-error')).to.have.length(1);
  });

  it('should render anchor when domain matches allowedDomains wildcard', () => {
    const wrapper = makeWrapper(
      { hyperlinkUrl: 'https://sub.example.com/page' },
      { allowedDomains: ['*.example.com'] }
    );
    expect(wrapper.find('a[data-bahmni-hyperlink]')).to.have.length(1);
  });

  it('should substitute patientUuid token in url', () => {
    const wrapper = makeWrapper(
      { hyperlinkUrl: '/patient/{patientUuid}/summary' },
      { patientUuid: 'test-uuid-123' }
    );
    const anchor = wrapper.find('a[data-bahmni-hyperlink]');
    expect(anchor).to.have.length(1);
    expect(anchor.prop('href')).to.equal('/patient/test-uuid-123/summary');
  });

  it('should render existing control fields (backward compat: no regression)', () => {
    const wrapper = makeWrapper({});
    expect(wrapper).to.have.descendants('DummyControl');
  });
});
