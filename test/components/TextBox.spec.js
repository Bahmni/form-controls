import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { TextBox } from 'src/components/TextBox.jsx';
import { Validator } from 'src/helpers/Validator';
import sinon from 'sinon';
import { Obs } from 'src/helpers/Obs';
import { ObsMapper } from 'src/helpers/ObsMapper';

chai.use(chaiEnzyme());

describe('TextBox', () => {
  before(() => {
    window.componentStore.registerComponent('text', TextBox);
  });

  after(() => {
    window.componentStore.deRegisterComponent('text');
  });

  const concept = {
    uuid: '70645842-be6a-4974-8d5f-45b52990e132',
    name: 'Pulse',
    dataType: 'Text',
  };

  const properties = {
    location: {
      row: 0,
      column: 0,
    },
    mandatory: true,
  };

  const metadata = {
    id: '100',
    type: 'text',
    concept,
    properties,
  };

  const obs = {
    observationDateTime: '2016-09-08T10:10:38.000+0530',
    uuid: 'someUuid',
    value: 'someValue',
  };

  const formUuid = 'someFormUuid';

  function getMapper(obsData) {
    const observation = new Obs(formUuid, metadata, obsData);
    return new ObsMapper(observation);
  }

  it('should render TextBox', () => {
    const mapper = getMapper(undefined);
    const wrapper = shallow(
      <TextBox errors={[]} formUuid={formUuid} mapper={mapper} metadata={metadata} />
    );
    expect(wrapper).to.have.descendants('textarea');
    expect(wrapper.find('textarea').props().defaultValue).to.eql(undefined);
  });

  it('should render TextBox with errors if error is present', () => {
    const mapper = getMapper(undefined);
    const errors = [{ controlId: '100' }];
    const wrapper = shallow(
      <TextBox errors={[]} formUuid={formUuid} mapper={mapper} metadata={metadata} />
    );
    wrapper.setProps({ errors });
    expect(wrapper.find('textarea')).to.have.className('form-builder-error');
  });

  it('should not render TextBox with errors if error is present for control', () => {
    const mapper = getMapper(undefined);
    const errors = [{ controlId: 'someOtherId' }, { controlId: 'differentId' }];
    const wrapper = shallow(
      <TextBox errors={errors} formUuid={formUuid} mapper={mapper} metadata={metadata} />
    );
    expect(wrapper.find('textarea')).to.have.className('');
  });

  it('should render TextBox with default value', () => {
    const mapper = getMapper(obs);
    const wrapper = shallow(
      <TextBox errors={[]} formUuid={formUuid} mapper={mapper} metadata={metadata} />
    );
    expect(wrapper.find('textarea').props().defaultValue).to.be.eql('someValue');
  });

  it('should return the default value of the text box if there is no change', () => {
    const mapper = getMapper(obs);
    const expectedObs = new Obs(formUuid, metadata, obs);
    const wrapper = shallow(
      <TextBox errors={[]} formUuid={formUuid} mapper={mapper} metadata={metadata} />
    );
    const instance = wrapper.instance();
    expect(instance.getValue()).to.eql(expectedObs);
  });

  it('should get user entered value of the text box', () => {
    const mapper = getMapper(obs);
    const expectedObs = {
      concept,
      formNamespace: 'someFormUuid/100',
      observationDateTime: null,
      uuid: 'someUuid',
      value: 'My new value',
      voided: false,
      comment: undefined,
    };

    const wrapper = shallow(
      <TextBox errors={[]} formUuid={formUuid} mapper={mapper} metadata={metadata} />
    );
    const instance = wrapper.instance();
    wrapper.find('textarea').simulate('change', { target: { value: 'My new value' } });

    expect(instance.getValue()).to.eql(expectedObs);
  });

  it('should return value only if there was initial value or if the value was changed', () => {
    const mapper = getMapper(undefined);
    const wrapper = shallow(
      <TextBox errors={[]} formUuid={formUuid} mapper={mapper} metadata={metadata} />
    );
    const instance = wrapper.instance();
    expect(instance.getValue()).to.eql(undefined);
  });

  it('getErrors should return errors if present', () => {
    const mapper = getMapper(undefined);
    const stub = sinon.stub(Validator, 'getErrors');
    const controlDetails = { id: '100', properties, value: 'My new value' };
    stub.withArgs(controlDetails).returns([{ errorType: 'something' }]);

    const wrapper = shallow(
      <TextBox errors={[]} formUuid={formUuid} mapper={mapper} metadata={metadata} />
    );
    const instance = wrapper.instance();
    wrapper.find('textarea').simulate('change', { target: { value: 'My new value' } });
    expect(instance.getErrors()).to.eql([{ errorType: 'something' }]);
  });

  it('should return the voided obs if value is removed', () => {
    const mapper = getMapper(obs);
    const expectedObs = {
      concept,
      formNamespace: 'someFormUuid/100',
      uuid: 'someUuid',
      value: 'someValue',
      observationDateTime: '2016-09-08T10:10:38.000+0530',
      voided: true,
      comment: undefined,
    };

    const wrapper = shallow(
      <TextBox errors={[]} formUuid={formUuid} mapper={mapper} metadata={metadata} />
    );
    const instance = wrapper.instance();
    wrapper.find('textarea').simulate('change', { target: { value: '' } });

    expect(instance.getValue()).to.eql(expectedObs);
  });

  it('should return the obs when previously voided obs is changed', () => {
    const voidedObs = {
      value: '',
      voided: true,
      observationDateTime: '2016-09-08T10:10:38.000+0530',
    };
    const mapper = getMapper(voidedObs);
    const expectedObs = {
      concept,
      formNamespace: 'someFormUuid/100',
      uuid: undefined,
      value: 'something',
      observationDateTime: null,
      voided: false,
      comment: undefined,
    };

    const wrapper = shallow(
      <TextBox errors={[]} formUuid={formUuid} mapper={mapper} metadata={metadata} />
    );
    const instance = wrapper.instance();
    wrapper.find('textarea').simulate('change', { target: { value: 'something' } });

    expect(instance.getValue()).to.eql(expectedObs);
  });
});
