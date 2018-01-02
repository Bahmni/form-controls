import React from 'react';
import { Record, List } from 'immutable';
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
import { ControlRecord } from '../../src/helpers/ControlRecordTreeBuilder';
import ComponentStore from 'src/helpers/componentStore';
import Constants from 'src/constants';
import sinon from 'sinon';


chai.use(chaiEnzyme());

describe('Container', () => {
  before(() => {
    ComponentStore.registerComponent('label', Label);
    ComponentStore.registerComponent('text', TextBox);
    ComponentStore.registerComponent('numeric', NumericBox);
    ComponentStore.registerComponent('button', Button);
    ComponentStore.registerComponent('Coded', CodedControl);
    ComponentStore.registerComponent('obsControl', ObsControl);
    ComponentStore.registerComponent('obsGroupControl', ObsGroupControl);
  });

  after(() => {
    ComponentStore.deRegisterComponent('label');
    ComponentStore.deRegisterComponent('text');
    ComponentStore.deRegisterComponent('numeric');
    ComponentStore.deRegisterComponent('button');
    ComponentStore.deRegisterComponent('Coded');
    ComponentStore.deRegisterComponent('obsControl');
    ComponentStore.deRegisterComponent('obsGroupControl');
  });
  const patient = { age: 10, gender: 'M' };

  describe('Single layer', () => {
    const metadata = {
      controls: [
        {
          concept: {
            answers: [],
            datatype: 'Numeric',
            description: [],
            name: 'Pulse',
            properties: {
              allowDecimal: true,
            },
            uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
          },
          hiAbsolute: null,
          hiNormal: 72,
          id: '1',
          label: {
            type: 'label',
            value: 'Pulse(/min)',
          },
          lowAbsolute: null,
          lowNormal: 72,
          properties: {
            addMore: true,
            hideLabel: false,
            location: {
              column: 0,
              row: 0,
            },
            mandatory: true,
            notes: false,
          },
          type: 'obsControl',
          units: '/min',
        },
      ],
      id: 209,
      name: 'SingleObs',
      uuid: '245940b7-3d6b-4a8b-806b-3f56444129ae',
      version: '1',
      defaultLocale: 'en',
    };

    const formFieldPath = 'SingleObs.1/1-0';
    const childRecord = new ControlRecord({
      control: {
        concept: {
          answers: [],
          datatype: 'Numeric',
          description: [],
          name: 'Pulse',
          properties: {
            allowDecimal: true,
          },
          uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
        },
        hiAbsolute: null,
        hiNormal: 72,
        id: '1',
        label: {
          type: 'label',
          value: 'Pulse(/min)',
        },
        lowAbsolute: null,
        lowNormal: 72,
        properties: {
          addMore: true,
          hideLabel: false,
          location: {
            column: 0,
            row: 0,
          },
          mandatory: true,
          notes: false,
        },
        type: 'obsControl',
        units: '/min',
      },
      formFieldPath,
      value: { value: '1', comment: undefined },
      dataSource: {
        abnormal: null,
        comment: null,
        concept: {
          conceptClass: 'Misc',
          dataType: 'Numeric',
          hiNormal: 72,
          lowNormal: 72,
          mappings: [],
          name: 'Pulse',
          set: false,
          shortName: 'Pulse',
          units: '/min',
          uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
        },
        conceptNameToDisplay: 'Pulse',
        conceptSortWeight: 1,
        conceptUuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
        creatorName: 'Super Man',
        duration: null,
        encounterDateTime: 1488523999000,
        encounterUuid: '8b5f9862-ce75-4d31-bf41-1c47d58c7444',
        formFieldPath: 'SingleObs.1/1-0',
        formNamespace: 'Bahmni',
        groupMembers: [],
        hiNormal: 72,
        isAbnormal: null,
        lowNormal: 72,
        obsGroupUuid: null,
        observationDateTime: '2017-03-03T06:53:19.000+0000',
        orderUuid: null,
        parentConceptUuid: null,
        providers: [
          {
            encounterRoleUuid: 'a0b03050-c99b-11e0-9572-0800200c9a66',
            name: 'Super Man',
            uuid: 'c1c26908-3f10-11e4-adec-0800271c1b75',
          },
        ],
        targetObsRelation: null,
        type: 'Numeric',
        unknown: false,
        uuid: '1c2b18ec-ad88-44e5-ae34-3b0e88240a93',
        value: undefined,
        valueAsString: '1.0',
        visitStartDateTime: null,
        voidReason: null,
        voided: false,
      },
    });

    const translations = {
      labels: {
        LABEL_1: 'some Label',
      },
    };
    const recordTree = new ControlRecord({ children: List.of(childRecord) });

    it('should render a control when given single layer tree data', () => {
      const wrapper = mount(
            <Container
              collapse
              locale="en"
              metadata={metadata}
              observations={[]}
              patient={patient}
              translations={translations}
              validate={false}
              validateForm={false}
            />
        );

      wrapper.setState({ data: recordTree });

      expect(wrapper).to.have.exactly(1).descendants('ObsControl');
    });

    it('should initialize the states of controls before mount', () => {
      const metadata1 = {
        controls: [
          {
            concept: {
              answers: [],
              datatype: 'Numeric',
              description: [],
              name: 'Pulse',
              properties: {
                allowDecimal: true,
              },
              uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
            },
            hiAbsolute: null,
            hiNormal: 72,
            id: '1',
            label: {
              type: 'label',
              value: 'Pulse(/min)',
            },
            lowAbsolute: null,
            lowNormal: 72,
            properties: {
              addMore: true,
              hideLabel: false,
              location: {
                column: 0,
                row: 0,
              },
              mandatory: true,
              notes: false,
            },
            type: 'obsControl',
            units: '/min',
          },
        ],
        id: 209,
        name: 'SingleObs',
        uuid: '245940b7-3d6b-4a8b-806b-3f56444129ae',
        version: '1',
        events: {
          onFormInit: "function(form){form.get('Pulse').setEnabled(false);}",
        },
        defaultLocale: 'en',
      };

      const wrapper = mount(
        <Container
          collapse
          locale="en"
          metadata={metadata1}
          observations={[]}
          patient={patient}
          translations={translations}
          validate={false}
          validateForm={false}
        />
      );

      expect(wrapper.find('ObsControl')).to.have.prop('enabled').to.deep.eql(false);
    });

    it('should change state when onValueChanged is triggered', () => {
      const wrapper = shallow(
                <Container
                  collapse
                  locale="en"
                  metadata={metadata}
                  observations={[]}
                  patient={patient}
                  translations={translations}
                  validate={false}
                  validateForm={false}
                />
            );
      const changedValue = { value: '1', comment: undefined };

            // const update = sinon.stub(wrapper.state().data, 'update').returns(recordTree);

      wrapper.instance().onValueChanged(formFieldPath, changedValue);

            // update.restore();

      const obsControlRecord = wrapper.state().data.children.get(0);
      expect(obsControlRecord.value).to.equal(changedValue);
    });

    it('should update dataSource value when getValue is triggered', () => {
      const wrapper = mount(
                <Container
                  collapse
                  locale="en"
                  metadata={metadata}
                  observations={[]}
                  patient={patient}
                  translations={translations}
                  validate={false}
                  validateForm={false}
                />
            );
      wrapper.setState({ data: recordTree });

      const previousValue = wrapper.state().data.children.get(0).get('dataSource').value;
      expect(previousValue).to.equal(undefined);

      const result = wrapper.instance().getValue();

      const updatedValue = result.observations[0].value;
      expect(updatedValue).to.equal('1');
    });

    describe('onControllAdd', () => {
      const concept = {
        answers: [],
        datatype: 'Numeric',
        description: [],
        name: 'HEIGHT',
        properties: {
          allowDecimal: false,
        },
        uuid: '5090AAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      };
      const addedFormFieldPath = 'singleObs.1/1-0';
      const childRecordTree = new ControlRecord({
        control: {
          concept,
          hiAbsolute: null,
          hiNormal: null,
          id: '1',
          label: {
            type: 'label',
            value: 'HEIGHT',
          },
          lowAbsolute: null,
          lowNormal: null,
          properties: {
            addMore: true,
            hideLabel: false,
            location: {
              column: 0,
              row: 0,
            },
            mandatory: false,
            notes: false,
          },
          type: 'obsControl',
          units: null,
        },
        formFieldPath: addedFormFieldPath,
        value: {},
        dataSource: {
          concept,
          formFieldPath: addedFormFieldPath,
          formNamespace: 'Bahmni',
          voided: true,
        },
      });
      const obsTree = new ControlRecord({ children: List.of(childRecordTree) });

      it('should add one obs when onControlAdd is triggered with obs in container', () => {
        const wrapper = mount(
          <Container
            collapse
            locale="en"
            metadata={metadata}
            observations={[]}
            patient={patient}
            translations={translations}
            validate={false}
            validateForm={false}
          />
        );
        wrapper.setState({ data: obsTree });
        wrapper.instance().onControlAdd(addedFormFieldPath);

        const expectedFormFieldPath = 'singleObs.1/1-1';
        const updatedRootTree = wrapper.state().data;
        expect(updatedRootTree.children.size).to.equal(2);
        expect(updatedRootTree.children.get(0).formFieldPath).to.equal(addedFormFieldPath);
        expect(updatedRootTree.children.get(1).formFieldPath).to.equal(expectedFormFieldPath);
      });

      it('should not render notification when add more with notification shown false', () => {
        const wrapper = mount(
          <Container
            collapse
            locale="en"
            metadata={metadata}
            observations={[]}
            patient={patient}
            translations={translations}
            validate={false}
            validateForm={false}
          />
        );
        wrapper.setState({ data: obsTree });
        wrapper.instance().onControlAdd(addedFormFieldPath, false);

        expect(wrapper.find('NotificationContainer').props().notification).to.eql({});
      });
    });

    it('should remove one obs when onControlRemove is triggered with obs in container', () => {
      const concept = {
        answers: [],
        datatype: 'Numeric',
        description: [],
        name: 'Pulse',
        properties: {
          allowDecimal: true,
        },
        uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
      };
      const obsRecord = new ControlRecord({
        control: {
          concept,
          hiAbsolute: null,
          hiNormal: 72,
          id: '1',
          label: {
            type: 'label',
            value: 'Pulse(/min)',
          },
          lowAbsolute: null,
          lowNormal: 72,
          properties: {
            addMore: true,
            hideLabel: false,
            location: {
              column: 0,
              row: 0,
            },
            mandatory: true,
            notes: false,
          },
          type: 'obsControl',
          units: '/min',
        },
        value: {},
        dataSource: {
          concept,
          formFieldPath: 'SingleObs.1/1-0',
          formNamespace: 'Bahmni',
          voided: true,
        },
        formFieldPath: 'SingleObs.1/1-0',
      });
      const removableFormFieldPath = 'SingleObs.1/1-1';
      const removableChildRecord = new ControlRecord({
        control: {
          concept,
          hiAbsolute: null,
          hiNormal: 72,
          id: '1',
          label: {
            type: 'label',
            value: 'Pulse(/min)',
          },
          lowAbsolute: null,
          lowNormal: 72,
          properties: {
            addMore: true,
            hideLabel: false,
            location: {
              column: 0,
              row: 0,
            },
            mandatory: true,
            notes: false,
          },
          type: 'obsControl',
          units: '/min',
        },
        value: {},
        dataSource: {
          concept,
          formFieldPath: 'SingleObs.1/1-0',
          formNamespace: 'Bahmni',
          voided: true,
        },
        formFieldPath: removableFormFieldPath,
      });
      const obsTree = new ControlRecord({ children: List.of(obsRecord, removableChildRecord) });
      const wrapper = mount(
                <Container
                  collapse
                  locale="en"
                  metadata={metadata}
                  observations={[]}
                  patient={patient}
                  translations={translations}
                  validate={false}
                  validateForm={false}
                />
            );
      wrapper.setState({ data: obsTree });

      wrapper.instance().onControlRemove(removableFormFieldPath);

      expect(wrapper.state().data.children.get(0).active).to.equal(true);
      expect(wrapper.state().data.children.get(1).active).to.equal(false);
    });

    it('should return observation even when given records with errors', () => {
      const concept = {
        answers: [],
        datatype: 'Numeric',
        description: [],
        name: 'HEIGHT',
        properties: {
          allowDecimal: false,
        },
        uuid: '5090AAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      };
      const heightMetadata = {
        controls: [
          {
            concept,
            hiAbsolute: null,
            hiNormal: null,
            id: '1',
            label: {
              type: 'label',
              value: 'HEIGHT',
            },
            lowAbsolute: null,
            lowNormal: null,
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
            units: null,
          },
        ],
        id: 284,
        name: '3383',
        uuid: 'c60ea8ad-17ef-4968-9733-82b846513d78',
        version: '3',
      };
      const obsFormFieldPath = '3383.3/1-0';
      const Errors = new Record({
        type: 'error',
        message: 'allowDecimal',
      });
      const obsRecord = new ControlRecord({
        control: concept,
        formFieldPath: obsFormFieldPath,
        value: { value: '11.1' },
        errors: [new Errors()],
        dataSource: {
          concept,
          formFieldPath: obsFormFieldPath,
          formNamespace: 'Bahmni',
          voided: true,
        },
      });
      const rootRecord = new ControlRecord({ children: List.of(obsRecord) });
      const wrapper = mount(
        <Container
          collapse
          locale="en"
          metadata={heightMetadata}
          observations={[]}
          patient={patient}
          translations={translations}
          validate={false}
          validateForm={false}
        />
      );
      wrapper.setState({ data: rootRecord });

      const result = wrapper.instance().getValue();

      expect(result.errors).is.not.equal(undefined);
      expect(result.observations).is.not.equal(undefined);
    });

    it('should add one obsGroup when onControlAdd is triggered with obsGroup in container', () => {
      const concept = {
        datatype: 'N/A',
        name: 'Pulse Data',
        set: true,
        setMembers: [
          {
            answers: [],
            datatype: 'Numeric',
            description: [],
            hiAbsolute: null,
            hiNormal: 72,
            lowAbsolute: null,
            lowNormal: 72,
            name: 'Pulse(/min)',
            properties: {
              allowDecimal: true,
            },
            units: '/min',
            uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
          },
          {
            answers: [],
            datatype: 'Boolean',
            description: [],
            hiAbsolute: null,
            hiNormal: null,
            lowAbsolute: null,
            lowNormal: null,
            name: 'Pulse Abnormal',
            properties: {
              allowDecimal: null,
            },
            units: null,
            uuid: 'c36c7c98-3f10-11e4-adec-0800271c1b75',
          },
        ],
        uuid: 'c36af094-3f10-11e4-adec-0800271c1b75',
      };
      const addFormFieldPath = 'obsGroup.1/2-0';
      const childRecordTree = new ControlRecord({
        control: {
          concept,
          controls: [
            {
              concept: {
                answers: [],
                datatype: 'Numeric',
                description: [],
                hiAbsolute: null,
                hiNormal: 72,
                lowAbsolute: null,
                lowNormal: 72,
                name: 'Pulse(/min)',
                properties: {
                  allowDecimal: true,
                },
                units: '/min',
                uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
              },
              hiAbsolute: null,
              hiNormal: 72,
              id: '3',
              label: {
                type: 'label',
                value: 'Pulse(/min)',
              },
              lowAbsolute: null,
              lowNormal: 72,
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
              units: '/min',
            },
            {
              concept: {
                answers: [],
                datatype: 'Boolean',
                description: [],
                hiAbsolute: null,
                hiNormal: null,
                lowAbsolute: null,
                lowNormal: null,
                name: 'Pulse Abnormal',
                properties: {
                  allowDecimal: null,
                },
                units: null,
                uuid: 'c36c7c98-3f10-11e4-adec-0800271c1b75',
              },
              hiAbsolute: null,
              hiNormal: null,
              id: '4',
              label: {
                type: 'label',
                value: 'Pulse Abnormal',
              },
              lowAbsolute: null,
              lowNormal: null,
              options: [
                {
                  name: 'Yes',
                  value: true,
                },
                {
                  name: 'No',
                  value: false,
                },
              ],
              properties: {
                addMore: false,
                hideLabel: false,
                location: {
                  column: 0,
                  row: 1,
                },
                mandatory: false,
                notes: false,
              },
              type: 'obsControl',
              units: null,
            },
          ],
          id: '2',
          label: {
            type: 'label',
            value: 'Pulse Data',
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
        formFieldPath: addFormFieldPath,
        value: {},
        dataSource: {
          concept,
          formFieldPath: addFormFieldPath,
          formNamespace: 'Bahmni',
          voided: true,
        },
      });
      const obsGroupTree = new ControlRecord({ children: List.of(childRecordTree) });
      const wrapper = mount(
                <Container
                  collapse
                  locale="en"
                  metadata={metadata}
                  observations={[]}
                  patient={patient}
                  translations={translations}
                  validate={false}
                  validateForm={false}
                />
            );
      wrapper.setState({ data: obsGroupTree });

      wrapper.instance().onControlAdd(addFormFieldPath);

      const expectedFormFieldPath = 'obsGroup.1/2-1';
      const updatedRootTree = wrapper.state().data;
      expect(updatedRootTree.children.size).to.equal(2);
      expect(updatedRootTree.children.get(0).formFieldPath).to.equal(addFormFieldPath);
      expect(updatedRootTree.children.get(1).formFieldPath).to.equal(expectedFormFieldPath);
    });

    it('should remove one obsGroup when onControlRemove ' +
        'is triggered with obsGroup in container', () => {
      const obsGroupConcept = {
        datatype: 'N/A',
        name: 'Pulse Data',
        set: true,
        setMembers: [
          {
            answers: [],
            datatype: 'Numeric',
            description: [],
            hiAbsolute: null,
            hiNormal: 72,
            lowAbsolute: null,
            lowNormal: 72,
            name: 'Pulse(/min)',
            properties: {
              allowDecimal: true,
            },
            units: '/min',
            uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
          },
          {
            answers: [],
            datatype: 'Boolean',
            description: [],
            hiAbsolute: null,
            hiNormal: null,
            lowAbsolute: null,
            lowNormal: null,
            name: 'Pulse Abnormal',
            properties: {
              allowDecimal: null,
            },
            units: null,
            uuid: 'c36c7c98-3f10-11e4-adec-0800271c1b75',
          },
        ],
        uuid: 'c36af094-3f10-11e4-adec-0800271c1b75',
      };
      const obsConcept = {
        conceptClass: 'Concept Details',
        dataType: 'N/A',
        hiNormal: null,
        lowNormal: null,
        mappings: [],
        name: 'Pulse Data',
        set: true,
        shortName: 'Pulse',
        uuid: 'c36af094-3f10-11e4-adec-0800271c1b75',
      };
      const obsGroupRecord = new ControlRecord({
        control: {
          concept: obsGroupConcept,
          controls: [
            {
              concept: {
                answers: [],
                datatype: 'Numeric',
                description: [],
                hiAbsolute: null,
                hiNormal: 72,
                lowAbsolute: null,
                lowNormal: 72,
                name: 'Pulse(/min)',
                properties: {
                  allowDecimal: true,
                },
                units: '/min',
                uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
              },
              hiAbsolute: null,
              hiNormal: 72,
              id: '2',
              label: {
                type: 'label',
                value: 'Pulse(/min)',
              },
              lowAbsolute: null,
              lowNormal: 72,
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
              units: '/min',
            },
            {
              concept: {
                answers: [],
                datatype: 'Boolean',
                description: [],
                hiAbsolute: null,
                hiNormal: null,
                lowAbsolute: null,
                lowNormal: null,
                name: 'Pulse Abnormal',
                properties: {
                  allowDecimal: null,
                },
                units: null,
                uuid: 'c36c7c98-3f10-11e4-adec-0800271c1b75',
              },
              hiAbsolute: null,
              hiNormal: null,
              id: '3',
              label: {
                type: 'label',
                value: 'Pulse Abnormal',
              },
              lowAbsolute: null,
              lowNormal: null,
              options: [
                {
                  name: 'Yes',
                  value: true,
                },
                {
                  name: 'No',
                  value: false,
                },
              ],
              properties: {
                addMore: false,
                hideLabel: false,
                location: {
                  column: 0,
                  row: 1,
                },
                mandatory: false,
                notes: false,
              },
              type: 'obsControl',
              units: null,
            },
          ],
          id: '1',
          label: {
            type: 'label',
            value: 'Pulse Data',
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
        formFieldPath: 'obsgroup1.1/1-1',
        value: {},
        dataSource: {
          abnormal: null,
          comment: null,
          concept: obsConcept,
          conceptNameToDisplay: 'Pulse',
          conceptSortWeight: 1,
          conceptUuid: 'c36af094-3f10-11e4-adec-0800271c1b75',
          creatorName: 'Super Man',
          duration: null,
          encounterDateTime: 1489643974000,
          encounterUuid: '69722943-a46f-4886-9fa1-8f089e0c1bd3',
          formFieldPath: 'obsgroup1.1/1-1',
          formNamespace: 'Bahmni',
          groupMembers: [
            {
              abnormal: null,
              comment: null,
              concept: {
                conceptClass: 'Misc',
                dataType: 'Numeric',
                hiNormal: 72,
                lowNormal: 72,
                mappings: [],
                name: 'Pulse',
                set: false,
                shortName: 'Pulse',
                units: '/min',
                uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
              },
              conceptNameToDisplay: 'Pulse',
              conceptSortWeight: 2,
              conceptUuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
              creatorName: 'Super Man',
              duration: null,
              encounterDateTime: 1489643974000,
              encounterUuid: '69722943-a46f-4886-9fa1-8f089e0c1bd3',
              formFieldPath: 'obsgroup1.1/2-1',
              formNamespace: 'Bahmni',
              groupMembers: [],
              hiNormal: 72,
              isAbnormal: null,
              lowNormal: 72,
              obsGroupUuid: '05c44520-6f6e-4ce4-b1c9-f3477f06a44f',
              observationDateTime: '2017-03-16T11:29:34.000+0530',
              orderUuid: null,
              parentConceptUuid: null,
              providers: [
                {
                  encounterRoleUuid: 'a0b03050-c99b-11e0-9572-0800200c9a66',
                  name: 'Super Man',
                  uuid: 'c1c26908-3f10-11e4-adec-0800271c1b75',
                },
              ],
              targetObsRelation: null,
              type: 'Numeric',
              unknown: false,
              uuid: 'e643514e-6c2d-4f55-8363-38c09c919c8d',
              value: 77,
              valueAsString: '77.0',
              visitStartDateTime: null,
              voidReason: null,
              voided: false,
            },
            {
              abnormal: null,
              comment: null,
              concept: {
                conceptClass: 'Abnormal',
                dataType: 'Boolean',
                hiNormal: null,
                lowNormal: null,
                mappings: [],
                name: 'Pulse Abnormal',
                set: false,
                shortName: 'Pulse Abnormal',
                uuid: 'c36c7c98-3f10-11e4-adec-0800271c1b75',
              },
              conceptNameToDisplay: 'Pulse Abnormal',
              conceptSortWeight: 3,
              conceptUuid: 'c36c7c98-3f10-11e4-adec-0800271c1b75',
              creatorName: 'Super Man',
              duration: null,
              encounterDateTime: 1489643974000,
              encounterUuid: '69722943-a46f-4886-9fa1-8f089e0c1bd3',
              formFieldPath: 'obsgroup1.1/3-1',
              formNamespace: 'Bahmni',
              groupMembers: [],
              hiNormal: null,
              isAbnormal: null,
              lowNormal: null,
              obsGroupUuid: '05c44520-6f6e-4ce4-b1c9-f3477f06a44f',
              observationDateTime: '2017-03-16T11:29:34.000+0530',
              orderUuid: null,
              parentConceptUuid: null,
              providers: [
                {
                  encounterRoleUuid: 'a0b03050-c99b-11e0-9572-0800200c9a66',
                  name: 'Super Man',
                  uuid: 'c1c26908-3f10-11e4-adec-0800271c1b75',
                },
              ],
              targetObsRelation: null,
              type: 'Boolean',
              unknown: false,
              uuid: '52d09e35-ad7d-4111-bbc1-cd0115e0c9ed',
              value: true,
              valueAsString: 'Yes',
              visitStartDateTime: null,
              voidReason: null,
              voided: false,
            },
          ],
          hiNormal: null,
          isAbnormal: null,
          lowNormal: null,
          obsGroupUuid: null,
          observationDateTime: '2017-03-16T11:29:34.000+0530',
          orderUuid: null,
          parentConceptUuid: null,
          providers: [
            {
              encounterRoleUuid: 'a0b03050-c99b-11e0-9572-0800200c9a66',
              name: 'Super Man',
              uuid: 'c1c26908-3f10-11e4-adec-0800271c1b75',
            },
          ],
          targetObsRelation: null,
          type: null,
          unknown: false,
          uuid: '05c44520-6f6e-4ce4-b1c9-f3477f06a44f',
          value: '77.0, true',
          valueAsString: '77.0, true',
          visitStartDateTime: null,
          voidReason: null,
          voided: false,
        },
      });
      const removedFormFieldPath = 'obsgroup1.1/1-0';
      const removedChildRecord = new ControlRecord({
        control: {
          concept: obsGroupConcept,
          controls: [
            {
              concept: obsConcept,
              hiAbsolute: null,
              hiNormal: 72,
              id: '2',
              label: {
                type: 'label',
                value: 'Pulse(/min)',
              },
              lowAbsolute: null,
              lowNormal: 72,
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
              units: '/min',
            },
            {
              concept: {
                answers: [],
                datatype: 'Boolean',
                description: [],
                hiAbsolute: null,
                hiNormal: null,
                lowAbsolute: null,
                lowNormal: null,
                name: 'Pulse Abnormal',
                properties: {
                  allowDecimal: null,
                },
                units: null,
                uuid: 'c36c7c98-3f10-11e4-adec-0800271c1b75',
              },
              hiAbsolute: null,
              hiNormal: null,
              id: '3',
              label: {
                type: 'label',
                value: 'Pulse Abnormal',
              },
              lowAbsolute: null,
              lowNormal: null,
              options: [
                {
                  name: 'Yes',
                  value: true,
                },
                {
                  name: 'No',
                  value: false,
                },
              ],
              properties: {
                addMore: false,
                hideLabel: false,
                location: {
                  column: 0,
                  row: 1,
                },
                mandatory: false,
                notes: false,
              },
              type: 'obsControl',
              units: null,
            },
          ],
          id: '1',
          label: {
            type: 'label',
            value: 'Pulse Data',
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
        value: {},
        dataSource: {
          abnormal: null,
          comment: null,
          concept: {
            conceptClass: 'Concept Details',
            dataType: 'N/A',
            hiNormal: null,
            lowNormal: null,
            mappings: [],
            name: 'Pulse Data',
            set: true,
            shortName: 'Pulse',
            uuid: 'c36af094-3f10-11e4-adec-0800271c1b75',
          },
          conceptNameToDisplay: 'Pulse',
          conceptSortWeight: 1,
          conceptUuid: 'c36af094-3f10-11e4-adec-0800271c1b75',
          creatorName: 'Super Man',
          duration: null,
          encounterDateTime: 1489643974000,
          encounterUuid: '69722943-a46f-4886-9fa1-8f089e0c1bd3',
          formFieldPath: 'obsgroup1.1/1-0',
          formNamespace: 'Bahmni',
          groupMembers: [
            {
              abnormal: null,
              comment: null,
              concept: {
                conceptClass: 'Misc',
                dataType: 'Numeric',
                hiNormal: 72,
                lowNormal: 72,
                mappings: [],
                name: 'Pulse',
                set: false,
                shortName: 'Pulse',
                units: '/min',
                uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
              },
              conceptNameToDisplay: 'Pulse',
              conceptSortWeight: 2,
              conceptUuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
              creatorName: 'Super Man',
              duration: null,
              encounterDateTime: 1489643974000,
              encounterUuid: '69722943-a46f-4886-9fa1-8f089e0c1bd3',
              formFieldPath: 'obsgroup1.1/2-0',
              formNamespace: 'Bahmni',
              groupMembers: [],
              hiNormal: 72,
              isAbnormal: null,
              lowNormal: 72,
              obsGroupUuid: '5e51edf2-ad99-448d-9920-fee9d0d067c9',
              observationDateTime: '2017-03-16T11:29:34.000+0530',
              orderUuid: null,
              parentConceptUuid: null,
              providers: [
                {
                  encounterRoleUuid: 'a0b03050-c99b-11e0-9572-0800200c9a66',
                  name: 'Super Man',
                  uuid: 'c1c26908-3f10-11e4-adec-0800271c1b75',
                },
              ],
              targetObsRelation: null,
              type: 'Numeric',
              unknown: false,
              uuid: 'b74488d1-de7c-432f-8fcd-7e7f7c1f5f66',
              value: 72,
              valueAsString: '72.0',
              visitStartDateTime: null,
              voidReason: null,
              voided: false,
            },
            {
              abnormal: null,
              comment: null,
              concept: {
                conceptClass: 'Abnormal',
                dataType: 'Boolean',
                hiNormal: null,
                lowNormal: null,
                mappings: [],
                name: 'Pulse Abnormal',
                set: false,
                shortName: 'Pulse Abnormal',
                uuid: 'c36c7c98-3f10-11e4-adec-0800271c1b75',
              },
              conceptNameToDisplay: 'Pulse Abnormal',
              conceptSortWeight: 3,
              conceptUuid: 'c36c7c98-3f10-11e4-adec-0800271c1b75',
              creatorName: 'Super Man',
              duration: null,
              encounterDateTime: 1489643974000,
              encounterUuid: '69722943-a46f-4886-9fa1-8f089e0c1bd3',
              formFieldPath: 'obsgroup1.1/3-0',
              formNamespace: 'Bahmni',
              groupMembers: [],
              hiNormal: null,
              isAbnormal: null,
              lowNormal: null,
              obsGroupUuid: '5e51edf2-ad99-448d-9920-fee9d0d067c9',
              observationDateTime: '2017-03-16T11:29:34.000+0530',
              orderUuid: null,
              parentConceptUuid: null,
              providers: [
                {
                  encounterRoleUuid: 'a0b03050-c99b-11e0-9572-0800200c9a66',
                  name: 'Super Man',
                  uuid: 'c1c26908-3f10-11e4-adec-0800271c1b75',
                },
              ],
              targetObsRelation: null,
              type: 'Boolean',
              unknown: false,
              uuid: '4ce2c142-88b6-45d3-960a-7d540a3e4015',
              value: true,
              valueAsString: 'Yes',
              visitStartDateTime: null,
              voidReason: null,
              voided: false,
            },
          ],
          hiNormal: null,
          isAbnormal: null,
          lowNormal: null,
          obsGroupUuid: null,
          observationDateTime: '2017-03-16T11:29:34.000+0530',
          orderUuid: null,
          parentConceptUuid: null,
          providers: [
            {
              encounterRoleUuid: 'a0b03050-c99b-11e0-9572-0800200c9a66',
              name: 'Super Man',
              uuid: 'c1c26908-3f10-11e4-adec-0800271c1b75',
            },
          ],
          targetObsRelation: null,
          type: null,
          unknown: false,
          uuid: '5e51edf2-ad99-448d-9920-fee9d0d067c9',
          value: 'true, 72.0',
          valueAsString: 'true, 72.0',
          visitStartDateTime: null,
          voidReason: null,
          voided: false,
        },
        formFieldPath: removedFormFieldPath,
      });
      const obsGroupTree = new ControlRecord({
        children: List.of(obsGroupRecord, removedChildRecord),
      });
      const wrapper = mount(
                <Container
                  collapse
                  locale="en"
                  metadata={metadata}
                  observations={[]}
                  patient={patient}
                  translations={translations}
                  validate={false}
                  validateForm={false}
                />
            );
      wrapper.setState({ data: obsGroupTree });

      wrapper.instance().onControlRemove(removedFormFieldPath);

      const updatedRootTree = wrapper.state().data;
      expect(updatedRootTree.children.get(0).active).to.equal(true);
      expect(updatedRootTree.children.get(1).active).to.equal(false);
    });

    it('should change state when onEventTrigger is triggered', () => {
      const booleanConcept = {
        answers: [],
        datatype: 'Text',
        description: [],
        name: 'Tuberculosis, Need of Admission',
        properties: {
          allowDecimal: null,
        },
        uuid: 'c5cdd4e5-86e0-400c-9742-d73ffb323fa8',
      };
      const textBoxConcept = {
        answers: [],
        datatype: 'Text',
        description: [],
        name: 'Chief Complaint Notes',
        properties: {
          allowDecimal: null,
        },
        uuid: 'c398a4be-3f10-11e4-adec-0800271c1b75',
      };
      const events = {
        onValueChange: `function(form){
                    var admission = form.get('Tuberculosis, Need of Admission').getValue();
                    var patient = form.getPatient();
                    if( admission === 'abc' && patient.age === 10) {
                      form.get('Chief Complaint Notes').setEnabled(false);
                    } else {
                      form.get('Chief Complaint Notes').setEnabled(true);
                    }
                  }`,
      };
      const eventMetadata = {
        controls: [
          {
            concept: booleanConcept,
            events,
            hiAbsolute: null,
            hiNormal: null,
            id: '5',
            label: {
              type: 'label',
              value: 'Tuberculosis, Need of Admission',
            },
            lowAbsolute: null,
            lowNormal: null,
            options: [
              {
                name: 'Yes',
                value: true,
              },
              {
                name: 'No',
                value: false,
              },
            ],
            properties: {
              addMore: true,
              hideLabel: false,
              location: {
                column: 0,
                row: 0,
              },
              mandatory: true,
              notes: false,
            },
            type: 'obsControl',
            units: null,
          },
          {
            concept: textBoxConcept,
            hiAbsolute: null,
            hiNormal: null,
            id: '2',
            label: {
              type: 'label',
              value: 'Chief Complaint Notes',
            },
            lowAbsolute: null,
            lowNormal: null,
            properties: {
              addMore: false,
              hideLabel: false,
              location: {
                column: 0,
                row: 1,
              },
              mandatory: false,
              notes: false,
            },
            type: 'obsControl',
            units: null,
          },
        ],
        id: 5,
        name: '3129',
        uuid: '6a3b4de9-5e21-46b4-addb-4ad9518e587b',
        version: '4',
        defaultLocale: 'en',
      };
      const wrapper = shallow(
        <Container
          collapse
          locale="en"
          metadata={eventMetadata}
          observations={[]}
          patient={patient}
          translations={translations}
          validate={false} validateForm={false}
        />
      );
      const targetFormFieldPath = '3129.4/5-0';

      const instance = wrapper.instance();
      instance.onValueChanged(targetFormFieldPath, { value: 'abc' }, undefined);
      instance.onEventTrigger(targetFormFieldPath, 'onValueChange');

      const textBoxRecord = wrapper.state().data.children.get(1);
      expect(textBoxRecord.enabled).to.equal(false);
    });

    it('should render notification when given non-empty notification', () => {
      const clock = sinon.useFakeTimers();
      const wrapper = shallow(
        <Container
          collapse
          locale="en"
          metadata={metadata}
          observations={[]}
          patient={patient}
          translations={translations}
          validate={false}
          validateForm={false}
        />
      );
      expect(wrapper.state().notification).to.eql({});
      const notification = {
        message: Constants.errorMessage.fileTypeNotSupported,
        type: Constants.messageType.error,
      };
      Constants.toastTimeout = 1000;
      wrapper.instance().showNotification(notification.message, notification.type);
      expect(wrapper.state().notification).to.eql(notification);
      expect(wrapper.find('NotificationContainer').length).to.equal(1);
      expect(wrapper.find('NotificationContainer').at(0).prop('notification')).to.eql(notification);
      clock.tick(Constants.toastTimeout);
      expect(wrapper.state().notification).to.eql({});
    });

    it('should confirm errors be array when onControlRemove be triggered', () => {
      const wrapper = shallow(
        <Container
          collapse
          locale="en"
          metadata={metadata}
          observations={[]}
          patient={patient}
          translations={translations}
          validate={false}
          validateForm={false}
        />
      );
      const clonedFormFieldPath = 'SingleObs.1/1-1';
      const clonedRecord = new ControlRecord({
        control: childRecord.control,
        formFieldPath: clonedFormFieldPath,
        dataSource: childRecord.dataSource,
      });
      const addMoreTree = new ControlRecord({ children: List.of(childRecord, clonedRecord) });
      wrapper.setState({ data: addMoreTree });

      wrapper.instance().onControlRemove(clonedFormFieldPath);

      wrapper.state().data.children.forEach(r => {
        expect(typeof r.errors).to.equal('object');
        expect(r.errors.length).to.be.at.least(0);
      });
    });
  });

  describe('Multiple layer', () => {
    const metadata = {
      controls: [
        {
          concept: {
            datatype: 'N/A',
            name: 'TestGroup',
            set: true,
            setMembers: [
              {
                answers: [],
                datatype: 'Numeric',
                description: [],
                hiAbsolute: null,
                hiNormal: null,
                lowAbsolute: null,
                lowNormal: null,
                name: 'TestObs',
                properties: {
                  allowDecimal: false,
                },
                units: null,
                uuid: 'd0490af4-72eb-4090-9b43-ac3487ba7474',
              },
            ],
            uuid: 'eafe7d68-904b-459b-b11d-6502ec0143a4',
          },
          controls: [
            {
              concept: {
                answers: [],
                datatype: 'Numeric',
                description: [],
                hiAbsolute: null,
                hiNormal: null,
                lowAbsolute: null,
                lowNormal: null,
                name: 'TestObs',
                properties: {
                  allowDecimal: false,
                },
                units: null,
                uuid: 'd0490af4-72eb-4090-9b43-ac3487ba7474',
              },
              hiAbsolute: null,
              hiNormal: null,
              id: '4',
              label: {
                type: 'label',
                value: 'TestObs',
              },
              lowAbsolute: null,
              lowNormal: null,
              properties: {
                addMore: true,
                hideLabel: false,
                location: {
                  column: 0,
                  row: 0,
                },
                mandatory: false,
                notes: false,
              },
              type: 'obsControl',
              units: null,
            },
          ],
          id: '3',
          label: {
            type: 'label',
            value: 'TestGroup',
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
      id: 210,
      name: 'SingleGroup',
      uuid: '72801201-2154-4f1e-89cb-21a57a23d06a',
      version: '3',
      defaultLocale: 'en',
    };

    const obsCtrlRecord = new ControlRecord({
      control: {
        concept: {
          answers: [],
          datatype: 'Numeric',
          description: [],
          hiAbsolute: null,
          hiNormal: null,
          lowAbsolute: null,
          lowNormal: null,
          name: 'TestObs',
          properties: {
            allowDecimal: false,
          },
          units: null,
          uuid: 'd0490af4-72eb-4090-9b43-ac3487ba7474',
        },
        hiAbsolute: null,
        hiNormal: null,
        id: '4',
        label: {
          type: 'label',
          value: 'TestObs',
        },
        lowAbsolute: null,
        lowNormal: null,
        properties: {
          addMore: true,
          hideLabel: false,
          location: {
            column: 0,
            row: 0,
          },
          mandatory: false,
          notes: false,
        },
        type: 'obsControl',
        units: null,
      },
      formFieldPath: 'SingleGroup.3/4-0',
      dataSource: {
        abnormal: null,
        comment: null,
        concept: {
          conceptClass: 'Test',
          dataType: 'Numeric',
          hiNormal: null,
          lowNormal: null,
          mappings: [],
          name: 'TestObs',
          set: false,
          shortName: 'TestObs',
          uuid: 'd0490af4-72eb-4090-9b43-ac3487ba7474',
        },
        conceptNameToDisplay: 'TestObs',
        conceptSortWeight: 2,
        conceptUuid: 'd0490af4-72eb-4090-9b43-ac3487ba7474',
        creatorName: 'Super Man',
        duration: null,
        encounterDateTime: 1488523999000,
        encounterUuid: '8b5f9862-ce75-4d31-bf41-1c47d58c7444',
        formFieldPath: 'SingleGroup.3/4-0',
        formNamespace: 'Bahmni',
        groupMembers: [],
        hiNormal: null,
        isAbnormal: null,
        lowNormal: null,
        obsGroupUuid: '531bd307-8c52-43eb-ac16-b184f2845cc5',
        observationDateTime: '2017-03-03T07:26:22.000+0000',
        orderUuid: null,
        parentConceptUuid: null,
        providers: [
          {
            encounterRoleUuid: 'a0b03050-c99b-11e0-9572-0800200c9a66',
            name: 'Super Man',
            uuid: 'c1c26908-3f10-11e4-adec-0800271c1b75',
          },
        ],
        targetObsRelation: null,
        type: 'Numeric',
        unknown: false,
        uuid: 'ff30ba63-bb45-404b-bb51-f686bbc15f49',
        value: undefined,
        valueAsString: '1.0',
        visitStartDateTime: null,
        voidReason: null,
        voided: false,
      },
      value: { value: '1', comment: undefined },
    });
    const childRecord = new ControlRecord({
      control: {
        concept: {
          datatype: 'N/A',
          name: 'TestGroup',
          set: true,
          setMembers: [
            {
              answers: [],
              datatype: 'Numeric',
              description: [],
              hiAbsolute: null,
              hiNormal: null,
              lowAbsolute: null,
              lowNormal: null,
              name: 'TestObs',
              properties: {
                allowDecimal: false,
              },
              units: null,
              uuid: 'd0490af4-72eb-4090-9b43-ac3487ba7474',
            },
          ],
          uuid: 'eafe7d68-904b-459b-b11d-6502ec0143a4',
        },
        controls: [
          {
            concept: {
              answers: [],
              datatype: 'Numeric',
              description: [],
              hiAbsolute: null,
              hiNormal: null,
              lowAbsolute: null,
              lowNormal: null,
              name: 'TestObs',
              properties: {
                allowDecimal: false,
              },
              units: null,
              uuid: 'd0490af4-72eb-4090-9b43-ac3487ba7474',
            },
            hiAbsolute: null,
            hiNormal: null,
            id: '4',
            label: {
              type: 'label',
              value: 'TestObs',
            },
            lowAbsolute: null,
            lowNormal: null,
            properties: {
              addMore: true,
              hideLabel: false,
              location: {
                column: 0,
                row: 0,
              },
              mandatory: false,
              notes: false,
            },
            type: 'obsControl',
            units: null,
          },
        ],
        id: '3',
        label: {
          type: 'label',
          value: 'TestGroup',
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
      formFieldPath: 'SingleGroup.3/3-0',
      dataSource: {
        abnormal: null,
        comment: null,
        concept: {
          conceptClass: 'Concept Details',
          dataType: 'N/A',
          hiNormal: null,
          lowNormal: null,
          mappings: [],
          name: 'TestGroup',
          set: true,
          shortName: 'TestGroup',
          uuid: 'eafe7d68-904b-459b-b11d-6502ec0143a4',
        },
        conceptNameToDisplay: 'TestGroup',
        conceptSortWeight: 1,
        conceptUuid: 'eafe7d68-904b-459b-b11d-6502ec0143a4',
        creatorName: 'Super Man',
        duration: null,
        encounterDateTime: 1488523999000,
        encounterUuid: '8b5f9862-ce75-4d31-bf41-1c47d58c7444',
        formFieldPath: 'SingleGroup.3/3-0',
        formNamespace: 'Bahmni',
        groupMembers: [
          {
            abnormal: null,
            comment: null,
            concept: {
              conceptClass: 'Test',
              dataType: 'Numeric',
              hiNormal: null,
              lowNormal: null,
              mappings: [],
              name: 'TestObs',
              set: false,
              shortName: 'TestObs',
              uuid: 'd0490af4-72eb-4090-9b43-ac3487ba7474',
            },
            conceptNameToDisplay: 'TestObs',
            conceptSortWeight: 2,
            conceptUuid: 'd0490af4-72eb-4090-9b43-ac3487ba7474',
            creatorName: 'Super Man',
            duration: null,
            encounterDateTime: 1488523999000,
            encounterUuid: '8b5f9862-ce75-4d31-bf41-1c47d58c7444',
            formFieldPath: 'SingleGroup.3/4-0',
            formNamespace: 'Bahmni',
            groupMembers: [],
            hiNormal: null,
            isAbnormal: null,
            lowNormal: null,
            obsGroupUuid: '531bd307-8c52-43eb-ac16-b184f2845cc5',
            observationDateTime: '2017-03-03T07:26:22.000+0000',
            orderUuid: null,
            parentConceptUuid: null,
            providers: [
              {
                encounterRoleUuid: 'a0b03050-c99b-11e0-9572-0800200c9a66',
                name: 'Super Man',
                uuid: 'c1c26908-3f10-11e4-adec-0800271c1b75',
              },
            ],
            targetObsRelation: null,
            type: 'Numeric',
            unknown: false,
            uuid: 'ff30ba63-bb45-404b-bb51-f686bbc15f49',
            value: 1,
            valueAsString: '1.0',
            visitStartDateTime: null,
            voidReason: null,
            voided: false,
          },
        ],
        hiNormal: null,
        isAbnormal: null,
        lowNormal: null,
        obsGroupUuid: null,
        observationDateTime: '2017-03-03T07:26:22.000+0000',
        orderUuid: null,
        parentConceptUuid: null,
        providers: [
          {
            encounterRoleUuid: 'a0b03050-c99b-11e0-9572-0800200c9a66',
            name: 'Super Man',
            uuid: 'c1c26908-3f10-11e4-adec-0800271c1b75',
          },
        ],
        targetObsRelation: null,
        type: null,
        unknown: false,
        uuid: '531bd307-8c52-43eb-ac16-b184f2845cc5',
        value: '1',
        valueAsString: '1',
        visitStartDateTime: null,
        voidReason: null,
        voided: false,
      },
      children: List.of(obsCtrlRecord),
    });

    const translations = {
      labels: {
        LABEL_1: 'some Label',
      },
      concepts: {
        TEMPERATURE_2: 'Temperature',
      },
    };

    const recordTree = new ControlRecord({ children: List.of(childRecord) });

    it('should render multiple control when given multiple layer tree data', () => {
      const wrapper = mount(
                <Container
                  collapse
                  locale="en"
                  metadata={metadata}
                  observations={[]}
                  patient={patient}
                  translations={translations}
                  validate={false}
                  validateForm={false}
                />
            );

      wrapper.setState({ data: recordTree });

      expect(wrapper).to.have.exactly(1).descendants('ObsGroupControl');
    });

    it('should change state when onValueChanged is triggered', () => {
      const wrapper = shallow(
                <Container
                  collapse
                  locale="en"
                  metadata={metadata}
                  observations={[]}
                  patient={patient}
                  translations={translations}
                  validate={false}
                  validateForm={false}
                />
            );
      const formFieldPath = 'SingleGroup.3/4-0';
      const changedValue = { value: '1', comment: undefined };

            // const update = sinon.stub(wrapper.state().data, 'update').returns(recordTree);

      wrapper.instance().onValueChanged(formFieldPath, changedValue);

            // update.restore();

      const obsGroupRecord = wrapper.state().data.children.get(0);
      const obsControlRecord = obsGroupRecord.children.get(0);
      expect(obsControlRecord.value).to.equal(changedValue);
    });

    it('should update dataSource value when getValue is triggered', () => {
      const wrapper = mount(
                <Container
                  collapse
                  locale="en"
                  metadata={metadata}
                  observations={[]}
                  patient={patient}
                  translations={translations}
                  validate={false}
                  validateForm={false}
                />
            );
      wrapper.setState({ data: recordTree });

      const previousValue = wrapper.state().data.children.get(0)
                .children.get(0).get('dataSource').value;
      expect(previousValue).to.equal(undefined);

      const result = wrapper.instance().getValue();

      const updatedValue = result.observations[0].groupMembers[0].value;
      expect(updatedValue).to.equal('1');
    });

    it('should both change when onValueChanged be triggered twice', () => {
      const smokingHistoryConcept = {
        answers: [],
        datatype: 'Boolean',
        name: 'Smoking History',
        properties: {
          allowDecimal: null,
        },
        uuid: 'c2a43174-c9db-4e54-8516-17372c83537f',
      };
      const pulseConcept = {
        answers: [],
        datatype: 'Numeric',
        description: [],
        name: 'Pulse',
        properties: {
          allowDecimal: true,
        },
        uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
      };
      const updatedMetadata = {
        controls: [
          {
            concept: smokingHistoryConcept,
            hiAbsolute: null,
            hiNormal: null,
            id: '1',
            label: {
              type: 'label',
              value: 'Smoking History',
            },
            lowAbsolute: null,
            lowNormal: null,
            options: [
              {
                name: 'Yes',
                value: true,
              },
              {
                name: 'No',
                value: false,
              },
            ],
            properties: {
              addMore: false,
              hideLabel: false,
              location: {
                column: 0,
                row: 0,
              },
              mandatory: true,
              notes: false,
            },
            type: 'obsControl',
            units: null,
          },
          {
            concept: pulseConcept,
            hiAbsolute: null,
            hiNormal: 72,
            id: '2',
            label: {
              type: 'label',
              value: 'Pulse(/min)',
            },
            lowAbsolute: null,
            lowNormal: 72,
            properties: {
              addMore: false,
              hideLabel: false,
              location: {
                column: 0,
                row: 1,
              },
              mandatory: true,
              notes: false,
            },
            type: 'obsControl',
            units: '/min',
          },
        ],
        id: 228,
        name: 'Error2',
        uuid: 'a4eb5bac-8c7a-43e6-9c75-cef0710991e5',
        version: '1',
        defaultLocale: 'en',
      };

      const wrapper = mount(
                <Container
                  collapse
                  locale="en"
                  metadata={updatedMetadata}
                  observations={[]}
                  patient={patient}
                  translations={translations}
                  validate={false}
                  validateForm={false}
                />
            );

      const Errors = new Record({
        type: 'error',
        message: 'mandatory',
      });

            // Wrapper will update state immediately, so save the function here
      const originalStateFunc = wrapper.instance().setState.bind(wrapper.instance());
      wrapper.instance().setState = (partialState) => {
                // Simulate real react setState, when partialState is function, react will call it with latest state.
        if (typeof partialState === 'function') {
          originalStateFunc(partialState(wrapper.state()));
        }
      };

      wrapper.instance().onValueChanged('Error2.1/1-0', {}, new Errors());
      wrapper.instance().onValueChanged('Error2.1/2-0', {}, new Errors());

      expect(wrapper.state().data.children.get(0).errors.length).not.to.equal(0);
      expect(wrapper.state().data.children.get(1).errors.length).not.to.equal(0);
    });

    describe('obsInObsGroup', () => {
      const obsGroupConcept = {
        datatype: 'N/A',
        name: 'TestGroup',
        set: true,
        setMembers: [
          {
            answers: [],
            datatype: 'Numeric',
            description: [],
            hiAbsolute: null,
            hiNormal: null,
            lowAbsolute: null,
            lowNormal: null,
            name: 'TestObs',
            properties: {
              allowDecimal: false,
            },
            units: null,
            uuid: 'd0490af4-72eb-4090-9b43-ac3487ba7474',
          },
        ],
        uuid: 'eafe7d68-904b-459b-b11d-6502ec0143a4',
      };
      const obsConcept = {
        answers: [],
        datatype: 'Numeric',
        description: [],
        hiAbsolute: null,
        hiNormal: null,
        lowAbsolute: null,
        lowNormal: null,
        name: 'TestObs',
        properties: {
          allowDecimal: false,
        },
        units: null,
        uuid: 'd0490af4-72eb-4090-9b43-ac3487ba7474',
      };
      const activeFormFieldPath = 'SingleGroup.3/4-0';
      const obsRecord = new ControlRecord({
        control: {
          concept: obsConcept,
          hiAbsolute: null,
          hiNormal: null,
          id: '4',
          label: {
            type: 'label',
            value: 'TestObs',
          },
          lowAbsolute: null,
          lowNormal: null,
          properties: {
            addMore: true,
            hideLabel: false,
            location: {
              column: 0,
              row: 0,
            },
            mandatory: false,
            notes: false,
          },
          type: 'obsControl',
          units: null,
        },
        formFieldPath: activeFormFieldPath,
        value: {},
        active: true,
        dataSource: {
          concept: obsConcept,
          formFieldPath: 'SingleGroup.3/4-0',
          formNamespace: 'Bahmni',
          voided: true,
        },
      });

      it('should add one obs when onControlAdd is triggered with obs in obs group', () => {
        const obsGroupRecord = new ControlRecord({
          control: {
            concept: obsGroupConcept,
            controls: [
              {
                concept: obsConcept,
                hiAbsolute: null,
                hiNormal: null,
                id: '4',
                label: {
                  type: 'label',
                  value: 'TestObs',
                },
                lowAbsolute: null,
                lowNormal: null,
                properties: {
                  addMore: true,
                  hideLabel: false,
                  location: {
                    column: 0,
                    row: 0,
                  },
                  mandatory: false,
                  notes: false,
                },
                type: 'obsControl',
                units: null,
              },
            ],
            id: '3',
            label: {
              type: 'label',
              value: 'TestGroup',
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
          formFieldPath: 'SingleGroup.3/3-0',
          children: List.of(obsRecord),
          value: {},
          active: true,
          dataSource: {
            concept: obsGroupConcept,
            formFieldPath: 'SingleGroup.3/3-0',
            formNamespace: 'Bahmni',
            voided: true,
          },
        });
        const obsTree = new ControlRecord({ children: List.of(obsGroupRecord) });
        const wrapper = mount(
                    <Container
                      collapse
                      locale="en"
                      metadata={metadata}
                      observations={[]}
                      patient={patient}
                      translations={translations}
                      validate={false}
                      validateForm={false}
                    />
                );
        wrapper.setState({ data: obsTree });
        wrapper.instance().onControlAdd(activeFormFieldPath);

        const updatedRootTree = wrapper.state().data;

        const obsGroupTree = updatedRootTree.children.get(0);
        expect(obsGroupTree.children.size).to.equal(2);
      });

      it('should remove one obs when onControlRemove is triggered with obs in obs group', () => {
        const removableFormFieldPath = 'SingleGroup.3/4-1';
        const removableObsRecord = new ControlRecord({
          control: {
            concept: obsConcept,
            hiAbsolute: null,
            hiNormal: null,
            id: '4',
            label: {
              type: 'label',
              value: 'TestObs',
            },
            lowAbsolute: null,
            lowNormal: null,
            properties: {
              addMore: true,
              hideLabel: false,
              location: {
                column: 0,
                row: 0,
              },
              mandatory: false,
              notes: false,
            },
            type: 'obsControl',
            units: null,
          },
          formFieldPath: removableFormFieldPath,
          value: {},
          active: true,
          dataSource: {
            concept: obsConcept,
            formFieldPath: 'SingleGroup.3/4-0',
            formNamespace: 'Bahmni',
            voided: true,
          },
        });

        const obsGroupRecord = new ControlRecord({
          control: {
            concept: obsGroupConcept,
            controls: [
              {
                concept: obsConcept,
                hiAbsolute: null,
                hiNormal: null,
                id: '4',
                label: {
                  type: 'label',
                  value: 'TestObs',
                },
                lowAbsolute: null,
                lowNormal: null,
                properties: {
                  addMore: true,
                  hideLabel: false,
                  location: {
                    column: 0,
                    row: 0,
                  },
                  mandatory: false,
                  notes: false,
                },
                type: 'obsControl',
                units: null,
              },
            ],
            id: '3',
            label: {
              type: 'label',
              value: 'TestGroup',
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
          formFieldPath: 'SingleGroup.3/3-0',
          children: List.of(obsRecord, removableObsRecord),
          value: {},
          active: true,
          dataSource: {
            concept: obsGroupConcept,
            formFieldPath: 'SingleGroup.3/3-0',
            formNamespace: 'Bahmni',
            voided: true,
          },
        });
        const obsTree = new ControlRecord({ children: List.of(obsGroupRecord) });
        const wrapper = mount(
                    <Container
                      collapse
                      locale="en"
                      metadata={metadata}
                      observations={[]}
                      patient={patient}
                      translations={translations}
                      validate={false}
                      validateForm={false}
                    />
                );
        wrapper.setState({ data: obsTree });
        wrapper.instance().onControlRemove(removableFormFieldPath);

        const updatedRootTree = wrapper.state().data;

        const obsGroupTree = updatedRootTree.children.get(0);
        expect(obsGroupTree.children.get(0).active).to.equal(true);
        expect(obsGroupTree.children.get(1).active).to.equal(false);
        expect(obsGroupTree.children.get(1).formFieldPath).to.equal(removableFormFieldPath);
      });
    });

    describe('obsInSection', () => {
      const obsGroupConcept = {
        datatype: 'N/A',
        name: 'TestGroup',
        set: true,
        setMembers: [
          {
            answers: [],
            datatype: 'Numeric',
            description: [],
            hiAbsolute: null,
            hiNormal: null,
            lowAbsolute: null,
            lowNormal: null,
            name: 'TestObs',
            properties: {
              allowDecimal: false,
            },
            units: null,
            uuid: 'd0490af4-72eb-4090-9b43-ac3487ba7474',
          },
        ],
        uuid: 'eafe7d68-904b-459b-b11d-6502ec0143a4',
      };
      const obsConcept = {
        answers: [],
        datatype: 'Numeric',
        description: [],
        hiAbsolute: null,
        hiNormal: null,
        lowAbsolute: null,
        lowNormal: null,
        name: 'TestObs',
        properties: {
          allowDecimal: false,
        },
        units: null,
        uuid: 'd0490af4-72eb-4090-9b43-ac3487ba7474',
      };
      const obsFormFieldPath = 'SectionWithObsGroup.1/3-0';
      const obsRecord = new ControlRecord({
        control: {
          concept: obsConcept,
          hiAbsolute: null,
          hiNormal: null,
          id: '3',
          label: {
            type: 'label',
            value: 'TestObs',
          },
          lowAbsolute: null,
          lowNormal: null,
          properties: {
            addMore: true,
            hideLabel: false,
            location: {
              column: 0,
              row: 0,
            },
            mandatory: false,
            notes: false,
          },
          type: 'obsControl',
          units: null,
        },
        value: {},
        dataSource: {
          concept: obsConcept,
          formFieldPath: obsFormFieldPath,
          formNamespace: 'Bahmni',
          voided: true,
        },
        formFieldPath: obsFormFieldPath,
      });

      it('should add one obs when onControlAdd is triggered ' +
                'with obs of obs group in section', () => {
        const obsGroupRecord = new ControlRecord({
          control: {
            concept: obsGroupConcept,
            controls: [
              {
                concept: obsConcept,
                hiAbsolute: null,
                hiNormal: null,
                id: '3',
                label: {
                  type: 'label',
                  value: 'TestObs',
                },
                lowAbsolute: null,
                lowNormal: null,
                properties: {
                  addMore: true,
                  hideLabel: false,
                  location: {
                    column: 0,
                    row: 0,
                  },
                  mandatory: false,
                  notes: false,
                },
                type: 'obsControl',
                units: null,
              },
            ],
            id: '2',
            label: {
              type: 'label',
              value: 'TestGroup',
            },
            properties: {
              abnormal: false,
              addMore: false,
              location: {
                column: 0,
                row: 0,
              },
            },
            type: 'obsGroupControl',
          },
          formFieldPath: 'SectionWithObsGroup.1/2-0',
          value: {},
          children: List.of(obsRecord),
          dataSource: {
            concept: obsGroupConcept,
            formFieldPath: 'SectionWithObsGroup.1/2-0',
            formNamespace: 'Bahmni',
            voided: true,
          },
        });
        const sectionRecord = new ControlRecord({
          control: {
            controls: [
              {
                concept: obsGroupConcept,
                controls: [
                  {
                    concept: {
                      answers: [],
                      datatype: 'Numeric',
                      description: [],
                      hiAbsolute: null,
                      hiNormal: null,
                      lowAbsolute: null,
                      lowNormal: null,
                      name: 'TestObs',
                      properties: {
                        allowDecimal: false,
                      },
                      units: null,
                      uuid: 'd0490af4-72eb-4090-9b43-ac3487ba7474',
                    },
                    hiAbsolute: null,
                    hiNormal: null,
                    id: '3',
                    label: {
                      type: 'label',
                      value: 'TestObs',
                    },
                    lowAbsolute: null,
                    lowNormal: null,
                    properties: {
                      addMore: true,
                      hideLabel: false,
                      location: {
                        column: 0,
                        row: 0,
                      },
                      mandatory: false,
                      notes: false,
                    },
                    type: 'obsControl',
                    units: null,
                  },
                ],
                id: '2',
                label: {
                  type: 'label',
                  value: 'TestGroup',
                },
                properties: {
                  abnormal: false,
                  addMore: false,
                  location: {
                    column: 0,
                    row: 0,
                  },
                },
                type: 'obsGroupControl',
              },
            ],
            id: '1',
            label: {
              type: 'label',
              value: 'Section',
            },
            properties: {
              location: {
                column: 0,
                row: 0,
              },
            },
            type: 'section',
          },
          value: {},
          formFieldPath: 'obsGroupInSection.1/1-0',
          dataSource: {
            formFieldPath: 'SectionWithObsGroup.1/1-0',
            obsList: [],
          },
          children: List.of(obsGroupRecord),
        });
        const obsTree = new ControlRecord({ children: List.of(sectionRecord) });

        const wrapper = mount(
                    <Container
                      collapse
                      locale="en"
                      metadata={metadata}
                      observations={[]}
                      patient={patient}
                      translations={translations}
                      validate={false}
                      validateForm={false}
                    />
                );
        wrapper.setState({ data: obsTree });
        wrapper.instance().onControlAdd(obsFormFieldPath);

        const updatedRootTree = wrapper.state().data;
        const sectionTree = updatedRootTree.children.get(0);

        expect(sectionTree.children.get(0).children.size).to.equal(2);
      });

      it('should remove one obs when onControlRemove is triggered ' +
                'with obs of obs group in section', () => {
        const removableFormFieldPath = 'SectionWithObsGroup.1/3-1';
        const removableObsRecord = new ControlRecord({
          control: {
            concept: obsConcept,
            hiAbsolute: null,
            hiNormal: null,
            id: '3',
            label: {
              type: 'label',
              value: 'TestObs',
            },
            lowAbsolute: null,
            lowNormal: null,
            properties: {
              addMore: true,
              hideLabel: false,
              location: {
                column: 0,
                row: 0,
              },
              mandatory: false,
              notes: false,
            },
            type: 'obsControl',
            units: null,
          },
          value: {},
          dataSource: {
            concept: obsConcept,
            formFieldPath: obsFormFieldPath,
            formNamespace: 'Bahmni',
            voided: true,
          },
          formFieldPath: removableFormFieldPath,
        });
        const obsGroupRecord = new ControlRecord({
          control: {
            concept: obsGroupConcept,
            controls: [
              {
                concept: obsConcept,
                hiAbsolute: null,
                hiNormal: null,
                id: '3',
                label: {
                  type: 'label',
                  value: 'TestObs',
                },
                lowAbsolute: null,
                lowNormal: null,
                properties: {
                  addMore: true,
                  hideLabel: false,
                  location: {
                    column: 0,
                    row: 0,
                  },
                  mandatory: false,
                  notes: false,
                },
                type: 'obsControl',
                units: null,
              },
            ],
            id: '2',
            label: {
              type: 'label',
              value: 'TestGroup',
            },
            properties: {
              abnormal: false,
              addMore: false,
              location: {
                column: 0,
                row: 0,
              },
            },
            type: 'obsGroupControl',
          },
          formFieldPath: 'SectionWithObsGroup.1/2-0',
          value: {},
          children: List.of(obsRecord, removableObsRecord),
          dataSource: {
            concept: obsGroupConcept,
            formFieldPath: 'SectionWithObsGroup.1/2-0',
            formNamespace: 'Bahmni',
            voided: true,
          },
        });
        const sectionRecord = new ControlRecord({
          control: {
            controls: [
              {
                concept: obsGroupConcept,
                controls: [
                  {
                    concept: {
                      answers: [],
                      datatype: 'Numeric',
                      description: [],
                      hiAbsolute: null,
                      hiNormal: null,
                      lowAbsolute: null,
                      lowNormal: null,
                      name: 'TestObs',
                      properties: {
                        allowDecimal: false,
                      },
                      units: null,
                      uuid: 'd0490af4-72eb-4090-9b43-ac3487ba7474',
                    },
                    hiAbsolute: null,
                    hiNormal: null,
                    id: '3',
                    label: {
                      type: 'label',
                      value: 'TestObs',
                    },
                    lowAbsolute: null,
                    lowNormal: null,
                    properties: {
                      addMore: true,
                      hideLabel: false,
                      location: {
                        column: 0,
                        row: 0,
                      },
                      mandatory: false,
                      notes: false,
                    },
                    type: 'obsControl',
                    units: null,
                  },
                ],
                id: '2',
                label: {
                  type: 'label',
                  value: 'TestGroup',
                },
                properties: {
                  abnormal: false,
                  addMore: false,
                  location: {
                    column: 0,
                    row: 0,
                  },
                },
                type: 'obsGroupControl',
              },
            ],
            id: '1',
            label: {
              type: 'label',
              value: 'Section',
            },
            properties: {
              location: {
                column: 0,
                row: 0,
              },
            },
            type: 'section',
          },
          value: {},
          formFieldPath: 'obsGroupInSection.1/1-0',
          dataSource: {
            formFieldPath: 'SectionWithObsGroup.1/1-0',
            obsList: [],
          },
          children: List.of(obsGroupRecord),
        });
        const obsTree = new ControlRecord({ children: List.of(sectionRecord) });

        const wrapper = mount(
                    <Container
                      collapse
                      locale="en"
                      metadata={metadata}
                      observations={[]}
                      patient={patient}
                      translations={translations}
                      validate={false}
                      validateForm={false}
                    />
                );
        wrapper.setState({ data: obsTree });
        wrapper.instance().onControlRemove(removableFormFieldPath);

        const updatedRootTree = wrapper.state().data;
        const obsGroupTree = updatedRootTree.children.get(0).children.get(0);

        expect(obsGroupTree.children.get(0).active).to.equal(true);
        expect(obsGroupTree.children.get(1).active).to.equal(false);
        expect(obsGroupTree.children.get(1).formFieldPath).to.equal(removableFormFieldPath);
      });
    });

    describe('obsGroupInSection', () => {
      it('should add one obs group when onControlAdd ' +
          'is triggered with obs group in section', () => {
        const concept = {
          datatype: 'N/A',
          name: 'Pulse Data',
          set: true,
          setMembers: [
            {
              answers: [],
              datatype: 'Numeric',
              description: [],
              hiAbsolute: null,
              hiNormal: 72,
              lowAbsolute: null,
              lowNormal: 72,
              name: 'Pulse(/min)',
              properties: {
                allowDecimal: true,
              },
              units: '/min',
              uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
            },
            {
              answers: [],
              datatype: 'Boolean',
              description: [],
              hiAbsolute: null,
              hiNormal: null,
              lowAbsolute: null,
              lowNormal: null,
              name: 'Pulse Abnormal',
              properties: {
                allowDecimal: null,
              },
              units: null,
              uuid: 'c36c7c98-3f10-11e4-adec-0800271c1b75',
            },
          ],
          uuid: 'c36af094-3f10-11e4-adec-0800271c1b75',
        };
        const obsGroupConcept = {
          datatype: 'N/A',
          name: 'Pulse Data',
          set: true,
          setMembers: [
            {
              answers: [],
              datatype: 'Numeric',
              description: [],
              hiAbsolute: null,
              hiNormal: 72,
              lowAbsolute: null,
              lowNormal: 72,
              name: 'Pulse(/min)',
              properties: {
                allowDecimal: true,
              },
              units: '/min',
              uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
            },
            {
              answers: [],
              datatype: 'Boolean',
              description: [],
              hiAbsolute: null,
              hiNormal: null,
              lowAbsolute: null,
              lowNormal: null,
              name: 'Pulse Abnormal',
              properties: {
                allowDecimal: null,
              },
              units: null,
              uuid: 'c36c7c98-3f10-11e4-adec-0800271c1b75',
            },
          ],
          uuid: 'c36af094-3f10-11e4-adec-0800271c1b75',
        };
        const addedFormFieldPath = 'obsGroupInSection.1/2-0';
        const obsGroupRecord = new ControlRecord({
          value: {},
          control: {
            concept: obsGroupConcept,
            controls: [
              {
                concept: {
                  answers: [],
                  datatype: 'Numeric',
                  description: [],
                  hiAbsolute: null,
                  hiNormal: 72,
                  lowAbsolute: null,
                  lowNormal: 72,
                  name: 'Pulse(/min)',
                  properties: {
                    allowDecimal: true,
                  },
                  units: '/min',
                  uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
                },
                hiAbsolute: null,
                hiNormal: 72,
                id: '3',
                label: {
                  type: 'label',
                  value: 'Pulse(/min)',
                },
                lowAbsolute: null,
                lowNormal: 72,
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
                units: '/min',
              },
              {
                concept: {
                  answers: [],
                  datatype: 'Boolean',
                  description: [],
                  hiAbsolute: null,
                  hiNormal: null,
                  lowAbsolute: null,
                  lowNormal: null,
                  name: 'Pulse Abnormal',
                  properties: {
                    allowDecimal: null,
                  },
                  units: null,
                  uuid: 'c36c7c98-3f10-11e4-adec-0800271c1b75',
                },
                hiAbsolute: null,
                hiNormal: null,
                id: '4',
                label: {
                  type: 'label',
                  value: 'Pulse Abnormal',
                },
                lowAbsolute: null,
                lowNormal: null,
                options: [
                  {
                    name: 'Yes',
                    value: true,
                  },
                  {
                    name: 'No',
                    value: false,
                  },
                ],
                properties: {
                  addMore: false,
                  hideLabel: false,
                  location: {
                    column: 0,
                    row: 1,
                  },
                  mandatory: false,
                  notes: false,
                },
                type: 'obsControl',
                units: null,
              },
            ],
            id: '2',
            label: {
              type: 'label',
              value: 'Pulse Data',
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
          formFieldPath: addedFormFieldPath,
          dataSource: {
            concept: obsGroupConcept,
            formFieldPath: 'obsGroupInSection.1/2-0',
            formNamespace: 'Bahmni',
            voided: true,
          },
        });
        const sectionRecord = new ControlRecord({
          value: {},
          control: {
            controls: [
              {
                concept,
                controls: [
                  {
                    concept: {
                      answers: [],
                      datatype: 'Numeric',
                      description: [],
                      hiAbsolute: null,
                      hiNormal: 72,
                      lowAbsolute: null,
                      lowNormal: 72,
                      name: 'Pulse(/min)',
                      properties: {
                        allowDecimal: true,
                      },
                      units: '/min',
                      uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
                    },
                    hiAbsolute: null,
                    hiNormal: 72,
                    id: '3',
                    label: {
                      type: 'label',
                      value: 'Pulse(/min)',
                    },
                    lowAbsolute: null,
                    lowNormal: 72,
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
                    units: '/min',
                  },
                  {
                    concept: {
                      answers: [],
                      datatype: 'Boolean',
                      description: [],
                      hiAbsolute: null,
                      hiNormal: null,
                      lowAbsolute: null,
                      lowNormal: null,
                      name: 'Pulse Abnormal',
                      properties: {
                        allowDecimal: null,
                      },
                      units: null,
                      uuid: 'c36c7c98-3f10-11e4-adec-0800271c1b75',
                    },
                    hiAbsolute: null,
                    hiNormal: null,
                    id: '4',
                    label: {
                      type: 'label',
                      value: 'Pulse Abnormal',
                    },
                    lowAbsolute: null,
                    lowNormal: null,
                    options: [
                      {
                        name: 'Yes',
                        value: true,
                      },
                      {
                        name: 'No',
                        value: false,
                      },
                    ],
                    properties: {
                      addMore: false,
                      hideLabel: false,
                      location: {
                        column: 0,
                        row: 1,
                      },
                      mandatory: false,
                      notes: false,
                    },
                    type: 'obsControl',
                    units: null,
                  },
                ],
                id: '2',
                label: {
                  type: 'label',
                  value: 'Pulse Data',
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
            id: '1',
            label: {
              type: 'label',
              value: 'Section',
            },
            properties: {
              location: {
                column: 0,
                row: 0,
              },
            },
            type: 'section',
          },
          formFieldPath: 'obsGroupInSection.1/1-0',
          dataSource: {
            formFieldPath: 'obsGroupInSection.1/1-0',
            obsList: [],
          },
          children: List.of(obsGroupRecord),
        });
        const rootTree = new ControlRecord({ children: List.of(sectionRecord) });
        const wrapper = mount(
                   <Container
                     collapse
                     locale="en"
                     metadata={metadata}
                     observations={[]}
                     patient={patient}
                     translations={translations}
                     validate={false}
                     validateForm={false}
                   />
               );
        wrapper.setState({ data: rootTree });
        wrapper.instance().onControlAdd(addedFormFieldPath);

        const updatedRootTree = wrapper.state().data;

        const sectionTree = updatedRootTree.children.get(0);

        expect(sectionTree.children.size).to.equal(2);
      });

      it('should remove one obs group when onControlAdd ' +
          'is triggered with obs group in section', () => {
        const obsGroupConcept = {
          datatype: 'N/A',
          name: 'Pulse Data',
          set: true,
          setMembers: [
            {
              answers: [],
              datatype: 'Numeric',
              description: [],
              hiAbsolute: null,
              hiNormal: 72,
              lowAbsolute: null,
              lowNormal: 72,
              name: 'Pulse(/min)',
              properties: {
                allowDecimal: true,
              },
              units: '/min',
              uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
            },
            {
              answers: [],
              datatype: 'Boolean',
              description: [],
              hiAbsolute: null,
              hiNormal: null,
              lowAbsolute: null,
              lowNormal: null,
              name: 'Pulse Abnormal',
              properties: {
                allowDecimal: null,
              },
              units: null,
              uuid: 'c36c7c98-3f10-11e4-adec-0800271c1b75',
            },
          ],
          uuid: 'c36af094-3f10-11e4-adec-0800271c1b75',
        };
        const obsGroupRecord = new ControlRecord({
          value: {},
          formFieldPath: 'obsGroupInSection.2/2-0',
          control: {
            concept: obsGroupConcept,
            controls: [
              {
                concept: {
                  answers: [],
                  datatype: 'Numeric',
                  description: [],
                  hiAbsolute: null,
                  hiNormal: 72,
                  lowAbsolute: null,
                  lowNormal: 72,
                  name: 'Pulse(/min)',
                  properties: {
                    allowDecimal: true,
                  },
                  units: '/min',
                  uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
                },
                hiAbsolute: null,
                hiNormal: 72,
                id: '3',
                label: {
                  type: 'label',
                  value: 'Pulse(/min)',
                },
                lowAbsolute: null,
                lowNormal: 72,
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
                units: '/min',
              },
              {
                concept: {
                  answers: [],
                  datatype: 'Boolean',
                  description: [],
                  hiAbsolute: null,
                  hiNormal: null,
                  lowAbsolute: null,
                  lowNormal: null,
                  name: 'Pulse Abnormal',
                  properties: {
                    allowDecimal: null,
                  },
                  units: null,
                  uuid: 'c36c7c98-3f10-11e4-adec-0800271c1b75',
                },
                hiAbsolute: null,
                hiNormal: null,
                id: '4',
                label: {
                  type: 'label',
                  value: 'Pulse Abnormal',
                },
                lowAbsolute: null,
                lowNormal: null,
                options: [
                  {
                    name: 'Yes',
                    value: true,
                  },
                  {
                    name: 'No',
                    value: false,
                  },
                ],
                properties: {
                  addMore: false,
                  hideLabel: false,
                  location: {
                    column: 0,
                    row: 1,
                  },
                  mandatory: false,
                  notes: false,
                },
                type: 'obsControl',
                units: null,
              },
            ],
            id: '2',
            label: {
              type: 'label',
              value: 'Pulse Data',
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
          dataSource: {
            abnormal: null,
            comment: null,
            concept: {
              conceptClass: 'Concept Details',
              dataType: 'N/A',
              hiNormal: null,
              lowNormal: null,
              mappings: [],
              name: 'Pulse Data',
              set: true,
              shortName: 'Pulse',
              uuid: 'c36af094-3f10-11e4-adec-0800271c1b75',
            },
            conceptNameToDisplay: 'Pulse',
            conceptSortWeight: 1,
            conceptUuid: 'c36af094-3f10-11e4-adec-0800271c1b75',
            creatorName: 'Super Man',
            duration: null,
            encounterDateTime: 1489648411000,
            encounterUuid: '708bcabf-34dd-42a8-a4fb-d3134323fe0c',
            formFieldPath: 'obsGroupInSection.2/2-0',
            formNamespace: 'Bahmni',
            groupMembers: [
              {
                abnormal: null,
                comment: null,
                concept: {
                  conceptClass: 'Misc',
                  dataType: 'Numeric',
                  hiNormal: 72,
                  lowNormal: 72,
                  mappings: [],
                  name: 'Pulse',
                  set: false,
                  shortName: 'Pulse',
                  units: '/min',
                  uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
                },
                conceptNameToDisplay: 'Pulse',
                conceptSortWeight: 2,
                conceptUuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
                creatorName: 'Super Man',
                duration: null,
                encounterDateTime: 1489648411000,
                encounterUuid: '708bcabf-34dd-42a8-a4fb-d3134323fe0c',
                formFieldPath: 'obsGroupInSection.2/3-0',
                formNamespace: 'Bahmni',
                groupMembers: [],
                hiNormal: 72,
                isAbnormal: null,
                lowNormal: 72,
                obsGroupUuid: '5cd662e4-bb94-4079-b484-a658634b4296',
                observationDateTime: '2017-03-16T12:46:56.000+0530',
                orderUuid: null,
                parentConceptUuid: null,
                providers: [
                  {
                    encounterRoleUuid: 'a0b03050-c99b-11e0-9572-0800200c9a66',
                    name: 'Super Man',
                    uuid: 'c1c26908-3f10-11e4-adec-0800271c1b75',
                  },
                ],
                targetObsRelation: null,
                type: 'Numeric',
                unknown: false,
                uuid: '16716551-94a3-4147-ab14-35ee5d6159de',
                value: 22,
                valueAsString: '22.0',
                visitStartDateTime: null,
                voidReason: null,
                voided: false,
              },
              {
                abnormal: null,
                comment: null,
                concept: {
                  conceptClass: 'Abnormal',
                  dataType: 'Boolean',
                  hiNormal: null,
                  lowNormal: null,
                  mappings: [],
                  name: 'Pulse Abnormal',
                  set: false,
                  shortName: 'Pulse Abnormal',
                  uuid: 'c36c7c98-3f10-11e4-adec-0800271c1b75',
                },
                conceptNameToDisplay: 'Pulse Abnormal',
                conceptSortWeight: 3,
                conceptUuid: 'c36c7c98-3f10-11e4-adec-0800271c1b75',
                creatorName: 'Super Man',
                duration: null,
                encounterDateTime: 1489648411000,
                encounterUuid: '708bcabf-34dd-42a8-a4fb-d3134323fe0c',
                formFieldPath: 'obsGroupInSection.2/4-0',
                formNamespace: 'Bahmni',
                groupMembers: [],
                hiNormal: null,
                isAbnormal: null,
                lowNormal: null,
                obsGroupUuid: '5cd662e4-bb94-4079-b484-a658634b4296',
                observationDateTime: '2017-03-16T12:46:56.000+0530',
                orderUuid: null,
                parentConceptUuid: null,
                providers: [
                  {
                    encounterRoleUuid: 'a0b03050-c99b-11e0-9572-0800200c9a66',
                    name: 'Super Man',
                    uuid: 'c1c26908-3f10-11e4-adec-0800271c1b75',
                  },
                ],
                targetObsRelation: null,
                type: 'Boolean',
                unknown: false,
                uuid: '4623ee7b-f499-449b-8dea-e8b65a17a47d',
                value: true,
                valueAsString: 'Yes',
                visitStartDateTime: null,
                voidReason: null,
                voided: false,
              },
            ],
            hiNormal: null,
            isAbnormal: null,
            lowNormal: null,
            obsGroupUuid: null,
            observationDateTime: '2017-03-16T12:46:56.000+0530',
            orderUuid: null,
            parentConceptUuid: null,
            providers: [
              {
                encounterRoleUuid: 'a0b03050-c99b-11e0-9572-0800200c9a66',
                name: 'Super Man',
                uuid: 'c1c26908-3f10-11e4-adec-0800271c1b75',
              },
            ],
            targetObsRelation: null,
            type: null,
            unknown: false,
            uuid: '5cd662e4-bb94-4079-b484-a658634b4296',
            value: '22.0, true',
            valueAsString: '22.0, true',
            visitStartDateTime: null,
            voidReason: null,
            voided: false,
          },
        });

        const removedFormFieldPath = 'obsGroupInSection.2/2-1';
        const removedObsGroupRecord = new ControlRecord({
          value: {},
          formFieldPath: removedFormFieldPath,
          control: {
            concept: obsGroupConcept,
            controls: [
              {
                concept: {
                  answers: [],
                  datatype: 'Numeric',
                  description: [],
                  hiAbsolute: null,
                  hiNormal: 72,
                  lowAbsolute: null,
                  lowNormal: 72,
                  name: 'Pulse(/min)',
                  properties: {
                    allowDecimal: true,
                  },
                  units: '/min',
                  uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
                },
                hiAbsolute: null,
                hiNormal: 72,
                id: '3',
                label: {
                  type: 'label',
                  value: 'Pulse(/min)',
                },
                lowAbsolute: null,
                lowNormal: 72,
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
                units: '/min',
              },
              {
                concept: {
                  answers: [],
                  datatype: 'Boolean',
                  description: [],
                  hiAbsolute: null,
                  hiNormal: null,
                  lowAbsolute: null,
                  lowNormal: null,
                  name: 'Pulse Abnormal',
                  properties: {
                    allowDecimal: null,
                  },
                  units: null,
                  uuid: 'c36c7c98-3f10-11e4-adec-0800271c1b75',
                },
                hiAbsolute: null,
                hiNormal: null,
                id: '4',
                label: {
                  type: 'label',
                  value: 'Pulse Abnormal',
                },
                lowAbsolute: null,
                lowNormal: null,
                options: [
                  {
                    name: 'Yes',
                    value: true,
                  },
                  {
                    name: 'No',
                    value: false,
                  },
                ],
                properties: {
                  addMore: false,
                  hideLabel: false,
                  location: {
                    column: 0,
                    row: 1,
                  },
                  mandatory: false,
                  notes: false,
                },
                type: 'obsControl',
                units: null,
              },
            ],
            id: '2',
            label: {
              type: 'label',
              value: 'Pulse Data',
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
          dataSource: {
            abnormal: null,
            comment: null,
            concept: {
              conceptClass: 'Concept Details',
              dataType: 'N/A',
              hiNormal: null,
              lowNormal: null,
              mappings: [],
              name: 'Pulse Data',
              set: true,
              shortName: 'Pulse',
              uuid: 'c36af094-3f10-11e4-adec-0800271c1b75',
            },
            conceptNameToDisplay: 'Pulse',
            conceptSortWeight: 1,
            conceptUuid: 'c36af094-3f10-11e4-adec-0800271c1b75',
            creatorName: 'Super Man',
            duration: null,
            encounterDateTime: 1489648411000,
            encounterUuid: '708bcabf-34dd-42a8-a4fb-d3134323fe0c',
            formFieldPath: removedFormFieldPath,
            formNamespace: 'Bahmni',
            groupMembers: [
              {
                abnormal: null,
                comment: null,
                concept: {
                  conceptClass: 'Misc',
                  dataType: 'Numeric',
                  hiNormal: 72,
                  lowNormal: 72,
                  mappings: [],
                  name: 'Pulse',
                  set: false,
                  shortName: 'Pulse',
                  units: '/min',
                  uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
                },
                conceptNameToDisplay: 'Pulse',
                conceptSortWeight: 2,
                conceptUuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
                creatorName: 'Super Man',
                duration: null,
                encounterDateTime: 1489648411000,
                encounterUuid: '708bcabf-34dd-42a8-a4fb-d3134323fe0c',
                formFieldPath: 'obsGroupInSection.2/3-1',
                formNamespace: 'Bahmni',
                groupMembers: [],
                hiNormal: 72,
                isAbnormal: null,
                lowNormal: 72,
                obsGroupUuid: '34c86574-42b3-488d-9616-69408eb2796e',
                observationDateTime: '2017-03-16T12:46:56.000+0530',
                orderUuid: null,
                parentConceptUuid: null,
                providers: [
                  {
                    encounterRoleUuid: 'a0b03050-c99b-11e0-9572-0800200c9a66',
                    name: 'Super Man',
                    uuid: 'c1c26908-3f10-11e4-adec-0800271c1b75',
                  },
                ],
                targetObsRelation: null,
                type: 'Numeric',
                unknown: false,
                uuid: 'b43fdbb9-fe4c-47b7-9049-81041aa3ee3a',
                value: 33,
                valueAsString: '33.0',
                visitStartDateTime: null,
                voidReason: null,
                voided: false,
              },
              {
                abnormal: null,
                comment: null,
                concept: {
                  conceptClass: 'Abnormal',
                  dataType: 'Boolean',
                  hiNormal: null,
                  lowNormal: null,
                  mappings: [],
                  name: 'Pulse Abnormal',
                  set: false,
                  shortName: 'Pulse Abnormal',
                  uuid: 'c36c7c98-3f10-11e4-adec-0800271c1b75',
                },
                conceptNameToDisplay: 'Pulse Abnormal',
                conceptSortWeight: 3,
                conceptUuid: 'c36c7c98-3f10-11e4-adec-0800271c1b75',
                creatorName: 'Super Man',
                duration: null,
                encounterDateTime: 1489648411000,
                encounterUuid: '708bcabf-34dd-42a8-a4fb-d3134323fe0c',
                formFieldPath: 'obsGroupInSection.2/4-1',
                formNamespace: 'Bahmni',
                groupMembers: [],
                hiNormal: null,
                isAbnormal: null,
                lowNormal: null,
                obsGroupUuid: '34c86574-42b3-488d-9616-69408eb2796e',
                observationDateTime: '2017-03-16T12:46:56.000+0530',
                orderUuid: null,
                parentConceptUuid: null,
                providers: [
                  {
                    encounterRoleUuid: 'a0b03050-c99b-11e0-9572-0800200c9a66',
                    name: 'Super Man',
                    uuid: 'c1c26908-3f10-11e4-adec-0800271c1b75',
                  },
                ],
                targetObsRelation: null,
                type: 'Boolean',
                unknown: false,
                uuid: 'b55dab85-8987-4199-94af-73a0f3aa3c5d',
                value: false,
                valueAsString: 'No',
                visitStartDateTime: null,
                voidReason: null,
                voided: false,
              },
            ],
            hiNormal: null,
            isAbnormal: null,
            lowNormal: null,
            obsGroupUuid: null,
            observationDateTime: '2017-03-16T12:46:56.000+0530',
            orderUuid: null,
            parentConceptUuid: null,
            providers: [
              {
                encounterRoleUuid: 'a0b03050-c99b-11e0-9572-0800200c9a66',
                name: 'Super Man',
                uuid: 'c1c26908-3f10-11e4-adec-0800271c1b75',
              },
            ],
            targetObsRelation: null,
            type: null,
            unknown: false,
            uuid: '34c86574-42b3-488d-9616-69408eb2796e',
            value: 'false, 33.0',
            valueAsString: 'false, 33.0',
            visitStartDateTime: null,
            voidReason: null,
            voided: false,
          },
        });
        const concept = {
          datatype: 'N/A',
          name: 'Pulse Data',
          set: true,
          setMembers: [
            {
              answers: [],
              datatype: 'Numeric',
              description: [],
              hiAbsolute: null,
              hiNormal: 72,
              lowAbsolute: null,
              lowNormal: 72,
              name: 'Pulse(/min)',
              properties: {
                allowDecimal: true,
              },
              units: '/min',
              uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
            },
            {
              answers: [],
              datatype: 'Boolean',
              description: [],
              hiAbsolute: null,
              hiNormal: null,
              lowAbsolute: null,
              lowNormal: null,
              name: 'Pulse Abnormal',
              properties: {
                allowDecimal: null,
              },
              units: null,
              uuid: 'c36c7c98-3f10-11e4-adec-0800271c1b75',
            },
          ],
          uuid: 'c36af094-3f10-11e4-adec-0800271c1b75',
        };
        const sectionRecord = new ControlRecord({
          value: {},
          formFieldPath: 'obsGroupInSection.2/1-0',
          control: {
            controls: [
              {
                concept,
                controls: [
                  {
                    concept: {
                      answers: [],
                      datatype: 'Numeric',
                      description: [],
                      hiAbsolute: null,
                      hiNormal: 72,
                      lowAbsolute: null,
                      lowNormal: 72,
                      name: 'Pulse(/min)',
                      properties: {
                        allowDecimal: true,
                      },
                      units: '/min',
                      uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
                    },
                    hiAbsolute: null,
                    hiNormal: 72,
                    id: '3',
                    label: {
                      type: 'label',
                      value: 'Pulse(/min)',
                    },
                    lowAbsolute: null,
                    lowNormal: 72,
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
                    units: '/min',
                  },
                  {
                    concept: {
                      answers: [],
                      datatype: 'Boolean',
                      description: [],
                      hiAbsolute: null,
                      hiNormal: null,
                      lowAbsolute: null,
                      lowNormal: null,
                      name: 'Pulse Abnormal',
                      properties: {
                        allowDecimal: null,
                      },
                      units: null,
                      uuid: 'c36c7c98-3f10-11e4-adec-0800271c1b75',
                    },
                    hiAbsolute: null,
                    hiNormal: null,
                    id: '4',
                    label: {
                      type: 'label',
                      value: 'Pulse Abnormal',
                    },
                    lowAbsolute: null,
                    lowNormal: null,
                    options: [
                      {
                        name: 'Yes',
                        value: true,
                      },
                      {
                        name: 'No',
                        value: false,
                      },
                    ],
                    properties: {
                      addMore: false,
                      hideLabel: false,
                      location: {
                        column: 0,
                        row: 1,
                      },
                      mandatory: false,
                      notes: false,
                    },
                    type: 'obsControl',
                    units: null,
                  },
                ],
                id: '2',
                label: {
                  type: 'label',
                  value: 'Pulse Data',
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
            id: '1',
            label: {
              type: 'label',
              value: 'Section',
            },
            properties: {
              location: {
                column: 0,
                row: 0,
              },
            },
            type: 'section',
          },
          dataSource: {
            formFieldPath: 'obsGroupInSection.2/1-0',
            obsList: [
              {
                abnormal: null,
                comment: null,
                concept: {
                  conceptClass: 'Concept Details',
                  dataType: 'N/A',
                  hiNormal: null,
                  lowNormal: null,
                  mappings: [],
                  name: 'Pulse Data',
                  set: true,
                  shortName: 'Pulse',
                  uuid: 'c36af094-3f10-11e4-adec-0800271c1b75',
                },
                conceptNameToDisplay: 'Pulse',
                conceptSortWeight: 1,
                conceptUuid: 'c36af094-3f10-11e4-adec-0800271c1b75',
                creatorName: 'Super Man',
                duration: null,
                encounterDateTime: 1489654263000,
                encounterUuid: 'f9cda4a7-e7dd-418f-a14d-1cc99e18da83',
                formFieldPath: 'obsGroupInSection.2/2-1',
                formNamespace: 'Bahmni',
                groupMembers: [
                  {
                    abnormal: null,
                    comment: null,
                    concept: {
                      conceptClass: 'Misc',
                      dataType: 'Numeric',
                      hiNormal: 72,
                      lowNormal: 72,
                      mappings: [],
                      name: 'Pulse',
                      set: false,
                      shortName: 'Pulse',
                      units: '/min',
                      uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
                    },
                    conceptNameToDisplay: 'Pulse',
                    conceptSortWeight: 2,
                    conceptUuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
                    creatorName: 'Super Man',
                    duration: null,
                    encounterDateTime: 1489654263000,
                    encounterUuid: 'f9cda4a7-e7dd-418f-a14d-1cc99e18da83',
                    formFieldPath: 'obsGroupInSection.2/3-1',
                    formNamespace: 'Bahmni',
                    groupMembers: [],
                    hiNormal: 72,
                    isAbnormal: null,
                    lowNormal: 72,
                    obsGroupUuid: '79537135-d445-40dc-8174-63f9ebd4d9d5',
                    observationDateTime: '2017-03-16T14:21:03.000+0530',
                    orderUuid: null,
                    parentConceptUuid: null,
                    providers: [
                      {
                        encounterRoleUuid: 'a0b03050-c99b-11e0-9572-0800200c9a66',
                        name: 'Super Man',
                        uuid: 'c1c26908-3f10-11e4-adec-0800271c1b75',
                      },
                    ],
                    targetObsRelation: null,
                    type: 'Numeric',
                    unknown: false,
                    uuid: '036269eb-b5da-4f2b-b5da-87fa84b50a8e',
                    value: 453,
                    valueAsString: '453.0',
                    visitStartDateTime: null,
                    voidReason: null,
                    voided: false,
                  },
                  {
                    abnormal: null,
                    comment: null,
                    concept: {
                      conceptClass: 'Abnormal',
                      dataType: 'Boolean',
                      hiNormal: null,
                      lowNormal: null,
                      mappings: [],
                      name: 'Pulse Abnormal',
                      set: false,
                      shortName: 'Pulse Abnormal',
                      uuid: 'c36c7c98-3f10-11e4-adec-0800271c1b75',
                    },
                    conceptNameToDisplay: 'Pulse Abnormal',
                    conceptSortWeight: 3,
                    conceptUuid: 'c36c7c98-3f10-11e4-adec-0800271c1b75',
                    creatorName: 'Super Man',
                    duration: null,
                    encounterDateTime: 1489654263000,
                    encounterUuid: 'f9cda4a7-e7dd-418f-a14d-1cc99e18da83',
                    formFieldPath: 'obsGroupInSection.2/4-1',
                    formNamespace: 'Bahmni',
                    groupMembers: [],
                    hiNormal: null,
                    isAbnormal: null,
                    lowNormal: null,
                    obsGroupUuid: '79537135-d445-40dc-8174-63f9ebd4d9d5',
                    observationDateTime: '2017-03-16T14:21:03.000+0530',
                    orderUuid: null,
                    parentConceptUuid: null,
                    providers: [
                      {
                        encounterRoleUuid: 'a0b03050-c99b-11e0-9572-0800200c9a66',
                        name: 'Super Man',
                        uuid: 'c1c26908-3f10-11e4-adec-0800271c1b75',
                      },
                    ],
                    targetObsRelation: null,
                    type: 'Boolean',
                    unknown: false,
                    uuid: '022f2ffa-53fd-4170-a250-aaf8bf3eac69',
                    value: true,
                    valueAsString: 'Yes',
                    visitStartDateTime: null,
                    voidReason: null,
                    voided: false,
                  },
                ],
                hiNormal: null,
                isAbnormal: null,
                lowNormal: null,
                obsGroupUuid: null,
                observationDateTime: '2017-03-16T14:21:03.000+0530',
                orderUuid: null,
                parentConceptUuid: null,
                providers: [
                  {
                    encounterRoleUuid: 'a0b03050-c99b-11e0-9572-0800200c9a66',
                    name: 'Super Man',
                    uuid: 'c1c26908-3f10-11e4-adec-0800271c1b75',
                  },
                ],
                targetObsRelation: null,
                type: null,
                unknown: false,
                uuid: '79537135-d445-40dc-8174-63f9ebd4d9d5',
                value: 'true, 453.0',
                valueAsString: 'true, 453.0',
                visitStartDateTime: null,
                voidReason: null,
                voided: false,
              },
              {
                abnormal: null,
                comment: null,
                concept: {
                  conceptClass: 'Concept Details',
                  dataType: 'N/A',
                  hiNormal: null,
                  lowNormal: null,
                  mappings: [],
                  name: 'Pulse Data',
                  set: true,
                  shortName: 'Pulse',
                  uuid: 'c36af094-3f10-11e4-adec-0800271c1b75',
                },
                conceptNameToDisplay: 'Pulse',
                conceptSortWeight: 1,
                conceptUuid: 'c36af094-3f10-11e4-adec-0800271c1b75',
                creatorName: 'Super Man',
                duration: null,
                encounterDateTime: 1489654263000,
                encounterUuid: 'f9cda4a7-e7dd-418f-a14d-1cc99e18da83',
                formFieldPath: 'obsGroupInSection.2/2-0',
                formNamespace: 'Bahmni',
                groupMembers: [
                  {
                    abnormal: null,
                    comment: null,
                    concept: {
                      conceptClass: 'Misc',
                      dataType: 'Numeric',
                      hiNormal: 72,
                      lowNormal: 72,
                      mappings: [],
                      name: 'Pulse',
                      set: false,
                      shortName: 'Pulse',
                      units: '/min',
                      uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
                    },
                    conceptNameToDisplay: 'Pulse',
                    conceptSortWeight: 2,
                    conceptUuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
                    creatorName: 'Super Man',
                    duration: null,
                    encounterDateTime: 1489654263000,
                    encounterUuid: 'f9cda4a7-e7dd-418f-a14d-1cc99e18da83',
                    formFieldPath: 'obsGroupInSection.2/3-0',
                    formNamespace: 'Bahmni',
                    groupMembers: [],
                    hiNormal: 72,
                    isAbnormal: null,
                    lowNormal: 72,
                    obsGroupUuid: '3e57d387-2f30-40ea-ac54-7c21d432ce68',
                    observationDateTime: '2017-03-16T14:21:03.000+0530',
                    orderUuid: null,
                    parentConceptUuid: null,
                    providers: [
                      {
                        encounterRoleUuid: 'a0b03050-c99b-11e0-9572-0800200c9a66',
                        name: 'Super Man',
                        uuid: 'c1c26908-3f10-11e4-adec-0800271c1b75',
                      },
                    ],
                    targetObsRelation: null,
                    type: 'Numeric',
                    unknown: false,
                    uuid: '8dcd50e7-edb8-417d-b47f-902c20abf892',
                    value: 23,
                    valueAsString: '23.0',
                    visitStartDateTime: null,
                    voidReason: null,
                    voided: false,
                  },
                  {
                    abnormal: null,
                    comment: null,
                    concept: {
                      conceptClass: 'Abnormal',
                      dataType: 'Boolean',
                      hiNormal: null,
                      lowNormal: null,
                      mappings: [],
                      name: 'Pulse Abnormal',
                      set: false,
                      shortName: 'Pulse Abnormal',
                      uuid: 'c36c7c98-3f10-11e4-adec-0800271c1b75',
                    },
                    conceptNameToDisplay: 'Pulse Abnormal',
                    conceptSortWeight: 3,
                    conceptUuid: 'c36c7c98-3f10-11e4-adec-0800271c1b75',
                    creatorName: 'Super Man',
                    duration: null,
                    encounterDateTime: 1489654263000,
                    encounterUuid: 'f9cda4a7-e7dd-418f-a14d-1cc99e18da83',
                    formFieldPath: 'obsGroupInSection.2/4-0',
                    formNamespace: 'Bahmni',
                    groupMembers: [],
                    hiNormal: null,
                    isAbnormal: null,
                    lowNormal: null,
                    obsGroupUuid: '3e57d387-2f30-40ea-ac54-7c21d432ce68',
                    observationDateTime: '2017-03-16T14:21:03.000+0530',
                    orderUuid: null,
                    parentConceptUuid: null,
                    providers: [
                      {
                        encounterRoleUuid: 'a0b03050-c99b-11e0-9572-0800200c9a66',
                        name: 'Super Man',
                        uuid: 'c1c26908-3f10-11e4-adec-0800271c1b75',
                      },
                    ],
                    targetObsRelation: null,
                    type: 'Boolean',
                    unknown: false,
                    uuid: 'c96ff35e-1e19-4313-853f-d9370f6303ed',
                    value: true,
                    valueAsString: 'Yes',
                    visitStartDateTime: null,
                    voidReason: null,
                    voided: false,
                  },
                ],
                hiNormal: null,
                isAbnormal: null,
                lowNormal: null,
                obsGroupUuid: null,
                observationDateTime: '2017-03-16T14:21:03.000+0530',
                orderUuid: null,
                parentConceptUuid: null,
                providers: [
                  {
                    encounterRoleUuid: 'a0b03050-c99b-11e0-9572-0800200c9a66',
                    name: 'Super Man',
                    uuid: 'c1c26908-3f10-11e4-adec-0800271c1b75',
                  },
                ],
                targetObsRelation: null,
                type: null,
                unknown: false,
                uuid: '3e57d387-2f30-40ea-ac54-7c21d432ce68',
                value: 'true, 23.0',
                valueAsString: 'true, 23.0',
                visitStartDateTime: null,
                voidReason: null,
                voided: false,
              },
            ],
          },
          children: List.of(obsGroupRecord, removedObsGroupRecord),
        });
        const rootTree = new ControlRecord({ children: List.of(sectionRecord) });
        const wrapper = mount(
                   <Container
                     collapse
                     locale="en"
                     metadata={metadata}
                     observations={[]}
                     patient={patient}
                     translations={translations}
                     validate={false}
                     validateForm={false}
                   />
               );
        wrapper.setState({ data: rootTree });
        wrapper.instance().onControlRemove(removedFormFieldPath);

        const updatedRootTree = wrapper.state().data;
        const sectionGroupTree = updatedRootTree.children.get(0);
        expect(sectionGroupTree.children.get(0).active).to.equal(true);
        expect(sectionGroupTree.children.get(1).active).to.equal(false);
        expect(sectionGroupTree.children.get(1).formFieldPath).to.equal(removedFormFieldPath);
      });
    });

    describe('obsGroupInObsGroup', () => {
      it('should add one obs group when onControlAdd ' +
          'is triggered with obs group in obs group', () => {
        const concept = {
          datatype: 'N/A',
          name: 'Pulse Data',
          set: true,
          setMembers: [
            {
              datatype: 'N/A',
              name: 'testObsGroupConcept',
              set: true,
              setMembers: [
                {
                  answers: [],
                  datatype: 'Numeric',
                  description: [],
                  hiAbsolute: null,
                  hiNormal: null,
                  lowAbsolute: null,
                  lowNormal: null,
                  name: 'WEIGHT',
                  properties: {
                    allowDecimal: false,
                  },
                  units: null,
                  uuid: '5089AAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                },
              ],
              uuid: 'dbf61fc7-2371-423b-9832-18c5659d41a0',
            },
          ],
          uuid: 'c36af094-3f10-11e4-adec-0800271c1b75',
        };

        const obsGroupInGroupConcept = {
          datatype: 'N/A',
          name: 'testObsGroupConcept',
          set: true,
          setMembers: [
            {
              answers: [],
              datatype: 'Numeric',
              description: [],
              hiAbsolute: null,
              hiNormal: null,
              lowAbsolute: null,
              lowNormal: null,
              name: 'WEIGHT',
              properties: {
                allowDecimal: false,
              },
              units: null,
              uuid: '5089AAAAAAAAAAAAAAAAAAAAAAAAAAAA',
            },
          ],
          uuid: 'dbf61fc7-2371-423b-9832-18c5659d41a0',
        };
        const addFormFieldPath = '88.1/3-0';
        const obsGroupInGroupRecord = new ControlRecord({
          value: {},
          formFieldPath: addFormFieldPath,
          control: {
            concept: obsGroupInGroupConcept,
            controls: [
              {
                concept: {
                  answers: [],
                  datatype: 'Numeric',
                  description: [],
                  hiAbsolute: null,
                  hiNormal: null,
                  lowAbsolute: null,
                  lowNormal: null,
                  name: 'WEIGHT',
                  properties: {
                    allowDecimal: false,
                  },
                  units: null,
                  uuid: '5089AAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                },
                hiAbsolute: null,
                hiNormal: null,
                id: '2',
                label: {
                  type: 'label',
                  value: 'WEIGHT',
                },
                lowAbsolute: null,
                lowNormal: null,
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
                units: null,
              },
            ],
            id: '3',
            label: {
              type: 'label',
              value: 'testObsGroupConcept',
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
          dataSource: {
            concept: obsGroupInGroupConcept,
            formFieldPath: addFormFieldPath,
            formNamespace: 'Bahmni',
            voided: true,
          },
        });
        const obsGroupRecord = new ControlRecord({
          value: {},
          formFieldPath: '88.1/1-0',
          control: {
            concept,
            controls: [
              {
                concept: {
                  datatype: 'N/A',
                  name: 'testObsGroupConcept',
                  set: true,
                  setMembers: [
                    {
                      answers: [],
                      datatype: 'Numeric',
                      description: [],
                      hiAbsolute: null,
                      hiNormal: null,
                      lowAbsolute: null,
                      lowNormal: null,
                      name: 'WEIGHT',
                      properties: {
                        allowDecimal: false,
                      },
                      units: null,
                      uuid: '5089AAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                    },
                  ],
                  uuid: 'dbf61fc7-2371-423b-9832-18c5659d41a0',
                },
                controls: [
                  {
                    concept: {
                      answers: [],
                      datatype: 'Numeric',
                      description: [],
                      hiAbsolute: null,
                      hiNormal: null,
                      lowAbsolute: null,
                      lowNormal: null,
                      name: 'WEIGHT',
                      properties: {
                        allowDecimal: false,
                      },
                      units: null,
                      uuid: '5089AAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                    },
                    hiAbsolute: null,
                    hiNormal: null,
                    id: '2',
                    label: {
                      type: 'label',
                      value: 'WEIGHT',
                    },
                    lowAbsolute: null,
                    lowNormal: null,
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
                    units: null,
                  },
                ],
                id: '3',
                label: {
                  type: 'label',
                  value: 'testObsGroupConcept',
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
            id: '1',
            label: {
              type: 'label',
              value: 'Pulse Data',
            },
            properties: {
              abnormal: false,
              addMore: false,
              location: {
                column: 0,
                row: 0,
              },
            },
            type: 'obsGroupControl',
          },
          dataSource: {
            concept,
            formFieldPath: '88.1/1-0',
            formNamespace: 'Bahmni',
            voided: true,
          },
          children: List.of(obsGroupInGroupRecord),
        });
        const rootTree = new ControlRecord({ children: List.of(obsGroupRecord) });
        const wrapper = mount(
                   <Container
                     collapse
                     locale="en"
                     metadata={metadata}
                     observations={[]}
                     patient={patient}
                     translations={translations}
                     validate={false}
                     validateForm={false}
                   />
               );
        wrapper.setState({ data: rootTree });
        wrapper.instance().onControlAdd(addFormFieldPath);

        const updatedRootTree = wrapper.state().data;
        const obsGroupTree = updatedRootTree.children.get(0);

        expect(obsGroupTree.children.size).to.equal(2);
      });

      it('should remove one obs group when onControlRemove ' +
          'is triggered with obs group in obs group', () => {
        const concept = {
          datatype: 'N/A',
          name: 'Pulse Data',
          set: true,
          setMembers: [
            {
              datatype: 'N/A',
              name: 'testObsGroupConcept',
              set: true,
              setMembers: [
                {
                  answers: [],
                  datatype: 'Numeric',
                  description: [],
                  hiAbsolute: null,
                  hiNormal: null,
                  lowAbsolute: null,
                  lowNormal: null,
                  name: 'WEIGHT',
                  properties: {
                    allowDecimal: false,
                  },
                  units: null,
                  uuid: '5089AAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                },
              ],
              uuid: 'dbf61fc7-2371-423b-9832-18c5659d41a0',
            },
          ],
          uuid: 'c36af094-3f10-11e4-adec-0800271c1b75',
        };
        const obsGroupConcept = {
          datatype: 'N/A',
          name: 'testObsGroupConcept',
          set: true,
          setMembers: [
            {
              answers: [],
              datatype: 'Numeric',
              description: [],
              hiAbsolute: null,
              hiNormal: null,
              lowAbsolute: null,
              lowNormal: null,
              name: 'WEIGHT',
              properties: {
                allowDecimal: false,
              },
              units: null,
              uuid: '5089AAAAAAAAAAAAAAAAAAAAAAAAAAAA',
            },
          ],
          uuid: 'dbf61fc7-2371-423b-9832-18c5659d41a0',
        };
        const obsGroupRecordOne = new ControlRecord({
          value: {},
          formFieldPath: '88.1/3-1',
          control: {
            concept: obsGroupConcept,
            controls: [
              {
                concept: {
                  answers: [],
                  datatype: 'Numeric',
                  description: [],
                  hiAbsolute: null,
                  hiNormal: null,
                  lowAbsolute: null,
                  lowNormal: null,
                  name: 'WEIGHT',
                  properties: {
                    allowDecimal: false,
                  },
                  units: null,
                  uuid: '5089AAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                },
                hiAbsolute: null,
                hiNormal: null,
                id: '2',
                label: {
                  type: 'label',
                  value: 'WEIGHT',
                },
                lowAbsolute: null,
                lowNormal: null,
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
                units: null,
              },
            ],
            id: '3',
            label: {
              type: 'label',
              value: 'testObsGroupConcept',
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
          dataSource: {
            abnormal: null,
            comment: null,
            concept: {
              conceptClass: 'Concept Details',
              dataType: 'N/A',
              hiNormal: null,
              lowNormal: null,
              mappings: [],
              name: 'testObsGroupConcept',
              set: true,
              shortName: 'testObsGroup',
              uuid: 'dbf61fc7-2371-423b-9832-18c5659d41a0',
            },
            conceptNameToDisplay: 'testObsGroup',
            conceptSortWeight: 2,
            conceptUuid: 'dbf61fc7-2371-423b-9832-18c5659d41a0',
            creatorName: 'Super Man',
            duration: null,
            encounterDateTime: 1489919402000,
            encounterUuid: '0cf221ee-323b-4dc9-b62a-4ea7491b58f6',
            formFieldPath: '88.1/3-1',
            formNamespace: 'Bahmni',
            groupMembers: [
              {
                abnormal: null,
                comment: null,
                concept: {
                  conceptClass: 'Misc',
                  dataType: 'Numeric',
                  hiNormal: null,
                  lowNormal: null,
                  mappings: [],
                  name: 'WEIGHT',
                  set: false,
                  shortName: 'WEIGHT',
                  uuid: '5089AAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                },
                conceptNameToDisplay: 'WEIGHT',
                conceptSortWeight: 3,
                conceptUuid: '5089AAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                creatorName: 'Super Man',
                duration: null,
                encounterDateTime: 1489919402000,
                encounterUuid: '0cf221ee-323b-4dc9-b62a-4ea7491b58f6',
                formFieldPath: '88.1/2-1',
                formNamespace: 'Bahmni',
                groupMembers: [],
                hiNormal: null,
                isAbnormal: null,
                lowNormal: null,
                obsGroupUuid: 'ae693dfb-f950-4694-a9c7-a8cf5694d19d',
                observationDateTime: '2017-03-19T16:00:02.000+0530',
                orderUuid: null,
                parentConceptUuid: null,
                providers: [
                  {
                    encounterRoleUuid: 'a0b03050-c99b-11e0-9572-0800200c9a66',
                    name: 'Super Man',
                    uuid: 'c1c26908-3f10-11e4-adec-0800271c1b75',
                  },
                ],
                targetObsRelation: null,
                type: 'Numeric',
                unknown: false,
                uuid: '11f9ee1a-0803-4625-9bd0-4c0d119c952a',
                value: 44,
                valueAsString: '44.0',
                visitStartDateTime: null,
                voidReason: null,
                voided: false,
              },
            ],
            hiNormal: null,
            isAbnormal: null,
            lowNormal: null,
            obsGroupUuid: '2feb6b69-daee-4f7a-870c-a1df7acc12ba',
            observationDateTime: '2017-03-19T16:00:02.000+0530',
            orderUuid: null,
            parentConceptUuid: null,
            providers: [
              {
                encounterRoleUuid: 'a0b03050-c99b-11e0-9572-0800200c9a66',
                name: 'Super Man',
                uuid: 'c1c26908-3f10-11e4-adec-0800271c1b75',
              },
            ],
            targetObsRelation: null,
            type: null,
            unknown: false,
            uuid: 'ae693dfb-f950-4694-a9c7-a8cf5694d19d',
            value: '44.0',
            valueAsString: '44.0',
            visitStartDateTime: null,
            voidReason: null,
            voided: false,
          },
        });
        const removeFormFieldPath = '88.1/3-0';
        const removeObsGroupRecord = new ControlRecord({
          value: {},
          formFieldPath: removeFormFieldPath,
          control: {
            concept: obsGroupConcept,
            controls: [
              {
                concept: {
                  answers: [],
                  datatype: 'Numeric',
                  description: [],
                  hiAbsolute: null,
                  hiNormal: null,
                  lowAbsolute: null,
                  lowNormal: null,
                  name: 'WEIGHT',
                  properties: {
                    allowDecimal: false,
                  },
                  units: null,
                  uuid: '5089AAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                },
                hiAbsolute: null,
                hiNormal: null,
                id: '2',
                label: {
                  type: 'label',
                  value: 'WEIGHT',
                },
                lowAbsolute: null,
                lowNormal: null,
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
                units: null,
              },
            ],
            id: '3',
            label: {
              type: 'label',
              value: 'testObsGroupConcept',
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
          dataSource: {
            abnormal: null,
            comment: null,
            concept: {
              conceptClass: 'Concept Details',
              dataType: 'N/A',
              hiNormal: null,
              lowNormal: null,
              mappings: [],
              name: 'testObsGroupConcept',
              set: true,
              shortName: 'testObsGroup',
              uuid: 'dbf61fc7-2371-423b-9832-18c5659d41a0',
            },
            conceptNameToDisplay: 'testObsGroup',
            conceptSortWeight: 2,
            conceptUuid: 'dbf61fc7-2371-423b-9832-18c5659d41a0',
            creatorName: 'Super Man',
            duration: null,
            encounterDateTime: 1489919402000,
            encounterUuid: '0cf221ee-323b-4dc9-b62a-4ea7491b58f6',
            formFieldPath: removeFormFieldPath,
            formNamespace: 'Bahmni',
            groupMembers: [
              {
                abnormal: null,
                comment: null,
                concept: {
                  conceptClass: 'Misc',
                  dataType: 'Numeric',
                  hiNormal: null,
                  lowNormal: null,
                  mappings: [],
                  name: 'WEIGHT',
                  set: false,
                  shortName: 'WEIGHT',
                  uuid: '5089AAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                },
                conceptNameToDisplay: 'WEIGHT',
                conceptSortWeight: 3,
                conceptUuid: '5089AAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                creatorName: 'Super Man',
                duration: null,
                encounterDateTime: 1489919402000,
                encounterUuid: '0cf221ee-323b-4dc9-b62a-4ea7491b58f6',
                formFieldPath: '88.1/2-0',
                formNamespace: 'Bahmni',
                groupMembers: [],
                hiNormal: null,
                isAbnormal: null,
                lowNormal: null,
                obsGroupUuid: '59acaf73-16ae-447d-bf72-a1bfd8374dd5',
                observationDateTime: '2017-03-19T16:00:02.000+0530',
                orderUuid: null,
                parentConceptUuid: null,
                providers: [
                  {
                    encounterRoleUuid: 'a0b03050-c99b-11e0-9572-0800200c9a66',
                    name: 'Super Man',
                    uuid: 'c1c26908-3f10-11e4-adec-0800271c1b75',
                  },
                ],
                targetObsRelation: null,
                type: 'Numeric',
                unknown: false,
                uuid: '1a3e3fc7-b6e1-4c4c-ad4b-8f02c443c6a7',
                value: 33,
                valueAsString: '33.0',
                visitStartDateTime: null,
                voidReason: null,
                voided: false,
              },
            ],
            hiNormal: null,
            isAbnormal: null,
            lowNormal: null,
            obsGroupUuid: '2feb6b69-daee-4f7a-870c-a1df7acc12ba',
            observationDateTime: '2017-03-19T16:00:02.000+0530',
            orderUuid: null,
            parentConceptUuid: null,
            providers: [
              {
                encounterRoleUuid: 'a0b03050-c99b-11e0-9572-0800200c9a66',
                name: 'Super Man',
                uuid: 'c1c26908-3f10-11e4-adec-0800271c1b75',
              },
            ],
            targetObsRelation: null,
            type: null,
            unknown: false,
            uuid: '59acaf73-16ae-447d-bf72-a1bfd8374dd5',
            value: '33.0',
            valueAsString: '33.0',
            visitStartDateTime: null,
            voidReason: null,
            voided: false,
          },
        });
        const obsGroupRecord = new ControlRecord({
          value: {},
          formFieldPath: '88.1/1-0',
          control: {
            concept,
            controls: [
              {
                concept: {
                  datatype: 'N/A',
                  name: 'testObsGroupConcept',
                  set: true,
                  setMembers: [
                    {
                      answers: [],
                      datatype: 'Numeric',
                      description: [],
                      hiAbsolute: null,
                      hiNormal: null,
                      lowAbsolute: null,
                      lowNormal: null,
                      name: 'WEIGHT',
                      properties: {
                        allowDecimal: false,
                      },
                      units: null,
                      uuid: '5089AAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                    },
                  ],
                  uuid: 'dbf61fc7-2371-423b-9832-18c5659d41a0',
                },
                controls: [
                  {
                    concept: {
                      answers: [],
                      datatype: 'Numeric',
                      description: [],
                      hiAbsolute: null,
                      hiNormal: null,
                      lowAbsolute: null,
                      lowNormal: null,
                      name: 'WEIGHT',
                      properties: {
                        allowDecimal: false,
                      },
                      units: null,
                      uuid: '5089AAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                    },
                    hiAbsolute: null,
                    hiNormal: null,
                    id: '2',
                    label: {
                      type: 'label',
                      value: 'WEIGHT',
                    },
                    lowAbsolute: null,
                    lowNormal: null,
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
                    units: null,
                  },
                ],
                id: '3',
                label: {
                  type: 'label',
                  value: 'testObsGroupConcept',
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
            id: '1',
            label: {
              type: 'label',
              value: 'Pulse Data',
            },
            properties: {
              abnormal: false,
              addMore: false,
              location: {
                column: 0,
                row: 0,
              },
            },
            type: 'obsGroupControl',
          },
          dataSource: {
            abnormal: null,
            comment: null,
            concept: {
              conceptClass: 'Concept Details',
              dataType: 'N/A',
              hiNormal: null,
              lowNormal: null,
              mappings: [],
              name: 'Pulse Data',
              set: true,
              shortName: 'Pulse',
              uuid: 'c36af094-3f10-11e4-adec-0800271c1b75',
            },
            conceptNameToDisplay: 'Pulse',
            conceptSortWeight: 1,
            conceptUuid: 'c36af094-3f10-11e4-adec-0800271c1b75',
            creatorName: 'Super Man',
            duration: null,
            encounterDateTime: 1489919402000,
            encounterUuid: '0cf221ee-323b-4dc9-b62a-4ea7491b58f6',
            formFieldPath: '88.1/1-0',
            formNamespace: 'Bahmni',
            groupMembers: [
              {
                abnormal: null,
                comment: null,
                concept: {
                  conceptClass: 'Concept Details',
                  dataType: 'N/A',
                  hiNormal: null,
                  lowNormal: null,
                  mappings: [],
                  name: 'testObsGroupConcept',
                  set: true,
                  shortName: 'testObsGroup',
                  uuid: 'dbf61fc7-2371-423b-9832-18c5659d41a0',
                },
                conceptNameToDisplay: 'testObsGroup',
                conceptSortWeight: 2,
                conceptUuid: 'dbf61fc7-2371-423b-9832-18c5659d41a0',
                creatorName: 'Super Man',
                duration: null,
                encounterDateTime: 1489919402000,
                encounterUuid: '0cf221ee-323b-4dc9-b62a-4ea7491b58f6',
                formFieldPath: '88.1/3-1',
                formNamespace: 'Bahmni',
                groupMembers: [
                  {
                    abnormal: null,
                    comment: null,
                    concept: {
                      conceptClass: 'Misc',
                      dataType: 'Numeric',
                      hiNormal: null,
                      lowNormal: null,
                      mappings: [],
                      name: 'WEIGHT',
                      set: false,
                      shortName: 'WEIGHT',
                      uuid: '5089AAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                    },
                    conceptNameToDisplay: 'WEIGHT',
                    conceptSortWeight: 3,
                    conceptUuid: '5089AAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                    creatorName: 'Super Man',
                    duration: null,
                    encounterDateTime: 1489919402000,
                    encounterUuid: '0cf221ee-323b-4dc9-b62a-4ea7491b58f6',
                    formFieldPath: '88.1/2-1',
                    formNamespace: 'Bahmni',
                    groupMembers: [],
                    hiNormal: null,
                    isAbnormal: null,
                    lowNormal: null,
                    obsGroupUuid: 'ae693dfb-f950-4694-a9c7-a8cf5694d19d',
                    observationDateTime: '2017-03-19T16:00:02.000+0530',
                    orderUuid: null,
                    parentConceptUuid: null,
                    providers: [
                      {
                        encounterRoleUuid: 'a0b03050-c99b-11e0-9572-0800200c9a66',
                        name: 'Super Man',
                        uuid: 'c1c26908-3f10-11e4-adec-0800271c1b75',
                      },
                    ],
                    targetObsRelation: null,
                    type: 'Numeric',
                    unknown: false,
                    uuid: '11f9ee1a-0803-4625-9bd0-4c0d119c952a',
                    value: 44,
                    valueAsString: '44.0',
                    visitStartDateTime: null,
                    voidReason: null,
                    voided: false,
                  },
                ],
                hiNormal: null,
                isAbnormal: null,
                lowNormal: null,
                obsGroupUuid: '2feb6b69-daee-4f7a-870c-a1df7acc12ba',
                observationDateTime: '2017-03-19T16:00:02.000+0530',
                orderUuid: null,
                parentConceptUuid: null,
                providers: [
                  {
                    encounterRoleUuid: 'a0b03050-c99b-11e0-9572-0800200c9a66',
                    name: 'Super Man',
                    uuid: 'c1c26908-3f10-11e4-adec-0800271c1b75',
                  },
                ],
                targetObsRelation: null,
                type: null,
                unknown: false,
                uuid: 'ae693dfb-f950-4694-a9c7-a8cf5694d19d',
                value: '44.0',
                valueAsString: '44.0',
                visitStartDateTime: null,
                voidReason: null,
                voided: false,
              },
              {
                abnormal: null,
                comment: null,
                concept: {
                  conceptClass: 'Concept Details',
                  dataType: 'N/A',
                  hiNormal: null,
                  lowNormal: null,
                  mappings: [],
                  name: 'testObsGroupConcept',
                  set: true,
                  shortName: 'testObsGroup',
                  uuid: 'dbf61fc7-2371-423b-9832-18c5659d41a0',
                },
                conceptNameToDisplay: 'testObsGroup',
                conceptSortWeight: 2,
                conceptUuid: 'dbf61fc7-2371-423b-9832-18c5659d41a0',
                creatorName: 'Super Man',
                duration: null,
                encounterDateTime: 1489919402000,
                encounterUuid: '0cf221ee-323b-4dc9-b62a-4ea7491b58f6',
                formFieldPath: removeFormFieldPath,
                formNamespace: 'Bahmni',
                groupMembers: [
                  {
                    abnormal: null,
                    comment: null,
                    concept: {
                      conceptClass: 'Misc',
                      dataType: 'Numeric',
                      hiNormal: null,
                      lowNormal: null,
                      mappings: [],
                      name: 'WEIGHT',
                      set: false,
                      shortName: 'WEIGHT',
                      uuid: '5089AAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                    },
                    conceptNameToDisplay: 'WEIGHT',
                    conceptSortWeight: 3,
                    conceptUuid: '5089AAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                    creatorName: 'Super Man',
                    duration: null,
                    encounterDateTime: 1489919402000,
                    encounterUuid: '0cf221ee-323b-4dc9-b62a-4ea7491b58f6',
                    formFieldPath: '88.1/2-0',
                    formNamespace: 'Bahmni',
                    groupMembers: [],
                    hiNormal: null,
                    isAbnormal: null,
                    lowNormal: null,
                    obsGroupUuid: '59acaf73-16ae-447d-bf72-a1bfd8374dd5',
                    observationDateTime: '2017-03-19T16:00:02.000+0530',
                    orderUuid: null,
                    parentConceptUuid: null,
                    providers: [
                      {
                        encounterRoleUuid: 'a0b03050-c99b-11e0-9572-0800200c9a66',
                        name: 'Super Man',
                        uuid: 'c1c26908-3f10-11e4-adec-0800271c1b75',
                      },
                    ],
                    targetObsRelation: null,
                    type: 'Numeric',
                    unknown: false,
                    uuid: '1a3e3fc7-b6e1-4c4c-ad4b-8f02c443c6a7',
                    value: 33,
                    valueAsString: '33.0',
                    visitStartDateTime: null,
                    voidReason: null,
                    voided: false,
                  },
                ],
                hiNormal: null,
                isAbnormal: null,
                lowNormal: null,
                obsGroupUuid: '2feb6b69-daee-4f7a-870c-a1df7acc12ba',
                observationDateTime: '2017-03-19T16:00:02.000+0530',
                orderUuid: null,
                parentConceptUuid: null,
                providers: [
                  {
                    encounterRoleUuid: 'a0b03050-c99b-11e0-9572-0800200c9a66',
                    name: 'Super Man',
                    uuid: 'c1c26908-3f10-11e4-adec-0800271c1b75',
                  },
                ],
                targetObsRelation: null,
                type: null,
                unknown: false,
                uuid: '59acaf73-16ae-447d-bf72-a1bfd8374dd5',
                value: '33.0',
                valueAsString: '33.0',
                visitStartDateTime: null,
                voidReason: null,
                voided: false,
              },
            ],
            hiNormal: null,
            isAbnormal: null,
            lowNormal: null,
            obsGroupUuid: null,
            observationDateTime: '2017-03-19T16:00:02.000+0530',
            orderUuid: null,
            parentConceptUuid: null,
            providers: [
              {
                encounterRoleUuid: 'a0b03050-c99b-11e0-9572-0800200c9a66',
                name: 'Super Man',
                uuid: 'c1c26908-3f10-11e4-adec-0800271c1b75',
              },
            ],
            targetObsRelation: null,
            type: null,
            unknown: false,
            uuid: '2feb6b69-daee-4f7a-870c-a1df7acc12ba',
            value: '33.0, 44.0',
            valueAsString: '33.0, 44.0',
            visitStartDateTime: null,
            voidReason: null,
            voided: false,
          },
          children: List.of(obsGroupRecordOne, removeObsGroupRecord),
        });
        const rootTree = new ControlRecord({ children: List.of(obsGroupRecord) });
        const wrapper = mount(
                    <Container
                      collapse
                      locale="en"
                      metadata={metadata}
                      observations={[]}
                      patient={patient}
                      translations={translations}
                      validate={false}
                      validateForm={false}
                    />
                );
        wrapper.setState({ data: rootTree });
        wrapper.instance().onControlRemove(removeFormFieldPath);

        const updatedRootTree = wrapper.state().data;
        const obsGroupTree = updatedRootTree.children.get(0);

        expect(obsGroupTree.children.get(0).active).to.equal(true);
        expect(obsGroupTree.children.get(1).active).to.equal(false);
        expect(obsGroupTree.children.get(1).formFieldPath).to.equal(removeFormFieldPath);
      });
    });
  });
});
