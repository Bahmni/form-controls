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

    it('should create multiple layer record given multiple layer metatdata and empty data', () => {
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
  });

});