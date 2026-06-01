import React from 'react';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { SurgicalBlock } from 'components/SurgicalBlock.jsx';
import sinon from 'sinon';
import { httpInterceptor } from 'src/helpers/httpInterceptor';
import Constants from 'src/constants';

chai.use(chaiEnzyme());
const sinonStubPromise = require('sinon-stub-promise');
sinonStubPromise(sinon);

describe('SurgicalBlock', () => {
  let wrapper;
  let surgicalBlockStub;
  let onChangeSpy;
  let showNotificationSpy;

  const formFieldPath = 'test1.1/1-0';
  const properties = { style: 'autocomplete' };

  const surgicalBlockData = {
    results: [
      {
        uuid: 'block-uuid-1',
        startDatetime: '2026-05-15T08:00:00.000+0000',
        provider: { person: { display: 'Dr. Smith' } },
        surgicalAppointments: [{ uuid: 'appt-uuid-1', patient: { uuid: 'patient-uuid-1' } }],
      },
      {
        uuid: 'block-uuid-2',
        startDatetime: '2026-05-20T10:00:00.000+0000',
        provider: { person: { display: 'Dr. Jones' } },
        surgicalAppointments: [{ uuid: 'appt-uuid-2', patient: { uuid: 'patient-uuid-2' } }],
      },
    ],
  };

  const expectedOptions = [
    { id: 'block-uuid-1', name: '15/05/2026 - Dr. Smith' },
    { id: 'block-uuid-2', name: '20/05/2026 - Dr. Jones' },
  ];

  beforeEach(() => {
    onChangeSpy = sinon.spy();
    showNotificationSpy = sinon.spy();
    surgicalBlockStub = sinon.stub(httpInterceptor, 'get');
  });

  afterEach(() => surgicalBlockStub.restore());

  it('should render the SurgicalBlock autocomplete component with formatted options', () => {
    surgicalBlockStub.returnsPromise().resolves(surgicalBlockData);
    wrapper = mount(
      <SurgicalBlock
        addMore
        formFieldPath={formFieldPath}
        onChange={onChangeSpy}
        properties={properties}
        showNotification={showNotificationSpy}
        validate={false}
        validations={[]}
      />
    );
    expect(wrapper).to.have.exactly(1).descendants('AutoComplete');
    expect(wrapper.find('AutoComplete')).to.have.prop('asynchronous').to.eql(false);
    expect(wrapper.find('AutoComplete')).to.have.prop('options').to.eql(expectedOptions);
    expect(wrapper.find('AutoComplete')).to.have.prop('searchable').to.eql(true);
    expect(wrapper.find('AutoComplete')).to.have.prop('minimumInput').to.eql(2);
    expect(wrapper.find('AutoComplete')).to.have.prop('labelKey').to.eql('name');
    expect(wrapper.find('AutoComplete')).to.have.prop('valueKey').to.eql('id');
  });

  it('should render as dropdown when style is not autocomplete', () => {
    surgicalBlockStub.returnsPromise().resolves(surgicalBlockData);
    wrapper = mount(
      <SurgicalBlock
        addMore
        formFieldPath={formFieldPath}
        onChange={onChangeSpy}
        properties={{ style: 'dropdown' }}
        showNotification={showNotificationSpy}
        validate={false}
        validations={[]}
        value={'block-uuid-1'}
      />
    );
    expect(wrapper.find('AutoComplete')).to.have.prop('searchable').to.eql(false);
    expect(wrapper.find('AutoComplete')).to.have.prop('minimumInput').to.eql(0);
    expect(wrapper.find('AutoComplete')).to.have.prop('value').to.eql(expectedOptions[0]);
  });

  it('should call the surgical block API with dynamic date parameters', () => {
    surgicalBlockStub.returnsPromise().resolves(surgicalBlockData);
    mount(
      <SurgicalBlock
        formFieldPath={formFieldPath}
        onChange={onChangeSpy}
        properties={properties}
        showNotification={showNotificationSpy}
        validate={false}
        validations={[]}
      />
    );
    sinon.assert.calledOnce(surgicalBlockStub);
    const calledUrl = surgicalBlockStub.getCall(0).args[0];
    expect(calledUrl).to.include('/openmrs/ws/rest/v1/surgicalBlock');
    expect(calledUrl).to.include('activeBlocks=true');
    expect(calledUrl).to.include('startDatetime=');
    expect(calledUrl).to.include('endDatetime=');
    expect(calledUrl).to.include('includeVoided=false');
  });

  it('should filter blocks by patient uuid when patient prop is provided', () => {
    surgicalBlockStub.returnsPromise().resolves(surgicalBlockData);
    wrapper = mount(
      <SurgicalBlock
        formFieldPath={formFieldPath}
        onChange={onChangeSpy}
        patientUuid={'patient-uuid-1'}
        properties={properties}
        showNotification={showNotificationSpy}
        validate={false}
        validations={[]}
      />
    );
    expect(wrapper.find('AutoComplete')).to.have.prop('options')
      .to.eql([{ id: 'block-uuid-1', name: '15/05/2026 - Dr. Smith' }]);
  });

  it('should show all blocks when patient prop is not provided', () => {
    surgicalBlockStub.returnsPromise().resolves(surgicalBlockData);
    wrapper = mount(
      <SurgicalBlock
        formFieldPath={formFieldPath}
        onChange={onChangeSpy}
        properties={properties}
        showNotification={showNotificationSpy}
        validate={false}
        validations={[]}
      />
    );
    expect(wrapper.find('AutoComplete')).to.have.prop('options').to.eql(expectedOptions);
  });

  it('should handle empty results gracefully', () => {
    surgicalBlockStub.returnsPromise().resolves({ results: [] });
    wrapper = mount(
      <SurgicalBlock
        formFieldPath={formFieldPath}
        onChange={onChangeSpy}
        properties={properties}
        showNotification={showNotificationSpy}
        validate={false}
        validations={[]}
      />
    );
    expect(wrapper.find('AutoComplete')).to.have.prop('options').to.eql([]);
  });

  it('should show notification when API call fails', () => {
    surgicalBlockStub.returnsPromise().rejects('error');
    mount(
      <SurgicalBlock
        formFieldPath={formFieldPath}
        onChange={onChangeSpy}
        properties={properties}
        showNotification={showNotificationSpy}
        validate={false}
        validations={[]}
      />
    );
    sinon.assert.calledOnce(
      showNotificationSpy.withArgs('Failed to fetch surgical blocks', Constants.messageType.error)
    );
  });

  it('should return the selected block uuid on value change', () => {
    surgicalBlockStub.returnsPromise().resolves(surgicalBlockData);
    wrapper = mount(
      <SurgicalBlock
        formFieldPath={formFieldPath}
        onChange={onChangeSpy}
        properties={properties}
        showNotification={showNotificationSpy}
        validate={false}
        validations={[]}
      />
    );
    const onValueChange = wrapper.find('AutoComplete').props().onValueChange;
    onValueChange(expectedOptions[0], []);
    sinon.assert.calledOnce(onChangeSpy.withArgs({ value: 'block-uuid-1', errors: [] }));
  });

  it('should return undefined when selection is cleared', () => {
    surgicalBlockStub.returnsPromise().resolves(surgicalBlockData);
    wrapper = mount(
      <SurgicalBlock
        formFieldPath={formFieldPath}
        onChange={onChangeSpy}
        properties={properties}
        showNotification={showNotificationSpy}
        validate={false}
        validations={[]}
      />
    );
    const onValueChange = wrapper.find('AutoComplete').props().onValueChange;
    onValueChange(null, []);
    sinon.assert.calledOnce(onChangeSpy.withArgs({ value: undefined, errors: [] }));
  });
});
