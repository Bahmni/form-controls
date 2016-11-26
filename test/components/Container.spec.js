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
  let metadata;
  let observations;
  let observation1;
  let observation2;

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

  function getLocationProperties(row, column) {
    return { location: { row, column } };
  }

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

  beforeEach(() => {
    metadata = {
      id: '100',
      uuid: 'fm1',
      name: 'Vitals',
      controls: [
        {
          id: '200',
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
          properties: { location: { row: 2, column: 0 }, mandatory: true },
        },
      ],
    };

    observation1 = {
      concept: textBoxConcept,
      formNamespace: 'fm1/101',
      observationDateTime: '2016-09-08T10:10:38.000+0530',
      uuid: undefined,
      value: '72',
      voided: false,
      comment: undefined,
      groupMembers: [],
    };

    observation2 = {
      concept: numericBoxConcept,
      formNamespace: 'fm1/102',
      observationDateTime: '2016-09-08T10:10:38.000+0530',
      uuid: undefined,
      value: '98',
      voided: false,
      comment: undefined,
      groupMembers: [],
    };

    observations = [observation1, observation2];
  });

  describe('render', () => {
    it('should render form', () => {
      const wrapper = mount(<Container metadata={metadata} observations={[]} validate={false} />);

      expect(wrapper).to.have.exactly(3).descendants('Row');
      expect(wrapper).to.have.exactly(3).descendants('Label');
      expect(wrapper).to.have.exactly(2).descendants('ObsControl');
    });

    it('should render form without controls when it is empty', () => {
      const meta = { id: '100', controls: [], uuid: 'uuid' };
      const wrapper = shallow(<Container metadata={meta} observations={[]} validate={false} />);

      expect(wrapper).to.be.blank();
    });

    it('should render form with only the registered controls', () => {
      componentStore.deRegisterComponent('numeric');

      const wrapper = mount(<Container metadata={metadata} observations={[]} validate={false} />);

      expect(wrapper).to.have.exactly(2).descendants('ObsControl');
      expect(wrapper).to.have.exactly(1).descendants('TextBox');
      expect(wrapper).to.have.exactly(2).descendants('Label');

      expect(wrapper.find('ObsControl').at(0).props().validate).to.eql(false);
      componentStore.registerComponent('numeric', NumericBox);
    });
  });

  describe('getValue', () => {
    it('should return the observations of its children which are data controls', () => {
      const wrapper = mount(<
        Container
        metadata={metadata}
        observations={observations}
        validate={false}
      />);
      const instance = wrapper.instance();

      expect(instance.getValue()).to.deep.equal({ observations });
    });

    it('should return empty when there are no observations', () => {
      const wrapper = mount(<Container metadata={metadata} observations={[]} validate={false} />);
      const instance = wrapper.instance();

      expect(instance.getValue()).to.deep.equal({ observations: [] });
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
      const wrapper = mount(<Container metadata={metadata} observations={obs} validate={false} />);
      const instance = wrapper.instance();

      expect(instance.getValue()).to.deep.equal({ observations: [] });
    });

    it('should return the errors of its children which are data controls', () => {
      const metadataClone = Object.assign({}, metadata);
      const mandatoryControl = {
        id: '103',
        type: 'obsControl',
        concept: numericBoxConcept,
        label,
        properties: { location: { row: 2, column: 1 }, mandatory: true },
      };
      metadataClone.controls.push(mandatoryControl);
      const wrapper = mount(<
        Container
        metadata={metadataClone}
        observations={observations}
        validate={false}
      />);

      wrapper.find('input').at(0).simulate('change', { target: { value: undefined } });
      const instance = wrapper.instance();

      const expectedErrors = [{ errorType: 'mandatory' }];
      expect(instance.getValue()).to.deep.equal({ errors: expectedErrors });
    });

    it('should not throw mandatory errors if there are no observations', () => {
      const metadataClone = Object.assign({}, metadata);
      const mandatoryControl = {
        id: '103',
        type: 'obsControl',
        concept: numericBoxConcept,
        label,
        properties: { location: { row: 2, column: 1 }, mandatory: true },
      };
      metadataClone.controls.push(mandatoryControl);
      const wrapper = mount(<
        Container
        metadata={metadataClone}
        observations={[]}
        validate={false}
      />);
      const instance = wrapper.instance();
      expect(instance.getValue()).to.deep.equal({ observations: [] });
    });

    it('should not throw mandatory errors on voided observations', () => {
      const metadataClone = Object.assign({}, metadata);
      const mandatoryControl = {
        id: '103',
        type: 'obsControl',
        concept: numericBoxConcept,
        label,
        properties: { location: { row: 2, column: 1 }, mandatory: true },
      };
      const voidedObservation = {
        concept: textBoxConcept,
        uuid: 'someUuid',
        value: '72',
        formNamespace: 'fm1/101',
        observationDateTime: '2016-09-08T10:10:38.000+0530',
        voided: true,
        groupMembers: [],
        comment: undefined,
      };
      metadataClone.controls.push(mandatoryControl);
      const wrapper =
        mount(<Container metadata={metadataClone} observations={[voidedObservation]}
          validate={false}
        />);
      wrapper.find('input').at(0).simulate('change', { target: { value: undefined } });
      const instance = wrapper.instance();

      expect(instance.getValue()).to.deep.equal({ observations: [voidedObservation] });
    });

    it('should throw mandatory error when there are voided and non-voided obs', () => {
      const metadataClone = Object.assign({}, metadata);
      const mandatoryControl = {
        id: '103',
        type: 'obsControl',
        concept: numericBoxConcept,
        label,
        properties: { location: { row: 2, column: 1 }, mandatory: true },
      };
      const voidedObservation = {
        concept: textBoxConcept,
        label: 'Pulse',
        value: '72',
        formNamespace: 'fm1/101',
        observationDateTime: '2016-09-08T10:10:38.000+0530',
        voided: true,
      };
      metadataClone.controls.push(mandatoryControl);
      const wrapper =
        mount(
          <Container
            metadata={metadataClone}
            observations={[voidedObservation, observation2]}
            validate={false}
          />
        );
      const instance = wrapper.instance();
      wrapper.find('input').at(1).simulate('change', { target: { value: undefined } });

      const expectedErrors = [{ errorType: 'mandatory' }];
      expect(instance.getValue()).to.deep.equal({ errors: expectedErrors });
    });
  });
});
/* eslint-enable no-undef */
