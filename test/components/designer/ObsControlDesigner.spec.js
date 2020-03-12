import React, { Component } from 'react';
import { shallow, mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { ObsControlDesigner } from 'components/designer/ObsControlDesigner.jsx';
import sinon from 'sinon';
import { IDGenerator } from 'src/helpers/idGenerator';
import cloneDeep from 'lodash/cloneDeep';

chai.use(chaiEnzyme());

const concept = { name: 'dummyPulse', datatype: 'text', uuid: 'dummyUuid' };
const properties = {};
const conceptWithDesc = Object.assign({}, concept);
conceptWithDesc.description = { value: 'concept description' };
class DummyControl extends Component {
  getJsonDefinition() {
    return { concept, properties };
  }

  render() {
    return <input />;
  }
}

class DummyControlWithDescription extends DummyControl {
  getJsonDefinition() {
    return { concept: conceptWithDesc, properties };
  }
}

describe('ObsControlDesigner', () => {
  let wrapper;
  let metadata;
  let onSelectSpy;
  let idGenerator;

  it('should inject concept to metadata', () => {
    metadata = { id: 'someId', type: 'obsControl' };
    const someConcept = {
      name: {
        name: 'someName',
      },
      datatype: {
        name: 'someDatatype',
      },
      conceptClass: {
        name: 'Misc',
      },
      uuid: 'someUuid',
      allowDecimal: false,
      handler: 'someHandler',
    };
    const expectedMetadata = {
      id: 'someId',
      type: 'obsControl',
      concept: {
        name: 'someName',
        description: undefined,
        datatype: 'someDatatype',
        conceptClass: 'Misc',
        uuid: 'someUuid',
        properties: { allowDecimal: false },
        answers: undefined,
        conceptHandler: 'someHandler',
      },
      units: undefined,
      hiNormal: undefined,
      lowNormal: undefined,
      hiAbsolute: undefined,
      lowAbsolute: undefined,
      label: {
        type: 'label',
        value: someConcept.name.name,
      },
    };
    const metadataWithConcept = ObsControlDesigner.injectConceptToMetadata(metadata, someConcept);
    expect(metadataWithConcept).to.deep.eql(expectedMetadata);
  });

  context('when concept is not present', () => {
    beforeEach(() => {
      idGenerator = new IDGenerator();
      onSelectSpy = sinon.spy();
      metadata = { id: '123', label: {}, type: 'obsControl', properties };
      wrapper = shallow(<ObsControlDesigner
        clearSelectedControl={() => {}}
        deleteControl={() => {}}
        metadata={metadata}
        onSelect={onSelectSpy}
        showDeleteButton={false}
      />);
    });

    it('should render simple div when there is no concept', () => {
      expect(wrapper.find('div').text()).to.eql('Select Obs Source');
    });

    it('should call onSelect function passed as prop', () => {
      const expectedMetadata = { id: '123', label: {}, properties: {}, type: 'obsControl' };
      expect(wrapper.find('div')).to.have.prop('onClick');
      wrapper.find('div').simulate('click');
      sinon.assert.calledOnce(onSelectSpy);
      sinon.assert.calledWith(onSelectSpy, sinon.match.any, expectedMetadata);
    });

    it('should return undefined for getJsonDefinition call', () => {
      const json = wrapper.instance().getJsonDefinition();
      expect(json).to.eql(undefined);
    });

    it('should show delete button if the showDeleteButton props is true', () => {
      wrapper.setProps({ showDeleteButton: true });
      const deleteButton = wrapper.find('button');

      expect(deleteButton.text()).to.eql('');
    });

    it('should call deleteControl after delete button is clicked', () => {
      const deleteControlSpy = sinon.spy();
      wrapper = mount(
        <ObsControlDesigner
          clearSelectedControl={() => {}}
          deleteControl={deleteControlSpy}
          dispatch={() => {}}
          idGenerator={idGenerator}
          metadata={metadata}
          onSelect={() => {}}
          showDeleteButton
          wrapper={() => {}}
        />);
      wrapper.find('button').simulate('click', {
        preventDefault: () => {},
      });

      sinon.assert.calledOnce(deleteControlSpy);
    });
  });

  context('when concept is present', () => {
    const label = {
      type: 'label',
      value: concept.name,
      properties: {},
    };
    beforeEach(() => {
      metadata = {
        id: '123',
        type: 'obsControl',
        concept,
        label,
        properties,
      };

      const textBoxDescriptor = { control: DummyControl };
      componentStore.registerDesignerComponent('text', textBoxDescriptor); // eslint-disable-line no-undef
      onSelectSpy = sinon.spy();
      wrapper = mount(<ObsControlDesigner
        clearSelectedControl={() => {}}
        deleteControl={() => {}}
        metadata={metadata}
        onSelect={onSelectSpy}
        showDeleteButton={false}
      />);
    });

    after(() => {
      componentStore.deRegisterDesignerComponent('text'); // eslint-disable-line no-undef
    });

    it('should render label and obsControl of appropriate displayType', () => {
      expect(wrapper).to.have.descendants('LabelDesigner');
      expect(wrapper).to.have.descendants('input');
    });

    it('should not display asterisk when field is not mandatory', () => {
      expect(wrapper).to.not.have.descendants('span');
    });

    it('should display asterisk when field is mandatory', () => {
      metadata = {
        id: '123',
        type: 'obsControl',
        concept,
        label,
        properties: { mandatory: true },
      };
      wrapper = mount(<ObsControlDesigner
        clearSelectedControl={() => {}}
        deleteControl={() => {}}
        metadata={metadata}
        onSelect={onSelectSpy}
        showDeleteButton={false}
      />);
      expect(wrapper.find('span')).to.have.className('form-builder-asterisk');
      expect(wrapper.find('span').text()).to.eql('*');
    });

    it('should pass appropriate props to Label', () => {
      const expectedLabelMetadata = { id: '123', type: 'label',
        value: 'dummyPulse', properties: {}, units: '' };
      expect(wrapper.find('LabelDesigner').props().metadata).to.deep.eql(expectedLabelMetadata);
    });

    it('should not render obsControl if there is no registered designer component', () => {
      const conceptClone = Object.assign({}, concept);
      conceptClone.datatype = 'somethingRandom';
      const metadataClone = Object.assign({}, metadata);
      metadataClone.concept = conceptClone;
      wrapper = mount(<ObsControlDesigner
        clearSelectedControl={() => {}}
        deleteControl={() => {}}
        metadata={metadataClone}
        onSelect={onSelectSpy}
        showDeleteButton={false}
      />);
      expect(wrapper).to.have.exactly(1).descendants('div');
    });

    it('should call onSelect function passed as prop', () => {
      expect(wrapper.find('.form-field-wrap')).to.have.prop('onClick');
      wrapper.find('.form-field-wrap').simulate('click');
      sinon.assert.calledOnce(onSelectSpy);
      sinon.assert.calledWith(onSelectSpy, sinon.match.any, metadata);
    });

    it('should return json definition', () => {
      wrapper = mount(
        <ObsControlDesigner
          clearSelectedControl={() => {}}
          deleteControl={ () => {} }
          dispatch={() => {}}
          idGenerator={idGenerator}
          metadata={ { ...metadata, units: '/min' } }
          onSelect={() => {}}
          showDeleteButton
          wrapper={() => {}}
        />);
      const expectedLabelMetadata = { id: '123', translationKey: 'DUMMYPULSE_123',
        type: 'label', value: 'dummyPulse', properties: {}, units: '(/min)' };
      const instance = wrapper.instance();
      const expectedJson = { concept, label: expectedLabelMetadata, properties: {} };
      expect(instance.getJsonDefinition()).to.eql(expectedJson);
    });

    it('should render comment if notes is configured', () => {
      metadata = {
        id: '123',
        type: 'obsControl',
        concept,
        label,
        properties: { notes: true },
      };
      wrapper = mount(<ObsControlDesigner
        clearSelectedControl={() => {}}
        deleteControl={() => {}}
        metadata={metadata}
        onSelect={onSelectSpy}
        showDeleteButton={false}
      />);
      expect(wrapper).to.have.descendants('CommentDesigner');
    });

    it('should not render comment if notes is not configured/not present', () => {
      metadata = {
        id: '123',
        type: 'obsControl',
        concept,
        label,
        properties: {},
      };
      wrapper = mount(<ObsControlDesigner
        clearSelectedControl={() => {}}
        deleteControl={() => {}}
        metadata={metadata}
        onSelect={onSelectSpy}
        showDeleteButton={false}
      />);
      expect(wrapper).to.not.have.descendants('CommentDesigner');
    });

    it('should not render label if hideLabel is true', () => {
      metadata = {
        id: '123',
        type: 'obsControl',
        concept,
        label,
        properties: { notes: true, hideLabel: true },
      };
      wrapper = mount(<ObsControlDesigner
        clearSelectedControl={() => {}}
        deleteControl={() => {}}
        metadata={metadata}
        onSelect={onSelectSpy}
        showDeleteButton={false}
      />);
      expect(wrapper).to.not.have.descendants('LabelDesigner');
    });

    it('should construct label object when hideLabel is set to false', () => {
      metadata = {
        id: '123',
        type: 'obsControl',
        concept,
        label,
        properties: { notes: true, hideLabel: false },
      };
      wrapper = mount(<ObsControlDesigner
        clearSelectedControl={() => {}}
        deleteControl={() => {}}
        metadata={metadata}
        onSelect={() => {}}
        showDeleteButton={false}
      />);
      expect(wrapper).to.have.descendants('LabelDesigner');
      expect(wrapper.find('LabelDesigner')).to.have.prop('onSelect');
    });

    it('should show delete button if the showDeleteButton props is true', () => {
      wrapper.setProps({ showDeleteButton: true });
      const deleteButton = wrapper.find('button');

      expect(deleteButton.text()).to.eql('');
    });

    it('should show script button if control has onValueChange events', () => {
      metadata.events = { onValueChange: 'some content' };

      wrapper.setProps({ metadata });
      expect(wrapper.contains(<i aria-hidden="true" className="fa fa-code script-circle"></i>))
          .to.equal(true);
    });

    it('should call deleteControl after delete button is clicked', () => {
      const deleteControlSpy = sinon.spy();
      wrapper = mount(
        <ObsControlDesigner
          clearSelectedControl={() => {}}
          deleteControl={deleteControlSpy}
          dispatch={() => {}}
          idGenerator={idGenerator}
          metadata={metadata}
          onSelect={() => {}}
          showDeleteButton
          wrapper={() => {}}
        />);
      wrapper.find('button').simulate('click', {
        preventDefault: () => {},
      });

      sinon.assert.calledOnce(deleteControlSpy);
    });

    it('should render abnormal button if abnormal is configured', () => {
      metadata = {
        id: '123',
        type: 'obsControl',
        concept,
        label,
        properties: { abnormal: true },
      };
      wrapper = mount(<ObsControlDesigner
        clearSelectedControl={() => {}}
        deleteControl={() => {}}
        metadata={metadata}
        onSelect={onSelectSpy}
        showDeleteButton={false}
      />);
      expect(wrapper.find('button').text()).to.eql('Abnormal');
    });
  });

  context('when concept has description', () => {
    const label = {
      type: 'label',
      value: concept.name,
      properties: {},
    };
    beforeEach(() => {
      metadata = {
        id: '123',
        type: 'obsControl',
        concept: conceptWithDesc,
        label,
        properties,
      };

      const textBoxDescriptor = { control: DummyControlWithDescription };
      componentStore.registerDesignerComponent('text', textBoxDescriptor); // eslint-disable-line no-undef
      onSelectSpy = sinon.spy();
      wrapper = mount(<ObsControlDesigner
        clearSelectedControl={() => {}}
        deleteControl={() => {}}
        metadata={metadata}
        onSelect={onSelectSpy}
        showDeleteButton={false}
      />);
    });

    after(() => {
      componentStore.deRegisterDesignerComponent('text'); // eslint-disable-line no-undef
    });

    it('should show help tooltip if concept description is present', () => {
      expect(wrapper.find('.form-builder-tooltip-trigger')).to.have.prop('onClick');
    });

    it('should include translationKey if description is present', () => {
      const instance = wrapper.instance();
      const clonedConcept = cloneDeep(conceptWithDesc);
      clonedConcept.description.translationKey = 'DUMMYPULSE_123_DESC';
      const expectedLabelMetadata = { id: '123', translationKey: 'DUMMYPULSE_123',
        type: 'label', value: 'dummyPulse', properties: {}, units: '' };
      const expectedJson = { concept: clonedConcept, label: expectedLabelMetadata, properties: {} };
      expect(instance.getJsonDefinition()).to.eql(expectedJson);
    });
  });
});
