import ControlRecordTreeBuilder from '../../src/helpers/ControlRecordTreeBuilder';
import ObservationMapper from '../../src/helpers/ObservationMapper';
import { expect } from 'chai';
import { ControlRecord } from 'src/helpers/ControlRecordTreeBuilder';
import { List } from 'immutable';

describe('Control Record', () => {
  const updatedValue = { value: 1, comment: undefined };

  describe('Single Layer Record', () => {
    const obsConcept = {
      datatype: 'Numeric',
      name: 'Pulse',
      properties: {
        allowDecimal: true,
      },
      uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
    };

    const obsControl = {
      concept: obsConcept,
      id: '1',
      label: {
        type: 'label',
        value: 'Pulse(/min)',
      },
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
    };
    const metadata = {
      controls: [
        obsControl,
      ],
      id: 209,
      name: 'SingleObs',
      uuid: '245940b7-3d6b-4a8b-806b-3f56444129ae',
      version: '1',
    };

    const observation = [{
      encounterDateTime: 1488354632000,
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
      encounterUuid: '957a49f2-98ba-4cbc-a9f5-233be6d1afe5',
      obsGroupUuid: null,
      creatorName: 'Super Man',
      conceptSortWeight: 1,
      parentConceptUuid: null,
      hiNormal: 72,
      lowNormal: 72,
      formNamespace: 'Bahmni',
      formFieldPath: 'SingleObs.1/1-0',
      conceptUuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
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
      valueAsString: '1.0',
      voided: false,
      voidReason: null,
      unknown: false,
      uuid: 'a2b351b7-03e2-47ce-a47d-b47ad425d3f6',
      observationDateTime: '2017-03-01T07:50:32.000+0000',
      comment: null,
      abnormal: null,
      orderUuid: null,
      conceptNameToDisplay: 'Pulse',
      value: 1,
    }];

    it('should create single layer record given single layer metadata and empty data', () => {
      const emptyObservation = [];
      const expectedFormFieldPath = 'SingleObs.1/1-0';

      const controlRecordTree = (new ControlRecordTreeBuilder()).build(metadata, emptyObservation);

      expect(controlRecordTree.children.size).to.equal(1);
      expect(controlRecordTree.children.get(0).formFieldPath).to.equal(expectedFormFieldPath);
      expect(controlRecordTree.children.get(0).control.concept.uuid).to.equal(obsConcept.uuid);
    });

    it('should create single layer record given single layer metadata and data', () => {
      const expectedFormFieldPath = 'SingleObs.1/1-0';

      const controlRecordTree = (new ControlRecordTreeBuilder()).build(metadata, observation);

      expect(controlRecordTree.children.size).to.equal(1);
      expect(controlRecordTree.children.get(0).formFieldPath).to.equal(expectedFormFieldPath);
      expect(controlRecordTree.children.get(0).value.value).to.equal(1);
    });

    it('should update value when given value to obs control', () => {
      const emptyObservation = [];
      const formFieldPath = 'SingleObs.1/1-0';
      const controlRecordTree = (new ControlRecordTreeBuilder()).build(metadata, emptyObservation);

      const updatedRecordTree = controlRecordTree.update(formFieldPath, updatedValue);

      expect(updatedRecordTree.children.get(0).formFieldPath).to.equal(formFieldPath);
      expect(updatedRecordTree.children.get(0).value.value).to.equal(1);
    });

    it('should generate data from record when input obs is empty', () => {
      const emptyObservation = [];
      const formFieldPath = 'SingleObs.1/1-0';
      const newValue = { value: 999, comment: undefined };

      const controlRecordTree = (new ControlRecordTreeBuilder()).build(metadata, emptyObservation);
      const updatedRecordTree = controlRecordTree.update(formFieldPath, newValue);

      const obs = (new ObservationMapper()).from(updatedRecordTree);
      expect(obs.length).to.equal(1);
      expect(obs[0].value).to.equal(newValue.value);
    });

    it('should generate data from record when input obs is not empty', () => {
      const formFieldPath = 'SingleObs.1/1-0';
      const newValue = { value: 999, comment: undefined };

      const controlRecordTree = (new ControlRecordTreeBuilder()).build(metadata, observation);
      const updatedRecordTree = controlRecordTree.update(formFieldPath, newValue);

      const obs = (new ObservationMapper()).from(updatedRecordTree);
      expect(obs.length).to.equal(1);
      expect(obs[0].value).to.equal(newValue.value);
    });

    it('should generate data from record when input obs is single section', () => {
      const updatedObservations = [
        {
          encounterDateTime: 1488424586000,
          visitStartDateTime: null,
          targetObsRelation: null,
          groupMembers: [],
          providers: [
            {
              uuid: 'c1c26908-3f10-11e4-adec-0800271c1b75',
              name: 'Super Man',
              encounterRoleUuid: 'a0b03050-c99b-11e0-9572-0800200c9a66',
            },
          ],
          isAbnormal: null,
          duration: null,
          type: 'Numeric',
          encounterUuid: 'f42c18c1-45a7-450d-9d18-1df89fb0b57b',
          obsGroupUuid: null,
          creatorName: 'Super Man',
          conceptSortWeight: 1,
          parentConceptUuid: null,
          hiNormal: null,
          lowNormal: null,
          formNamespace: 'Bahmni',
          formFieldPath: 'section.1/3-0',
          voided: false,
          voidReason: null,
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
          valueAsString: '23423.0',
          conceptUuid: '5090AAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          unknown: false,
          uuid: 'ed9ad526-c8f0-438a-a79d-be36e815ecf2',
          observationDateTime: '2017-03-02T03:16:26.000+0000',
          comment: null,
          conceptNameToDisplay: 'HEIGHT',
          orderUuid: null,
          abnormal: null,
          value: 23423,
        },
      ];

      const updatedMetadata = {
        name: 'section',
        id: 39,
        uuid: 'befa88ab-163d-4934-8c8d-0c37ae58724d',
        controls: [
          {
            type: 'section',
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
            id: '1',
            controls: [
              {
                type: 'obsControl',
                label: {
                  type: 'label',
                  value: 'HEIGHT',
                },
                properties: {
                  mandatory: false,
                  notes: false,
                  addMore: false,
                  hideLabel: false,
                  location: {
                    column: 0,
                    row: 0,
                  },
                },
                id: '3',
                concept: {
                  name: 'HEIGHT',
                  uuid: '5090AAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                  description: [],
                  datatype: 'Numeric',
                  answers: [],
                  properties: {
                    allowDecimal: false,
                  },
                },
                units: null,
                hiNormal: null,
                lowNormal: null,
                hiAbsolute: null,
                lowAbsolute: null,
              },
            ],
          },
        ],
        version: '1',
      };

      const controlRecordTree = (new ControlRecordTreeBuilder())
                                        .build(updatedMetadata, updatedObservations);

      const obs = (new ObservationMapper()).from(controlRecordTree);

      expect(obs.length).to.equal(1);
      expect(obs[0].value).to.equal(23423);
    });
  });

  describe('Multiple layer Record', () => {
    const obsGroupConcept = {
      datatype: 'N/A',
      name: 'TestGroup',
      setMembers: [
        {
          datatype: 'Numeric',
          name: 'TestObs',
          properties: {
            allowDecimal: false,
          },
          uuid: 'd0490af4-72eb-4090-9b43-ac3487ba7474',
        },
      ],
      uuid: 'eafe7d68-904b-459b-b11d-6502ec0143a4',
    };

    const obsConcept = {
      datatype: 'Numeric',
      name: 'TestObs',
      properties: {
        allowDecimal: false,
      },
      uuid: 'd0490af4-72eb-4090-9b43-ac3487ba7474',
    };

    const metadata = {
      controls: [
        {
          concept: obsGroupConcept,
          controls: [
            {
              concept: obsConcept,
              id: '4',
              label: {
                type: 'label',
                value: 'TestObs',
              },
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
    };

    it('should create multiple layer record given multiple layer metadata and empty data', () => {
      const emptyObservation = [];
      const expectedFormFieldPath = 'SingleGroup.3/3-0';
      const expectedSubFormFieldPath = 'SingleGroup.3/3-0/4-0';

      const controlRecordTree = (new ControlRecordTreeBuilder()).build(metadata, emptyObservation);

      const node = controlRecordTree.children;
      expect(node.size).to.equal(1);
      expect(node.get(0).formFieldPath).to.equal(expectedFormFieldPath);
      expect(node.get(0).control.concept.uuid).to.equal(obsGroupConcept.uuid);

      const subNode = node.get(0).children;
      expect(subNode.size).to.equal(1);
      expect(subNode.get(0).formFieldPath).to.equal(expectedSubFormFieldPath);
      expect(subNode.get(0).control.concept.uuid).to.equal(obsConcept.uuid);
    });

    it('should create multiple layer record given multiple layer metadata and data', () => {
      const observation = [{
        concept: {
          uuid: 'eafe7d68-904b-459b-b11d-6502ec0143a4',
          name: 'TestGroup',
          dataType: 'N/A',
          shortName: 'TestGroup',
          conceptClass: 'Concept Details',
          hiNormal: null,
          lowNormal: null,
          set: true,
          mappings: [],
        },
        uuid: '4f8a9887-9780-4b0e-8e1e-9135d3be5b32',
        value: '1.0',
        observationDateTime: '2017-03-01T08:19:29.000+0000',
        voided: false,
        comment: null,
        formNamespace: 'Bahmni',
        formFieldPath: 'SingleGroup.3/3-0',
        groupMembers: [{
          concept: {
            uuid: 'd0490af4-72eb-4090-9b43-ac3487ba7474',
            name: 'TestObs',
            dataType: 'Numeric',
            shortName: 'TestObs',
            conceptClass: 'Test',
            hiNormal: null,
            lowNormal: null,
            set: false,
            mappings: [],
          },
          uuid: '772b0080-e674-47b6-b0d8-5d88919465a2',
          value: 1,
          observationDateTime: '2017-03-01T08:19:29.000+0000',
          voided: false,
          comment: null,
          formNamespace: 'Bahmni',
          formFieldPath: 'SingleGroup.3/4-0',
        }],
      }];
      const expectedFormFieldPath = 'SingleGroup.3/3-0';
      const expectedSubFormFieldPath = 'SingleGroup.3/3-0/4-0';

      const controlRecordTree = (new ControlRecordTreeBuilder()).build(metadata, observation);

      const node = controlRecordTree.children;
      expect(node.size).to.equal(1);
      expect(node.get(0).formFieldPath).to.equal(expectedFormFieldPath);
      expect(node.get(0).control.concept.uuid).to.equal(obsGroupConcept.uuid);

      const subNode = node.get(0).children;
      expect(subNode.size).to.equal(1);
      expect(subNode.get(0).formFieldPath).to.equal(expectedSubFormFieldPath);
      expect(subNode.get(0).control.concept.uuid).to.equal(obsConcept.uuid);
      expect(subNode.get(0).value.value).to.equal(1);
    });

    it('should update data from record when input obs is emtpy', () => {
      const emptyObservation = [];
      const expectedSubFormFieldPath = 'SingleGroup.3/3-0/4-0';
      const controlRecordTree = (new ControlRecordTreeBuilder()).build(metadata, emptyObservation);

      const updatedRecordTree = controlRecordTree.update(expectedSubFormFieldPath, updatedValue);

      const node = updatedRecordTree.children;
      const subNode = node.get(0).children;
      expect(subNode.size).to.equal(1);
      expect(subNode.get(0).value.value).to.equal(1);
    });

    it('should generate data from record when input obs is emtpy', () => {
      const emptyObservation = [];
      const expectedSubFormFieldPath = 'SingleGroup.3/3-0/4-0';
      const controlRecordTree = (new ControlRecordTreeBuilder()).build(metadata, emptyObservation);
      const updatedRecordTree = controlRecordTree.update(expectedSubFormFieldPath, updatedValue);

      const obs = (new ObservationMapper()).from(updatedRecordTree);

      expect(obs.length).to.equal(1);
      expect(obs[0].groupMembers.length).to.equal(1);
      expect(obs[0].groupMembers[0].value).to.equal(1);
    });

    it('should remove value of all child records when a parent record is removed', () => {
      const innerObsControlRecord = new ControlRecord(
        {
          control: {
            type: 'obsControl',
            id: '4',
            concept: {
              name: 'This is concept',
            },
            units: null,
            hiNormal: null,
            lowNormal: null,
            hiAbsolute: null,
            lowAbsolute: null,
          },
          formFieldPath: 'ObsGroupTEst2.1/1-1/3-0/4-0',
          value: {
            value: 'aaaa',
            comment: null,
            interpretation: null,
          },
          active: true,
          enabled: true,
          hidden: false,
          showAddMore: true,
          showRemove: false,
          errors: [],
        }
          );
      const innerObsGrpControlRecord = new ControlRecord(
        {
          control: {
            type: 'obsGroupControl',
            properties: {
              addMore: true,
              location: {
                column: 0,
                row: 0,
              },
            },
            id: '3',
            concept: {
            },
          },
          formFieldPath: 'ObsGroupTEst2.1/1-1/3-0',
          children: List.of(innerObsControlRecord),
          value: 'aaaa',
          active: true,
          enabled: true,
          hidden: false,
          showAddMore: true,
          showRemove: false,
          errors: [],
        }
          );
      const parentControl = new ControlRecord(
        {
          control: {
            type: 'section',
            properties: {
              addMore: true,
              location: {
                column: 0,
                row: 0,
              },
            },
            id: '1',
          },
          formFieldPath: 'ObsGroupTEst2.1/1-1',
          children: List.of(innerObsGrpControlRecord),
          value: {},
          active: true,
          enabled: true,
          hidden: false,
          showAddMore: true,
          showRemove: false,
          errors: [],
        }
          );
      const formFieldPath = 'ObsGroupTEst2.1/1-1';
      const updatedControlRecord = parentControl.update(formFieldPath, {}, [], true);

      expect(updatedControlRecord.getValue()).to.eql(undefined);
      expect(updatedControlRecord.active).to.eql(false);
      expect(updatedControlRecord.children.get(0).getValue()).to.eql(undefined);
      expect(updatedControlRecord.children.get(0).children.get(0).getValue()).to.eql(undefined);
    });

    it('should generate data from record when input obs is nested section', () => {
      const observations = [{
        encounterDateTime: 1488435209000,
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
        encounterUuid: 'eeb1ae70-d764-46e9-ad73-13a796dd99de',
        obsGroupUuid: null,
        creatorName: 'Super Man',
        conceptSortWeight: 1,
        parentConceptUuid: null,
        hiNormal: null,
        lowNormal: null,
        formNamespace: 'Bahmni',
        formFieldPath: 'nested_section.1/2-0',
        voided: false,
        voidReason: null,
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
        valueAsString: '23.0',
        conceptUuid: '5090AAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        unknown: false,
        uuid: '733f6daa-e00e-4623-8576-81c945b5d178',
        observationDateTime: '2017-03-02T06:13:29.000+0000',
        comment: null,
        conceptNameToDisplay: 'HEIGHT',
        orderUuid: null,
        abnormal: null,
        value: 23,
      }, {
        encounterDateTime: 1488435209000,
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
        encounterUuid: 'eeb1ae70-d764-46e9-ad73-13a796dd99de',
        obsGroupUuid: null,
        creatorName: 'Super Man',
        conceptSortWeight: 1,
        parentConceptUuid: null,
        hiNormal: 72,
        lowNormal: 72,
        formNamespace: 'Bahmni',
        formFieldPath: 'nested_section.1/4-0',
        voided: false,
        voidReason: null,
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
        valueAsString: '1212.0',
        conceptUuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
        unknown: false,
        uuid: 'db2ce505-a655-416a-86c0-ea36d96b0ec1',
        observationDateTime: '2017-03-02T06:13:29.000+0000',
        comment: null,
        conceptNameToDisplay: 'Pulse',
        orderUuid: null,
        abnormal: null,
        value: 1212,
      }];

      const updatedMetadata = {
        name: 'nested_section',
        id: 43,
        uuid: '9b9b20ee-2350-42c3-b365-a395ec2590cb',
        controls: [{
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
        }],
        version: '1',
      };

      const controlRecordTree = (new ControlRecordTreeBuilder())
                                        .build(updatedMetadata, observations);

      expect(controlRecordTree.children.size).to.equal(1);
      expect(controlRecordTree.children.get(0).children.get(0).value.value).to.equal(23);

      const nested = controlRecordTree.children.get(0).children.get(1);
      expect(nested.children.size).to.equal(1);
      expect(nested.children.get(0).value.value).to.equal(1212);
    });
  });

  it('should generate record tree when section is add-more in given metadata with child obsControl',
      () => {
        const metadata = {
          name: 'section-add-more-with-obs',
          id: 43,
          uuid: '9b9b20ee-2350-42c3-b365-a395ec2590cb',
          controls: [
            {
              type: 'section',
              properties: {
                addMore: true,
              },
              id: 1,
              controls: [
                {
                  type: 'obsControl',
                  properties: {
                    addMore: false,
                  },
                  id: 2,
                },
              ],
            },
          ],
          version: 1,
        };

        const observations = [
          {
            formFieldPath: 'section-add-more-with-obs.1/1-0/2-0',
            value: 120,
          },
        ];

        const controlRecordTree = new ControlRecordTreeBuilder().build(metadata, observations);
        expect(controlRecordTree.children.size).to.equal(1);
        expect(controlRecordTree.children.get(0).children.get(0).value.value).to.equal(120);
      });

  it('should generate record tree when section is add-more in given metadata with' +
        'child obsGroupControl', () => {
    const metadata = {
      name: 'section-add-more-with-obsGroup',
      id: 43,
      uuid: '9b9b20ee-2350-42c3-b365-a395ec2590cb',
      controls: [
        {
          type: 'section',
          properties: {
            addMore: true,
          },
          id: 1,
          controls: [{
            type: 'obsGroupControl',
            properties: {
              addMore: false,
            },
            id: 2,
            controls: [
              {
                type: 'obsControl',
                properties: {
                  addMore: false,
                },
                id: 3,
              },
            ],
          },
          ],
        },
      ],
      version: 1,
    };

    const observations = [
      {
        formFieldPath: 'section-add-more-with-obsGroup.1/1-0/2-0',
        groupMembers: [
          {
            formFieldPath: 'section-add-more-with-obsGroup.1/1-0/2-0/3-0',
            voided: false,
            value: 120,
          },
        ],

      },
    ];

    const controlRecordTree = new ControlRecordTreeBuilder().build(metadata, observations);
    expect(controlRecordTree.children.size).to.equal(1);
    const sectionRecord = controlRecordTree.children.get(0);
    expect(sectionRecord.formFieldPath)
          .to.eql('section-add-more-with-obsGroup.1/1-0');
    const obsGroupRecord = sectionRecord.children.get(0);
    expect(obsGroupRecord.formFieldPath)
          .to.eql('section-add-more-with-obsGroup.1/1-0/2-0');
    expect(obsGroupRecord.children.get(0).formFieldPath)
          .to.eql('section-add-more-with-obsGroup.1/1-0/2-0/3-0');
    expect(obsGroupRecord.children.get(0).value.value)
          .to.equal(120);
  });
});
