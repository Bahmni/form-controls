import React, { Component, PropTypes } from 'react';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { ObsGroupControl } from 'components/ObsGroupControl.jsx';
import sinon from 'sinon';
import { Obs } from 'src/helpers/Obs';
import { List } from 'immutable';
import { AbnormalObsGroupMapper } from 'src/mapper/AbnormalObsGroupMapper';
import { ObsGroupMapper } from 'src/mapper/ObsGroupMapper';


chai.use(chaiEnzyme());

function getLocationProperties(row, column) {
  return { location: { row, column } };
}

class DummyControl extends Component {
  getValue() {
    return { uuid: this.props.formUuid };
  }

  render() {
    return (<div>{ this.props.formUuid }</div>);
  }
}

DummyControl.propTypes = {
  formUuid: PropTypes.string,
};

describe('ObsGroupControl', () => {
  before(() => {
    window.componentStore.registerComponent('randomType', DummyControl);
  });

  after(() => {
    window.componentStore.deRegisterComponent('randomType');
  });

  const formUuid = 'someUuid';
  const obsGroupConcept = {
    uuid: '70645842-be6a-4974-8d5f-45b52990e132',
    name: 'Pulse Data',
    datatype: 'N/A',
  };

  const metadata = {
    id: '1',
    type: 'obsGroupControl',
    concept: obsGroupConcept,
    properties: getLocationProperties(0, 0),
    label: {
      type: 'label',
      value: 'label',
    },
    controls: [
      {
        id: '100',
        type: 'numeric',
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
        properties: getLocationProperties(1, 0),
      },
    ],
  };
  const onChangeSpy = sinon.spy();
  const observation = {
    groupMembers: [{
      formNamespace: `${formUuid}/101`,
      value: 'someValue',
    }],
  };

  describe('render', () => {
    it('should render obsGroup control with observations', () => {
      const wrapper = mount(
        <ObsGroupControl
          formUuid={formUuid}
          metadata={metadata}
          obs={observation}
          onValueChanged={onChangeSpy}
          validate={false}
        />);

      expect(wrapper.find('Row').at(0).props().observations).to.eql(observation.groupMembers);
      expect(wrapper.find('legend').text()).to.eql(obsGroupConcept.name);
    });


    it('should render obsGroup control with only the registered controls', () => {
      window.componentStore.deRegisterComponent('randomType');
      const wrapper = mount(
        <ObsGroupControl
          formUuid={formUuid}
          metadata={metadata}
          obs={observation}
          onValueChanged={onChangeSpy}
          validate={false}
        />);

      expect(wrapper).to.not.have.descendants('DummyControl');
      window.componentStore.registerComponent('randomType', DummyControl);
    });

    it('should invoke the corresponding mapper based on metadata property', () => {
      metadata.properties.isAbnormal = true;
      const wrapper = mount(
        <ObsGroupControl
          formUuid={formUuid}
          metadata={metadata}
          obs={observation}
          onValueChanged={onChangeSpy}
          validate={false}
        />);

      const instance = wrapper.instance();
      expect(instance.mapper instanceof AbnormalObsGroupMapper).to.deep.equal(true);
    });

    it('should trigger onChange in obsGroup if its child obs has changed', () => {
      const pulseAbnormalObs = new Obs({ concept: {
        name: 'PulseAbnormal',
        uuid: 'pulseAbnormalUuid',
        datatype: 'Boolean',
        conceptClass: 'Abnormal',
      }, value: false, formNamespace: 'formUuid/5', uuid: 'childObs2Uuid' });

      const pulseNumericObs = new Obs({ concept: {
        name: 'Pulse',
        uuid: 'pulseUuid',
        datatype: 'Numeric',
        conceptClass: 'Misc',
      }, value: 10, formNamespace: 'formUuid/6', uuid: 'childObs1Uuid' });

      const pulseDataObs = new Obs({ concept: {
        name: 'Pulse Data',
        uuid: 'pulseDataUuid',
        datatype: 'Misc',
      },
        groupMembers: List.of(pulseNumericObs, pulseAbnormalObs),
        formNamespace: 'formUuid/4', uuid: 'pulseDataObsUuid' });

      const wrapper = mount(
        <ObsGroupControl
          formUuid={formUuid}
          metadata={metadata}
          obs={pulseDataObs}
          onValueChanged={onChangeSpy}
          validate={false}
        />);

      const pulseNumericUpdated = pulseNumericObs.setValue(20);
      const instance = wrapper.instance();
      instance.onChange(pulseNumericUpdated, []);

      sinon.assert.calledOnce(
        onChangeSpy.withArgs(instance.mapper.setValue(pulseDataObs, pulseNumericUpdated, []), []));
    });

    it('should have obsGroupMapper if metadata does not have isAbnormal property', () => {
      metadata.properties.isAbnormal = false;
      const wrapper = mount(
        <ObsGroupControl
          formUuid={formUuid}
          metadata={metadata}
          obs={observation}
          onValueChanged={onChangeSpy}
          validate={false}
        />);

      const instance = wrapper.instance();
      expect(instance.mapper instanceof ObsGroupMapper).to.deep.equal(true);
    });
  });
});
