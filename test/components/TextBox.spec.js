import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { TextBox } from 'src/components/TextBox.jsx';
import { Validator } from 'src/helpers/Validator';
import sinon from 'sinon';
import { Obs } from 'src/helpers/Obs';

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

  it('should render TextBox', () => {
    const wrapper = shallow(<TextBox errors={[]} formUuid={formUuid} metadata={metadata} />);
    expect(wrapper.find('input').props().type).to.be.eql('text');
    expect(wrapper.find('input').props().defaultValue).to.eql(undefined);
  });

  it('should render TextBox with errors if error is present', () => {
    const errors = [{ controlId: '100' }];
    const wrapper = shallow(<TextBox errors={[]} formUuid={formUuid} metadata={metadata} />);
    wrapper.setProps({ errors });
    expect(wrapper.find('input')).to.have.className('form-builder-error');
  });

  it('should not render TextBox with errors if error is present for control', () => {
    const errors = [{ controlId: 'someOtherId' }, { controlId: 'differentId' }];
    const wrapper = shallow(<TextBox errors={errors} formUuid={formUuid} metadata={metadata} />);
    expect(wrapper.find('input')).to.have.className('');
  });

  it('should render TextBox with default value', () => {
    const wrapper = shallow(
      <TextBox errors={[]} formUuid={formUuid} metadata={metadata} obs={obs} />
    );
    expect(wrapper.find('input').props().type).to.be.eql('text');
    expect(wrapper.find('input').props().defaultValue).to.be.eql('someValue');
  });

  it('should return the default value of the text box if there is no change', () => {
    const expectedObs = new Obs(formUuid, metadata, obs);
    const wrapper = shallow(
      <TextBox errors={[]} formUuid={formUuid} metadata={metadata} obs={obs} />
    );
    const instance = wrapper.instance();
    expect(instance.isDirty()).to.be.eql(false);
    expect(instance.getValue()).to.eql(expectedObs);
  });

  it('should get user entered value of the text box', () => {
    let expectedObs = new Obs(formUuid, metadata, undefined);
    expectedObs = expectedObs.set('My new value');

    const wrapper = shallow(
      <TextBox errors={[]} formUuid={formUuid} metadata={metadata} obs={obs} />
    );
    const instance = wrapper.instance();
    wrapper.find('input').simulate('change', { target: { value: 'My new value' } });

    expect(instance.isDirty()).to.be.eql(true);
    expect(instance.getValue()).to.eql(expectedObs);
  });

  it('should return value only if there was initial value or if the value was changed', () => {
    const wrapper = shallow(<TextBox errors={[]} formUuid={formUuid} metadata={metadata} />);
    const instance = wrapper.instance();
    expect(instance.getValue()).to.eql(undefined);
  });

  it('getErrors should return errors if present', () => {
    const stub = sinon.stub(Validator, 'getErrors');
    const controlDetails = { id: '100', properties, value: 'My new value' };
    stub.withArgs(controlDetails).returns([{ errorType: 'something' }]);

    const wrapper = shallow(<TextBox errors={[]} formUuid={formUuid} metadata={metadata} />);
    const instance = wrapper.instance();
    wrapper.find('input').simulate('change', { target: { value: 'My new value' } });
    expect(instance.getErrors()).to.eql([{ errorType: 'something' }]);
  });

  it('should return the voided obs if value is set to undefined', () => {
    const expectedObs = new Obs(formUuid, metadata, obs).void();

    const wrapper = shallow(
      <TextBox errors={[]} formUuid={formUuid} metadata={metadata} obs={obs} />
    );
    const instance = wrapper.instance();
    wrapper.find('input').simulate('change', { target: { value: '' } });

    expect(instance.getValue()).to.eql(expectedObs);
  });
});
