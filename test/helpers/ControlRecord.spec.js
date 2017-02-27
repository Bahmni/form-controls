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
    })
  });

  describe('Multiple layer Record', () => {
    it('should create multiple layer record given multiple layer metatdata and empty data', () => {

    })
  });

});