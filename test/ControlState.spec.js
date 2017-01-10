import { expect } from 'chai';
import { ControlState, ControlRecord, controlStateFactory } from 'src/ControlState';
import { createFormNamespaceAndPath } from 'src/helpers/formNamespace';

describe('Control State', () => {
  const form = {
    id: 1,
    name: 'Vitals',
    version: '1',
    uuid: 'fbc5d897-64e4-4cc1-90a3-47fde7a98026',
    controls: [
      {
        id: '1',
        type: 'obsControl',
        label: {
          id: 'systolic',
          type: 'label',
          value: 'Systolic',
        },
        properties: {
          mandatory: true,
          allowDecimal: false,
          location: {
            column: 0,
            row: 0,
          },
        },
        concept: {
          name: 'Systolic',
          uuid: 'c36e9c8b-3f10-11e4-adec-0800271c1b75',
          datatype: 'Numeric',
        },
      },
      {
        id: '2',
        type: 'obsControl',
        label: {
          id: 'diastolic',
          type: 'label',
          value: 'Diastolic',
        },
        properties: {
          mandatory: true,
          location: {
            column: 0,
            row: 0,
          },
        },
        concept: {
          name: 'Diastolic',
          uuid: 'c379aa1d-3f10-11e4-adec-0800271c1b75',
          datatype: 'Text',
        },
      },
      {
        id: '3',
        type: 'obsControl',
        label: {
          type: 'label',
          value: 'Smoking History',
        },
        displayType: 'radio',
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
          mandatory: true,
          notes: false,
          location: {
            column: 0,
            row: 0,
          },
        },
        concept: {
          name: 'Smoking History',
          uuid: 'c2a43174-c9db-4e54-8516-17372c83537f',
          datatype: 'Boolean',
          properties: {
            allowDecimal: null,
          },
        },
      },
    ],
  };

  const record1 = new ControlRecord({ formFieldPath: 'FID.1/CID1' });
  const record2 = new ControlRecord({ formFieldPath: 'FID.1/CID2' });
  const record3 = new ControlRecord({ formFieldPath: 'FID.1/CID3' });


  it('should initialize with the given records', () => {
    const records = [record1, record2];
    const controlState = new ControlState().setRecords(records);
    const updatedState = controlState.getRecords();
    expect(updatedState).to.deep.equal(records);
  });

  it('should insert new record', () => {
    const records = [record1, record2];
    const controlState = new ControlState().setRecords(records);
    const updatedState = controlState.getRecords();

    expect(updatedState).to.be.deep.equal(records);
    expect(controlState.setRecord(record3).getRecords()).to.deep.equal([record1, record2, record3]);
  });

  it('should fetch record based on the formNamespace', () => {
    const records = [record1, record2];
    const controlState = new ControlState().setRecords(records);
    const fetchedRecord = controlState.getRecord('FID.1/CID1');

    expect(fetchedRecord).to.be.deep.equal(record1);
  });

  describe('controlStateFactory', () => {
    it('should create control state with the metadata provided', () => {
      const controlState = controlStateFactory(form, []);
      const expectedRecords = controlState.getRecords();

      expect(expectedRecords).to.have.length(3);

      const namespaces = form.controls.map(control =>
        createFormNamespaceAndPath(form.name, form.version, control.id).formFieldPath
      );

      expectedRecords.forEach((record) => {
        expect(namespaces).to.include(record.formFieldPath);
      });
    });


    it('should insert observations into the appropriate records', () => {
      const formNamespaceAndPath =
        createFormNamespaceAndPath(form.name, form.version, form.controls[1].id);
      const obs1 = {
        uuid: 'obs1',
        formNamespace: formNamespaceAndPath.formNamespace,
        formFieldPath: formNamespaceAndPath.formFieldPath,
      };
      const controlState = controlStateFactory(form, [obs1]);
      const records = controlState.getRecords();
      const { formFieldPath: formFieldPath1 } =
        createFormNamespaceAndPath(form.name, form.version, form.controls[0].id);
      const { formFieldPath: formFieldPath2 } =
        createFormNamespaceAndPath(form.name, form.version, form.controls[2].id);

      expect(records).to.have.length(3);


      expect(controlState.getRecord(obs1.formFieldPath).obs.uuid).to.deep.equal(obs1.uuid);
      expect(controlState.getRecord(formFieldPath1).obs.formFieldPath).to.equal(formFieldPath1);
      expect(controlState.getRecord(formFieldPath2).obs.formFieldPath).to.equal(formFieldPath2);
    });
  });
});
