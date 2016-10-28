import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { NumericBox } from 'components/NumericBox.jsx';
import { Validator } from 'src/helpers/Validator';
import sinon from 'sinon';

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
    value: '007',
    observationDateTime: '2016-09-08T10:10:38.000+0530',
  };

  const formUuid = 'f1';

  const formNamespace = `${formUuid}/100`;

  it('should render NumericBox', () => {
    const wrapper = shallow(<NumericBox errors={[]} formUuid={formUuid} metadata={metadata} />);
    expect(wrapper.find('input').props().type).to.be.eql('number');
    expect(wrapper.find('input').props().defaultValue).to.be.eql(undefined);
  });

  it('should render NumericBox with errors if error is present', () => {
    const errors = [{ controlId: '100' }];
    const wrapper = shallow(<NumericBox errors={[]} formUuid={formUuid} metadata={metadata} />);
    wrapper.setProps({ errors });
    expect(wrapper.find('input')).to.have.className('form-builder-error');
  });

  it('should not render NumericBox with errors if error is present for control', () => {
    const errors = [{ controlId: 'someOtherId' }, { controlId: 'differentId' }];
    const wrapper = shallow(<NumericBox errors={errors} formUuid={formUuid} metadata={metadata} />);
    expect(wrapper.find('input')).to.have.className('');
  });

  it('should render NumericBox with default value', () => {
    const wrapper = shallow(
      <NumericBox errors={[]} formUuid={formUuid} metadata={metadata} obs={obs} />
    );
    expect(wrapper.find('input').props().type).to.be.eql('number');
    expect(wrapper.find('input').props().defaultValue).to.be.eql('007');
  });

  it('should get the default value of the NumericBox if there is no change', () => {
    const expectedObs = {
      concept,
      value: '007',
      observationDateTime: '2016-09-08T10:10:38.000+0530',
      formNamespace,
    };
    const wrapper = shallow(
      <NumericBox errors={[]} formUuid={formUuid} metadata={metadata} obs={obs} />
    );
    const instance = wrapper.instance();
    expect(instance.getValue()).to.eql(expectedObs);
  });

  it('should get user entered value of the NumericBox', () => {
    const expectedObs = {
      concept,
      value: '999',
      observationDateTime: null,
      formNamespace,
    };
    const wrapper = shallow(
      <NumericBox errors={[]} formUuid={formUuid} metadata={metadata} obs={obs} />
    );
    const instance = wrapper.instance();
    wrapper.find('input').simulate('change', { target: { value: '999' } });
    expect(instance.getValue()).to.eql(expectedObs);
  });

  it('should return value only if there was initial value or if the value was changed', () => {
    const wrapper = shallow(
      <NumericBox errors={[]} formUuid={formUuid} metadata={metadata} />
    );
    const instance = wrapper.instance();
    expect(instance.getValue()).to.eql(undefined);
  });

  it('getErrors should return errors for its and concept properties if present', () => {
    const stub = sinon.stub(Validator, 'getErrors');
    const allProperties = Object.assign({}, properties, concept.properties);
    const controlDetails = { id: '100', properties: allProperties, value: '999' };
    stub.withArgs(controlDetails).returns([{ errorType: 'something' }]);

    const wrapper = shallow(
      <NumericBox errors={[]} formUuid={formUuid} metadata={metadata} />
    );
    const instance = wrapper.instance();
    wrapper.find('input').simulate('change', { target: { value: '999' } });
    expect(instance.getErrors()).to.eql([{ errorType: 'something' }]);
  });

  it('should return the voided obs if value is set to undefined', () => {
    const expectedObs = {
      concept,
      value: '',
      observationDateTime: '2016-09-08T10:10:38.000+0530',
      formNamespace,
      voided: true,
    };

    const wrapper = shallow(
      <NumericBox errors={[]} formUuid={formUuid} metadata={metadata} obs={obs} />
    );
    const instance = wrapper.instance();
    wrapper.find('input').simulate('change', { target: { value: '' } });

    expect(instance.getValue()).to.eql(expectedObs);
  });
});
