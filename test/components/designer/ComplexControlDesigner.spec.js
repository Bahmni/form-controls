import React from 'react';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { ComplexControlDesigner } from 'components/designer/ComplexControlDesigner.jsx';
import ComponentStore from 'src/helpers/componentStore';

chai.use(chaiEnzyme());

describe('ComplexControlDesigner', () => {
  let wrapper;
  let metadata;

  const DummyControl = () => <input />;

  before(() => {
    ComponentStore.registerDesignerComponent('someHandler', { control: DummyControl });
  });

  after(() => {
    ComponentStore.deRegisterDesignerComponent('someHandler');
  });

  beforeEach(() => {
    metadata = {
      concept: {
        name: 'Image',
        uuid: 'someUuid',
        conceptHandler: 'someHandler',
      },
      type: 'obsControl',
      id: 'someId',
      properties: {},
    };
  });

  it('should render the ComplexControl designer component', () => {
    wrapper = mount(<ComplexControlDesigner metadata={metadata} />);
    expect(wrapper).to.have.exactly(1).descendants('DummyControl');
  });

  it('should not render complexControl if corresponding control is not registered', () => {
    ComponentStore.deRegisterDesignerComponent('someHandler');
    wrapper = mount(<ComplexControlDesigner metadata={metadata} />);
    expect(wrapper).to.be.blank();
    expect(wrapper).to.not.have.descendants('DummyControl');
  });

  it('should return json definition', () => {
    wrapper = mount(<ComplexControlDesigner metadata={metadata} />);
    const instance = wrapper.instance();
    expect(instance.getJsonDefinition()).to.deep.eql(metadata);
  });
});
