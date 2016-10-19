import React from 'react';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { LabelDesigner } from 'components/designer/Label.jsx';
import sinon from 'sinon';

chai.use(chaiEnzyme());

describe('LabelDesigner', () => {
  let wrapper;
  let metadata;
  let onSelectSpy;

  beforeEach(() => {
    onSelectSpy = sinon.spy();
    metadata = { id: 'someId', type: 'label', value: 'History Notes', properties: {} };
    wrapper = mount(<LabelDesigner metadata={metadata} onSelect={onSelectSpy} />);
  });

  it('should render the non editable value', () => {
    expect(wrapper.find('span').text()).to.eql('History Notes');
  });

  it('should call onSelect function when clicked', () => {
    wrapper.find('span').simulate('click');
    sinon.assert.calledOnce(onSelectSpy);
    sinon.assert.calledWith(onSelectSpy, sinon.match.any, metadata);
  });

  it('should allow editing of value on double click', () => {
    expect(wrapper).to.have.descendants('span');

    wrapper.find('span').props().onDoubleClick();
    expect(wrapper).to.have.descendants('input');
  });

  it('should call onSelect in edit mode', () => {
    wrapper.find('span').props().onDoubleClick();
    wrapper.find('input').simulate('click');
    sinon.assert.calledOnce(onSelectSpy);
    sinon.assert.calledWith(onSelectSpy, sinon.match.any, metadata);
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
      properties: {},
    };
    expect(instance.getJsonDefinition()).to.deep.eql(expectedJson);
  });
});
