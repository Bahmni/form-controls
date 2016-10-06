/* eslint-disable no-undef */
import React from 'react';
import { shallow, mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { Section } from 'components/Section.jsx';
import { Label } from 'components/Label.jsx';
import { TextBox } from 'components/TextBox.jsx';
import { NumericBox } from 'components/NumericBox.jsx';
import { ObsControl } from 'components/ObsControl.jsx';

chai.use(chaiEnzyme());

describe('Section', () => {
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

  const label = {
    id: 'someId',
    value: 'someLabelName',
    type: 'label',
  };

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
    id: '100',
    value: 'SectionTitle',
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
        label,
      },
      {
        id: '102',
        type: 'obsControl',
        displayType: 'numeric',
        concept: numericBoxConcept,
        label,
      },
    ],
  };

  const formUuid = 'F1';

  const observation1 = {
    concept: textBoxConcept,
    label: 'Pulse',
    value: '72',
    formNamespace: `${formUuid}/101`,
    observationDateTime: '2016-09-08T10:10:38.000+0530',
  };

  const observation2 = {
    concept: numericBoxConcept,
    label: 'Temperature',
    value: '98',
    formNamespace: `${formUuid}/102`,
    observationDateTime: '2016-09-08T10:10:38.000+0530',
  };

  const sectionProperties = { visualOnly: true };

  const observations = [observation1, observation2];

  describe('render', () => {
    it('should render section', () => {
      const wrapper = shallow(
        <Section
          formUuid={formUuid}
          metadata={metadata}
          obs={observations}
          properties={sectionProperties}
        />);

      expect(wrapper.find('legend').text()).to.eql('SectionTitle');
      expect(wrapper).to.have.exactly(1).descendants('Label');
      expect(wrapper).to.have.exactly(2).descendants('ObsControl');
    });

    it('should render section without controls when it is empty', () => {
      const meta = { id: '100', controls: [], value: 'Title' };
      const wrapper = shallow(
        <Section
          formUuid={formUuid}
          metadata={meta}
          obs={[]}
          properties={sectionProperties}
        />);

      expect(wrapper.find('legend').text()).to.eql('Title');
      expect(wrapper.find('.section-controls')).to.be.blank();
    });

    it('should render section with only the registered controls', () => {
      componentStore.deRegisterComponent('label');

      const wrapper = shallow(
        <Section
          formUuid={formUuid}
          metadata={metadata}
          obs={[]}
          properties={sectionProperties}
        />);

      expect(wrapper).to.not.have.descendants('Label');
      expect(wrapper).to.have.exactly(2).descendants('ObsControl');

      componentStore.registerComponent('label', Label);
    });
  });

  describe('getValue', () => {
    it('should return the observations of its children which are data controls', () => {
      const wrapper = mount(
        <Section
          formUuid={formUuid}
          metadata={metadata}
          obs={observations}
          properties={sectionProperties}
        />);
      const instance = wrapper.instance();

      expect(instance.getValue()).to.deep.equal([observation1, observation2]);
    });

    it('should return empty when there are no observations', () => {
      const wrapper = mount(
        <Section
          formUuid={formUuid}
          metadata={metadata}
          obs={[]}
          properties={sectionProperties}
        />);
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
      const wrapper = mount(
        <Section
          formUuid={formUuid}
          metadata={metadata}
          obs={obs}
          properties={sectionProperties}
        />);
      const instance = wrapper.instance();

      expect(instance.getValue()).to.deep.equal([]);
    });
  });
});
/* eslint-enable no-undef */
