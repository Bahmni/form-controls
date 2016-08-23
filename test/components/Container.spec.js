/* eslint-disable no-undef */
import React from 'react';
import { shallow, mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { Container } from 'components/Container.jsx';
import { Label } from 'components/Label.jsx';
import { TextBox } from 'components/TextBox.jsx';
import { NumericBox } from 'components/NumericBox.jsx';
import { ObsControl } from 'components/ObsControl.jsx';

chai.use(chaiEnzyme());

describe('Container', () => {
  before(() => {
    componentStore.registerComponent('label', Label);
    componentStore.registerComponent('text', TextBox);
    componentStore.registerComponent('numeric', NumericBox);
    componentStore.registerComponent('obsControl', ObsControl);
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

  const metadata = {
    name: 'Vitals',
    controls: [
      {
        id: '100',
        type: 'label',
        value: 'Pulse',
      },
      {
        id: '101',
        type: 'obsControl',
        displayType: 'text',
        concept: textBoxConcept,
      },
      {
        id: '102',
        type: 'obsControl',
        displayType: 'numeric',
        concept: numericBoxConcept,
      },
    ],
  };

  const observation1 = {
    concept: textBoxConcept,
    label: 'Pulse',
    value: '72',
  };

  const observation2 = {
    concept: numericBoxConcept,
    label: 'Temperature',
    value: '98',
  };

  const observations = [observation1, observation2];

  describe('render', () => {
    it('should render form', () => {
      const wrapper = shallow(<Container metadata={metadata} observations={[]} />);

      expect(wrapper).to.have.exactly(1).descendants('Label');
      expect(wrapper).to.have.exactly(2).descendants('ObsControl');
    });

    it('should render form without controls when it is empty', () => {
      const wrapper = shallow(<Container metadata={{ controls: [] }} observations={[]} />);

      expect(wrapper).to.be.blank();
    });

    it('should render form with only the registered controls', () => {
      componentStore.deRegisterComponent('label');

      const wrapper = shallow(<Container metadata={metadata} observations={[]} />);

      expect(wrapper).to.not.have.descendants('Label');
      expect(wrapper).to.have.exactly(2).descendants('ObsControl');

      componentStore.registerComponent('label', Label);
    });
  });

  describe('getValue', () => {
    it('should return the observations of its children which are data controls', () => {
      const wrapper = mount(<Container metadata={metadata} observations={observations} />);
      const instance = wrapper.instance();

      const expectedObservations = [observation1, observation2];
      expect(instance.getValue()).to.deep.equal(expectedObservations);
    });

    it('should return empty when there are no observations', () => {
      const wrapper = mount(<Container metadata={metadata} observations={[]} />);
      const instance = wrapper.instance();

      expect(instance.getValue()).to.deep.equal([]);
    });

    it('should return empty when the observations do not match any concept id in form', () => {
      const obs = [
        {
          concept: {
            uuid: 'differentUuid',
            name: 'Pulse',
            dataType: 'Text',
          },
          label: 'Pulse',
          value: '72',
        },
      ];
      const wrapper = mount(<Container metadata={metadata} observations={obs} />);
      const instance = wrapper.instance();

      expect(instance.getValue()).to.deep.equal([]);
    });
  });
});
/* eslint-enable no-undef */
