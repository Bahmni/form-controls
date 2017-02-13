import React from 'react';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { LabelDesigner } from 'components/designer/LabelDesigner.jsx';

chai.use(chaiEnzyme());

describe('LabelDesigner', () => {
  let wrapper;
  let metadata;

  beforeEach(() => {
    metadata = { id: 'someId', type: 'label', value: 'History Notes', properties: {} };
    wrapper = mount(<LabelDesigner metadata={metadata} />);
  });

  it('should render the non editable value', () => {
    expect(wrapper.find('label').text()).to.eql('History Notes');
  });

  it('should allow editing of value on double click', () => {
    expect(wrapper).to.have.descendants('label');

    wrapper.find('label').props().onDoubleClick();
    expect(wrapper).to.have.descendants('input');
  });

  it('should display value in non editable mode after pressing enter', () => {
    wrapper.find('label').props().onDoubleClick();
    expect(wrapper).to.have.descendants('input');

    const instance = wrapper.instance();
    instance.input.value = 'Note';
    wrapper.find('input').props().onKeyUp({ keyCode: 13 });
    expect(wrapper).to.have.descendants('label');
    expect(wrapper).to.not.have.descendants('input');
    expect(wrapper.find('label').text()).to.eql('Note');
  });

  it('should display value in non editable mode on blur', () => {
    wrapper.find('label').props().onDoubleClick();
    expect(wrapper).to.have.descendants('input');

    wrapper.find('input').props().onBlur();
    expect(wrapper).to.have.descendants('label');
    expect(wrapper).to.not.have.descendants('input');
  });

  it('should return appropriate JSON definition', () => {
    const instance = wrapper.instance();
    const expectedJson = {
      id: 'someId',
      type: 'label',
      value: 'History Notes',
      properties: {},
    };
    expect(instance.getJsonDefinition()).to.deep.eql(expectedJson);
  });

  it('should display existing value when only spaces are entered', () => {
    wrapper.find('label').props().onDoubleClick();
    expect(wrapper).to.have.descendants('input');

    const instance = wrapper.instance();
    instance.input.value = '  ';
    wrapper.find('input').props().onKeyUp({ keyCode: 13 });
    expect(wrapper.find('label')).text().to.eql('History Notes');
  });
});
