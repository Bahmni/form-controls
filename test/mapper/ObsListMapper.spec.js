import { ObsListMapper } from 'src/mapper/ObsListMapper';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { ObsList } from '../../src/helpers/ObsList';
import { List } from 'immutable';
import { ControlRecord } from '../../src/helpers/ControlRecordTreeBuilder';

chai.use(chaiEnzyme());

describe('ObsListMapper', () => {
  const formName = 'multipleSelect';
  const formVersion = '1';
  const multipleSelectConcept = {
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
  const multipleSelectControl = {
    concept: multipleSelectConcept,
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
  const formFieldPath = 'multipleSelect.1/2-0';
  const obs1 = {
    concept: multipleSelectConcept,
    formFieldPath,
    formNamespace: 'Bahmni',
    value: {
      conceptClass: 'Misc',
      dataType: 'N/A',
      hiNormal: null,
      lowNormal: null,
      mappings: [],
      name: 'Pills',
      set: false,
      shortName: 'Pills',
      uuid: 'ffa2244a-8729-47fc-9185-d62a7033b511',
    },
    voided: false,
  };
  const obs2 = {
    concept: multipleSelectConcept,
    formFieldPath,
    formNamespace: 'Bahmni',
    value: {
      conceptClass: 'Misc',
      dataType: 'N/A',
      hiNormal: null,
      lowNormal: null,
      mappings: [],
      name: 'Condoms',
      set: false,
      shortName: 'Condoms',
      uuid: '1fe0597e-470d-49bd-9d82-9c7b7342dab0',
    },
    voided: false,
  };

  const obsListData = new ObsList({
    obsList: List.of(obs1, obs2),
    formFieldPath,
    obs: {
      concept: multipleSelectConcept,
      formFieldPath,
      formNamespace: 'Bahmni',
      voided: true,
    } });

  it('should get obsList when getInitialObject be triggered with empty observation', () => {
    const emptyObservation = [];

    const obsLists = new ObsListMapper()
      .getInitialObject(formName, formVersion, multipleSelectControl, emptyObservation);

    expect(obsLists[0].obsList.size).to.equal(0);
    expect(obsLists[0].formFieldPath).to.equal(formFieldPath);
    expect(obsLists[0].obs.concept).to.equal(multipleSelectConcept);
    expect(obsLists[0].obs.formFieldPath).to.equal(formFieldPath);
    expect(obsLists[0].obs.voided).to.equal(true);
  });

  it('should get obsList when getInitialObject be triggered with observation', () => {
    const observations = [obs1, obs2];

    const obsLists = new ObsListMapper()
      .getInitialObject(formName, formVersion, multipleSelectControl, observations);

    expect(obsLists[0].obsList.size).to.equal(observations.length);
    expect(obsLists[0].formFieldPath).to.equal(formFieldPath);
    expect(obsLists[0].obs.concept).to.equal(multipleSelectConcept);
    expect(obsLists[0].obs.formFieldPath).to.equal(formFieldPath);
    expect(obsLists[0].obs.voided).to.equal(true);
  });

  it('should get value from record with obsList type when getValue be triggered', () => {
    const value = new ObsListMapper().getValue(obsListData);

    expect(value.value.length).to.equal(obsListData.obsList.size);
  });

  it('should get obs from record when getData be triggered', () => {
    const record = new ControlRecord({
      control: multipleSelectControl,
      formFieldPath,
      value: {
        value: [
          {
            conceptClass: 'Misc',
            dataType: 'N/A',
            hiNormal: null,
            lowNormal: null,
            mappings: [],
            name: 'Pills',
            set: false,
            shortName: 'Pills',
            uuid: 'ffa2244a-8729-47fc-9185-d62a7033b511',
          },
          {
            conceptClass: 'Misc',
            dataType: 'N/A',
            hiNormal: null,
            lowNormal: null,
            mappings: [],
            name: 'Condoms',
            set: false,
            shortName: 'Condoms',
            uuid: '1fe0597e-470d-49bd-9d82-9c7b7342dab0',
          },
        ] },
      dataSource: obsListData,
    });

    const obsArray = new ObsListMapper().getData(record);

    expect(obsArray.length).to.equal(record.value.value.length);
  });

  it('should get obs with voided when given record without value but saved before', () => {
    const record = new ControlRecord({
      control: multipleSelectControl,
      formFieldPath,
      value: { value: [] },
      dataSource: obsListData,
    });

    const obsArray = new ObsListMapper().getData(record);

    expect(obsArray.length).to.equal(record.dataSource.obsList.size);
    expect(obsArray[0].voided).to.equal(true);
    expect(obsArray[1].voided).to.equal(true);
  });
});
