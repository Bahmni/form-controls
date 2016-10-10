import React, { Component, PropTypes } from 'react';
import { mount, shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { BooleanControlDesigner } from 'components/designer/BooleanControl.jsx';

chai.use(chaiEnzyme());

class DummyRadioControl extends Component {
  getJsonDefinition() {
    return { name: 'someDummyName' };
  }

  render() {
    return <input />;
  }
}

DummyRadioControl.propTypes = {
  metadata: PropTypes.any,
};


describe('Boolean Control Designer', () => {
  let metadata;
  before(() => {
    window.componentStore.registerDesignerComponent('radio', { control: DummyRadioControl });
  });

  after(() => {
    window.componentStore.deRegisterDesignerComponent('radio');
  });

  const options = [
    { name: 'Yes', value: true },
    { name: 'No', value: false },
  ];

  beforeEach(() => {
    metadata = {
      id: '100',
      type: 'obsControl',
      concept: {
        uuid: '70645842-be6a-4974-8d5f-45b52990e132',
        name: 'Pulse',
        datatype: 'Boolean',
      },
    };
  });

  it('should render Dummy Control with default options', () => {
    const wrapper = shallow(<BooleanControlDesigner metadata={metadata} />);
    const expectedMetadata = Object.assign({}, { options }, metadata);
    expect(wrapper).to.have.exactly(1).descendants('DummyRadioControl');
    expect(wrapper.find('DummyRadioControl').props().metadata).to.deep.eql(expectedMetadata);
  });

  it('should return null when registered component not found', () => {
    metadata.displayType = 'somethingRandom';
    const wrapper = shallow(<BooleanControlDesigner metadata={metadata} />);
    expect(wrapper).to.be.blank();
  });

  it('should return the JSON Definition', () => {
    const wrapper = mount(<BooleanControlDesigner metadata={metadata} />);
    const instance = wrapper.instance();
    expect(instance.getJsonDefinition()).to.deep.eql({ name: 'someDummyName' });
  });

  it('should should override default options', () => {
    metadata.options = [
      { name: 'Ha', value: 'Yes' },
      { name: 'Na', value: 'No' },
    ];
    const wrapper = shallow(<BooleanControlDesigner metadata={metadata} />);
    expect(wrapper.find('DummyRadioControl').props().metadata).to.deep.eql(metadata);
  });
});
