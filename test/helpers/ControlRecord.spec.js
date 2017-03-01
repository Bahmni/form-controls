import ControlRecordTreeBuilder from '../../src/helpers/ControlRecordTreeBuilder';

describe.only('Control Record', () => {

  describe('Single Layer Record', () => {

    const obsConcept = {
      "datatype": "Numeric",
      "name": "Pulse",
      "properties": {
        "allowDecimal": true
      },
      "uuid": "c36bc411-3f10-11e4-adec-0800271c1b75"
    };

    const metadata = {
      "controls": [
        {
          "concept": obsConcept,
          "id": "1",
          "label": {
            "type": "label",
            "value": "Pulse(/min)"
          },
          "properties": {
            "addMore": true,
            "hideLabel": false,
            "location": {
              "column": 0,
              "row": 0
            },
            "mandatory": true,
            "notes": false
          },
          "type": "obsControl",
        }
      ],
      "id": 209,
      "name": "SingleObs",
      "uuid": "245940b7-3d6b-4a8b-806b-3f56444129ae",
      "version": "1"
    };

    it('should create single layer record given single layer metadata and empty data', () => {
      const emptyObservation = [];
      const expectedFormFieldPath = 'SingleObs.1/1-0';

      const controlRecordTree = (new ControlRecordTreeBuilder()).build(metadata, emptyObservation);

      expect(controlRecordTree.children.size).to.equal(1);
      expect(controlRecordTree.children.get(0).formFieldPath).to.equal(expectedFormFieldPath);
      expect(controlRecordTree.children.get(0).control.concept.uuid).to.equal(obsConcept.uuid);
    });

    it('should create single layer record given single layer metadata and data', () => {
      const observation = [{
        "encounterDateTime": 1488354632000,
        "visitStartDateTime": null,
        "targetObsRelation": null,
        "groupMembers": [],
        "providers": [{
          "uuid": "c1c26908-3f10-11e4-adec-0800271c1b75",
          "name": "Super Man",
          "encounterRoleUuid": "a0b03050-c99b-11e0-9572-0800200c9a66"
        }],
        "isAbnormal": null,
        "duration": null,
        "type": "Numeric",
        "encounterUuid": "957a49f2-98ba-4cbc-a9f5-233be6d1afe5",
        "obsGroupUuid": null,
        "creatorName": "Super Man",
        "conceptSortWeight": 1,
        "parentConceptUuid": null,
        "hiNormal": 72,
        "lowNormal": 72,
        "formNamespace": "Bahmni",
        "formFieldPath": "SingleObs.1/1-0",
        "conceptUuid": "c36bc411-3f10-11e4-adec-0800271c1b75",
        "concept": {
          "uuid": "c36bc411-3f10-11e4-adec-0800271c1b75",
          "name": "Pulse",
          "dataType": "Numeric",
          "shortName": "Pulse",
          "units": "/min",
          "conceptClass": "Misc",
          "hiNormal": 72,
          "lowNormal": 72,
          "set": false,
          "mappings": []
        },
        "valueAsString": "1.0",
        "voided": false,
        "voidReason": null,
        "unknown": false,
        "uuid": "a2b351b7-03e2-47ce-a47d-b47ad425d3f6",
        "observationDateTime": "2017-03-01T07:50:32.000+0000",
        "comment": null,
        "abnormal": null,
        "orderUuid": null,
        "conceptNameToDisplay": "Pulse",
        "value": 1
      }];

      const expectedFormFieldPath = 'SingleObs.1/1-0';

      const controlRecordTree = (new ControlRecordTreeBuilder()).build(metadata, observation);

      expect(controlRecordTree.children.size).to.equal(1);
      expect(controlRecordTree.children.get(0).formFieldPath).to.equal(expectedFormFieldPath);
      expect(controlRecordTree.children.get(0).value).to.equal(1);
    });

    it('should update value when given value to obs control', () => {
      const emptyObservation = [];
      const formFieldPath = 'SingleObs.1/1-0';
      const controlRecordTree = (new ControlRecordTreeBuilder()).build(metadata, emptyObservation);

      const updatedRecordTree = ControlRecordTreeBuilder.update(controlRecordTree, formFieldPath, 1);

      expect(updatedRecordTree.children.get(0).formFieldPath).to.equal(formFieldPath);
      expect(updatedRecordTree.children.get(0).value).to.equal(1);
    });
  });

  describe('Multiple layer Record', () => {

    const obsGroupConcept = {
      "datatype": "N/A",
      "name": "TestGroup",
      "setMembers": [
        {
          "datatype": "Numeric",
          "name": "TestObs",
          "properties": {
            "allowDecimal": false
          },
          "uuid": "d0490af4-72eb-4090-9b43-ac3487ba7474"
        }
      ],
      "uuid": "eafe7d68-904b-459b-b11d-6502ec0143a4"
    };

    const obsConcept = {
      "datatype": "Numeric",
      "name": "TestObs",
      "properties": {
        "allowDecimal": false
      },
      "uuid": "d0490af4-72eb-4090-9b43-ac3487ba7474"
    };

    const metadata = {
      "controls": [
        {
          "concept": obsGroupConcept,
          "controls": [
            {
              "concept": obsConcept,
              "id": "4",
              "label": {
                "type": "label",
                "value": "TestObs"
              },
              "properties": {
                "addMore": true,
                "hideLabel": false,
                "location": {
                  "column": 0,
                  "row": 0
                },
                "mandatory": false,
                "notes": false
              },
              "type": "obsControl",
            }
          ],
          "id": "3",
          "label": {
            "type": "label",
            "value": "TestGroup"
          },
          "properties": {
            "abnormal": false,
            "addMore": true,
            "location": {
              "column": 0,
              "row": 0
            }
          },
          "type": "obsGroupControl"
        }
      ],
      "id": 210,
      "name": "SingleGroup",
      "uuid": "72801201-2154-4f1e-89cb-21a57a23d06a",
      "version": "3"
    };

    it('should create multiple layer record given multiple layer metadata and empty data', () => {
      const emptyObservation = [];
      const expectedFormFieldPath = 'SingleGroup.3/3-0';
      const expectedSubFormFieldPath = 'SingleGroup.3/4-0';

      const controlRecordTree = (new ControlRecordTreeBuilder()).build(metadata, emptyObservation);

      const node = controlRecordTree.children;
      expect(node.size).to.equal(1);
      expect(node.get(0).formFieldPath).to.equal(expectedFormFieldPath);
      expect(node.get(0).control.concept.uuid).to.equal(obsGroupConcept.uuid);

      const subNode = node.get(0).children;
      expect(subNode.size).to.equal(1);
      expect(subNode.get(0).formFieldPath).to.equal(expectedSubFormFieldPath);
      expect(subNode.get(0).control.concept.uuid).to.equal(obsConcept.uuid);
    })

    it('should create multiple layer record given multiple layer metadata and data', () => {
      const observation = [{
        "concept": {
          "uuid": "eafe7d68-904b-459b-b11d-6502ec0143a4",
          "name": "TestGroup",
          "dataType": "N/A",
          "shortName": "TestGroup",
          "conceptClass": "Concept Details",
          "hiNormal": null,
          "lowNormal": null,
          "set": true,
          "mappings": []
        },
        "uuid": "4f8a9887-9780-4b0e-8e1e-9135d3be5b32",
        "value": "1.0",
        "observationDateTime": "2017-03-01T08:19:29.000+0000",
        "voided": false,
        "comment": null,
        "formNamespace": "Bahmni",
        "formFieldPath": "SingleGroup.3/3-0",
        "groupMembers": [{
          "concept": {
            "uuid": "d0490af4-72eb-4090-9b43-ac3487ba7474",
            "name": "TestObs",
            "dataType": "Numeric",
            "shortName": "TestObs",
            "conceptClass": "Test",
            "hiNormal": null,
            "lowNormal": null,
            "set": false,
            "mappings": []
          },
          "uuid": "772b0080-e674-47b6-b0d8-5d88919465a2",
          "value": 1,
          "observationDateTime": "2017-03-01T08:19:29.000+0000",
          "voided": false,
          "comment": null,
          "formNamespace": "Bahmni",
          "formFieldPath": "SingleGroup.3/4-0"
        }]
      }];
      const expectedFormFieldPath = 'SingleGroup.3/3-0';
      const expectedSubFormFieldPath = 'SingleGroup.3/4-0';

      const controlRecordTree = (new ControlRecordTreeBuilder()).build(metadata, observation);

      const node = controlRecordTree.children;
      expect(node.size).to.equal(1);
      expect(node.get(0).formFieldPath).to.equal(expectedFormFieldPath);
      expect(node.get(0).control.concept.uuid).to.equal(obsGroupConcept.uuid);

      const subNode = node.get(0).children;
      expect(subNode.size).to.equal(1);
      expect(subNode.get(0).formFieldPath).to.equal(expectedSubFormFieldPath);
      expect(subNode.get(0).control.concept.uuid).to.equal(obsConcept.uuid);
      expect(subNode.get(0).value).to.equal(1);
    })
  });

});