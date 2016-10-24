import React, { Component, PropTypes } from 'react';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { ObsGroupControl } from 'components/ObsGroupControl.jsx';
import sinon from 'sinon';
import each from 'lodash/each';

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
    controls: [
      {
        id: '100',
        type: 'randomType',
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

  describe('render', () => {
    it('should render obsGroup control', () => {
      const observation = {};
      const wrapper = mount(
        <ObsGroupControl
          formUuid={formUuid}
          metadata={metadata}
          obs={observation}
        />);

      expect(wrapper).to.have.exactly(2).descendants('Row');
      expect(wrapper).to.have.exactly(3).descendants('DummyControl');
      expect(wrapper.find('Row').at(0).props().observations).to.eql([]);
      expect(wrapper.find('legend').text()).to.eql(obsGroupConcept.name);
    });

    it('should render obsGroup control with observations', () => {
      const observation = {
        groupMembers: [{
          formNamespace: `${formUuid}/101`,
          value: 'someValue',
        }],
      };
      const wrapper = mount(
        <ObsGroupControl
          formUuid={formUuid}
          metadata={metadata}
          obs={observation}
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
          obs={{}}
        />);

      expect(wrapper).to.not.have.descendants('DummyControl');
      window.componentStore.registerComponent('randomType', DummyControl);
    });
  });

  describe('getValue', () => {
    it('should return the observations from childControls', () => {
      const wrapper = mount(
        <ObsGroupControl
          formUuid={formUuid}
          metadata={metadata}
          obs={{}}
        />);
      const instance = wrapper.instance();
      const uuid = { uuid: 'someUuid' };

      const expectedObs = {
        concept: {
          uuid: '70645842-be6a-4974-8d5f-45b52990e132',
          name: 'Pulse Data', datatype: 'N/A',
        },
        formNamespace: 'someUuid/1',
        groupMembers: [uuid, uuid, uuid],
        voided: false,
      };

      const observations = instance.getValue();
      expect(observations).to.deep.eql(expectedObs);
    });

    it('should return undefined when there are no observations', () => {
      const metadataClone = Object.assign({}, metadata);
      metadataClone.controls = [];
      const wrapper = mount(
        <ObsGroupControl
          formUuid={formUuid}
          metadata={metadataClone}
          obs={{}}
        />);
      const instance = wrapper.instance();
      expect(instance.getValue()).to.deep.equal(undefined);
    });

    it('should return voided obs if all the child obs are voided', () => {
      const wrapper = mount(
        <ObsGroupControl
          formUuid={formUuid}
          metadata={metadata}
          obs={{}}
        />);
      const instance = wrapper.instance();
      const childObs = { uuid: 'someUuid', voided: true };

      const expectedObs = {
        concept: {
          uuid: '70645842-be6a-4974-8d5f-45b52990e132',
          name: 'Pulse Data', datatype: 'N/A',
        },
        formNamespace: 'someUuid/1',
        groupMembers: [childObs, childObs, childObs],
        voided: true,
      };

      each(instance.childControls, (controls) => {
        each(controls.childControls, (control) => {
          sinon.stub(control, 'getValue', () => ({ uuid: childObs.uuid, voided: true }));
        });
      });
      const observations = instance.getValue();
      expect(observations).to.deep.eql(expectedObs);
    });
  });

  describe('getErrors', () => {
    it('should return all children errors', () => {
      const wrapper = mount(
        <ObsGroupControl
          formUuid={formUuid}
          metadata={metadata}
          obs={{}}
        />);
      const instance = wrapper.instance();

      const error1 = { errorType: 'error1' };
      const error2 = { errorType: 'error2' };
      const error3 = { errorType: 'error3' };
      instance.childControls = {
        ref1: { getErrors: () => [error1, error2] },
        ref2: { getErrors: () => [error3, error1, error2] },
      };

      expect(instance.getErrors()).to.deep.equal([error1, error2, error3, error1, error2]);
    });
  });
});
