import React from 'react';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { LabelDesigner } from 'components/designer/Label.jsx';
import { IDGenerator } from 'src/helpers/idGenerator';
import sinon from 'sinon';

chai.use(chaiEnzyme());

describe('LabelDesigner', () => {
  let wrapper;
  let metadata;
  let idGenerator;

  beforeEach(() => {
    idGenerator = new IDGenerator();
    metadata = { id: '1', type: 'label',
      value: 'History Notes', properties: {} };
    wrapper = mount(<LabelDesigner
      clearSelectedControl={() => {}}
      deleteControl={() => {}}
      dispatch={() => {}}
      idGenerator={idGenerator}
      metadata={metadata}
      showDeleteButton={false}
      wrapper={() => {}}
    />);
  });

  it('should render the non editable value', () => {
    expect(wrapper.find('label').text()).to.eql('History Notes');
  });

  it('should allow editing of value on double click', () => {
    expect(wrapper).to.have.descendants('label');

    wrapper.find('label').props().onDoubleClick();
    wrapper.update();
    expect(wrapper).to.have.descendants('input');
  });

  it('should not change translation key after editing the label', () => {
    wrapper.find('label').props().onDoubleClick();
    wrapper.update();
    const instance = wrapper.instance();
    instance.input.value = 'My new value';
    wrapper.find('input').props().onKeyUp({ keyCode: 13 });
    const expectedJson = {
      translationKey: 'HISTORY_NOTES_1',
      id: '1',
      type: 'label',
      value: 'My new value',
      properties: {},
    };
    wrapper.update();
    expect(instance.getJsonDefinition()).to.deep.eql(expectedJson);
  });

  it('should display value in non editable mode after pressing enter', () => {
    wrapper.find('label').props().onDoubleClick();
    wrapper.update();
    expect(wrapper).to.have.descendants('input');

    const instance = wrapper.instance();
    instance.input.value = 'Note';
    wrapper.find('input').props().onKeyUp({ keyCode: 13 });
    wrapper.update();
    expect(wrapper).to.have.descendants('label');
    expect(wrapper).to.not.have.descendants('input');
    expect(wrapper.find('label').text()).to.eql('Note');
  });

  it('should display value in non editable mode on blur', () => {
    wrapper.find('label').props().onDoubleClick();
    wrapper.update();
    expect(wrapper).to.have.descendants('input');

    wrapper.find('input').props().onBlur();
    wrapper.update();
    expect(wrapper).to.have.descendants('label');
    expect(wrapper).to.not.have.descendants('input');
  });

  it('should return appropriate JSON definition', () => {
    const instance = wrapper.instance();
    const expectedJson = {
      translationKey: 'HISTORY_NOTES_1',
      id: '1',
      type: 'label',
      value: 'History Notes',
      properties: {},
    };
    expect(instance.getJsonDefinition()).to.deep.eql(expectedJson);
  });

  it('should display existing value when only spaces are entered', () => {
    wrapper.find('label').props().onDoubleClick();
    wrapper.update();
    expect(wrapper).to.have.descendants('input');
    const instance = wrapper.instance();
    instance.input.value = '  ';
    wrapper.find('input').props().onKeyUp({ keyCode: 13 });
    wrapper.update();
    expect(wrapper.find('label')).text().to.eql('History Notes');
  });

  it('should stop event propagation to upper component when click on lable', () => {
    const dispatchSpy = sinon.spy();
    wrapper = mount(
      <LabelDesigner
        clearSelectedControl={() => {}}
        deleteControl={() => {}}
        dispatch={dispatchSpy}
        idGenerator={idGenerator}
        metadata={metadata}
        showDeleteButton={false}
        wrapper={() => {}}
      />);
    wrapper.find('div').simulate('click', {
      preventDefault: () => {},
    });

    sinon.assert.calledOnce(dispatchSpy);
  });

  it('should show delete button if the showDeleteButton props is true', () => {
    wrapper.setProps({ showDeleteButton: true });
    const deleteButton = wrapper.find('button');
    expect(deleteButton.text()).to.eql('');
  });

  it('should call deleteControl when delete button is clicked', () => {
    const deleteControlSpy = sinon.spy();
    wrapper = mount(
      <LabelDesigner
        clearSelectedControl={() => {}}
        deleteControl={deleteControlSpy}
        dispatch={() => {}}
        idGenerator={idGenerator}
        metadata={metadata}
        showDeleteButton
        wrapper={() => {}}
      />);
    wrapper.find('button').simulate('click', {
      preventDefault: () => {},
    });

    sinon.assert.calledOnce(deleteControlSpy);
  });


  it('should not generate new translation key if it already exists', () => {
    metadata.units = '(/min)';
    metadata.translationKey = 'SOME_KEY';
    wrapper = mount(
      <LabelDesigner
        clearSelectedControl={() => {}}
        deleteControl={() => {}}
        dispatch={() => {}}
        idGenerator={idGenerator}
        metadata={metadata}
        showDeleteButton={false}
        wrapper={() => {}}
      />);
    expect(wrapper.find('label').text()).to.eql('History Notes (/min)');
    const instance = wrapper.instance();
    expect(instance.getJsonDefinition().translationKey).to.deep.eql('SOME_KEY');
  });

  it('should call onSelect callback when clicked', () => {
    const onSelectSpy = sinon.spy();
    wrapper = mount(
      <LabelDesigner
        clearSelectedControl={() => {}}
        deleteControl={() => {}}
        dispatch={() => {}}
        idGenerator={idGenerator}
        metadata={metadata}
        onSelect={onSelectSpy}
        showDeleteButton={false}
        wrapper={() => {}}
      />);
    wrapper.find('label').simulate('click');
    sinon.assert.calledOnce(onSelectSpy);
  });

  it('should render hyperlink preview when hyperlinkUrl property is present', () => {
    metadata.properties = { hyperlinkUrl: 'https://example.com' };
    wrapper = mount(
      <LabelDesigner
        clearSelectedControl={() => {}}
        deleteControl={() => {}}
        dispatch={() => {}}
        idGenerator={idGenerator}
        metadata={metadata}
        showDeleteButton={false}
        wrapper={() => {}}
      />);
    expect(wrapper.find('a.form-builder-hyperlink-preview')).to.have.length(1);
    expect(wrapper.find('a').prop('data-bahmni-hyperlink')).to.eql('true');
  });

  it('should not render hyperlink preview when hyperlinkUrl property is absent', () => {
    metadata.properties = {};
    wrapper = mount(
      <LabelDesigner
        clearSelectedControl={() => {}}
        deleteControl={() => {}}
        dispatch={() => {}}
        idGenerator={idGenerator}
        metadata={metadata}
        showDeleteButton={false}
        wrapper={() => {}}
      />);
    expect(wrapper.find('a.form-builder-hyperlink-preview')).to.have.length(0);
  });

  it('should enter edit mode when hyperlink is double clicked', () => {
    metadata.properties = { hyperlinkUrl: 'https://example.com' };
    wrapper = mount(
      <LabelDesigner
        clearSelectedControl={() => {}}
        deleteControl={() => {}}
        dispatch={() => {}}
        idGenerator={idGenerator}
        metadata={metadata}
        showDeleteButton={false}
        wrapper={() => {}}
      />);
    expect(wrapper).to.have.descendants('a');
    wrapper.find('a').simulate('doubleClick');
    wrapper.update();
    expect(wrapper).to.have.descendants('input');
  });

  it('should prevent default when hyperlink is clicked', () => {
    metadata.properties = { hyperlinkUrl: 'https://example.com' };
    wrapper = mount(
      <LabelDesigner
        clearSelectedControl={() => {}}
        deleteControl={() => {}}
        dispatch={() => {}}
        idGenerator={idGenerator}
        metadata={metadata}
        showDeleteButton={false}
        wrapper={() => {}}
      />);
    const hyperlink = wrapper.find('a');
    const preventDefaultSpy = sinon.spy();
    hyperlink.props().onClick({ preventDefault: preventDefaultSpy });
    sinon.assert.calledOnce(preventDefaultSpy);
  });

  it('should allow editing label value when hyperlink is present', () => {
    metadata.properties = { hyperlinkUrl: 'https://example.com' };
    wrapper = mount(
      <LabelDesigner
        clearSelectedControl={() => {}}
        deleteControl={() => {}}
        dispatch={() => {}}
        idGenerator={idGenerator}
        metadata={metadata}
        showDeleteButton={false}
        wrapper={() => {}}
      />);
    wrapper.find('a').simulate('doubleClick');
    wrapper.update();
    expect(wrapper).to.have.descendants('input');
    const instance = wrapper.instance();
    instance.input.value = 'Updated Label';
    wrapper.find('input').props().onBlur();
    wrapper.update();
    expect(wrapper).to.have.descendants('a');
    expect(wrapper.find('a').text()).to.eql('Updated Label');
  });
});
