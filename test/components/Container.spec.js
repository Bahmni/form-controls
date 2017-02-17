/* eslint-disable no-undef */
import React from 'react';
import { shallow, mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { Container } from 'components/Container.jsx';
import { Label } from 'components/Label.jsx';
import { TextBox } from 'components/TextBox.jsx';
import { NumericBox } from 'components/NumericBox.jsx';
import { Button } from 'components/Button.jsx';
import { ObsControl } from 'components/ObsControl.jsx';
import { ObsGroupControl } from 'components/ObsGroupControl.jsx';
import { CodedControl } from 'components/CodedControl.jsx';
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
    componentStore.registerComponent('button', Button);
    componentStore.registerComponent('Coded', CodedControl);
    componentStore.registerComponent('obsControl', ObsControl);
    componentStore.registerComponent('obsGroupControl', ObsGroupControl);
  });

  after(() => {
    componentStore.deRegisterComponent('label');
    componentStore.deRegisterComponent('text');
    componentStore.deRegisterComponent('numeric');
    componentStore.deRegisterComponent('button');
    componentStore.deRegisterComponent('Coded');
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
      id: 100,
      uuid: 'fm1',
      name: 'Vitals',
      version: '1',
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
      formNamespace: 'Bahmni',
      formFieldPath: 'Vitals.1/101-0',
      observationDateTime: '2016-09-08T10:10:38.000+0530',
      uuid: undefined,
      value: '72',
      voided: false,
      comment: undefined,
      groupMembers: undefined,
    };

    observation2 = {
      concept: numericBoxConcept,
      formNamespace: 'Bahmni',
      formFieldPath: 'Vitals.1/102-0',
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
      const wrapper = mount(<Container
        collapse
        metadata={metadata}
        observations={[]}
        validate={false}
      />);

      expect(wrapper).to.have.exactly(3).descendants('Row');
      expect(wrapper).to.have.exactly(3).descendants('Label');
      expect(wrapper).to.have.exactly(2).descendants('ObsControl');
    });

    it('should render form with collapse equals true', () => {
      const wrapper = mount(
        <Container collapse metadata={metadata} observations={[]} validate={false} />
      );

      expect(wrapper).to.have.exactly(3).descendants('Row');
      expect(wrapper.find('Row').at(0).props().collapse).to.eql(true);
      expect(wrapper.find('Row').at(1).props().collapse).to.eql(true);
    });

    it('should render form without controls when it is empty', () => {
      const meta = { id: 100, name: 'Vitals', controls: [], uuid: 'uuid', version: '1' };
      const wrapper = shallow(<Container
        collapse
        metadata={meta}
        observations={[]}
        validate={false}
      />);

      expect(wrapper).to.be.blank();
    });

    it('should render form with only the registered controls', () => {
      componentStore.deRegisterComponent('numeric');

      const wrapper = mount(<Container
        collapse
        metadata={metadata}
        observations={[]}
        validate={false}
      />);

      expect(wrapper).to.have.exactly(2).descendants('ObsControl');
      expect(wrapper).to.have.exactly(1).descendants('TextBox');
      expect(wrapper).to.have.exactly(2).descendants('Label');

      expect(wrapper.find('ObsControl').at(0).props().validate).to.eql(false);
      componentStore.registerComponent('numeric', NumericBox);
    });

    it('should reRender on change of collapse property', () => {
      const wrapper = mount(
        <Container
          collapse
          metadata={metadata}
          observations={[]}
          validate={false}
        />
      );

      expect(wrapper).to.have.exactly(3).descendants('Row');
      expect(wrapper.find('Row').at(0).props().collapse).to.eql(true);
      expect(wrapper.find('Row').at(1).props().collapse).to.eql(true);

      wrapper.setProps({ collapse: false });
      expect(wrapper).to.have.exactly(3).descendants('Row');
      expect(wrapper.find('Row').at(0).props().collapse).to.eql(false);
      expect(wrapper.find('Row').at(1).props().collapse).to.eql(false);
    });
  });

  describe('getValue', () => {
    it('should return the observations of its children which are data controls', () => {
      const wrapper = mount(<
        Container
        collapse
        metadata={metadata}
        observations={observations}
        validate={false}
      />);
      const instance = wrapper.instance();

      expect(instance.getValue()).to.deep.equal({ observations });
    });

    it('should return empty when there are no observations', () => {
      const wrapper = mount(<Container
        collapse
        metadata={metadata}
        observations={[]}
        validate={false}
      />);
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
          formFieldPath: 'fm1/999999',
        },
      ];
      const wrapper = mount(<Container
        collapse
        metadata={metadata}
        observations={obs}
        validate={false}
      />);
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
        collapse
        metadata={metadataClone}
        observations={observations}
        validate={false}
      />);

      wrapper.find('input').at(0).simulate('change', { target: { value: undefined } });
      const instance = wrapper.instance();

      const mandatoryError = new Error({ message: constants.validations.mandatory });
      expect(instance.getValue().errors.length).to.eql(1);
      expect(instance.getValue().errors).to.deep.eql([mandatoryError]);

      expect(instance.getValue().observations.length).to.equal(1);
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
        collapse
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
        formNamespace: 'Bahmni',
        formFieldPath: 'Vitals.1/101-0',
        observationDateTime: '2016-09-08T10:10:38.000+0530',
        voided: true,
        groupMembers: undefined,
        comment: undefined,
      };
      metadataClone.controls.push(mandatoryControl);
      const wrapper =
        mount(<Container
          collapse
          metadata={metadataClone}
          observations={[voidedObservation]}
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
        formFieldPath: 'fm1/101',
        observationDateTime: '2016-09-08T10:10:38.000+0530',
        voided: true,
      };
      metadataClone.controls.push(mandatoryControl);
      const wrapper =
        mount(
          <Container
            collapse
            metadata={metadataClone}
            observations={[voidedObservation, observation2]}
            validate={false}
          />
        );
      const instance = wrapper.instance();
      wrapper.find('input').at(1).simulate('change', { target: { value: undefined } });

      const mandatoryError = new Error({ message: constants.validations.mandatory });
      expect(instance.getValue().errors.length).to.equal(1);
      expect(instance.getValue().errors).to.deep.equal([mandatoryError]);

      expect(instance.getValue().observations.length).to.equal(1);
    });

    it('should set active of empty record to be false when call filterEmptyRecords method', () => {
      metadata = {
        controls: [
          {
            concept: {
              answers: [],
              datatype: 'Numeric',
              name: 'Pulse',
              properties: {
                allowDecimal: true,
              },
              uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
            },
            id: '1',
            label: {
              type: 'label',
              value: 'Pulse(/min)',
            },
            properties: {
              addMore: true,
              location: {
                column: 0,
                row: 0,
              },
              mandatory: false,
              notes: false,
            },
            type: 'obsControl',
          },
        ],
        id: 182,
        name: 'bug',
        uuid: '77024fad-36eb-4b76-86f6-dbe84612dda1',
        version: '1',
      };

      observations =
      [
        {
          concept: {
            conceptClass: 'Misc',
            dataType: 'Numeric',
            mappings: [],
            name: 'Pulse',
            set: false,
            shortName: 'Pulse',
            units: '/min',
            uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
          },
          formFieldPath: 'bug.1/1-0',
          uuid: 'aa91a654-b346-4d70-9881-01ef54bf928c',
          value: 1,
          voided: false,
        },
        {
          concept: {
            conceptClass: 'Misc',
            dataType: 'Numeric',
            mappings: [],
            name: 'Pulse',
            set: false,
            shortName: 'Pulse',
            units: '/min',
            uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
          },
          formFieldPath: 'bug.1/1-1',
          uuid: 'c9e0d7fb-79ec-43c4-9739-28b98fae8dc4',
          voided: true,
        },
      ];


      const wrapper =
        mount(
          <Container
            metadata={metadata}
            observations={observations}
            validate={false}
          />
        );

      expect(wrapper.state('data').getRecords()[0].toJS().active).to.equal(true);
      expect(wrapper.state('data').getRecords()[1].toJS().active).to.equal(false);
    });
  });

  describe('obsGroup', () => {
    const obsGroupMetaData = {
      id: 1,
      uuid: 'formUuid',
      name: 'Vitals',
      version: '1',
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

    it('should also generate nextFormFieldPath for obsControl ' +
      'when click obsGroup\'s add more button', () => {
      const newObsGroupMetaData = {
        controls: [
          {
            concept: {
              datatype: 'N/A',
              name: 'Bacteriology Additional Attributes',
              uuid: '695e99d6-12b2-11e6-8c00-080027d2adbd',
            },
            controls: [
              {
                concept: {
                  datatype: 'Text',
                  name: 'Consultation Note',
                  uuid: '81d6e852-3f10-11e4-adec-0800271c1b75',
                },
                id: '2',
                label: {
                  type: 'label',
                  value: 'Consultation Note',
                },
                properties: {
                  addMore: false,
                  hideLabel: false,
                  location: {
                    column: 0,
                    row: 0,
                  },
                  mandatory: false,
                  notes: false,
                },
                type: 'obsControl',
              },
            ],
            id: '1',
            label: {
              type: 'label',
              value: 'Bacteriology Additional Attributes',
            },
            properties: {
              abnormal: false,
              addMore: true,
              location: {
                column: 0,
                row: 0,
              },
            },
            type: 'obsGroupControl',
          },
        ],
        id: 185,
        name: 'Test1',
        uuid: '63d4fd28-38e6-4638-bab0-c052fa824352',
        version: '1',
      };
      const nextFormFieldPath = 'Test1.1/2-1';
      const wrapper = mount(
        <Container
          collapse
          metadata={newObsGroupMetaData}
          observations={[]}
          validate={false}
        />);

      wrapper.find('.form-builder-add-more').simulate('click');

      const obsGroupMembers = wrapper.state().data.getRecords()[1].obs.getGroupMembers();
      expect(obsGroupMembers &&
        obsGroupMembers.getIn([0, 'formFieldPath'])).to.equal(nextFormFieldPath);
    });

    it('should filter child obs which are not having value from obs group', () => {
      const wrapper = mount(
        <Container
          collapse
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
          formFieldPath: 'Vitals.1/2-0',
          groupMembers: [
            {
              concept: {
                name: 'Pulse',
                uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
                datatype: 'Numeric',
              },
              value: '99',
              formFieldPath: 'Vitals.1/201-0',
            },
            {
              concept: {
                name: 'History Notes',
                uuid: 'c2a43174-c9db-4e54-8516-17372c83537f',
                datatype: 'text',
              },
              value: 'notes',
              formFieldPath: 'Vitals.1/202-0',
            },
          ],
        },
      ];
      const wrapper = mount(
        <Container
          collapse
          metadata={obsGroupMetaData}
          observations={obs}
          validate={false}
        />);

      expect(wrapper.find('input')).to.have.value('99');
      expect(wrapper.find('textarea').props().defaultValue).to.be.eql('notes');
    });
  });

  describe('AddMore', () => {
    let metadata2;
    let obs1;
    let obs2;
    beforeEach(() => {
      metadata2 = {
        id: 100,
        uuid: 'fm1',
        name: 'Vitals',
        version: '1',
        controls: [
          {
            id: '101',
            type: 'obsControl',
            concept: textBoxConcept,
            label,
            properties: {
              ...getLocationProperties(1, 0),
              addMore: true,
            },
          },
        ],
      };

      obs1 = {
        concept: textBoxConcept,
        formNamespace: 'Bahmni',
        formFieldPath: 'Vitals.1/101-0',
        observationDateTime: '2016-09-08T10:10:38.000+0530',
        uuid: undefined,
        value: '72',
        voided: false,
        comment: undefined,
        groupMembers: undefined,
      };

      obs2 = {
        concept: textBoxConcept,
        formNamespace: 'Bahmni',
        formFieldPath: 'Vitals.1/101-1',
        observationDateTime: '2016-09-08T10:10:38.000+0530',
        uuid: undefined,
        value: '73',
        voided: false,
        comment: undefined,
        groupMembers: undefined,
      };
    });

    it('should render multiple observations filled using AddMore', () => {
      const wrapper = mount(<Container
        collapse
        metadata={metadata2}
        observations={[obs1, obs2]}
        validate={false}
      />);

      expect(wrapper).to.have.exactly(2).descendants('ObsControl');
      expect(wrapper).to.have.exactly(2).descendants('TextBox');
      expect(wrapper).to.have.exactly(2).descendants('AddMore');

      expect(wrapper.find('ObsControl').at(0).props().validate).to.eql(false);
      expect(wrapper.find('TextBox').at(0).props().value).to.eql('72');
      expect(wrapper.find('TextBox').at(1).props().value).to.eql('73');
      expect(wrapper.find('AddMore').at(0).props().canAdd).to.eql(false);
      expect(wrapper.find('AddMore').at(0).props().canRemove).to.eql(false);
      expect(wrapper.find('AddMore').at(1).props().canAdd).to.eql(true);
      expect(wrapper.find('AddMore').at(1).props().canRemove).to.eql(true);
    });

    it('should render empty control if Add button is clicked', () => {
      const wrapper = mount(<Container
        collapse
        metadata={metadata2}
        observations={[]}
        validate={false}
      />);

      expect(wrapper).to.have.exactly(1).descendants('ObsControl');
      expect(wrapper).to.have.exactly(1).descendants('TextBox');
      expect(wrapper).to.have.exactly(1).descendants('AddMore');
      expect(wrapper).to.have.exactly(1).descendants('button');

      wrapper.find('button').at(0).simulate('click');

      expect(wrapper).to.have.exactly(2).descendants('ObsControl');
      expect(wrapper).to.have.exactly(2).descendants('TextBox');
      expect(wrapper).to.have.exactly(2).descendants('AddMore');
      expect(wrapper).to.have.exactly(2).descendants('button');
    });

    it('should remove control if Remove button is clicked', () => {
      const wrapper = mount(<Container
        collapse
        metadata={metadata2}
        observations={[obs1, obs2]}
        validate={false}
      />);

      expect(wrapper).to.have.exactly(2).descendants('ObsControl');
      expect(wrapper).to.have.exactly(2).descendants('TextBox');
      expect(wrapper).to.have.exactly(2).descendants('AddMore');
      expect(wrapper).to.have.exactly(2).descendants('button');

      wrapper.find('button').at(1).simulate('click');

      expect(wrapper).to.have.exactly(1).descendants('ObsControl');
      expect(wrapper).to.have.exactly(1).descendants('TextBox');
      expect(wrapper).to.have.exactly(1).descendants('AddMore');
      expect(wrapper).to.have.exactly(1).descendants('button');
    });

    it('should remove control having saved obs if Remove button is clicked', () => {
      obs1.uuid = 'uuid1';
      obs2.uuid = 'uuid2';
      const wrapper = mount(<Container
        collapse
        metadata={metadata2}
        observations={[obs1, obs2]}
        validate={false}
      />);

      expect(wrapper).to.have.exactly(2).descendants('ObsControl');
      expect(wrapper).to.have.exactly(2).descendants('TextBox');
      expect(wrapper).to.have.exactly(2).descendants('AddMore');
      expect(wrapper).to.have.exactly(2).descendants('button');

      wrapper.find('button').at(1).simulate('click');

      expect(wrapper).to.have.exactly(1).descendants('ObsControl');
      expect(wrapper).to.have.exactly(1).descendants('TextBox');
      expect(wrapper).to.have.exactly(1).descendants('AddMore');
      expect(wrapper).to.have.exactly(1).descendants('button');
    });
  });

  describe('AddMore For MultiSelect', () => {
    let codedConcept;
    let obsList1;
    let obsList2;
    let metadata3;

    beforeEach(() => {
      codedConcept = {
        uuid: '70645842-be6a-4974-8d5f-45b52990e132',
        name: 'Disease',
        datatype: 'Coded',
        answers: [
          {
            uuid: '1e3f1870-b252-4808-8edb-f86fad050ebd',
            name: {
              display: 'Diabetes',
              uuid: 'fdabcf86-7ac9-4122-96f7-9f84858228fd',
              name: 'Diabetes',
              locale: 'en',
              localePreferred: true,
              conceptNameType: 'FULLY_SPECIFIED',
              resourceVersion: '1.9',
            },
            names: [
              {
                display: 'Diabetes',
                uuid: 'fdabcf86-7ac9-4122-96f7-9f84858228fd',
                name: 'Diabetes',
                locale: 'en',
                localePreferred: true,
                conceptNameType: 'FULLY_SPECIFIED',
                resourceVersion: '1.9',
              },
            ],
            displayString: 'Diabetes',
            resourceVersion: '1.9',
          },
          {
            uuid: 'f48a534d-b1dd-4d37-8794-065243c546a4',
            name: {
              display: 'Liver Disease',
              uuid: '47937ec0-b7a2-405b-8a2a-a137738bda9b',
              name: 'Liver Disease',
              locale: 'en',
              localePreferred: true,
              conceptNameType: 'FULLY_SPECIFIED',
              resourceVersion: '1.9',
            },
            names: [
              {
                display: 'Liver Disease',
                uuid: '47937ec0-b7a2-405b-8a2a-a137738bda9b',
                name: 'Liver Disease',
                locale: 'en',
                localePreferred: true,
                conceptNameType: 'FULLY_SPECIFIED',
                resourceVersion: '1.9',
              },
            ],
            displayString: 'Liver Disease',
            resourceVersion: '1.9',
          }],
      };

      obsList1 = [
        {
          observationDateTime: '2016-09-08T10:10:38.000+0530',
          uuid: 'systolicUuid',
          value: {
            uuid: '1e3f1870-b252-4808-8edb-f86fad050ebd',
            name: {
              display: 'Diabetes',
              uuid: 'fdabcf86-7ac9-4122-96f7-9f84858228fd',
              name: 'Diabetes',
              locale: 'en',
              localePreferred: true,
              conceptNameType: 'FULLY_SPECIFIED',
              resourceVersion: '1.9',
            },
            names: [
              {
                display: 'Diabetes',
                uuid: 'fdabcf86-7ac9-4122-96f7-9f84858228fd',
                name: 'Diabetes',
                locale: 'en',
                localePreferred: true,
                conceptNameType: 'FULLY_SPECIFIED',
                resourceVersion: '1.9',
              },
            ],
            displayString: 'Diabetes',
            resourceVersion: '1.9',
          },
          formNamespace: 'Bahmni',
          formFieldPath: 'MultiSelect.1/1-0',
        },
        {
          observationDateTime: '2016-09-08T10:10:38.000+0530',
          uuid: 'diastolicUuid',
          value: {
            uuid: 'f48a534d-b1dd-4d37-8794-065243c546a4',
            name: {
              display: 'Liver Disease',
              uuid: '47937ec0-b7a2-405b-8a2a-a137738bda9b',
              name: 'Liver Disease',
              locale: 'en',
              localePreferred: true,
              conceptNameType: 'FULLY_SPECIFIED',
              resourceVersion: '1.9',
            },
            names: [
              {
                display: 'Liver Disease',
                uuid: '47937ec0-b7a2-405b-8a2a-a137738bda9b',
                name: 'Liver Disease',
                locale: 'en',
                localePreferred: true,
                conceptNameType: 'FULLY_SPECIFIED',
                resourceVersion: '1.9',
              },
            ],
            displayString: 'Liver Disease',
            resourceVersion: '1.9',
          },
          formNamespace: 'Bahmni',
          formFieldPath: 'MultiSelect.1/1-0',
        },
      ];

      obsList2 = [
        {
          observationDateTime: '2016-09-08T10:10:38.000+0530',
          uuid: 'systolicUuid',
          value: {
            uuid: '1e3f1870-b252-4808-8edb-f86fad050ebd',
            name: {
              display: 'Diabetes',
              uuid: 'fdabcf86-7ac9-4122-96f7-9f84858228fd',
              name: 'Diabetes',
              locale: 'en',
              localePreferred: true,
              conceptNameType: 'FULLY_SPECIFIED',
              resourceVersion: '1.9',
            },
            names: [
              {
                display: 'Diabetes',
                uuid: 'fdabcf86-7ac9-4122-96f7-9f84858228fd',
                name: 'Diabetes',
                locale: 'en',
                localePreferred: true,
                conceptNameType: 'FULLY_SPECIFIED',
                resourceVersion: '1.9',
              },
            ],
            displayString: 'Diabetes',
            resourceVersion: '1.9',
          },
          formNamespace: 'Bahmni',
          formFieldPath: 'MultiSelect.1/1-1',
        },
      ];

      metadata3 = {
        id: 101,
        uuid: 'fm1',
        name: 'MultiSelect',
        version: '1',
        controls: [
          {
            id: '1',
            type: 'obsControl',
            concept: codedConcept,
            label,
            properties: {
              ...getLocationProperties(1, 0),
              addMore: true,
              multiSelect: true,
            },
          },
        ],
      };
    });

    it('should render control with multiple observations', () => {
      const wrapper = mount(<Container
        collapse
        metadata={metadata3}
        observations={obsList1}
        validate={false}
      />);

      expect(wrapper).to.have.exactly(1).descendants('ObsControl');
      expect(wrapper.find('ObsControl')).to.have.exactly(1).descendants('Button');
      expect(wrapper).to.have.exactly(1).descendants('AddMore');
      expect(wrapper.find('ObsControl').at(0).props().validate).to.eql(false);
      expect(wrapper.find('Button').props().options.length).to.eql(2);
      expect(wrapper.find('button').at(0).hasClass('active'));
      expect(wrapper.find('button').at(1).hasClass('active'));
      expect(wrapper.find('AddMore').at(0).props().canAdd).to.eql(true);
      expect(wrapper.find('AddMore').at(0).props().canRemove).to.eql(false);
    });


    it('should render two controls', () => {
      const wrapper = mount(<Container
        collapse
        metadata={metadata3}
        observations={[...obsList1, ...obsList2]}
        validate={false}
      />);

      expect(wrapper).to.have.exactly(2).descendants('ObsControl');
      expect(wrapper.find('ObsControl').at(0)).to.have.exactly(1).descendants('Button');
      expect(wrapper.find('ObsControl').at(1)).to.have.exactly(1).descendants('Button');
      expect(wrapper).to.have.exactly(2).descendants('AddMore');
      expect(wrapper.find('ObsControl').at(0).props().validate).to.eql(false);
      expect(wrapper.find('ObsControl').at(1).props().validate).to.eql(false);
      expect(wrapper.find('Button').at(0).props().options.length).to.eql(2);
      expect(wrapper.find('Button').at(1).props().options.length).to.eql(2);
      expect(wrapper.find('button').at(0).hasClass('active')).to.eql(true);
      expect(wrapper.find('button').at(1).hasClass('active')).to.eql(true);
      expect(wrapper.find('button').at(2).hasClass('active')).to.eql(true);
      expect(wrapper.find('button').at(3).hasClass('active')).to.eql(false);
      expect(wrapper.find('AddMore').at(0).props().canAdd).to.eql(false);
      expect(wrapper.find('AddMore').at(0).props().canRemove).to.eql(false);
      expect(wrapper.find('AddMore').at(1).props().canAdd).to.eql(true);
      expect(wrapper.find('AddMore').at(1).props().canRemove).to.eql(true);
    });

    it('should add a control on clicking AddMore', () => {
      const wrapper = mount(<Container
        collapse
        metadata={metadata3}
        observations={obsList1}
        validate={false}
      />);
      wrapper.find('button').at(2).simulate('click');

      expect(wrapper).to.have.exactly(2).descendants('ObsControl');
      expect(wrapper.find('ObsControl').at(0)).to.have.exactly(1).descendants('Button');
      expect(wrapper.find('ObsControl').at(1)).to.have.exactly(1).descendants('Button');
      expect(wrapper).to.have.exactly(2).descendants('AddMore');
      expect(wrapper.find('ObsControl').at(0).props().validate).to.eql(false);
      expect(wrapper.find('ObsControl').at(1).props().validate).to.eql(false);
      expect(wrapper.find('Button').at(0).props().options.length).to.eql(2);
      expect(wrapper.find('Button').at(1).props().options.length).to.eql(2);
      expect(wrapper.find('button').at(0).hasClass('active')).to.eql(true);
      expect(wrapper.find('button').at(1).hasClass('active')).to.eql(true);
      expect(wrapper.find('button').at(2).hasClass('active')).to.eql(false);
      expect(wrapper.find('button').at(3).hasClass('active')).to.eql(false);
      expect(wrapper.find('AddMore').at(0).props().canAdd).to.eql(false);
      expect(wrapper.find('AddMore').at(0).props().canRemove).to.eql(false);
      expect(wrapper.find('AddMore').at(1).props().canAdd).to.eql(true);
      expect(wrapper.find('AddMore').at(1).props().canRemove).to.eql(true);
    });

    it('should add a control on clicking AddMore', () => {
      const wrapper = mount(<Container
        collapse
        metadata={metadata3}
        observations={[...obsList1, ...obsList2]}
        validate={false}
      />);
      wrapper.find('button').at(5).simulate('click');

      expect(wrapper).to.have.exactly(1).descendants('ObsControl');
      expect(wrapper.find('ObsControl').at(0)).to.have.exactly(1).descendants('Button');
      expect(wrapper).to.have.exactly(1).descendants('AddMore');
      expect(wrapper.find('ObsControl').at(0).props().validate).to.eql(false);
      expect(wrapper.find('Button').at(0).props().options.length).to.eql(2);
      expect(wrapper.find('button').at(0).hasClass('active')).to.eql(true);
      expect(wrapper.find('button').at(1).hasClass('active')).to.eql(true);
      expect(wrapper.find('button').at(2).hasClass('active')).to.eql(false);
      expect(wrapper.find('AddMore').at(0).props().canAdd).to.eql(true);
      expect(wrapper.find('AddMore').at(0).props().canRemove).to.eql(false);
    });
  });
});
/* eslint-enable no-undef */
