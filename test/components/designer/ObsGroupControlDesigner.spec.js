import React, { Component } from 'react';
import { shallow, mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { ObsGroupControlDesigner } from 'components/designer/ObsGroupControlDesigner.jsx';
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
      uuid: 'someUuid',
      allowDecimal: false,
      set: true,
      setMembers: [],
    };

    const expectedMetadata = {
      id: '1',
      type: 'obsGroupControl',
      concept: {
        name: 'someName',
        datatype: 'someDatatype',
        uuid: 'someUuid',
        set: true,
        setMembers: [],
      },
      label: {
        type: 'label',
        value: someConcept.name.name,
      },
      properties: { location: { row: 0, column: 0 } },
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
          idGenerator={idGenerator}
          metadata={metadata}
          onSelect={onSelectSpy}
          wrapper={() => {}}
        />);
    });

    it('should render simple div', () => {
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
          idGenerator={idGenerator}
          metadata={metadata}
          onSelect={onSelectSpy}
          wrapper={() => {}}
        />);
    });

    afterEach(() => {
      componentStore.deRegisterDesignerComponent('text'); // eslint-disable-line no-undef
    });

    it('should render a fieldset with the appropriate legend', () => {
      expect(wrapper).to.have.descendants('fieldset');
      expect(wrapper.find('legend')).to.have.text('dummyPulse');
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
      expect(instance.getJsonDefinition()).to.deep.eql(metadata);
    });
  });
});
