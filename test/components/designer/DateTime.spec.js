import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { DateTimeDesigner } from 'components/designer/DateTime.jsx';

chai.use(chaiEnzyme());

describe('DateTimeDesigner', () => {
  let wrapper;
  let metadata;

  beforeEach(() => {
    metadata = {
      concept: {
        name: 'DateTime',
        uuid: 'someUuid',
        dataType: 'Date',
      },
      type: 'obsControl',
      id: 'someId',
      properties: {},
    };
    wrapper = shallow(<DateTimeDesigner metadata={metadata} />);
  });

  it('should render the DateTime designer component', () => {
    expect(wrapper).to.have.exactly(2).descendants('input');
    expect(wrapper.find('input').at(0)).to.have.prop('type').to.eql('date');
    expect(wrapper.find('input').at(1)).to.have.prop('type').to.eql('time');
  });

  it('should return json definition', () => {
    const instance = wrapper.instance();
    expect(instance.getJsonDefinition()).to.deep.eql(metadata);
  });
});
