import React, { Component } from 'react';
import { mount, shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { BooleanControlDesigner } from 'components/designer/BooleanControl.jsx';

chai.use(chaiEnzyme());

describe('Boolean Control Designer', () => {

  const DummyControl = () => <input />;
  let metadata;
  before(() => {
    window.componentStore.registerDesignerComponent('button', { control: DummyControl });
  });

  after(() => {
    window.componentStore.deRegisterDesignerComponent('button');
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

    expect(wrapper).to.have.exactly(1).descendants('DummyControl');
    expect(wrapper.find('DummyControl').props().options).to.deep.eql(options);
  });

  it('should return null when registered component not found', () => {
    window.componentStore.deRegisterDesignerComponent('button');

    const wrapper = shallow(<BooleanControlDesigner metadata={metadata} />);
    expect(wrapper).to.be.blank();

    window.componentStore.registerDesignerComponent('button', { control: DummyControl });
  });

  it('should return the JSON Definition', () => {
    const expectedMetadata = Object.assign({}, metadata, { options });
    const wrapper = mount(<BooleanControlDesigner metadata={metadata} />);
    const instance = wrapper.instance();
    expect(instance.getJsonDefinition()).to.deep.eql(expectedMetadata);
  });

  it('should override default options', () => {
    metadata.options = [
      { name: 'Ha', value: 'Yes' },
      { name: 'Na', value: 'No' },
    ];

    const wrapper = shallow(<BooleanControlDesigner metadata={metadata} />);
    expect(wrapper.find('DummyControl').props().options).to.deep.eql(metadata.options);
  });
});
