import React, { Component, PropTypes } from 'react';
import { mount, shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { BooleanControl } from 'components/BooleanControl.jsx';
import { Validator } from 'src/helpers/Validator';
import sinon from 'sinon';

chai.use(chaiEnzyme());

class DummyRadioControl extends Component {
  getValue() {
    return this.props.value;
  }

  render() {
    return <input />;
  }
}

DummyRadioControl.propTypes = {
  value: PropTypes.any,
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
    const wrapper = shallow(
      <BooleanControl errors={[]} formUuid={formUuid} metadata={metadata} />
    );
    expect(wrapper).to.have.exactly(1).descendants('DummyRadioControl');
    expect(wrapper.find('DummyRadioControl').props().id).to.eql('someFormUuid-100');
    expect(wrapper.find('DummyRadioControl').props().options).to.deep.eql(metadata.options);
  });

  it('should pass hasError to child Controls if present', () => {
    const errors = [{ controlId: '100' }];
    const wrapper = shallow(
      <BooleanControl errors={errors} formUuid={formUuid} metadata={metadata} />
    );
    expect(wrapper.find('DummyRadioControl').props().hasErrors).to.eql(true);
  });

  it('should pass hasError as false to child Controls if no error for the control', () => {
    const errors = [{ controlId: 'someOtherId' }];
    const wrapper = shallow(
      <BooleanControl errors={errors} formUuid={formUuid} metadata={metadata} />
    );
    expect(wrapper.find('DummyRadioControl').props().hasErrors).to.eql(false);
  });

  it('should render Dummy Control of specified displayType', () => {
    window.componentStore.registerComponent('radio', DummyRadioControl);
    const spy = sinon.spy(window.componentStore, 'getRegisteredComponent');

    metadata.displayType = 'radio';
    const wrapper = shallow(
      <BooleanControl errors={[]} formUuid={formUuid} metadata={metadata} />
    );

    sinon.assert.calledWith(spy, 'radio');
    expect(wrapper).to.have.exactly(1).descendants('DummyRadioControl');
    expect(wrapper.find('DummyRadioControl').props().id).to.eql('someFormUuid-100');
    expect(wrapper.find('DummyRadioControl').props().options).to.deep.eql(metadata.options);

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
      value: true,
      observationDateTime: undefined,
      formNamespace,
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
      value: false,
      observationDateTime: '2016-09-08T10:10:38.000+0530',
      formNamespace,
    };
    const wrapper = mount(<BooleanControl errors={[]} formUuid={formUuid} metadata={metadata} obs={obs} />);
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
    const stub = sinon.stub(Validator, 'getErrors');
    stub.withArgs({ id: '100', properties, value: false }).returns([{ errorType: 'something' }]);

    const wrapper = mount(
      <BooleanControl errors={[]} formUuid={formUuid} metadata={metadata} obs={obs} />
    );
    const instance = wrapper.instance();
    expect(instance.getErrors()).to.eql([{ errorType: 'something' }]);
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
      value: false,
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
});
