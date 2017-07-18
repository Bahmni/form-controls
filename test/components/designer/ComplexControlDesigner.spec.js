import React from 'react';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { ComplexControlDesigner } from 'components/designer/ComplexControlDesigner.jsx';

chai.use(chaiEnzyme());

describe('ComplexControlDesigner', () => {
  let wrapper;
  let metadata;

  beforeEach(() => {
    metadata = {
      concept: {
        name: 'Image',
        uuid: 'someUuid',
      },
      type: 'obsControl',
      id: 'someId',
      properties: {},
    };
    wrapper = mount(<ComplexControlDesigner metadata={metadata} />);
  });

  it('should render the ComplexControl designer component', () => {
    expect(wrapper.find('input')).to.have.prop('type').to.eql('file');
    expect(wrapper.find('input')).to.have.prop('disabled').to.eql(true);
  });

  it('should return json definition', () => {
    const instance = wrapper.instance();
    expect(instance.getJsonDefinition()).to.deep.eql(metadata);
  });
});
