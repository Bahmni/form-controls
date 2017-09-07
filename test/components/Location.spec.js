import React from 'react';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { Location } from 'components/Location.jsx';
import sinon from 'sinon';
import { httpInterceptor } from 'src/helpers/httpInterceptor';
import Constants from 'src/constants';

chai.use(chaiEnzyme());
const sinonStubPromise = require('sinon-stub-promise');
sinonStubPromise(sinon);

describe('Location', () => {
  let wrapper;
  let locationDataStub;
  const locationData = {
    results: [{ name: 'loc1', id: 1 }, { name: 'loc2', id: 2 }],
  };
  let onChangeSpy;
  let showNotificationSpy;
  const formFieldPath = 'test1.1/1-0';
  const properties = { URL: 'someUrl', style: 'autocomplete' };
  beforeEach(() => {
    onChangeSpy = sinon.spy();
    showNotificationSpy = sinon.spy();
    locationDataStub = sinon.stub(httpInterceptor, 'get');
  });

  afterEach(() => locationDataStub.restore());

  it('should render the Location autocomplete component', () => {
    locationDataStub.returnsPromise().resolves(locationData);
    wrapper = mount(
      <Location
        addMore
        formFieldPath={formFieldPath}
        onChange={onChangeSpy}
        properties={properties}
        showNotification={showNotificationSpy}
        validate={false}
        validations={[]}
      />);
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
    properties.style = 'dropdown';
    wrapper = mount(
      <Location
        addMore
        formFieldPath={formFieldPath}
        onChange={onChangeSpy}
        properties={properties}
        showNotification={showNotificationSpy}
        validate={false}
        validations={[]}
        value={'1'}
      />);
    expect(wrapper).to.have.exactly(1).descendants('AutoComplete');
    expect(wrapper.find('AutoComplete')).to.have.prop('options').to.eql(locationData.results);
    expect(wrapper.find('AutoComplete')).to.have.prop('searchable').to.eql(false);
    expect(wrapper.find('AutoComplete')).to.have.prop('minimumInput').to.eql(0);
    expect(wrapper.find('AutoComplete')).to.have.prop('labelKey').to.eql('name');
    expect(wrapper.find('AutoComplete')).to.have.prop('valueKey').to.eql('id');
    expect(wrapper.find('AutoComplete')).to.have.prop('value').to.eql(locationData.results[0]);
  });


  it('should throw error if given URL is invalid', () => {
    locationDataStub.returnsPromise().rejects('error');
    wrapper = mount(
      <Location
        addMore
        formFieldPath={formFieldPath}
        onChange={onChangeSpy}
        properties={properties}
        showNotification={showNotificationSpy}
        validate={false}
        validations={[]}
      />);
    sinon.assert.calledOnce(
      showNotificationSpy.withArgs('Failed to fetch location data', Constants.messageType.error));
  });

  it('should return the selected value from the AutoComplete', () => {
    locationDataStub.returnsPromise().resolves(locationData);
    wrapper = mount(
      <Location
        addMore
        formFieldPath={formFieldPath}
        onChange={onChangeSpy}
        properties={properties}
        showNotification={showNotificationSpy}
        validate={false}
        validations={[]}
      />);
    const onValueChange = wrapper.find('AutoComplete').props().onValueChange;
    onValueChange(locationData.results[0], []);
    sinon.assert.calledOnce(onChangeSpy.withArgs(1, []));
  });
});
