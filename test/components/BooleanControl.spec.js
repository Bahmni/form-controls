import React, { Component, PropTypes } from 'react';
import { mount, shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { BooleanControl } from 'components/BooleanControl.jsx';

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
    window.componentStore.registerComponent('radio', DummyRadioControl);
  });

  after(() => {
    window.componentStore.deRegisterComponent('radio');
  });

  beforeEach(() => {
    metadata = {
      id: '100',
      type: 'obsControl',
      concept: {
        uuid: '70645842-be6a-4974-8d5f-45b52990e132',
        name: 'Pulse',
        datatype: 'Boolean',
      },
      options: [
        { name: 'Yes', value: true },
        { name: 'No', value: false },
      ],
    };
  });

  const formUuid = 'someFormUuid';

  const formNamespace = `${formUuid}/100`;

  it('should render Dummy Control', () => {
    const wrapper = shallow(<BooleanControl formUuid={formUuid} metadata={metadata} />);
    expect(wrapper).to.have.exactly(1).descendants('DummyRadioControl');
    expect(wrapper.find('DummyRadioControl').props().id).to.eql('someFormUuid-100');
    expect(wrapper.find('DummyRadioControl').props().options).to.deep.eql(metadata.options);
  });

  it('should return null when registered component not found', () => {
    metadata.displayType = 'somethingRandom';
    const wrapper = shallow(<BooleanControl formUuid={formUuid} metadata={metadata} />);
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
    const wrapper = mount(<BooleanControl formUuid={formUuid} metadata={metadata} obs={obs} />);
    const instance = wrapper.instance();
    expect(instance.getValue()).to.deep.eql(expectedObs);
  });

  it('should return undefined when child value is undefined', () => {
    const wrapper = mount(<BooleanControl formUuid={formUuid} metadata={metadata} />);
    const instance = wrapper.instance();
    expect(instance.getValue()).to.deep.eql(undefined);
  });
});
