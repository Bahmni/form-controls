import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { TextBoxDesigner } from 'components/designer/TextBoxDesigner.jsx';

chai.use(chaiEnzyme());

describe('TextBoxDesigner', () => {
  let wrapper;
  let metadata;

  beforeEach(() => {
    metadata = {
      concept: {
        name: 'Pulse',
        uuid: 'someUuid',
      },
      displayType: 'text',
      type: 'obsControl',
      id: 'someId',
      properties: {},
    };
    wrapper = shallow(<TextBoxDesigner metadata={metadata} />);
  });

  it('should render the input', () => {
    expect(wrapper).to.have.descendants('input');
    expect(wrapper.find('input').props().type).to.eql('text');
  });

  it('should return json definition', () => {
    const instance = wrapper.instance();
    expect(instance.getJsonDefinition()).to.deep.eql(metadata);
  });
});
