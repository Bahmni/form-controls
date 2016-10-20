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
import { Section } from 'components/Section.jsx';

chai.use(chaiEnzyme());

describe('Container', () => {
  before(() => {
    componentStore.registerComponent('label', Label);
    componentStore.registerComponent('text', TextBox);
    componentStore.registerComponent('numeric', NumericBox);
    componentStore.registerComponent('obsControl', ObsControl);
    componentStore.registerComponent('section', Section);
  });

  after(() => {
    componentStore.deRegisterComponent('label');
    componentStore.deRegisterComponent('text');
    componentStore.deRegisterComponent('numeric');
    componentStore.deRegisterComponent('obsControl');
    componentStore.deRegisterComponent('section');
  });

  const textBoxConcept = {
    uuid: '70645842-be6a-4974-8d5f-45b52990e132',
    name: 'Pulse',
    datatype: 'Text',
  };

  const numericBoxConcept = {
    uuid: '216861e7-23d8-468f-9efb-672ce427a14b',
    name: 'Temperature',
    datatype: 'Numeric',
  };

  const label = {
    id: 'someId',
    value: 'someValue',
    type: 'label',
  };

  function getLocationProperties(row, column) {
    return { location: { row, column } };
  }

  const metadata = {
    id: '100',
    uuid: 'fm1',
    name: 'Vitals',
    controls: [
      {
        id: '100',
        type: 'label',
        value: 'Pulse',
        properties: getLocationProperties(0, 0),
      },
      {
        id: '101',
        type: 'obsControl',
        concept: textBoxConcept,
        label,
        properties: getLocationProperties(1, 0),
      },
      {
        id: '102',
        type: 'obsControl',
        concept: numericBoxConcept,
        label,
        properties: getLocationProperties(2, 0),
      },
    ],
  };

  const observation1 = {
    concept: textBoxConcept,
    label: 'Pulse',
    value: '72',
    formNamespace: 'fm1/101',
    observationDateTime: '2016-09-08T10:10:38.000+0530',
  };

  const observation2 = {
    concept: numericBoxConcept,
    label: 'Temperature',
    value: '98',
    formNamespace: 'fm1/102',
    observationDateTime: '2016-09-08T10:10:38.000+0530',
  };

  const observations = [observation1, observation2];

  describe('render', () => {
    it('should render form', () => {
      const wrapper = mount(<Container metadata={metadata} observations={[]} />);

      expect(wrapper).to.have.exactly(3).descendants('Row');
      expect(wrapper).to.have.exactly(3).descendants('Label');
      expect(wrapper).to.have.exactly(2).descendants('ObsControl');
    });

    it('should render form without controls when it is empty', () => {
      const meta = { id: '100', controls: [], uuid: 'uuid' };
      const wrapper = shallow(<Container metadata={meta} observations={[]} />);

      expect(wrapper).to.be.blank();
    });

    it('should render form with only the registered controls', () => {
      componentStore.deRegisterComponent('numeric');

      const wrapper = mount(<Container metadata={metadata} observations={[]} />);

      expect(wrapper).to.have.exactly(2).descendants('ObsControl');
      expect(wrapper).to.have.exactly(2).descendants('Label');

      componentStore.registerComponent('numeric', NumericBox);
    });
  });

  describe('getValue', () => {
    it('should return the observations of its children which are data controls', () => {
      const wrapper = mount(<Container metadata={metadata} observations={observations} />);
      const instance = wrapper.instance();

      expect(instance.getValue()).to.deep.equal([observation1, observation2]);
    });

    it('should return empty when there are no observations', () => {
      const wrapper = mount(<Container metadata={metadata} observations={[]} />);
      const instance = wrapper.instance();

      expect(instance.getValue()).to.deep.equal([]);
    });

    it('should return empty when the observations do not match any control id in form', () => {
      const obs = [
        {
          concept: {
            uuid: 'differentUuid',
            name: 'Pulse',
            dataType: 'Text',
          },
          label: 'Pulse',
          value: '72',
          formNamespace: 'fm1/999999',
        },
      ];
      const wrapper = mount(<Container metadata={metadata} observations={obs} />);
      const instance = wrapper.instance();

      expect(instance.getValue()).to.deep.equal([]);
    });
  });

  describe('with section', () => {
    const metadataWithSection = {
      id: '100',
      uuid: 'fm1',
      name: 'Vitals',
      controls: [
        {
          id: '300',
          type: 'section',
          value: 'someSectionLegend',
          properties: {
            visualOnly: true,
            location: getLocationProperties(0, 0).location,
          },
          controls: [
            {
              id: '100',
              type: 'label',
              value: 'Pulse',
              properties: getLocationProperties(0, 0),
            },
            {
              id: '101',
              type: 'obsControl',
              displayType: 'text',
              concept: textBoxConcept,
              label,
              properties: getLocationProperties(1, 0),
            },
            {
              id: '102',
              type: 'obsControl',
              displayType: 'numeric',
              concept: numericBoxConcept,
              label,
              properties: getLocationProperties(2, 0),
            },
          ],
        },
        {
          id: '301',
          type: 'obsControl',
          displayType: 'numeric',
          concept: numericBoxConcept,
          label,
          properties: getLocationProperties(1, 0),
        },
      ],
    };

    it('should render form with section and pass all observations to section', () => {
      const wrapper = mount(
        <Container
          metadata={metadataWithSection}
          observations={observations}
        />);

      expect(wrapper).to.have.exactly(1).descendants('Section');
      expect(wrapper.find('Section')).to.have.prop('obs').deep.equal(observations);
      expect(wrapper).to.have.exactly(3).descendants('ObsControl');
    });

    it('should return observations of all children', () => {
      const observation3 = {
        concept: numericBoxConcept,
        label: 'Temperature',
        value: '98',
        formNamespace: 'fm1/301',
        observationDateTime: '2016-09-08T10:10:38.000+0530',
      };

      const obs = [observation1, observation2, observation3];
      const wrapper = mount(<Container metadata={metadataWithSection} observations={obs} />);

      const instance = wrapper.instance();

      expect(instance.getValue()).to.deep.equal([observation1, observation2, observation3]);
    });
  });
});
/* eslint-enable no-undef */
