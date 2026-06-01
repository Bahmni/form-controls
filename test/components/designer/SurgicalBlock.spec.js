import React from 'react';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { SurgicalBlockDesigner } from 'components/designer/SurgicalBlock.jsx';
import sinon from 'sinon';
import { httpInterceptor } from 'src/helpers/httpInterceptor';

chai.use(chaiEnzyme());
const sinonStubPromise = require('sinon-stub-promise');
sinonStubPromise(sinon);

describe('SurgicalBlockDesigner', () => {
  let wrapper;
  let metadata;
  let surgicalBlockStub;

  const surgicalBlockData = {
    results: [
      {
        uuid: 'block-uuid-1',
        startDatetime: '2026-05-15T08:00:00.000+0000',
        provider: { person: { display: 'Dr. Smith' } },
      },
    ],
  };

  const expectedOptions = [
    { id: 'block-uuid-1', name: '15/05/2026 - Dr. Smith' },
  ];

  beforeEach(() => {
    metadata = {
      concept: {
        name: 'Select Surgery',
        uuid: 'someUuid',
        datatype: 'Complex',
        handler: 'SurgicalBlockObsHandler',
      },
      type: 'obsControl',
      id: 'someId',
      properties: { style: 'autocomplete' },
    };
    surgicalBlockStub = sinon.stub(httpInterceptor, 'get');
  });

  afterEach(() => surgicalBlockStub.restore());

  it('should render the surgical block designer autocomplete component', () => {
    surgicalBlockStub.returnsPromise().resolves(surgicalBlockData);
    wrapper = mount(<SurgicalBlockDesigner metadata={metadata} />);
    expect(wrapper).to.have.exactly(1).descendants('AutoComplete');
    expect(wrapper.find('AutoComplete')).to.have.prop('asynchronous').to.eql(false);
    expect(wrapper.find('AutoComplete')).to.have.prop('options').to.eql(expectedOptions);
    expect(wrapper.find('AutoComplete')).to.have.prop('searchable').to.eql(true);
    expect(wrapper.find('AutoComplete')).to.have.prop('minimumInput').to.eql(2);
    expect(wrapper.find('AutoComplete')).to.have.prop('labelKey').to.eql('name');
    expect(wrapper.find('AutoComplete')).to.have.prop('valueKey').to.eql('id');
  });

  it('should render the surgical block designer dropdown component', () => {
    surgicalBlockStub.returnsPromise().resolves(surgicalBlockData);
    metadata.properties.style = 'dropdown';
    wrapper = mount(<SurgicalBlockDesigner metadata={metadata} />);
    expect(wrapper).to.have.exactly(1).descendants('AutoComplete');
    expect(wrapper.find('AutoComplete')).to.have.prop('options').to.eql(expectedOptions);
    expect(wrapper.find('AutoComplete')).to.have.prop('searchable').to.eql(false);
    expect(wrapper.find('AutoComplete')).to.have.prop('minimumInput').to.eql(0);
    expect(wrapper.find('AutoComplete')).to.have.prop('labelKey').to.eql('name');
    expect(wrapper.find('AutoComplete')).to.have.prop('valueKey').to.eql('id');
  });

  it('should call setError when API call fails', () => {
    const setErrorSpy = sinon.spy();
    surgicalBlockStub.returnsPromise().rejects('error');
    wrapper = mount(<SurgicalBlockDesigner metadata={metadata} setError={setErrorSpy} />);
    sinon.assert.calledOnce(setErrorSpy.withArgs({ message: 'Invalid Surgical Block URL' }));
  });
});
