import React, { Component } from 'react';
import { shallow, mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { ObsGroupControlDesigner } from 'components/designer/ObsGroupControlDesigner.jsx';
import * as Grid from 'components/designer/Grid.jsx';
import { IDGenerator } from 'src/helpers/idGenerator';
import sinon from 'sinon';
import { AddMoreDesigner } from 'components/designer/AddMore.jsx';
import cloneDeep from 'lodash/cloneDeep';

chai.use(chaiEnzyme());

const concept = { name: 'dummyPulse', datatype: 'text', uuid: 'dummyUuid' };
const properties = {};
const conceptWithDesc = Object.assign({}, concept);
conceptWithDesc.description = { value: 'concept set description' };

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

describe('ObsGroupControlDesigner', () => {
  let wrapper;
  let metadata;
  let onSelectSpy;

  it('should inject concept to metadata', () => {
    metadata = { id: 'someId', type: 'obsGroupControl' };
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
      handler: 'someHandler',
      uuid: 'someUuid',
      allowDecimal: false,
      set: true,
      setMembers: [],
    };

    const expectedMetadata = {
      id: 'someId',
      type: 'obsGroupControl',
      concept: {
        name: 'someName',
        datatype: 'someDatatype',
        conceptClass: 'Misc',
        conceptHandler: 'someHandler',
        uuid: 'someUuid',
        set: true,
        setMembers: [],
        description: undefined,
      },
      label: {
        type: 'label',
        value: someConcept.name.name,
      },
      properties: {
        addMore: false,
        location: { row: 0, column: 0 },
      },
      controls: [],
    };
    const metadataWithConcept = ObsGroupControlDesigner.injectConceptToMetadata(
      metadata,
      someConcept,
      new IDGenerator()
    );
    expect(metadataWithConcept).to.deep.eql(expectedMetadata);
  });

  context('when concept is not present', () => {
    beforeEach(() => {
      onSelectSpy = sinon.spy();
      metadata = { id: '123', label: {}, type: 'obsControl', properties };
      const idGenerator = new IDGenerator();
      wrapper = shallow(
        <ObsGroupControlDesigner
          clearSelectedControl={() => {}}
          deleteControl={() => {}}
          idGenerator={idGenerator}
          metadata={metadata}
          onSelect={onSelectSpy}
          wrapper={() => {}}
        />);
    });

    it('should render simple div', () => {
      expect(wrapper.find('div').text()).to.eql('Select ObsGroup Source');
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
  });

  context('when concept is present', () => {
    const label = {
      type: 'label',
      value: concept.name,
      properties: {},
    };
    const childControl = {
      id: '124',
      type: 'obsControl',
      concept,
      label,
      properties,
    };
    /* eslint-disable react/no-multi-comp */
    class GridStub extends Component {
      getControls() { return [childControl]; }
      render() { return (<div />); }
    }

    before(() => {
      sinon.stub(Grid, 'GridDesigner', GridStub);
    });
    after(() => {
      Grid.GridDesigner.restore();
    });
    beforeEach(() => {
      metadata = {
        id: '123',
        type: 'obsGroupControl',
        concept,
        label,
        properties,
        controls: [childControl],
      };

      const textBoxDescriptor = { control: DummyControl };
      componentStore.registerDesignerComponent('text', textBoxDescriptor); // eslint-disable-line no-undef
      onSelectSpy = sinon.spy();
      const idGenerator = new IDGenerator();
      wrapper = mount(
        <ObsGroupControlDesigner
          clearSelectedControl={() => {}}
          deleteControl={() => {}}
          idGenerator={idGenerator}
          metadata={metadata}
          onSelect={onSelectSpy}
          wrapper={() => {}}
        />);
    });

    afterEach(() => {
      componentStore.deRegisterDesignerComponent('text'); // eslint-disable-line no-undef
    });

    it('should render add more with addMore properties', () => {
      const newProperties = Object.assign({}, metadata.properties, { addMore: true });
      const newMetadata = Object.assign({}, metadata, { properties: newProperties });
      const idGenerator = new IDGenerator();

      const newWrapper = mount(
        <ObsGroupControlDesigner
          clearSelectedControl={() => {}}
          deleteControl={() => {}}
          idGenerator={idGenerator}
          metadata={newMetadata}
          onSelect={onSelectSpy}
          wrapper={() => {}}
        />);

      expect(newWrapper.contains(<AddMoreDesigner />)).to.equal(true);
    });

    it('should render a fieldset with the appropriate label', () => {
      expect(wrapper).to.have.descendants('fieldset');
      expect(wrapper.find('LabelDesigner').prop('metadata').value).to.deep.eql('dummyPulse');
    });

    it('should render a grid with appropriate props', () => {
      expect(wrapper).to.have.descendants('GridDesigner');
      const grid = wrapper.find('GridDesigner');

      expect(grid.prop('controls')).to.eql([childControl]);
      expect(grid).to.have.prop('idGenerator');
      expect(grid).to.have.prop('wrapper');
    });

    it('should call onSelect function passed as prop', () => {
      expect(wrapper.find('.form-builder-fieldset')).to.have.prop('onClick');
      wrapper.find('.form-builder-fieldset').simulate('click');
      sinon.assert.calledOnce(onSelectSpy);
      sinon.assert.calledWith(onSelectSpy, sinon.match.any, metadata);
    });

    it('should return json definition', () => {
      const instance = wrapper.instance();
      const metadataClone = metadata;
      metadataClone.label = Object.assign({}, metadata.label,
        { id: '123', translationKey: 'DUMMYPULSE_123' });
      expect(instance.getJsonDefinition()).to.deep.eql(metadataClone);
    });

    it('should show delete button if the showDeleteButton props is true', () => {
      wrapper.setProps({ showDeleteButton: true });
      const deleteButton = wrapper.find('button');

      expect(deleteButton.text()).to.eql('');
    });

    it('should call deleteControl after delete button is clicked', () => {
      const deleteControlSpy = sinon.spy();
      const idGenerator = new IDGenerator();
      wrapper = mount(
        <ObsGroupControlDesigner
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
  context('when concept set has description', () => {
    const label = {
      type: 'label',
      value: concept.name,
      properties: {},
    };
    beforeEach(() => {
      metadata = {
        id: '123',
        type: 'obsGroupControl',
        concept: conceptWithDesc,
        label,
        properties,
      };

      const textBoxDescriptor = { control: DummyControlWithDescription };
      componentStore.registerDesignerComponent('text', textBoxDescriptor); // eslint-disable-line no-undef
      onSelectSpy = sinon.spy();
      const idGenerator = new IDGenerator();
      wrapper = mount(
            <ObsGroupControlDesigner
              clearSelectedControl={() => {}}
              deleteControl={() => {}}
              idGenerator={idGenerator}
              metadata={metadata}
              onSelect={onSelectSpy}
              wrapper={() => {}}
            />);
    });

    after(() => {
      componentStore.deRegisterDesignerComponent('text'); // eslint-disable-line no-undef
    });

    it('should show concept description if present', () => {
      expect(wrapper.find('.description').length).to.equal(1);
    });

    it('should include translationKey if description is present', () => {
      const instance = wrapper.instance();
      const clonedConcept = cloneDeep(conceptWithDesc);
      clonedConcept.description.translationKey = 'DUMMYPULSE_123_DESC';

      const expectedLabelMetadata = { translationKey: 'DUMMYPULSE_123', id: '123',
        type: 'label', value: 'dummyPulse', properties: {} };

      const expectedJson = { concept: clonedConcept, label: expectedLabelMetadata,
        controls: [], properties: {}, id: '123', type: 'obsGroupControl' };

      expect(instance.getJsonDefinition()).to.eql(expectedJson);
    });
  });
});
