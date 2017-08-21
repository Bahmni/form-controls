import React from 'react';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { ComplexControl } from 'src/components/ComplexControl.jsx';
import sinon from 'sinon';
import ComponentStore from 'src/helpers/componentStore';

chai.use(chaiEnzyme());


describe('Complex Control', () => {
  let onChangeSpy;
  let wrapper;
  let addMoreSpy;
  let showNotificationSpy;
  const formFieldPath = 'test1.1/1-0';

  const DummyControl = () => <input />;

  beforeEach(() => {
    ComponentStore.registerComponent('someHandler', DummyControl);
    onChangeSpy = sinon.spy();
    addMoreSpy = sinon.spy();
    showNotificationSpy = sinon.spy();
  });

  afterEach(() => {
    ComponentStore.deRegisterComponent('someHandler');
  });

  it('should render ComplexControl if ', () => {
    wrapper = mount(
      <ComplexControl
        addMore
        conceptHandler={'someHandler'}
        formFieldPath={formFieldPath}
        onChange={onChangeSpy}
        onControlAdd={addMoreSpy}
        showNotification={showNotificationSpy}
        validate={false}
        validations={[]}
      />);
    expect(wrapper).to.have.exactly(1).descendants('DummyControl');
    expect(wrapper.find('DummyControl')).to.have.prop('formFieldPath').to.deep.eql(formFieldPath);
    expect(wrapper.find('DummyControl')).to.have.prop('onChange').to.deep.eql(onChangeSpy);
    expect(wrapper.find('DummyControl')).to.have.prop('onControlAdd').to.deep.eql(addMoreSpy);
  });

  it('should not render complex Control if corresponding control is not registered', () => {
    ComponentStore.deRegisterComponent('someHandler');
    wrapper = mount(
      <ComplexControl
        addMore
        conceptHandler={'someHandler'}
        formFieldPath={formFieldPath}
        onChange={onChangeSpy}
        onControlAdd={addMoreSpy}
        showNotification={showNotificationSpy}
        validate={false}
        validations={[]}
      />);
    expect(wrapper).to.be.blank();
    expect(wrapper).to.not.have.descendants('DummyControl');
  });
});
