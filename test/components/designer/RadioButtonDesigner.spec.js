import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { RadioButtonDesigner } from 'components/designer/RadioButtonDesigner.jsx';

chai.use(chaiEnzyme());

describe('Radio Button Designer', () => {
  let wrapper;
  let metadata;

  const options = [
    { name: 'Yes', value: true },
    { name: 'No', value: false },
  ];

  beforeEach(() => {
    metadata = {
      concept: {
        name: 'Pulse',
        uuid: 'someUuid',
        datatype: 'boolean',
      },
      displayType: 'radio',
      type: 'obsControl',
      id: 'someId',
      options,
      properties: {},
    };
    wrapper = shallow(<RadioButtonDesigner metadata={metadata} />);
  });

  it('should render the radio button', () => {
    expect(wrapper).to.have.exactly(2).descendants('input');

    expect(wrapper.find('input').at(0).props().type).to.eql('radio');
    expect(wrapper.find('.option-list').at(0).text()).to.eql('Yes');
    expect(wrapper.find('input').at(0).props().value).to.eql(true);

    expect(wrapper.find('input').at(1).props().type).to.eql('radio');
    expect(wrapper.find('.option-list').at(1).text()).to.eql('No');
    expect(wrapper.find('input').at(1).props().value).to.eql(false);
  });

  it('should return json definition', () => {
    const instance = wrapper.instance();
    expect(instance.getJsonDefinition()).to.deep.eql(metadata);
  });
});
