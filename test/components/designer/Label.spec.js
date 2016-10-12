import React from 'react';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { LabelDesigner } from 'components/designer/Label.jsx';

chai.use(chaiEnzyme());

describe('LabelDesigner', () => {
  let wrapper;
  let metadata;

  beforeEach(() => {
    metadata = { id: 'someId', type: 'label', value: 'History Notes' };
    wrapper = mount(<LabelDesigner metadata={metadata} onUpdateMetadata={() => {}} />);
  });

  it('should render the non editable value', () => {
    expect(wrapper.find('span').text()).to.eql('History Notes');
  });

  it('should allow editing of value on double click', () => {
    expect(wrapper).to.have.descendants('span');

    wrapper.find('span').props().onDoubleClick();
    expect(wrapper).to.have.descendants('input');
  });

  it('should display value in non editable mode after pressing enter', () => {
    wrapper.find('span').props().onDoubleClick();
    expect(wrapper).to.have.descendants('input');

    wrapper.find('input').props().onKeyUp({ keyCode: 13 });
    expect(wrapper).to.have.descendants('span');
    expect(wrapper).to.not.have.descendants('input');
  });

  it('should display value in non editable mode on blur', () => {
    wrapper.find('span').props().onDoubleClick();
    expect(wrapper).to.have.descendants('input');

    wrapper.find('input').props().onBlur();
    expect(wrapper).to.have.descendants('span');
    expect(wrapper).to.not.have.descendants('input');
  });

  it('should return appropriate JSON definition', () => {
    const instance = wrapper.instance();
    const expectedJson = {
      type: 'label',
      value: 'History Notes',
    };
    expect(instance.getJsonDefinition()).to.deep.eql(expectedJson);
  });
});
