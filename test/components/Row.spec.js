import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { mount, shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import Row from 'components/Row.jsx';
import sinon from 'sinon';
import ComponentStore from 'src/helpers/componentStore';
import { ObsMapper } from '../../src/mapper/ObsMapper';
import { Obs } from '../../src/helpers/Obs';

chai.use(chaiEnzyme());

function getLocationAndSameLineProperties(row, column) {
  return { location: { row, column }, sameLine: true };
}

class DummyControl extends Component {
  getValue() {
    return this.props.formUuid;
  }

  render() {
    return (<div>{ this.props.formUuid }</div>);
  }
}

DummyControl.propTypes = {
  formUuid: PropTypes.string,
};

describe('Row', () => {
  const controls = [
    {
      id: '100',
      type: 'randomType',
      value: 'Pulse',
      properties: getLocationAndSameLineProperties(0, 1),
    },
    {
      id: '101',
      type: 'randomType',
      properties: getLocationAndSameLineProperties(0, 2),
    },
    {
      id: '102',
      type: 'randomType',
      properties: getLocationAndSameLineProperties(0, 3),
    },
  ];
  const formName = 'formName';
  const formVersion = '1';

  const records = controls.map((control) => ({
    control,
    obs: new Obs({ formFieldPath: `${formName}.${formVersion}/${control.id}` }),
    mapper: new ObsMapper(),
  }));


  before(() => {
    ComponentStore.componentList = {};
    ComponentStore.registerComponent('randomType', DummyControl);
  });

  after(() => {
    ComponentStore.deRegisterComponent('randomType');
  });

  const onChangeSpy = sinon.spy();

  describe('render', () => {
    it('should render rows', () => {
      const wrapper = mount(
        <Row
          controls={controls}
          formName={formName}
          formVersion={formVersion}
          id={0}
          onValueChanged={onChangeSpy}
          records={records}
          validate={false}
          validateForm={false}
        />
      );
      expect(wrapper).to.have.exactly(3).descendants('DummyControl');

      expect(wrapper.find('DummyControl').at(0)).to.have.prop('validate').to.eql(false);
    });

    it('should pass enabled value of records when parent\'s enabled value is true', () => {
      const records1 = [{ id: 'someId', enabled: false, control: { id: '101' } }];
      const wrapper = mount(
        <Row
          controls={controls}
          enabled
          formName={formName}
          formVersion={formVersion}
          id={0}
          onValueChanged={onChangeSpy}
          records={records1}
          validate={false}
          validateForm={false}
        />
      );

      expect(wrapper.find('DummyControl').at(0)).to.have.prop('enabled').to.eql(false);
    });

    it('should not render rows when controls is empty', () => {
      const wrapper = shallow(
        <Row
          controls={[]}
          formName={formName}
          formVersion={formVersion}
          id={0}
          onValueChanged={onChangeSpy}
          records={records}
          validate={false}
          validateForm={false}
        />
      );

      expect(wrapper).to.be.blank();
    });
  });

  describe('in table', () => {
    it('should render empty div on the left when first column has no obs'
    + ' and column 2 has obs', () => {
      const tableControls = [
        {
          id: '100',
          type: 'randomType',
          value: 'Pulse',
          properties: { location: { row: 0, column: 1 } },
        }];
      const tableRecords = tableControls.map((control) => ({
        control,
        obs: new Obs({ formFieldPath: `${formName}.${formVersion}/${control.id}` }),
        mapper: new ObsMapper(),
      }));

      const wrapper = shallow(<Row
        controls={tableControls}
        formName={formName}
        formVersion={formVersion}
        id={0}
        isInTable
        onValueChanged={onChangeSpy}
        records={tableRecords}
        validate={false}
        validateForm={false}
      />);
      expect(wrapper.find('.form-builder-column-empty-left').length).to.eql(1);
    });

    it('should render empty div on the right when first column has' +
    'obs and column 2 has no obs', () => {
      const tableControls = [
        {
          id: '100',
          type: 'randomType',
          value: 'Pulse',
          properties: { location: { row: 0, column: 0 } },
        }];
      const tableRecords = tableControls.map((control) => ({
        control,
        obs: new Obs({ formFieldPath: `${formName}.${formVersion}/${control.id}` }),
        mapper: new ObsMapper(),
      }));

      const wrapper = shallow(<Row
        controls={tableControls}
        formName={formName}
        formVersion={formVersion}
        id={0}
        isInTable
        onValueChanged={onChangeSpy}
        records={tableRecords}
        validate={false}
        validateForm={false}
      />);
      expect(wrapper.find('.form-builder-column-empty-right').length).to.eql(1);
    });

    it('should show the cell skeleton and hide it\'s content, when one of the two cells is ' +
      'hidden and other is visible', () => {
      const tableControls = [
        {
          id: '100',
          type: 'randomType',
          value: 'Pulse',
          properties: { location: { row: 0, column: 0 } },
        }, {
          id: '101',
          type: 'randomType',
          value: 'Node',
          properties: { location: { row: 0, column: 1 } },
        }];
      const tableRecords = tableControls.map((control) => ({
        control,
        obs: new Obs({ formFieldPath: `${formName}.${formVersion}/${control.id}` }),
        mapper: new ObsMapper(),
        hidden: control.properties.location.column === 1,
      }));

      const wrapper = shallow(<Row
        controls={tableControls}
        formName={formName}
        formVersion={formVersion}
        id={0}
        isInTable
        onValueChanged={onChangeSpy}
        records={tableRecords}
        validate={false}
        validateForm={false}
      />);
      expect(wrapper.find('.form-builder-row .form-builder-column-wrapper').length)
        .to.eql(2);
      expect(wrapper.find('.form-builder-row .form-builder-column').length)
        .to.eql(2);
      expect(wrapper.find('.form-builder-row .form-builder-column.hidden').length)
        .to.eql(1);
    });

    it('should hide the entire row if the two cells are hidden', () => {
      const tableControls = [
        {
          id: '100',
          type: 'randomType',
          value: 'Pulse',
          properties: { location: { row: 0, column: 0 } },
        }, {
          id: '101',
          type: 'randomType',
          value: 'Node',
          properties: { location: { row: 0, column: 1 } },
        }];
      const tableRecords = tableControls.map((control) => ({
        control,
        obs: new Obs({ formFieldPath: `${formName}.${formVersion}/${control.id}` }),
        mapper: new ObsMapper(),
        hidden: true,
      }));

      const wrapper = shallow(<Row
        controls={tableControls}
        formName={formName}
        formVersion={formVersion}
        id={0}
        isInTable
        onValueChanged={onChangeSpy}
        records={tableRecords}
        validate={false}
        validateForm={false}
      />);
      expect(wrapper.find('.form-builder-row .form-builder-column-wrapper').length)
        .to.eql(0);
      expect(wrapper.find('.form-builder-row .form-builder-column').length)
        .to.eql(0);
    });

    it('should hide the entire row if one column has no obs and second is hidden', () => {
      const tableControls = [
        {
          id: '100',
          type: 'randomType',
          value: 'Pulse',
          properties: { location: { row: 0, column: 0 } },
        }];
      const tableRecords = tableControls.map((control) => ({
        control,
        obs: new Obs({ formFieldPath: `${formName}.${formVersion}/${control.id}` }),
        mapper: new ObsMapper(),
        hidden: true,
      }));

      const wrapper = shallow(<Row
        controls={tableControls}
        formName={formName}
        formVersion={formVersion}
        id={0}
        isInTable
        onValueChanged={onChangeSpy}
        records={tableRecords}
        validate={false}
        validateForm={false}
      />);
      expect(wrapper.find('.form-builder-row').length).to.eql(1);
      expect(wrapper.find('.form-builder-row')).to.be.blank();
    });
  });

  it('should hide the row when control is hidden', () => {
    records[0].hidden = true;
    const wrapper = shallow(
      <Row
        controls={controls}
        formName={formName}
        formVersion={formVersion}
        id={0}
        onValueChanged={onChangeSpy}
        records={records}
        validate={false}
        validateForm={false}
      />
    );
    expect(wrapper.find('.form-builder-column').at(0)).to.have.className('hidden');
  });

  it('should set same line class to the row when control is set same line', () => {
    const wrapper = shallow(
      <Row
        controls={controls}
        formName={formName}
        formVersion={formVersion}
        id={0}
        onValueChanged={onChangeSpy}
        records={records}
        validate={false}
        validateForm={false}
      />
    );
    expect(wrapper.find('.form-builder-column').at(0)).to.have.className('same-line');
  });
});
