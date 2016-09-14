/* eslint-disable no-undef */
import React from 'react';
import { shallow, mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { ObsGroupControl } from 'components/ObsGroupControl.jsx';
import { Label } from 'components/Label.jsx';
import { TextBox } from 'components/TextBox.jsx';
import { NumericBox } from 'components/NumericBox.jsx';
import { ObsControl } from 'components/ObsControl.jsx';

chai.use(chaiEnzyme());

describe('ObsGroupControl', () => {
  before(() => {
    componentStore.registerComponent('label', { control: Label });
    componentStore.registerComponent('text', { control: TextBox });
    componentStore.registerComponent('numeric', { control: NumericBox });
    componentStore.registerComponent('obsControl', { control: ObsControl });
  });

  after(() => {
    componentStore.deRegisterComponent('label');
    componentStore.deRegisterComponent('text');
    componentStore.deRegisterComponent('numeric');
    componentStore.deRegisterComponent('obsControl');
  });

  const textBoxConcept = {
    uuid: '70645842-be6a-4974-8d5f-45b52990e132',
    name: 'Pulse',
    dataType: 'Text',
  };

  const numericBoxConcept = {
    uuid: '216861e7-23d8-468f-9efb-672ce427a14b',
    name: 'Temperature',
    dataType: 'Numeric',
  };

  const conceptSet = {
    uuid: 'c36af094-3f10-11e4-adec-0800271c1b75',
    name: 'Pulse Data',
    dataType: 'N/A',
  };

  const metadata = {
    id: '100',
    concept: conceptSet,
    controls: [
      {
        id: '100',
        type: 'label',
        value: 'Pulse',
      },
      {
        id: '101',
        type: 'obsControl',
        displayType: 'numeric',
        concept: numericBoxConcept,
      },
    ],
  };

  const formUuid = 'F1';

  const observation = {
    concept: conceptSet,
    formNamespace: `${formUuid}/100`,
    groupMembers: [{
      concept: textBoxConcept,
      label: 'Pulse',
      value: '72',
      formNamespace: `${formUuid}/101`,
    }],
  };

  const properties = {};

  describe('render', () => {
    it('should render obsGroup control', () => {
      const wrapper = shallow(
        <ObsGroupControl
          formUuid={formUuid}
          metadata={metadata}
          obs={observation}
          properties={properties}
        />);

      expect(wrapper).to.have.exactly(1).descendants('Label');
      expect(wrapper).to.have.exactly(1).descendants('ObsControl');
    });


    it('should render obsGroup control with only the registered controls', () => {
      componentStore.deRegisterComponent('label');

      const wrapper = shallow(
        <ObsGroupControl
          formUuid={formUuid}
          metadata={metadata}
          obs={observation}
          properties={properties}
        />);

      expect(wrapper).to.not.have.descendants('Label');
      expect(wrapper).to.have.exactly(1).descendants('ObsControl');

      componentStore.registerComponent('label', Label);
    });
  });

  describe('getValue', () => {
    it('should return the observations of its children which are data controls', () => {
      const wrapper = mount(
        <ObsGroupControl
          formUuid={formUuid}
          metadata={metadata}
          obs={observation}
          properties={properties}
        />);
      const instance = wrapper.instance();

      const observations = instance.getValue();
      expect(observations.concept.name).to.eql('Pulse Data');
      expect(observations.groupMembers.length).to.eql(1);
      expect(observations.groupMembers[0].concept.name).to.eql('Pulse');
    });

    it('should return empty when there are no observations', () => {
      const wrapper = mount(
        <ObsGroupControl
          formUuid={formUuid}
          metadata={metadata}
          obs={{}}
          properties={properties}
        />);
      const instance = wrapper.instance();
      expect(instance.getValue()).to.deep.equal(undefined);
    });

    it('should return empty when the observations do not match any control id in form', () => {
      const obs = {
        concept: {
          uuid: 'uuid',
          name: 'Pulse Data',
          dataType: 'N/A',
        },
        groupMembers: [{
          concept: {
            uuid: 'differentUuid',
            name: 'Pulse',
            dataType: 'Text',
          },
          label: 'Pulse',
          value: '72',
          formNamespace: 'fm1/999999',
        }],
      };
      const wrapper = mount(
        <ObsGroupControl
          formUuid={formUuid}
          metadata={metadata}
          obs={obs}
          properties={properties}
        />);
      const instance = wrapper.instance();

      expect(instance.getValue()).to.deep.equal(undefined);
    });
  });
});
/* eslint-enable no-undef */
