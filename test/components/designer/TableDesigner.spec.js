import React, { Component } from 'react';
import { mount, shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import * as Grid from 'components/designer/Grid.jsx';
import { IDGenerator } from 'src/helpers/idGenerator';
import sinon from 'sinon';
import { TableDesigner } from 'components/designer/TableDesigner.jsx';

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

describe('TableDesigner', () => {
  let wrapper;
  let metadata;
  let idGenerator;
  const onSelectSpy = sinon.spy();

  context('when table is rendered', () => {
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
    const column1LabelJson = {
      translationKey: 'COLUMN1_1',
      type: 'label',
      value: 'Label1',
      id: '1',
    };

    const column2LabelJson = {
      translationKey: 'COLUMN2_2',
      type: 'label',
      value: 'Label2',
      id: '2',
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
        type: 'table',
        properties,
        controls: [column1LabelJson, column2LabelJson, childControl],
        label,
      };

      const textBoxDescriptor = { control: DummyControl };
      componentStore.registerDesignerComponent('text', textBoxDescriptor); // eslint-disable-line no-undef
      idGenerator = new IDGenerator();
      wrapper = shallow(
        <TableDesigner
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

    it('should call onSelect function on table click', () => {
      wrapper = mount(
        <TableDesigner
          clearSelectedControl={() => {}}
          deleteControl={() => {}}
          dispatch={() => {}}
          idGenerator={idGenerator}
          metadata={metadata}
          onSelect={onSelectSpy}
          wrapper={() => {}}
        />);
      expect(wrapper.find('.form-builder-fieldset')).to.have.prop('onClick');
      wrapper.find('.form-builder-fieldset').simulate('click');
      sinon.assert.calledOnce(onSelectSpy);
    });

    it('should call onSelect method with given metadata', () => {
      wrapper = mount(
        <TableDesigner
          clearSelectedControl={() => {}}
          deleteControl={() => {}}
          dispatch={() => {}}
          idGenerator={idGenerator}
          metadata={metadata}
          onSelect={onSelectSpy}
          wrapper={() => {}}
        />);
      wrapper.find('.form-builder-fieldset').simulate('click');
      sinon.assert.calledWith(onSelectSpy, sinon.match.any, metadata);
    });

    it('should render column names as Column1 and Column2 when controls are not defined', () => {
      metadata.controls = undefined;
      wrapper = shallow(
        <TableDesigner
          clearSelectedControl={() => {}}
          deleteControl={() => {}}
          dispatch={() => {}}
          idGenerator={idGenerator}
          metadata={metadata}
          onSelect={() => {}}
          wrapper={() => {}}
        />);

      expect(wrapper).to.have.descendants('fieldset');
      expect(wrapper.find('LabelDesigner').length).to.eql(2);
      expect(wrapper.find('LabelDesigner').get(0).props.metadata.value).to.eql('Column1');
      expect(wrapper.find('LabelDesigner').get(1).props.metadata.value).to.eql('Column2');
    });

    it('should render column names as what is passed in controls', () => {
      expect(wrapper).to.have.descendants('fieldset');
      expect(wrapper.find('LabelDesigner').length).to.eql(2);
      expect(wrapper.find('LabelDesigner').get(0)
        .props.metadata.value).to.eql(column1LabelJson.value);
      expect(wrapper.find('LabelDesigner').get(1)
        .props.metadata.value).to.eql(column2LabelJson.value);
    });

    it('should render a grid with appropriate props', () => {
      expect(wrapper).to.have.descendants('GridDesigner');
      const grid = wrapper.find('GridDesigner');

      expect(grid.prop('controls')).to.eql([childControl]);
      expect(grid).to.have.prop('idGenerator');
      expect(grid).to.have.prop('wrapper');
      expect(grid.prop('minRows')).to.eql(2);
      expect(grid.prop('minColumns')).to.eql(2);
    });

    it('should render section without any controls', () => {
      metadata.controls = undefined;

      wrapper = shallow(
        <TableDesigner
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

    it('should show delete button if the showDeleteButton props is true', () => {
      wrapper.setProps({ showDeleteButton: true });
      const deleteButton = wrapper.find('button');
      expect(deleteButton.text()).to.eql('');
    });

    it('should not show delete button if the showDeleteButton props is false', () => {
      wrapper.setProps({ showDeleteButton: false });
      expect(wrapper.find('button')).to.eql({});
    });

    it('should call deleteControl when delete button is clicked', () => {
      const instance = wrapper.instance();
      sinon.spy(instance, 'deleteControl');
      wrapper.setProps({ showDeleteButton: true });
      wrapper.find('button').simulate('click');

      sinon.assert.calledOnce(instance.deleteControl);
      instance.deleteControl.restore();
    });

    it('should call clearSelectedControl prop when delete button is clicked', () => {
      const clearSelectedControlSpy = sinon.spy();
      const tableWrapper = shallow(
            <TableDesigner
              clearSelectedControl={clearSelectedControlSpy}
              deleteControl={() => {}}
              dispatch={() => {}}
              idGenerator={idGenerator}
              metadata={metadata}
              onSelect={() => {}}
              showDeleteButton
              wrapper={() => {}}
            />);
      tableWrapper.find('button').simulate('click');
      sinon.assert.calledOnce(clearSelectedControlSpy);
    });

    it('should call deleteControl prop when delete button is clicked', () => {
      const deleteControlSpy = sinon.spy();
      const tableWrapper = shallow(
            <TableDesigner
              clearSelectedControl={() => {}}
              deleteControl={deleteControlSpy}
              dispatch={() => {}}
              idGenerator={idGenerator}
              metadata={metadata}
              onSelect={() => {}}
              showDeleteButton
              wrapper={() => {}}
            />);
      tableWrapper.find('button').simulate('click');
      sinon.assert.calledOnce(deleteControlSpy);
    });

    it('should return json definition', () => {
      const instance = wrapper.instance();
      instance.storeGridRef({
        getControls: sinon.stub().returns([childControl]),
      });

      instance.labelControls = [
        {
          getJsonDefinition: sinon.stub().returns(column1LabelJson),
        },
        {
          getJsonDefinition: sinon.stub().returns(column2LabelJson),
        },
      ];
      metadata.controls = [
        column1LabelJson,
        column2LabelJson,
        childControl,
      ];
      expect(instance.getJsonDefinition()).to.deep.eql(metadata);
    });

    it('should have addMore in unsupportedProperties and obsControl ' +
      'in supportedControlTypes', () => {
      wrapper = shallow(
        <TableDesigner
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
      expect(grid.prop('unsupportedProperties')).to.eql(['addMore']);
      expect(grid.prop('supportedControlTypes')).to.eql(['obsControl']);
    });
  });
});
