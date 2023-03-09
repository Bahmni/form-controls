import React from 'react';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { CodedControl } from 'components/CodedControl.jsx';
import sinon from 'sinon';
import constants from 'src/constants';
import ComponentStore from 'src/helpers/componentStore';
import { mountWithIntl } from '../intlEnzymeTest.js';
import { httpInterceptor } from 'src/helpers/httpInterceptor';

chai.use(chaiEnzyme());
const sinonStubPromise = require('sinon-stub-promise');
sinonStubPromise(sinon);

describe('CodedControl', () => {
  const DummyControl = () => <input />;

  const options = [
    { translationKey: 'ANSWER_1', name: { display: 'Answer1' }, uuid: 'answer1uuid' },
    { translationKey: 'ANSWER_2', name: { display: 'Answer2' }, uuid: 'answer2uuid' },
    { translationKey: 'ANSWER_3', name: { display: 'Answer3' }, uuid: 'answer3uuid' },
    { translationKey: 'ANSWER_4', name: { display: 'Answer4' }, uuid: 'answer4uuid' },
    { translationKey: 'ANSWER_5', name: { display: 'Answer5' }, uuid: 'answer5uuid' },
  ];

  const expectedOptions = [
    { name: 'Answer1', value: 'answer1uuid' },
    { name: 'Answer2', value: 'answer2uuid' },
    { name: 'Answer3', value: 'answer3uuid' },
    { name: 'Answer4', value: 'answer4uuid' },
    { name: 'Answer5', value: 'answer5uuid' },
  ];

  let codedDataStub;
  const codedData = {
    expansion: {
      contains: [
        {
          display: 'Yes',
          code: 'yes',
          system: 'http://snomed.info/sct',
        },
        {
          display: 'No',
          code: 'no',
          system: 'http://snomed.info/sct',
        },
      ],
    },
  };

  let onChangeSpy;
  let showNotificationSpy;

  context('when FHIR Value set url is provided', () => {
    const properties = { URL: 'someUrl' };

    beforeEach(() => {
      onChangeSpy = sinon.spy();
      showNotificationSpy = sinon.spy();
      codedDataStub = sinon.stub(httpInterceptor, 'get');
      codedDataStub.returnsPromise().resolves(codedData);
    });

    afterEach(() => {
      codedDataStub.restore();
    });

    it('should fetch coded data from the url', () => {
      mountWithIntl(
        <CodedControl
          enabled
          onChange={onChangeSpy}
          options={options}
          properties={properties}
          showNotification={showNotificationSpy}
          validate={false}
          validateForm={false}
          validations={[]}
        />
      );

      sinon.assert.calledOnce(codedDataStub.withArgs(properties.URL));
    });

    it('should show notification when fetch fails', () => {
      codedDataStub.returnsPromise().rejects('error');
      mountWithIntl(
        <CodedControl
          enabled
          onChange={onChangeSpy}
          options={options}
          properties={properties}
          showNotification={showNotificationSpy}
          validate={false}
          validateForm={false}
          validations={[]}
        />
      );

      sinon.assert.calledOnce(
        showNotificationSpy.withArgs(
          'Failed to fetch answers',
          constants.messageType.error
        )
      );
    });
  });


  before(() => {
    ComponentStore.registerComponent('button', DummyControl);
  });

  after(() => {
    ComponentStore.deRegisterComponent('button');
  });


  beforeEach(() => {
    onChangeSpy = sinon.spy();
  });

  const validations = [constants.validations.allowDecimal, constants.validations.mandatory];

  it('should render Dummy Control of displayType button by default', () => {
    const wrapper = mountWithIntl(
      <CodedControl
        enabled
        onChange={onChangeSpy}
        options={options}
        properties={{}}
        validate={false}
        validateForm={false}
        validations={validations}
      />
    );

    expect(wrapper).to.have.exactly(1).descendants('DummyControl');
    expect(Object.keys(wrapper.find('DummyControl').props())).to.have.length(10);

    expect(wrapper.find('DummyControl')).to.have.prop('validate').to.deep.eql(false);
    expect(wrapper.find('DummyControl')).to.have.prop('validations').to.deep.eql(validations);
    expect(wrapper.find('DummyControl')).to.have.prop('options').to.deep.eql(expectedOptions);
    expect(wrapper.find('DummyControl')).to.have.prop('enabled').to.deep.eql(true);
  });

  it('should render Dummy Control with default value', () => {
    const wrapper = mountWithIntl(
      <CodedControl
        onChange={onChangeSpy}
        options={options}
        properties={{}}
        validate={false}
        validateForm={false}
        validations={validations}
        value={{ name: 'Answer1', uuid: 'answer1uuid' }}
      />
    );

    expect(wrapper).to.have.exactly(1).descendants('DummyControl');
    expect(Object.keys(wrapper.find('DummyControl').props())).to.have.length(10);

    expect(wrapper.find('DummyControl')).to.have.prop('validate').to.deep.eql(false);
    expect(wrapper.find('DummyControl')).to.have.prop('validateForm').to.deep.eql(false);
    expect(wrapper.find('DummyControl')).to.have.prop('validations').to.deep.eql(validations);
    expect(wrapper.find('DummyControl')).to.have.prop('value').
        to.deep.eql({ name: 'Answer1', value: 'answer1uuid' });
  });


  it('should return null when registered component not found', () => {
    ComponentStore.deRegisterComponent('button');
    const wrapper = mountWithIntl(
      <CodedControl
        onChange={onChangeSpy}
        options={options}
        properties={{}}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );
    expect(wrapper).to.be.blank();
    ComponentStore.registerComponent('button', DummyControl);
  });

  it('should return the coded button control value', () => {
    const wrapper = mountWithIntl(
      <CodedControl
        onChange={onChangeSpy}
        options={options}
        properties={{}}
        validate={false}
        validateForm={false}
        validations={[]}
      />);
    const instance = wrapper.instance();
    instance.onValueChange({ value: 'answer1uuid' }, []);
    sinon.assert.calledOnce(onChangeSpy.withArgs({ value: options[0], errors: [],
      triggerControlEvent: undefined }));
  });

  it('should return the autoComplete control value', () => {
    ComponentStore.registerComponent('autoComplete', DummyControl);
    const wrapper = mountWithIntl(
      <CodedControl
        onChange={onChangeSpy}
        options={options}
        properties={{ autoComplete: true }}
        validate={false}
        validateForm={false}
        validations={[]}
      />);
    expect(wrapper.find('DummyControl')).to.have.prop('asynchronous').to.eql(false);
    expect(wrapper.find('DummyControl')).to.have.prop('labelKey').to.eql('name');
    const instance = wrapper.instance();
    instance.onValueChange({ value: 'answer1uuid' }, []);
    sinon.assert.calledOnce(onChangeSpy.withArgs({ value: options[0], errors: [],
      triggerControlEvent: undefined }));
    ComponentStore.deRegisterComponent('autoComplete');
  });

  it('should validate in state on change of props', () => {
    const wrapper = mountWithIntl(
      <CodedControl
        onChange={onChangeSpy}
        options={options}
        properties={{}}
        validate={false}
        validateForm={false}
        validations={[]}
      />);
    expect(wrapper.find('DummyControl')).to.have.prop('validate').to.deep.eql(false);
    wrapper.setProps({ validate: true });

    expect(wrapper.find('DummyControl')).to.have.prop('validate').to.deep.eql(true);
  });

  it('should not set errors in state if props are same', () => {
    const wrapper = mountWithIntl(
      <CodedControl
        onChange={onChangeSpy}
        options={options}
        properties={{}}
        validate={false}
        validateForm={false}
        validations={[]}
      />);
    expect(wrapper.find('DummyControl')).to.have.prop('validate').to.deep.eql(false);
    wrapper.setProps({ validate: true });

    expect(wrapper.find('DummyControl')).to.have.prop('validate').to.deep.eql(true);
  });

  it('should render multiselect coded control with default values', () => {
    ComponentStore.registerComponent('autoComplete', DummyControl);
    const wrapper = mountWithIntl(
      <CodedControl
        onChange={onChangeSpy}
        options={options}
        properties={{ autoComplete: true, multiSelect: true }}
        validate={false}
        validateForm={false}
        validations={validations}
        value={[options[0], options[1]]}
      />
    );

    expect(wrapper).to.have.exactly(1).descendants('DummyControl');
    expect(Object.keys(wrapper.find('DummyControl').props())).to.have.length(13);

    expect(wrapper.find('DummyControl')).to.have.prop('validate').to.deep.eql(false);
    expect(wrapper.find('DummyControl')).to.have.prop('validateForm').to.deep.eql(false);
    expect(wrapper.find('DummyControl')).to.have.prop('validations').to.deep.eql(validations);
    expect(wrapper.find('DummyControl')).to.have.prop('value').
    to.deep.eql([expectedOptions[0], expectedOptions[1]]);

    expect(wrapper.find('DummyControl')).to.have.prop('options').to.deep.eql(expectedOptions);
    ComponentStore.deRegisterComponent('autoComplete');
  });

  it('should return multiselect values from coded control', () => {
    ComponentStore.registerComponent('autoComplete', DummyControl);
    const wrapper = mountWithIntl(
      <CodedControl
        onChange={onChangeSpy}
        options={options}
        properties={{ autoComplete: true, multiSelect: true }}
        validate={false}
        validateForm={false}
        validations={[]}
      />);
    const instance = wrapper.instance();
    instance.onValueChange([expectedOptions[0], expectedOptions[2]], []);
    sinon.assert.calledOnce(onChangeSpy.withArgs({ value: [options[0], options[2]], errors: [],
      triggerControlEvent: undefined }));
    ComponentStore.deRegisterComponent('autoComplete');
  });

  it('should return undefined if no value is selected', () => {
    const wrapper = mountWithIntl(
      <CodedControl
        onChange={onChangeSpy}
        options={options}
        properties={{}}
        validate={false}
        validateForm={false}
        validations={[]}
      />);
    const instance = wrapper.instance();
    instance.onValueChange(undefined, []);
    sinon.assert.calledOnce(onChangeSpy.withArgs({ value: undefined, errors: [],
      triggerControlEvent: undefined }));
  });
});
