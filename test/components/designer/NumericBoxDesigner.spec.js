import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { NumericBoxDesigner } from 'components/designer/NumericBoxDesigner.jsx';

chai.use(chaiEnzyme());

describe('NumericBoxDesigner', () => {
  let wrapper;
  let metadata;

  beforeEach(() => {
    metadata = {
      concept: {
        name: 'Pulse',
        uuid: 'someUuid',
      },
      displayType: 'numeric',
      type: 'obsControl',
      id: 'someId',
    };
    wrapper = shallow(<NumericBoxDesigner metadata={metadata} />);
  });

  it('should render the input', () => {
    expect(wrapper).to.have.descendants('input');
    expect(wrapper.find('input').props().type).to.eql('number');
  });

  it('should return json definition', () => {
    const instance = wrapper.instance();
    expect(instance.getJsonDefinition()).to.deep.eql(metadata);
  });
});
