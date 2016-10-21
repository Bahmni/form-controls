import React, { Component, PropTypes } from 'react';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { ObsGroupControl } from 'components/ObsGroupControl.jsx';

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

      const observations = instance.getValue();
      expect(observations.concept.name).to.eql(obsGroupConcept.name);
      expect(observations.groupMembers.length).to.eql(3);
      expect(observations.groupMembers).to.deep.eql([formUuid, formUuid, formUuid]);
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
