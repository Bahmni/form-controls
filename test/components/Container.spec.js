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
import { ObsGroupControl } from 'components/ObsGroupControl.jsx';
import { Error } from 'src/Error';
import constants from 'src/constants';

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
    componentStore.registerComponent('obsGroupControl', ObsGroupControl);
  });

  after(() => {
    componentStore.deRegisterComponent('label');
    componentStore.deRegisterComponent('text');
    componentStore.deRegisterComponent('numeric');
    componentStore.deRegisterComponent('obsControl');
    componentStore.deRegisterComponent('obsGroupControl');
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
      groupMembers: undefined,
    };

    observation2 = {
      concept: numericBoxConcept,
      formNamespace: 'fm1/102',
      observationDateTime: '2016-09-08T10:10:38.000+0530',
      uuid: undefined,
      value: '98',
      voided: false,
      comment: undefined,
      groupMembers: undefined,
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

      const mandatoryError = new Error({ message: constants.validations.mandatory });
      expect(instance.getValue()).to.deep.eql({ errors: [mandatoryError] });
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
        groupMembers: undefined,
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

      const mandatoryError = new Error({ message: constants.validations.mandatory });
      expect(instance.getValue()).to.deep.equal({ errors: [mandatoryError] });
    });
  });

  describe('obsGroup', () => {
    const obsGroupMetaData = {
      id: 'formUuid',
      uuid: 'formUuid',
      controls: [{
        type: 'obsGroupControl',
        id: '2',
        label: { type: 'label', value: 'New ObsGroup' },
        concept: {
          name: 'New ObsGroup',
          uuid: 'f5bda4ed-c400-4304-8c7c-8c647c3cb429',
          datatype: 'N/A',
        },
        controls: [{
          type: 'obsControl',
          id: '201',
          concept: {
            name: 'Pulse',
            uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
            datatype: 'Numeric',
          },
          properties: { location: { column: 0, row: 0 } },
          label: { type: 'label', value: 'Pulse' },
        }, {
          type: 'obsControl',
          id: '202',
          concept: {
            name: 'History Notes',
            uuid: 'c2a43174-c9db-4e54-8516-17372c83537f',
            datatype: 'text',
          },
          properties: { location: { column: 0, row: 2 } },
          label: { type: 'label', value: 'History Notes' },
        }],
        properties: { location: { column: 0, row: 1 } },
      }],
    };

    it('should filter child obs which are not having value from obs group', () => {
      const wrapper = mount(
        <Container
          metadata={obsGroupMetaData}
          observations={[]}
          validate={false}
        />);

      wrapper.find('input').simulate('change', { target: { value: '999' } });
      const instance = wrapper.instance();

      const updatedObs = instance.getValue();

      expect(updatedObs.observations.length).to.be.eql(1);
      expect(updatedObs.observations[0].groupMembers.length).to.be.eql(1);
    });


    it('should render with default obs', () => {
      const obs = [
        {
          concept: {
            name: 'New ObsGroup',
            uuid: 'f5bda4ed-c400-4304-8c7c-8c647c3cb429',
            datatype: 'N/A',
          },
          formNamespace: 'formUuid/2',
          groupMembers: [
            {
              concept: {
                name: 'Pulse',
                uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
                datatype: 'Numeric',
              },
              value: '99',
              formNamespace: 'formUuid/201',
            },
            {
              concept: {
                name: 'History Notes',
                uuid: 'c2a43174-c9db-4e54-8516-17372c83537f',
                datatype: 'text',
              },
              value: 'notes',
              formNamespace: 'formUuid/202',
            },
          ],
        },
      ];
      const wrapper = mount(
        <Container
          metadata={obsGroupMetaData}
          observations={obs}
          validate={false}
        />);

      expect(wrapper.find('input')).to.have.value('99');
      expect(wrapper.find('textarea').props().defaultValue).to.be.eql('notes');
    });
  });
});
/* eslint-enable no-undef */
