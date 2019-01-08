import { SectionMapper } from 'src/mapper/SectionMapper';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { ObsList } from 'src/helpers/ObsList';
import { createFormNamespaceAndPath } from 'src/helpers/formNamespace';
import { getKeyPrefixForControl } from '../../src/helpers/formNamespace';
import { ControlRecord } from '../../src/helpers/ControlRecordTreeBuilder';
import { List } from 'immutable';
import { Obs } from 'src/helpers/Obs';

chai.use(chaiEnzyme());

describe('SectionMapper', () => {
  let mapper;
  const formName = 'someName';
  const formVersion = '1';
  const concept = {
    name: 'Pulse',
    uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
  };
  const obsControl = {
    type: 'obsControl',
    id: '2',
    concept,
    properties: {},
  };
  const sectionControl = {
    type: 'section',
    id: '1',
    controls: [obsControl],
    properties: {},
  };

  const sectionControlFormFieldPath =
    createFormNamespaceAndPath(formName, formVersion, sectionControl.id).formFieldPath;
  const obsControlFormFieldPath =
    createFormNamespaceAndPath(formName, formVersion, obsControl.id).formFieldPath;

  beforeEach(() => {
    mapper = new SectionMapper();
  });

  context('getInitialObject', () => {
    it('should return initial object when obs has no value', () => {
      const initObjectArray = mapper.getInitialObject(
        formName, formVersion, sectionControl, null, []);

      expect(initObjectArray.length).to.eql(1);
      expect(initObjectArray[0].getObsList().length).to.eql(0);
      expect(initObjectArray[0].formFieldPath).to.eql(sectionControlFormFieldPath);
    });

    it('should return initial object with default value', () => {
      const observations = [{
        formFieldPath: obsControlFormFieldPath,
        concept,
      }];

      const initObjectArray =
        mapper.getInitialObject(formName, formVersion, sectionControl, null, observations);

      expect(initObjectArray.length).to.eql(1);
      expect(initObjectArray[0].getObsList().length).to.eql(1);
      expect(initObjectArray[0].formFieldPath).to.eql(sectionControlFormFieldPath);
    });

    it('should return more than one obs when observations come from addMore controls', () => {
      const formFieldPathPrefix =
        getKeyPrefixForControl(formName, formVersion, obsControl.id).formFieldPath;
      const observations = [{
        formFieldPath: `${formFieldPathPrefix}-0`,
        concept,
      },
      {
        formFieldPath: `${formFieldPathPrefix}-1`,
        concept,
      }];

      const initObjectArray =
        mapper.getInitialObject(formName, formVersion, sectionControl, null, observations);

      expect(initObjectArray.length).to.eql(1);
      const initObject = initObjectArray[0].toJS();
      expect(initObject.formFieldPath).to.eql(sectionControlFormFieldPath);
      expect(initObject.obsList.length).to.eql(2);
    });

    it('should return two initial objects if observations come from add more sections and' +
        'obs are segregated by section control ids', () => {
      const observationControl = {
        type: 'obsControl',
        id: '2',
        concept,
        properties: {},
      };
      const sectionCtrl = {
        type: 'section',
        id: '1',
        controls: [observationControl],
        properties: {
          addMore: true,
        },
      };
      const formFieldPathPrefix =
            getKeyPrefixForControl(formName, formVersion, sectionCtrl.id).formFieldPath;
      const firstObsFormFieldPathInSection = `${formFieldPathPrefix}-0/2-0`;
      const secondObsFormFieldPathInSection = `${formFieldPathPrefix}-0/2-1`;
      const obsFormFieldPathInAddMoreSection = `${formFieldPathPrefix}-1/2-0`;

      const observations = [{
        formFieldPath: firstObsFormFieldPathInSection,
        concept,
      },
      {
        formFieldPath: secondObsFormFieldPathInSection,
        concept,
      },
      {
        formFieldPath: obsFormFieldPathInAddMoreSection,
        concept,
      }];

      const initObjects = mapper.getInitialObject(formName, formVersion, sectionCtrl, null,
          observations);
      expect(initObjects.length).to.eql(2);

      const initObjectArray = [initObjects[0].toJS(), initObjects[1].toJS()];
      expect([initObjectArray[0].formFieldPath, initObjectArray[1].formFieldPath])
          .to.have.members([`${formFieldPathPrefix}-0`, `${formFieldPathPrefix}-1`]);

      let sectionObj = initObjectArray.find(obj =>
          (obj.formFieldPath === `${formFieldPathPrefix}-0` ? obj : undefined));
      expect(sectionObj.obsList.length).to.eql(2);
      expect(sectionObj.obsList.map(obs => obs.formFieldPath))
          .to.have.members([firstObsFormFieldPathInSection, secondObsFormFieldPathInSection]);

      sectionObj = initObjectArray.find(obj => (obj.formFieldPath === `${formFieldPathPrefix}-1` ?
        obj : undefined));

      expect(sectionObj.obsList.length).to.eql(1);
      expect(sectionObj.obsList[0].formFieldPath).to.eql(obsFormFieldPathInAddMoreSection);
    });

    it('should return two initial objects if observations come from add more sections' +
        'whose parent is also section with add more property and obs are segregated by' +
        'current section control ids', () => {
      const observationCtrl = {
        type: 'obsControl',
        id: '3',
        concept,
        properties: {},
      };
      const sectionCtrl = {
        type: 'section',
        id: '2',
        controls: [observationCtrl],
        properties: {
          addMore: true,
        },
      };
      const parentFormFieldPath = createFormNamespaceAndPath(formName, formVersion, 1)
          .formFieldPath;

      const formFieldPathPrefix =
              getKeyPrefixForControl(formName, formVersion, sectionCtrl.id, parentFormFieldPath)
                  .formFieldPath;
      const firstObsFormFieldPathInSection = `${formFieldPathPrefix}-0/3-0`;
      const secondObsFormFieldPathInSection = `${formFieldPathPrefix}-0/3-1`;
      const obsFormFieldPathInAddMoreSection = `${formFieldPathPrefix}-1/3-0`;

      const observations = [{
        formFieldPath: firstObsFormFieldPathInSection,
        concept,
      },
      {
        formFieldPath: secondObsFormFieldPathInSection,
        concept,
      },
      {
        formFieldPath: obsFormFieldPathInAddMoreSection,
        concept,
      }];

      const initObjects = mapper.getInitialObject(formName, formVersion, sectionCtrl, null,
              observations, parentFormFieldPath);
      expect(initObjects.length).to.eql(2);

      const initObjectArray = [initObjects[0].toJS(), initObjects[1].toJS()];
      expect([initObjectArray[0].formFieldPath, initObjectArray[1].formFieldPath])
              .to.have.members([`${formFieldPathPrefix}-0`, `${formFieldPathPrefix}-1`]);

      let sectionObj = initObjectArray.find(obj =>
          (obj.formFieldPath === `${formFieldPathPrefix}-0` ? obj : undefined));
      expect(sectionObj.obsList.length).to.eql(2);
      expect(sectionObj.obsList.map(obs => obs.formFieldPath))
              .to.have.members([firstObsFormFieldPathInSection, secondObsFormFieldPathInSection]);

      sectionObj = initObjectArray.find(obj =>
          (obj.formFieldPath === `${formFieldPathPrefix}-1` ? obj : undefined));

      expect(sectionObj.obsList.length).to.eql(1);
      expect(sectionObj.obsList[0].formFieldPath).to.eql(obsFormFieldPathInAddMoreSection);
    });


    it('should get flatten data from records given single layer control record', () => {
      const child = new ControlRecord({
        control: {
          type: 'obsControl',
          properties: {},
          id: '3',
          concept: {
            name: 'HEIGHT',
            uuid: '5090AAAAAAAAAAAAAAAAAAAAAAAAAAAA',
            description: [],
            datatype: 'Numeric',
            answers: [],
          },
        },
        formFieldPath: 'section.1/3-0',
        value: { value: '2', comment: undefined },
        active: true,
        dataSource: new Obs({
          concept: {
            name: 'HEIGHT',
            uuid: '5090AAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          }, formNamespace: 'Bahmni',
          formFieldPath: 'section.1/3-0',
        }),
      });

      const records = new ControlRecord({
        control: {
          type: 'section',
          id: '1',
          controls: [{
            type: 'obsControl',
            label: { type: 'label', value: 'HEIGHT' },
            id: '3',
            concept: {
              name: 'HEIGHT',
              uuid: '5090AAAAAAAAAAAAAAAAAAAAAAAAAAAA',
            },
          }],
        },
        formFieldPath: 'section.1/1-0',
        children: List.of(child),
        active: true,
        dataSource: { formFieldPath: 'section.1/1-0', obsList: [] },
      });

      const data = mapper.getData(records);

      expect(data.length).to.equal(1);
      expect(data[0].value).to.equal('2');
    });

    it('should get flatten data from records given multiple layer control record', () => {
      const controlRecord2 = {
        control: {
          type: 'obsControl',
          label: { type: 'label', value: 'Pulse(/min)' },
          properties: {
            mandatory: false,
            notes: false,
            addMore: false,
            hideLabel: false,
            location: { column: 0, row: 0 },
          },
          id: '4',
          concept: {
            name: 'Pulse',
            uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
            description: [],
            datatype: 'Numeric',
            answers: [],
            properties: { allowDecimal: true },
          },
          units: '/min',
          hiNormal: 72,
          lowNormal: 72,
          hiAbsolute: null,
          lowAbsolute: null,
        },
        formFieldPath: 'nested_section.3/4-0',
        value: { value: 2, comment: undefined },
        active: true,
        showAddMore: true,
        showRemove: false,
        errors: [],
        dataSource: new Obs({
          encounterDateTime: 1488762812000,
          visitStartDateTime: null,
          targetObsRelation: null,
          groupMembers: [],
          providers: [{
            uuid: 'c1c26908-3f10-11e4-adec-0800271c1b75',
            name: 'Super Man',
            encounterRoleUuid: 'a0b03050-c99b-11e0-9572-0800200c9a66',
          }],
          isAbnormal: null,
          duration: null,
          type: 'Numeric',
          encounterUuid: '152b99b8-5f87-4386-a5bb-773d5588a443',
          obsGroupUuid: null,
          creatorName: 'Super Man',
          conceptSortWeight: 1,
          parentConceptUuid: null,
          hiNormal: 72,
          lowNormal: 72,
          formNamespace: 'Bahmni',
          formFieldPath: 'nested_section.3/4-0',
          concept: {
            uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
            name: 'Pulse',
            dataType: 'Numeric',
            shortName: 'Pulse',
            units: '/min',
            conceptClass: 'Misc',
            hiNormal: 72,
            lowNormal: 72,
            set: false,
            mappings: [],
          },
          valueAsString: '2.0',
          voided: false,
          voidReason: null,
          conceptUuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
          unknown: false,
          uuid: 'cf638311-d39e-4daf-81db-5bb61c75cb15',
          observationDateTime: '2017-03-06T02:10:48.000+0000',
          comment: null,
          abnormal: null,
          orderUuid: null,
          conceptNameToDisplay: 'Pulse',
          value: { value: 2, comment: undefined },
        }),
      };

      const layer2Control = {
        type: 'obsControl',
        label: { type: 'label', value: 'Pulse(/min)' },
        properties: {
          mandatory: false,
          notes: false,
          addMore: false,
          hideLabel: false,
          location: { column: 0, row: 0 },
        },
        id: '4',
        concept: {
          name: 'Pulse',
          uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
          description: [],
          datatype: 'Numeric',
          answers: [],
          properties: { allowDecimal: true },
        },
        units: '/min',
        hiNormal: 72,
        lowNormal: 72,
        hiAbsolute: null,
        lowAbsolute: null,
      };

      const layer2 = {
        control: {
          type: 'section',
          label: { type: 'label', value: 'Section' },
          properties: { location: { column: 0, row: 1 } },
          id: '3',
          controls: [layer2Control],
        },
        formFieldPath: 'nested_section.3/3-0',
        children: List.of(controlRecord2),
        active: true,
        showAddMore: true,
        showRemove: false,
        errors: [],
        dataSource: {
          formFieldPath: 'nested_section.3/3-0',
          obsList: [new Obs(
            {
              encounterDateTime: 1488762812000,
              visitStartDateTime: null,
              targetObsRelation: null,
              groupMembers: [],
              providers: [{
                uuid: 'c1c26908-3f10-11e4-adec-0800271c1b75',
                name: 'Super Man',
                encounterRoleUuid: 'a0b03050-c99b-11e0-9572-0800200c9a66',
              }],
              isAbnormal: null,
              duration: null,
              type: 'Numeric',
              encounterUuid: '152b99b8-5f87-4386-a5bb-773d5588a443',
              obsGroupUuid: null,
              creatorName: 'Super Man',
              conceptSortWeight: 1,
              parentConceptUuid: null,
              hiNormal: 72,
              lowNormal: 72,
              formNamespace: 'Bahmni',
              formFieldPath: 'nested_section.3/4-0',
              concept: {
                uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
                name: 'Pulse',
                dataType: 'Numeric',
                shortName: 'Pulse',
                units: '/min',
                conceptClass: 'Misc',
                hiNormal: 72,
                lowNormal: 72,
                set: false,
                mappings: [],
              },
              valueAsString: '2.0',
              voided: false,
              voidReason: null,
              conceptUuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
              unknown: false,
              uuid: 'cf638311-d39e-4daf-81db-5bb61c75cb15',
              observationDateTime: '2017-03-06T02:10:48.000+0000',
              comment: null,
              abnormal: null,
              orderUuid: null,
              conceptNameToDisplay: 'Pulse',
              value: { value: 2, comment: undefined },
            })],
        },
      };

      const obsControl1 = {
        control: {
          type: 'obsControl',
          label: { type: 'label', value: 'HEIGHT' },
          properties: {
            mandatory: false,
            notes: false,
            addMore: false,
            hideLabel: false,
            location: { column: 0, row: 0 },
          },
          id: '2',
          concept: {
            name: 'HEIGHT',
            uuid: '5090AAAAAAAAAAAAAAAAAAAAAAAAAAAA',
            description: [],
            datatype: 'Numeric',
            answers: [],
            properties: { allowDecimal: false },
          },
          units: null,
          hiNormal: null,
          lowNormal: null,
          hiAbsolute: null,
          lowAbsolute: null,
        },
        formFieldPath: 'nested_section.3/2-0',
        value: { value: 1, comment: undefined },
        active: true,
        showAddMore: true,
        showRemove: false,
        errors: [],
        dataSource: new Obs({
          encounterDateTime: 1488762812000,
          visitStartDateTime: null,
          targetObsRelation: null,
          groupMembers: [],
          providers: [{
            uuid: 'c1c26908-3f10-11e4-adec-0800271c1b75',
            name: 'Super Man',
            encounterRoleUuid: 'a0b03050-c99b-11e0-9572-0800200c9a66',
          }],
          isAbnormal: null,
          duration: null,
          type: 'Numeric',
          encounterUuid: '152b99b8-5f87-4386-a5bb-773d5588a443',
          obsGroupUuid: null,
          creatorName: 'Super Man',
          conceptSortWeight: 1,
          parentConceptUuid: null,
          hiNormal: null,
          lowNormal: null,
          formNamespace: 'Bahmni',
          formFieldPath: 'nested_section.3/2-0',
          concept: {
            uuid: '5090AAAAAAAAAAAAAAAAAAAAAAAAAAAA',
            name: 'HEIGHT',
            dataType: 'Numeric',
            shortName: 'HEIGHT',
            conceptClass: 'Misc',
            hiNormal: null,
            lowNormal: null,
            set: false,
            mappings: [],
          },
          valueAsString: '1.0',
          voided: false,
          voidReason: null,
          conceptUuid: '5090AAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          unknown: false,
          uuid: '95116466-74a0-4ecc-bc48-3b9917cb2d2a',
          observationDateTime: '2017-03-06T02:10:48.000+0000',
          comment: null,
          abnormal: null,
          orderUuid: null,
          conceptNameToDisplay: 'HEIGHT',
          value: { value: 1, comment: undefined },
        }),
      };

      const layer1 = {
        control: {
          type: 'section',
          label: { type: 'label', value: 'Section' },
          properties: { location: { column: 0, row: 0 } },
          id: '1',
          controls: [{
            type: 'obsControl',
            label: { type: 'label', value: 'HEIGHT' },
            properties: {
              mandatory: false,
              notes: false,
              addMore: false,
              hideLabel: false,
              location: { column: 0, row: 0 },
            },
            id: '2',
            concept: {
              name: 'HEIGHT',
              uuid: '5090AAAAAAAAAAAAAAAAAAAAAAAAAAAA',
              description: [],
              datatype: 'Numeric',
              answers: [],
              properties: { allowDecimal: false },
            },
            units: null,
            hiNormal: null,
            lowNormal: null,
            hiAbsolute: null,
            lowAbsolute: null,
          }, {
            type: 'section',
            label: { type: 'label', value: 'Section' },
            properties: { location: { column: 0, row: 1 } },
            id: '3',
            controls: [{
              type: 'obsControl',
              label: { type: 'label', value: 'Pulse(/min)' },
              properties: {
                mandatory: false,
                notes: false,
                addMore: false,
                hideLabel: false,
                location: { column: 0, row: 0 },
              },
              id: '4',
              concept: {
                name: 'Pulse',
                uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
                description: [],
                datatype: 'Numeric',
                answers: [],
                properties: { allowDecimal: true },
              },
              units: '/min',
              hiNormal: 72,
              lowNormal: 72,
              hiAbsolute: null,
              lowAbsolute: null,
            }],
          }],
        },
        formFieldPath: 'nested_section.3/1-0',
        children: List.of(obsControl1, layer2),
        active: true,
        showAddMore: true,
        showRemove: false,
        errors: [],
        dataSource: {
          formFieldPath: 'nested_section.3/1-0',
          obsList: [new Obs({
            encounterDateTime: 1488762812000,
            visitStartDateTime: null,
            targetObsRelation: null,
            groupMembers: [],
            providers: [{
              uuid: 'c1c26908-3f10-11e4-adec-0800271c1b75',
              name: 'Super Man',
              encounterRoleUuid: 'a0b03050-c99b-11e0-9572-0800200c9a66',
            }],
            isAbnormal: null,
            duration: null,
            type: 'Numeric',
            encounterUuid: '152b99b8-5f87-4386-a5bb-773d5588a443',
            obsGroupUuid: null,
            creatorName: 'Super Man',
            conceptSortWeight: 1,
            parentConceptUuid: null,
            hiNormal: null,
            lowNormal: null,
            formNamespace: 'Bahmni',
            formFieldPath: 'nested_section.3/2-0',
            concept: {
              uuid: '5090AAAAAAAAAAAAAAAAAAAAAAAAAAAA',
              name: 'HEIGHT',
              dataType: 'Numeric',
              shortName: 'HEIGHT',
              conceptClass: 'Misc',
              hiNormal: null,
              lowNormal: null,
              set: false,
              mappings: [],
            },
            valueAsString: '1.0',
            voided: false,
            voidReason: null,
            conceptUuid: '5090AAAAAAAAAAAAAAAAAAAAAAAAAAAA',
            unknown: false,
            uuid: '95116466-74a0-4ecc-bc48-3b9917cb2d2a',
            observationDateTime: '2017-03-06T02:10:48.000+0000',
            comment: null,
            abnormal: null,
            orderUuid: null,
            conceptNameToDisplay: 'HEIGHT',
            value: { value: 1, comment: undefined },
          }), {
            formFieldPath: 'nested_section.3/3-0',
            obsList: [new Obs({
              encounterDateTime: 1488762812000,
              visitStartDateTime: null,
              targetObsRelation: null,
              groupMembers: [],
              providers: [{
                uuid: 'c1c26908-3f10-11e4-adec-0800271c1b75',
                name: 'Super Man',
                encounterRoleUuid: 'a0b03050-c99b-11e0-9572-0800200c9a66',
              }],
              isAbnormal: null,
              duration: null,
              type: 'Numeric',
              encounterUuid: '152b99b8-5f87-4386-a5bb-773d5588a443',
              obsGroupUuid: null,
              creatorName: 'Super Man',
              conceptSortWeight: 1,
              parentConceptUuid: null,
              hiNormal: 72,
              lowNormal: 72,
              formNamespace: 'Bahmni',
              formFieldPath: 'nested_section.3/4-0',
              concept: {
                uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
                name: 'Pulse',
                dataType: 'Numeric',
                shortName: 'Pulse',
                units: '/min',
                conceptClass: 'Misc',
                hiNormal: 72,
                lowNormal: 72,
                set: false,
                mappings: [],
              },
              valueAsString: '2.0',
              voided: false,
              voidReason: null,
              conceptUuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
              unknown: false,
              uuid: 'cf638311-d39e-4daf-81db-5bb61c75cb15',
              observationDateTime: '2017-03-06T02:10:48.000+0000',
              comment: null,
              abnormal: null,
              orderUuid: null,
              conceptNameToDisplay: 'Pulse',
              value: { value: 2, comment: undefined },
            })],
          }],
        },
      };

      const root = new ControlRecord({
        formFieldPath: '',
        children: List.of(layer1),
        active: true,
        showAddMore: false,
        showRemove: false,
        errors: [],
      });

      const data = mapper.getData(root);

      expect(data.length).to.equal(2);
      expect(data[0].value).to.equal(1);
      expect(data[1].value).to.equal(2);
    });

    it('should return null object when call getValue', () => {
      expect(mapper.getValue()).to.eql({});
    });

    it('should get observations for children records', () => {
      const data = new ObsList({
        formFieldPath: 'section.1/1-0',
        obsList: [{
          groupMembers: [],
          formFieldPath: 'section.1/3-0',
          concept: {
            uuid: '5090AAAAAAAAAAAAAAAAAAAAAAAAAAAA',
            name: 'HEIGHT',
            dataType: 'Numeric',
            shortName: 'HEIGHT',
            conceptClass: 'Misc',
          },
          valueAsString: '2.0',
          voided: false,
          voidReason: null,
          conceptUuid: '5090AAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          unknown: false,
          uuid: '22a41779-e637-44b6-a827-34d6b8df7159',
          value: 2,
        }],
      });

      expect(mapper.getChildren(data).length).to.equal(1);
      expect(mapper.getChildren(data)[0].value).to.equal(2);
    });
  });
});
