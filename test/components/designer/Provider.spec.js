import React from 'react';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { ProviderDesigner } from 'components/designer/Provider.jsx';
import sinon from 'sinon';
import { httpInterceptor } from 'src/helpers/httpInterceptor';

chai.use(chaiEnzyme());
const sinonStubPromise = require('sinon-stub-promise');
sinonStubPromise(sinon);

describe('ProviderDesigner', () => {
  let wrapper;
  let metadata;
  let providerDataStub;
  const providerData = {
    results: [{ name: 'user1', id: 1 }, { name: 'user2', id: 2 }],
  };

  beforeEach(() => {
    metadata = {
      concept: {
        name: 'Provider',
        uuid: 'someUuid',
        datatype: 'Complex',
        handler: 'ProviderObsHandler',
      },
      type: 'obsControl',
      id: 'someId',
      properties: { style: 'autocomplete' },
    };
    providerDataStub = sinon.stub(httpInterceptor, 'get');
  });

  afterEach(() => providerDataStub.restore());

  it('should render the provider designer autocomplete component', () => {
    providerDataStub.returnsPromise().resolves(providerData);
    wrapper = mount(<ProviderDesigner metadata={metadata} />);
    expect(wrapper).to.have.exactly(1).descendants('AutoComplete');
    expect(wrapper.find('AutoComplete')).to.have.prop('asynchronous').to.eql(false);
    expect(wrapper.find('AutoComplete')).to.have.prop('options').to.eql(providerData.results);
    expect(wrapper.find('AutoComplete')).to.have.prop('searchable').to.eql(true);
    expect(wrapper.find('AutoComplete')).to.have.prop('minimumInput').to.eql(2);
    expect(wrapper.find('AutoComplete')).to.have.prop('labelKey').to.eql('name');
    expect(wrapper.find('AutoComplete')).to.have.prop('valueKey').to.eql('id');
  });

  it('should render the provider designer dropdown component', () => {
    providerDataStub.returnsPromise().resolves(providerData);
    metadata.properties.style = 'dropdown';
    wrapper = mount(<ProviderDesigner metadata={metadata} />);
    expect(wrapper).to.have.exactly(1).descendants('AutoComplete');
    expect(wrapper.find('AutoComplete')).to.have.prop('options').to.eql(providerData.results);
    expect(wrapper.find('AutoComplete')).to.have.prop('searchable').to.eql(false);
    expect(wrapper.find('AutoComplete')).to.have.prop('minimumInput').to.eql(0);
    expect(wrapper.find('AutoComplete')).to.have.prop('labelKey').to.eql('name');
    expect(wrapper.find('AutoComplete')).to.have.prop('valueKey').to.eql('id');
  });

  it('should throw error if given URL is invalid', () => {
    const setErrorSpy = sinon.spy();
    providerDataStub.returnsPromise().rejects('error');
    wrapper = mount(<ProviderDesigner metadata={metadata} setError={setErrorSpy} />);
    sinon.assert.calledOnce(setErrorSpy.withArgs({ message: 'Invalid Provider URL' }));
  });
});
