import React, { Component } from 'react';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { SectionDesigner } from 'components/designer/Section.jsx';
import * as Grid from 'components/designer/Grid.jsx';
import { IDGenerator } from 'src/helpers/idGenerator';
import sinon from 'sinon';

chai.use(chaiEnzyme());

const concept = { name: 'dummyPulse', datatype: 'text', uuid: 'dummyUuid' };
const properties = {};

class DummyControl extends Component {
  getJsonDefinition() {
    return { concept, properties };
  }

  render() {
    return <input />;
  }
}

describe('SectionDesigner', () => {
  let wrapper;
  let metadata;
  let idGenerator;
  const onSelectSpy = sinon.spy();

  context('when section is rendered', () => {
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
        type: 'section',
        label,
        properties,
        controls: [childControl],
      };

      const textBoxDescriptor = { control: DummyControl };
      componentStore.registerDesignerComponent('text', textBoxDescriptor); // eslint-disable-line no-undef
      idGenerator = new IDGenerator();
      wrapper = mount(
        <SectionDesigner
          clearSelectedControl={() => {}}
          deleteControl={() => {}}
          dispatch={() => {}}
          idGenerator={idGenerator}
          metadata={metadata}
          onSelect={onSelectSpy}
          wrapper={() => {}}
        />);
    });

    afterEach(() => {
      componentStore.deRegisterDesignerComponent('text'); // eslint-disable-line no-undef
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
      expect(grid.prop('minRows')).to.eql(2);
    });

    it('should render section without any controls', () => {
      metadata.controls = undefined;

      wrapper = mount(
        <SectionDesigner
          clearSelectedControl={() => {}}
          deleteControl={() => {}}
          dispatch={() => {}}
          idGenerator={idGenerator}
          metadata={metadata}
          onSelect={() => {}}
          wrapper={() => {}}
        />);

      expect(wrapper).to.have.descendants('GridDesigner');
      const grid = wrapper.find('GridDesigner');
      expect(grid.prop('controls')).to.eql([]);
    });

    it('should call onSelect function on section click', () => {
      expect(wrapper.find('.form-builder-fieldset')).to.have.prop('onClick');
      wrapper.find('.form-builder-fieldset').simulate('click');
      sinon.assert.calledOnce(onSelectSpy);
    });

    it('should call onSelect method with given metadata', () => {
      wrapper.find('.form-builder-fieldset').simulate('click');
      sinon.assert.calledWith(onSelectSpy, sinon.match.any, metadata);
    });

    it('should return json definition', () => {
      const instance = wrapper.instance();
      const expectSectionLabel = Object.assign({}, metadata.label,
        { id: '123', translationKey: 'DUMMYPULSE_123' });
      const expectObsLabel = Object.assign({}, metadata.label,
        { id: '124', translationKey: 'DUMMYPULSE_124' });

      metadata.label = expectSectionLabel;
      metadata.controls[0].label = expectObsLabel;

      expect(instance.getJsonDefinition()).to.deep.eql(metadata);
    });

    it('should stop event propagation to upper component when click on section', () => {
      const dispatchSpy = sinon.spy();
      wrapper = mount(
        <SectionDesigner
          clearSelectedControl={() => {}}
          deleteControl={() => {}}
          dispatch = {dispatchSpy}
          idGenerator={idGenerator}
          metadata={metadata}
          onSelect={() => {}}
          wrapper={() => {}}
        />);
      wrapper.find('fieldset').simulate('click', {
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
      const instance = wrapper.instance();
      sinon.spy(instance, 'deleteControl');
      wrapper.setProps({ showDeleteButton: true });
      wrapper.find('button').simulate('click');

      sinon.assert.calledOnce(instance.deleteControl);
      instance.deleteControl.restore();
    });

    it('should not render add-more and remove buttons when addMore attribute is false', () => {
      Object.assign(metadata.properties, { addMore: false });
      wrapper = mount(
              <SectionDesigner
                clearSelectedControl={() => {}}
                deleteControl={() => {}}
                dispatch={() => {}}
                idGenerator={idGenerator}
                metadata={metadata}
                onSelect={onSelectSpy}
                wrapper={() => {}}
              />);
      expect(wrapper.exists('.form-builder-add-more')).to.equal(false);
      expect(wrapper.exists('.form-builder-remove')).to.equal(false);
    });

    it('should render add-more and remove buttons when addMore attribute is true', () => {
      Object.assign(metadata.properties, { addMore: true });
      wrapper = mount(
              <SectionDesigner
                clearSelectedControl={() => {}}
                deleteControl={() => {}}
                dispatch={() => {}}
                idGenerator={idGenerator}
                metadata={metadata}
                onSelect={onSelectSpy}
                wrapper={() => {}}
              />);
      expect(wrapper.find('.form-builder-add-more')).to.be.length(1);
      expect(wrapper.find('.form-builder-remove')).to.be.length(1);
    });
  });
});
