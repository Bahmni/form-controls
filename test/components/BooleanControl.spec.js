import React, { Component, PropTypes } from 'react';
import { mount, shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { BooleanControl } from 'components/BooleanControl.jsx';
import sinon from 'sinon';

chai.use(chaiEnzyme());

class DummyRadioControl extends Component {
  getValue() {
    const value = this.props.obs && this.props.obs.value;
    return value;
  }

  getErrors() {
    return [{ errorType: 'somethingFromChild' }];
  }

  render() {
    return <input />;
  }
}

DummyRadioControl.propTypes = {
  obs: PropTypes.shape({ value: PropTypes.bool }),
};

describe('BooleanControl', () => {
  let metadata;
  before(() => {
    window.componentStore.registerComponent('button', DummyRadioControl);
  });

  after(() => {
    window.componentStore.deRegisterComponent('button');
  });

  const properties = {
    location: {
      row: 0,
      column: 0,
    },
    mandatory: true,
  };

  beforeEach(() => {
    metadata = {
      id: '100',
      type: 'obsControl',
      concept: {
        uuid: '70645842-be6a-4974-8d5f-45b52990e132',
        name: 'Pulse',
        datatype: 'Boolean',
      },
      properties,
      displayType: 'button',
      options: [
        { name: 'Yes', value: true },
        { name: 'No', value: false },
      ],
    };
  });

  const formUuid = 'someFormUuid';

  const formNamespace = `${formUuid}/100`;

  it('should render Dummy Control of displayType button by default', () => {
    const errors = [{ errorType: 'mandatory' }];
    const wrapper = shallow(
      <BooleanControl errors={errors} formUuid={formUuid} metadata={metadata} />
    );
    const expectedChildProps = { errors, formUuid, metadata };

    expect(wrapper).to.have.exactly(1).descendants('DummyRadioControl');
    expect(wrapper.find('DummyRadioControl').props()).to.deep.eql(expectedChildProps);
  });

  it('should render Dummy Control of specified displayType', () => {
    window.componentStore.registerComponent('radio', DummyRadioControl);
    const spy = sinon.spy(window.componentStore, 'getRegisteredComponent');
    const expectedMetadata = { errors: [], formUuid, metadata };

    metadata.displayType = 'radio';
    const wrapper = shallow(
      <BooleanControl errors={[]} formUuid={formUuid} metadata={metadata} />
    );

    sinon.assert.calledWith(spy, 'radio');
    expect(wrapper).to.have.exactly(1).descendants('DummyRadioControl');
    expect(wrapper.find('DummyRadioControl').props()).to.deep.eql(expectedMetadata);

    window.componentStore.deRegisterComponent('radio');
  });

  it('should return null when registered component not found', () => {
    metadata.displayType = 'somethingRandom';
    const wrapper = shallow(
      <BooleanControl errors={[]} formUuid={formUuid} metadata={metadata} />
    );
    expect(wrapper).to.be.blank();
  });

  it('should return the boolean control value', () => {
    const expectedObs = {
      concept: {
        uuid: '70645842-be6a-4974-8d5f-45b52990e132',
        name: 'Pulse',
        datatype: 'Boolean',
      },
      formNamespace,
      observationDateTime: undefined,
      value: true,
      voided: false,
    };
    const wrapper = mount(
      <BooleanControl
        errors={[]}
        formUuid={formUuid}
        metadata={metadata}
        obs={{ value: true }}
      />);
    const instance = wrapper.instance();
    expect(instance.getValue()).to.deep.eql(expectedObs);
  });

  it('should return the updated boolean control value', () => {
    const obs = {
      value: false,
      observationDateTime: '2016-09-08T10:10:38.000+0530',
    };
    const expectedObs = {
      concept: {
        uuid: '70645842-be6a-4974-8d5f-45b52990e132',
        name: 'Pulse',
        datatype: 'Boolean',
      },
      formNamespace,
      observationDateTime: '2016-09-08T10:10:38.000+0530',
      value: false,
      voided: false,
    };
    const wrapper = mount(
      <BooleanControl errors={[]} formUuid={formUuid} metadata={metadata} obs={obs} />
    );
    const instance = wrapper.instance();
    expect(instance.getValue()).to.deep.eql(expectedObs);
  });

  it('should return undefined when child value is undefined', () => {
    const wrapper = mount(<BooleanControl errors={[]} formUuid={formUuid} metadata={metadata} />);
    const instance = wrapper.instance();
    expect(instance.getValue()).to.deep.eql(undefined);
  });

  it('getErrors should return errors if present', () => {
    const obs = {
      value: false,
      observationDateTime: '2016-09-08T10:10:38.000+0530',
    };
    const wrapper = mount(
      <BooleanControl errors={[]} formUuid={formUuid} metadata={metadata} obs={obs} />
    );
    const instance = wrapper.instance();
    expect(instance.getErrors()).to.eql([{ errorType: 'somethingFromChild' }]);
  });

  it('should return voided obs when obs are passed and child value is undefined', () => {
    const obs = {
      value: false,
      observationDateTime: '2016-09-08T10:10:38.000+0530',
    };
    const expectedObs = {
      concept: {
        uuid: '70645842-be6a-4974-8d5f-45b52990e132',
        name: 'Pulse',
        datatype: 'Boolean',
      },
      value: undefined,
      observationDateTime: '2016-09-08T10:10:38.000+0530',
      formNamespace,
      voided: true,
    };
    const wrapper = mount(
      <BooleanControl errors={[]} formUuid={formUuid} metadata={metadata} obs={obs} />
    );
    const instance = wrapper.instance();
    sinon.stub(instance.childControl, 'getValue', () => undefined);
    expect(instance.getValue()).to.deep.eql(expectedObs);
  });

  it('should return the obs when previously voided obs is changed', () => {
    const voidedObs = {
      value: undefined,
      voided: true,
      observationDateTime: '2016-09-08T10:10:38.000+0530',
    };
    const expectedObs = {
      concept: {
        uuid: '70645842-be6a-4974-8d5f-45b52990e132',
        name: 'Pulse',
        datatype: 'Boolean',
      },
      formNamespace,
      observationDateTime: '2016-09-08T10:10:38.000+0530',
      value: false,
      voided: false,
    };

    const wrapper = mount(
      <BooleanControl errors={[]} formUuid={formUuid} metadata={metadata} obs={voidedObs} />
    );

    const instance = wrapper.instance();
    sinon.stub(instance.childControl, 'getValue', () => false);
    expect(instance.getValue()).to.deep.eql(expectedObs);
  });
});
