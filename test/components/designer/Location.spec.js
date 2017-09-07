import React from 'react';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { LocationDesigner } from 'components/designer/Location.jsx';
import sinon from 'sinon';
import { httpInterceptor } from 'src/helpers/httpInterceptor';

chai.use(chaiEnzyme());
const sinonStubPromise = require('sinon-stub-promise');
sinonStubPromise(sinon);

describe('LocationDesigner', () => {
  let wrapper;
  let metadata;
  let locationDataStub;
  const locationData = {
    results: [{ name: 'loc1', id: 1 }, { name: 'loc2', id: 2 }],
  };

  beforeEach(() => {
    metadata = {
      concept: {
        name: 'Location',
        uuid: 'someUuid',
        datatype: 'Complex',
        handler: 'LocationObsHandler',
      },
      type: 'obsControl',
      id: 'someId',
      properties: { style: 'autocomplete' },
    };
    locationDataStub = sinon.stub(httpInterceptor, 'get');
  });

  afterEach(() => locationDataStub.restore());

  it('should render the Location designer autocomplete component', () => {
    locationDataStub.returnsPromise().resolves(locationData);
    wrapper = mount(<LocationDesigner metadata={metadata} />);
    expect(wrapper).to.have.exactly(1).descendants('AutoComplete');
    expect(wrapper.find('AutoComplete')).to.have.prop('asynchronous').to.eql(false);
    expect(wrapper.find('AutoComplete')).to.have.prop('options').to.eql(locationData.results);
    expect(wrapper.find('AutoComplete')).to.have.prop('searchable').to.eql(true);
    expect(wrapper.find('AutoComplete')).to.have.prop('minimumInput').to.eql(2);
    expect(wrapper.find('AutoComplete')).to.have.prop('labelKey').to.eql('name');
    expect(wrapper.find('AutoComplete')).to.have.prop('valueKey').to.eql('id');
  });

  it('should render the Location designer dropdown component', () => {
    locationDataStub.returnsPromise().resolves(locationData);
    metadata.properties.style = 'dropdown';
    wrapper = mount(<LocationDesigner metadata={metadata} />);
    expect(wrapper).to.have.exactly(1).descendants('AutoComplete');
    expect(wrapper.find('AutoComplete')).to.have.prop('options').to.eql(locationData.results);
    expect(wrapper.find('AutoComplete')).to.have.prop('searchable').to.eql(false);
    expect(wrapper.find('AutoComplete')).to.have.prop('minimumInput').to.eql(0);
    expect(wrapper.find('AutoComplete')).to.have.prop('labelKey').to.eql('name');
    expect(wrapper.find('AutoComplete')).to.have.prop('valueKey').to.eql('id');
  });

  it('should throw error if given URL is invalid', () => {
    const setErrorSpy = sinon.spy();
    locationDataStub.returnsPromise().rejects('error');
    wrapper = mount(<LocationDesigner metadata={metadata} setError={setErrorSpy} />);
    sinon.assert.calledOnce(setErrorSpy.withArgs({ message: 'Invalid Location URL' }));
  });
});
