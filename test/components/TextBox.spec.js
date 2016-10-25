import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { TextBox } from '../../src/components/TextBox.jsx';
import { Validator } from 'src/helpers/Validator';
import sinon from 'sinon';

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
    value: 'someValue',
    observationDateTime: '2016-09-08T10:10:38.000+0530',
  };

  const formUuid = 'someFormUuid';

  const formNamespace = `${formUuid}/100`;

  it('should render TextBox', () => {
    const wrapper = shallow(<TextBox formUuid={formUuid} metadata={metadata} />);
    expect(wrapper.find('input').props().type).to.be.eql('text');
    expect(wrapper.find('input').props().defaultValue).to.eql(undefined);
  });

  it('should render TextBox with default value', () => {
    const wrapper = shallow(<TextBox formUuid={formUuid} metadata={metadata} obs={obs} />);
    expect(wrapper.find('input').props().type).to.be.eql('text');
    expect(wrapper.find('input').props().defaultValue).to.be.eql('someValue');
  });

  it('should return the default value of the text box if there is no change', () => {
    const expectedObs = {
      concept,
      value: 'someValue',
      observationDateTime: '2016-09-08T10:10:38.000+0530',
      formNamespace,
    };

    const wrapper = shallow(<TextBox formUuid={formUuid} metadata={metadata} obs={obs} />);
    const instance = wrapper.instance();

    expect(instance.getValue()).to.eql(expectedObs);
  });

  it('should get user entered value of the text box', () => {
    const expectedObs = {
      concept,
      value: 'My new value',
      observationDateTime: null,
      formNamespace,
    };

    const wrapper = shallow(<TextBox formUuid={formUuid} metadata={metadata} obs={obs} />);
    const instance = wrapper.instance();
    wrapper.find('input').simulate('change', { target: { value: 'My new value' } });

    expect(instance.getValue()).to.eql(expectedObs);
  });

  it('should return value only if there was initial value or if the value was changed', () => {
    const wrapper = shallow(<TextBox formUuid={formUuid} metadata={metadata} />);
    const instance = wrapper.instance();
    expect(instance.getValue()).to.eql(undefined);
  });

  it('getErrors should return errors if present', () => {
    const stub = sinon.stub(Validator, 'getErrors');
    const controlDetails = { id: '100', properties, value: 'My new value' };
    stub.withArgs(controlDetails).returns([{ errorType: 'something' }]);

    const wrapper = shallow(<TextBox formUuid={formUuid} metadata={metadata} />);
    const instance = wrapper.instance();
    wrapper.find('input').simulate('change', { target: { value: 'My new value' } });
    expect(instance.getErrors()).to.eql([{ errorType: 'something' }]);
  });

  it('should return the voided obs if value is set to undefined', () => {
    const expectedObs = {
      concept,
      value: 'someValue',
      observationDateTime: '2016-09-08T10:10:38.000+0530',
      formNamespace,
      voided: true,
    };

    const wrapper = shallow(<TextBox formUuid={formUuid} metadata={metadata} obs={obs} />);
    const instance = wrapper.instance();
    wrapper.find('input').simulate('change', { target: { value: '' } });

    expect(instance.getValue()).to.eql(expectedObs);
  });
});
