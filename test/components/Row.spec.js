import React, { Component, PropTypes } from 'react';
import { mount, shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import Row from 'components/Row.jsx';
import sinon from 'sinon';
import ComponentStore from 'src/helpers/componentStore';
import { ObsMapper } from '../../src/mapper/ObsMapper';
import { Obs } from '../../src/helpers/Obs';

chai.use(chaiEnzyme());

function getLocationProperties(row, column) {
  return { location: { row, column } };
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
      properties: getLocationProperties(0, 1),
    },
    {
      id: '101',
      type: 'randomType',
      properties: getLocationProperties(0, 2),
    },
    {
      id: '102',
      type: 'randomType',
      properties: getLocationProperties(0, 3),
    },
  ];
  const formName = 'formName';
  const formVersion = '1';

  const records = controls.map(control => ({
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
        />
      );
      expect(wrapper).to.have.exactly(3).descendants('DummyControl');

      expect(wrapper.find('DummyControl').at(0)).to.have.prop('validate').to.eql(false);
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
        />
      );

      expect(wrapper).to.be.blank();
    });
  });
});
