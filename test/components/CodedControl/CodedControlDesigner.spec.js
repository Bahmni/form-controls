import React from 'react';
import { mount, shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { CodedControlDesigner } from 'components/CodedControl/CodedControlDesigner.jsx';
import ComponentStore from 'src/helpers/componentStore';

chai.use(chaiEnzyme());

describe('Coded Control Designer', () => {
  const DummyControl = () => <input />;

  let metadata;
  before(() => {
    ComponentStore.registerDesignerComponent('button', { control: DummyControl });
  });

  after(() => {
    ComponentStore.deRegisterDesignerComponent('button');
  });


  beforeEach(() => {
    metadata = {
      id: '100',
      type: 'obsControl',
      concept: {
        uuid: '70645842-be6a-4974-8d5f-45b52990e132',
        name: 'Pulse',
        datatype: 'Coded',
        answers: [{
          name: {
            display: 'answer1',
          },
          uuid: 'uuid',
        }],
      },
      properties: {},
    };
  });

  it('should render Dummy Control with  concept answers', () => {
    const wrapper = shallow(<CodedControlDesigner metadata={metadata} />);

    expect(wrapper).to.have.exactly(1).descendants('DummyControl');
    expect(wrapper.find('DummyControl').props().options).to.deep.eql(
      [{ name: 'answer1', value: 'uuid' }]);
  });

  it('should return the JSON Definition', () => {
    const wrapper = mount(<CodedControlDesigner metadata={metadata} />);
    const instance = wrapper.instance();
    expect(instance.getJsonDefinition()).to.deep.eql(metadata);
  });

  it('should return null when registered component not found', () => {
    ComponentStore.deRegisterDesignerComponent('button');

    const wrapper = shallow(<CodedControlDesigner metadata={metadata} />);
    expect(wrapper).to.be.blank();

    ComponentStore.registerDesignerComponent('button', { control: DummyControl });
  });
});
