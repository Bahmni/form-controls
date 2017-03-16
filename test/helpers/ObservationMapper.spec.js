import { List } from 'immutable';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { ControlRecord } from '../../src/helpers/ControlRecordTreeBuilder';
import ObservationMapper from '../../src/helpers/ObservationMapper';
import { ObsList } from 'src/helpers/ObsList';

chai.use(chaiEnzyme());

describe('ObservationMapper', () => {
  const obsFormFieldPath = 'ComplexTest.5/23-0';
  const obsConcept = {
    answers: [],
    datatype: 'Boolean',
    name: 'Smoking History',
    properties: {
      allowDecimal: null,
    },
    uuid: 'c2a43174-c9db-4e54-8516-17372c83537f',
  };
  const obsDataSource = {
    concept: obsConcept,
    formFieldPath: obsFormFieldPath,
    formNamespace: 'Bahmni',
    voided: true,
  };
  const obsControl = {
    concept: obsConcept,
    hiAbsolute: null,
    hiNormal: null,
    id: '23',
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
  };
  const labelFormFieldPath = 'ComplexTest.5/27-0';
  const labelControl = {
    id: '27',
    properties: {
      location: {
        column: 0,
        row: 1,
      },
    },
    type: 'label',
    value: 'This is label test',
  };
  const labelDataSource = {
    formFieldPath: labelFormFieldPath,
    formNamespace: 'Bahmni',
    voided: true,
  };

  it('should get obs exclude record that is voided and doesn\'t have concept', () => {
    const obsRecord = new ControlRecord({
      control: obsControl,
      formFieldPath: obsFormFieldPath,
      value: { value: false, comment: undefined },
      dataSource: obsDataSource,
    });
    const labelRecord = new ControlRecord({
      control: labelControl,
      formFieldPath: labelFormFieldPath,
      value: {},
      dataSource: labelDataSource,
    });
    const recordTree = new ControlRecord({ children: List.of(obsRecord, labelRecord) });

    const observations = (new ObservationMapper()).from(recordTree);

    expect(observations.length).to.equal(1);
    observations.forEach(obs => expect(obs.voided).to.equal(false));
  });

  it('should get obs include record that is voided but has concept', () => {
    const obsRecord = new ControlRecord({
      control: obsControl,
      formFieldPath: obsFormFieldPath,
      value: {},
      dataSource: obsDataSource,
    });
    const labelRecord = new ControlRecord({
      control: labelControl,
      formFieldPath: labelFormFieldPath,
      value: {},
      dataSource: labelDataSource,
    });
    const recordTree = new ControlRecord({ children: List.of(obsRecord, labelRecord) });

    const observations = (new ObservationMapper()).from(recordTree);

    expect(observations.length).to.equal(1);
    observations.forEach(obs => expect(obs.voided).to.equal(true));
  });

  it('should get multiple obs when given record of obsList type', () => {
    const obsListConcept = {
      answers: [
        {
          displayString: 'Condoms',
          name: {
            conceptNameType: 'FULLY_SPECIFIED',
            display: 'Condoms',
            locale: 'en',
            localePreferred: true,
            name: 'Condoms',
            resourceVersion: '1.9',
            uuid: '305d616f-3a6b-40e6-8053-23f3735f2844',
          },
          names: [
            {
              conceptNameType: 'FULLY_SPECIFIED',
              display: 'Condoms',
              locale: 'en',
              localePreferred: true,
              name: 'Condoms',
              resourceVersion: '1.9',
              uuid: '305d616f-3a6b-40e6-8053-23f3735f2844',
            },
          ],
          resourceVersion: '1.9',
          uuid: '1fe0597e-470d-49bd-9d82-9c7b7342dab0',
        },
        {
          displayString: 'Pills',
          name: {
            conceptNameType: 'FULLY_SPECIFIED',
            display: 'Pills',
            locale: 'en',
            localePreferred: true,
            name: 'Pills',
            resourceVersion: '1.9',
            uuid: '65da2a33-8ae7-4b71-b490-e484a8f6b3b2',
          },
          names: [
            {
              conceptNameType: 'FULLY_SPECIFIED',
              display: 'Pills',
              locale: 'en',
              localePreferred: true,
              name: 'Pills',
              resourceVersion: '1.9',
              uuid: '65da2a33-8ae7-4b71-b490-e484a8f6b3b2',
            },
          ],
          resourceVersion: '1.9',
          uuid: 'ffa2244a-8729-47fc-9185-d62a7033b511',
        },
        {
          displayString: 'Depo Provera',
          name: {
            conceptNameType: 'FULLY_SPECIFIED',
            display: 'Depo Provera',
            locale: 'en',
            localePreferred: true,
            name: 'Depo Provera',
            resourceVersion: '1.9',
            uuid: '3ef03635-1e07-4368-bd94-9dc14d9031fe',
          },
          names: [
            {
              conceptNameType: 'FULLY_SPECIFIED',
              display: 'Depo Provera',
              locale: 'en',
              localePreferred: true,
              name: 'Depo Provera',
              resourceVersion: '1.9',
              uuid: '3ef03635-1e07-4368-bd94-9dc14d9031fe',
            },
          ],
          resourceVersion: '1.9',
          uuid: '593959fa-7e93-4ab8-bf25-71574e87f56c',
        },
        {
          displayString: 'Female sterilization',
          name: {
            conceptNameType: 'FULLY_SPECIFIED',
            display: 'Female sterilization',
            locale: 'en',
            localePreferred: true,
            name: 'Female sterilization',
            resourceVersion: '1.9',
            uuid: '15b02d66-4d17-4b78-8112-f2bc9b1101ef',
          },
          names: [
            {
              conceptNameType: 'FULLY_SPECIFIED',
              display: 'Female sterilization',
              locale: 'en',
              localePreferred: true,
              name: 'Female sterilization',
              resourceVersion: '1.9',
              uuid: '15b02d66-4d17-4b78-8112-f2bc9b1101ef',
            },
          ],
          resourceVersion: '1.9',
          uuid: 'cdde742d-bce2-49da-94fd-8717040d914b',
        },
        {
          displayString: 'Male sterilization',
          name: {
            conceptNameType: 'FULLY_SPECIFIED',
            display: 'Male sterilization',
            locale: 'en',
            localePreferred: true,
            name: 'Male sterilization',
            resourceVersion: '1.9',
            uuid: '881ea44f-a9db-4c48-b6dd-9a48a9536807',
          },
          names: [
            {
              conceptNameType: 'FULLY_SPECIFIED',
              display: 'Male sterilization',
              locale: 'en',
              localePreferred: true,
              name: 'Male sterilization',
              resourceVersion: '1.9',
              uuid: '881ea44f-a9db-4c48-b6dd-9a48a9536807',
            },
          ],
          resourceVersion: '1.9',
          uuid: 'fd941da4-f45d-471e-a007-53867a6251ec',
        },
        {
          displayString: 'Implant',
          name: {
            conceptNameType: 'FULLY_SPECIFIED',
            display: 'Implant',
            locale: 'en',
            localePreferred: true,
            name: 'Implant',
            resourceVersion: '1.9',
            uuid: '5e0305ae-d310-4a4c-9fda-26fd96ce4a90',
          },
          names: [
            {
              conceptNameType: 'FULLY_SPECIFIED',
              display: 'Implant',
              locale: 'en',
              localePreferred: true,
              name: 'Implant',
              resourceVersion: '1.9',
              uuid: '5e0305ae-d310-4a4c-9fda-26fd96ce4a90',
            },
          ],
          resourceVersion: '1.9',
          uuid: '66a6bacc-8ac0-4c2c-b44a-d62ca9a3e89b',
        },
        {
          displayString: 'Intra Uterine Contraceptive Device',
          name: {
            conceptNameType: 'FULLY_SPECIFIED',
            display: 'Intra Uterine Contraceptive Device',
            locale: 'en',
            localePreferred: true,
            name: 'Intra Uterine Contraceptive Device',
            resourceVersion: '1.9',
            uuid: 'f73455ea-0556-4107-b485-0a61aa7fa561',
          },
          names: [
            {
              conceptNameType: 'SHORT',
              display: 'IUCD',
              locale: 'en',
              localePreferred: false,
              name: 'IUCD',
              resourceVersion: '1.9',
              uuid: '6adb7900-0fe4-4f60-a6b2-f9d7e3bcca32',
            },
            {
              conceptNameType: 'FULLY_SPECIFIED',
              display: 'Intra Uterine Contraceptive Device',
              locale: 'en',
              localePreferred: true,
              name: 'Intra Uterine Contraceptive Device',
              resourceVersion: '1.9',
              uuid: 'f73455ea-0556-4107-b485-0a61aa7fa561',
            },
          ],
          resourceVersion: '1.9',
          uuid: 'fb5767ed-e228-4c34-91a6-9421f61879d2',
        },
      ],
      datatype: 'Coded',
      description: [],
      name: 'Accepted Family Planning methods',
      properties: {
        allowDecimal: null,
      },
      uuid: '7269aa2e-5901-41ab-a738-eb0b83ff1d78',
    };
    const obsListControl = {
      concept: obsListConcept,
      hiAbsolute: null,
      hiNormal: null,
      id: '2',
      label: {
        type: 'label',
        value: 'Accepted Family Planning methods',
      },
      lowAbsolute: null,
      lowNormal: null,
      properties: {
        addMore: false,
        autoComplete: false,
        dropDown: false,
        hideLabel: false,
        location: {
          column: 0,
          row: 0,
        },
        mandatory: false,
        multiSelect: true,
        notes: false,
      },
      type: 'obsControl',
      units: null,
    };
    const obsListFormFieldPath = 'multipleSelect.1/2-0';
    const obsListDataSource = new ObsList({
      obsList: new List(),
      formFieldPath: obsListFormFieldPath,
      obs: {
        concept: obsListConcept,
        formFieldPath: obsListFormFieldPath,
        formNamespace: 'Bahmni',
        voided: true,
      } });
    const obsListValue = {
      value: [
        {
          displayString: 'Condoms',
          name: {
            conceptNameType: 'FULLY_SPECIFIED',
            display: 'Condoms',
            locale: 'en',
            localePreferred: true,
            name: 'Condoms',
            resourceVersion: '1.9',
            uuid: '305d616f-3a6b-40e6-8053-23f3735f2844',
          },
          names: [
            {
              conceptNameType: 'FULLY_SPECIFIED',
              display: 'Condoms',
              locale: 'en',
              localePreferred: true,
              name: 'Condoms',
              resourceVersion: '1.9',
              uuid: '305d616f-3a6b-40e6-8053-23f3735f2844',
            },
          ],
          resourceVersion: '1.9',
          uuid: '1fe0597e-470d-49bd-9d82-9c7b7342dab0',
        },
        {
          displayString: 'Depo Provera',
          name: {
            conceptNameType: 'FULLY_SPECIFIED',
            display: 'Depo Provera',
            locale: 'en',
            localePreferred: true,
            name: 'Depo Provera',
            resourceVersion: '1.9',
            uuid: '3ef03635-1e07-4368-bd94-9dc14d9031fe',
          },
          names: [
            {
              conceptNameType: 'FULLY_SPECIFIED',
              display: 'Depo Provera',
              locale: 'en',
              localePreferred: true,
              name: 'Depo Provera',
              resourceVersion: '1.9',
              uuid: '3ef03635-1e07-4368-bd94-9dc14d9031fe',
            },
          ],
          resourceVersion: '1.9',
          uuid: '593959fa-7e93-4ab8-bf25-71574e87f56c',
        },
      ],
    };

    const obsListRecord = new ControlRecord({
      control: obsListControl,
      formFieldPath: obsListFormFieldPath,
      value: obsListValue,
      dataSource: obsListDataSource,
    });
    const recordTree = new ControlRecord({ children: List.of(obsListRecord) });

    const observations = (new ObservationMapper()).from(recordTree);

    expect(observations.length).to.equal(2);
    expect(observations[0].formFieldPath).to.equal('multipleSelect.1/2-0');
    expect(observations[1].formFieldPath).to.equal('multipleSelect.1/2-0');
  });

  it('should get inactive obs when given inactive record', () => {
    const obsConcept = {
      "answers": [],
      "datatype": "Numeric",
      "description": [],
      "name": "Pulse",
      "properties": {
        "allowDecimal": true
      },
      "uuid": "c36bc411-3f10-11e4-adec-0800271c1b75"
    };
    const activeFormFieldPath = 'SingleObs.1/1-0';
    const activeObsRecordTree = new ControlRecord({
      control: {
        "concept": obsConcept,
        "hiAbsolute": null,
        "hiNormal": 72,
        "id": "1",
        "label": {
          "type": "label",
          "value": "Pulse(/min)"
        },
        "lowAbsolute": null,
        "lowNormal": 72,
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
        "units": "/min"
      },
      formFieldPath: activeFormFieldPath,
      dataSource: {
        "concept": obsConcept,
        "formFieldPath": activeFormFieldPath,
        "formNamespace": "Bahmni",
        "voided": true
      },
    });
    const inactiveFormFieldPath = 'SingleObs.1/1-1';
    const inactiveObsRecordTree = new ControlRecord({
      control: {
        "concept": obsConcept,
        "hiAbsolute": null,
        "hiNormal": 72,
        "id": "1",
        "label": {
          "type": "label",
          "value": "Pulse(/min)"
        },
        "lowAbsolute": null,
        "lowNormal": 72,
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
        "units": "/min"
      },
      formFieldPath: inactiveFormFieldPath,
      dataSource: {
        "concept": obsConcept,
        "formFieldPath": activeFormFieldPath,
        "formNamespace": "Bahmni",
        "voided": true
      },
      active: false
    });
    const rootRecordTree = new ControlRecord({children: List.of(activeObsRecordTree, inactiveObsRecordTree)});

    const observations = new ObservationMapper().from(rootRecordTree);

    const activeObservation = observations[0];
    expect(activeObservation.formFieldPath).to.equal(activeFormFieldPath);
    expect(activeObservation.inactive).to.equal(false);
    const inactiveObservation = observations[1];
    expect(inactiveObservation.formFieldPath).to.equal(inactiveFormFieldPath);
    expect(inactiveObservation.inactive).to.equal(true);
  })
});
