import React from 'react';
import { mount, shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { NumericBox } from 'components/NumericBox.jsx';
import { Validator } from 'src/helpers/Validator';
import sinon from 'sinon';
import { ObsMapper } from 'src/helpers/ObsMapper';
import { Obs } from 'src/helpers/Obs';

chai.use(chaiEnzyme());

describe('NumericBox', () => {
  before(() => {
    window.componentStore.registerComponent('numeric', NumericBox);
  });

  after(() => {
    window.componentStore.deRegisterComponent('numeric');
  });

  const concept = {
    uuid: '70645842-be6a-4974-8d5f-45b52990e132',
    name: 'Pulse',
    dataType: 'Numeric',
    properties: {
      allowDecimal: true,
    },
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
    type: 'numeric',
    concept,
    properties,
  };

  const obs = {
    observationDateTime: '2016-09-08T10:10:38.000+0530',
    uuid: 'someUuid',
    value: '007',
    voided: false,
  };

  const formUuid = 'f1';

  const formNamespace = `${formUuid}/100`;

  function getMapper(obsData) {
    const observation = new Obs(formUuid, metadata, obsData);
    return new ObsMapper(observation);
  }

  it('should render NumericBox', () => {
    const mapper = getMapper(undefined);
    const wrapper = shallow(
      <NumericBox errors={[]} formUuid={formUuid} mapper={mapper} metadata={metadata} />
    );
    expect(wrapper.find('input').props().type).to.be.eql('number');
    expect(wrapper.find('input')).to.have.value(undefined);
  });

  it('should render NumericBox with errors if error is present', () => {
    const mapper = getMapper(undefined);
    const errors = [{ controlId: '100' }];
    const wrapper = shallow(
      <NumericBox errors={[]} formUuid={formUuid} mapper={mapper} metadata={metadata} />
    );
    wrapper.setProps({ errors });
    expect(wrapper.find('input')).to.have.className('form-builder-error');
  });

  it('should not render NumericBox with errors if error is present for control', () => {
    const mapper = getMapper(undefined);
    const errors = [{ controlId: 'someOtherId' }, { controlId: 'differentId' }];
    const wrapper = shallow(
      <NumericBox errors={errors} formUuid={formUuid} mapper={mapper} metadata={metadata} />
    );
    expect(wrapper.find('input')).to.have.className('');
  });

  it('should render NumericBox with default value', () => {
    const mapper = getMapper(obs);
    const wrapper = mount(
      <NumericBox errors={[]} formUuid={formUuid} mapper={mapper} metadata={metadata} />
    );
    expect(wrapper.find('input').props().type).to.be.eql('number');
    expect(wrapper.find('input')).to.have.value('007');
  });

  it('should get the default value of the NumericBox if there is no change', () => {
    const mapper = getMapper(obs);
    const expectedObs = {
      concept,
      formNamespace,
      observationDateTime: '2016-09-08T10:10:38.000+0530',
      uuid: 'someUuid',
      value: '007',
      voided: false,
    };
    const wrapper = shallow(
      <NumericBox errors={[]} formUuid={formUuid} mapper={mapper} metadata={metadata} />
    );
    const instance = wrapper.instance();
    expect(instance.getValue()).to.eql(expectedObs);
  });

  it('should get user entered value of the NumericBox', () => {
    const mapper = getMapper(obs);
    const expectedObs = {
      concept,
      formNamespace,
      observationDateTime: null,
      uuid: 'someUuid',
      value: '999',
      voided: false,
    };
    const wrapper = shallow(
      <NumericBox errors={[]} formUuid={formUuid} mapper={mapper} metadata={metadata} />
    );
    const instance = wrapper.instance();
    wrapper.find('input').simulate('change', { target: { value: '999' } });
    expect(instance.getValue()).to.eql(expectedObs);
  });

  it('should return value only if there was initial value or if the value was changed', () => {
    const mapper = getMapper(undefined);
    const wrapper = shallow(
      <NumericBox errors={[]} formUuid={formUuid} mapper={mapper} metadata={metadata} />
    );
    const instance = wrapper.instance();
    expect(instance.getValue()).to.eql(undefined);
  });

  it('getErrors should return errors for its and concept properties if present', () => {
    const mapper = getMapper(undefined);
    const stub = sinon.stub(Validator, 'getErrors');
    const allProperties = Object.assign({}, properties, concept.properties);
    const controlDetails = { id: '100', properties: allProperties, value: '999' };
    stub.withArgs(controlDetails).returns([{ errorType: 'something' }]);

    const wrapper = shallow(
      <NumericBox errors={[]} formUuid={formUuid} mapper={mapper} metadata={metadata} />
    );
    const instance = wrapper.instance();
    wrapper.find('input').simulate('change', { target: { value: '999' } });
    expect(instance.getErrors()).to.eql([{ errorType: 'something' }]);
  });

  it('should return the voided obs if value is removed', () => {
    const mapper = getMapper(obs);
    const expectedObs = {
      concept,
      formNamespace,
      observationDateTime: '2016-09-08T10:10:38.000+0530',
      uuid: 'someUuid',
      value: '007',
      voided: true,
    };

    const wrapper = shallow(
      <NumericBox errors={[]} formUuid={formUuid} mapper={mapper} metadata={metadata} />
    );
    const instance = wrapper.instance();

    wrapper.find('input').simulate('change', { target: { value: '' } });

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
      formNamespace,
      observationDateTime: null,
      uuid: undefined,
      value: '100',
      voided: false,
    };

    const wrapper = shallow(
      <NumericBox errors={[]} formUuid={formUuid} mapper={mapper} metadata={metadata} />
    );
    const instance = wrapper.instance();
    wrapper.find('input').simulate('change', { target: { value: '100' } });

    expect(instance.getValue()).to.eql(expectedObs);
  });
});
