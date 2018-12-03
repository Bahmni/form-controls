import { ObsListMapper } from 'src/mapper/ObsListMapper';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { ObsList } from '../../src/helpers/ObsList';
import { List } from 'immutable';
import { ControlRecord } from '../../src/helpers/ControlRecordTreeBuilder';
import { cloneDeep } from 'lodash';

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

  it('should get obsList when getInitialObject with empty observation', () => {
    const emptyObservation = [];

    const obsLists = new ObsListMapper()
      .getInitialObject(formName, formVersion, multipleSelectControl, emptyObservation);

    expect(obsLists[0].obsList.size).to.equal(0);
    expect(obsLists[0].formFieldPath).to.equal(formFieldPath);
    expect(obsLists[0].obs.concept).to.equal(multipleSelectConcept);
    expect(obsLists[0].obs.formFieldPath).to.equal(formFieldPath);
    expect(obsLists[0].obs.voided).to.equal(true);
  });

  it('should get obsList when getInitialObject with observation', () => {
    const observations = [obs1, obs2];

    const obsLists = new ObsListMapper()
      .getInitialObject(formName, formVersion, multipleSelectControl, observations);

    expect(obsLists[0].obsList.size).to.equal(observations.length);
    expect(obsLists[0].formFieldPath).to.equal(formFieldPath);
    expect(obsLists[0].obs.concept).to.equal(multipleSelectConcept);
    expect(obsLists[0].obs.formFieldPath).to.equal(formFieldPath);
    expect(obsLists[0].obs.voided).to.equal(true);
  });

  it('should get correct obs when getInitialObject with observation', () => {
    const obs = cloneDeep(obs1);
    obs.formFieldPath = 'multipleSelect.1/20-0';    // this form field path is part of multipleSelect.1/2
    const observations = [obs];

    const obsLists = new ObsListMapper()
      .getInitialObject(formName, formVersion, multipleSelectControl, observations);

    expect(obsLists[0].obsList.size).to.equal(0);
    expect(obsLists[0].formFieldPath).to.equal(formFieldPath);
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

  it('should save comment to obs when given record has comment', () => {
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
        ],
        comment: 'this is a comment',
      },
      dataSource: obsListData,
    });

    const obsArray = new ObsListMapper().getData(record);

    expect(obsArray[0].comment).to.equal(record.value.comment);
    expect(obsArray[1].comment).to.equal(record.value.comment);
  });

  it('should get value with comment when given record has comment', () => {
    const obs1WithComment = cloneDeep(obs1);
    obs1WithComment.comment = 'this is a comment';

    const obsListDataWithComment = new ObsList({
      obsList: List.of(obs1WithComment, obs2),
      formFieldPath,
      obs: {
        concept: multipleSelectConcept,
        formFieldPath,
        formNamespace: 'Bahmni',
        voided: true,
      } });


    const value = new ObsListMapper().getValue(obsListDataWithComment);

    expect(value.comment).to.equal(obs1WithComment.comment);
  });
  it('should return obs with same uuid available in obsList if formFieldPath matches', () => {
    const multiSelectCtrlRecord = new ControlRecord({
      valueMapper: {},
      control: {
        type: 'obsControl',
        label: {
          translationKey: 'P/A_PRESENTING_PART_7',
          id: '7',
          units: '',
          type: 'label',
          value: 'P/A Presenting Part',
        },
        properties: {
          multiSelect: true,
        },
        id: '7',
        unsupportedProperties: [],
        concept: {
          name: 'P/A Presenting Part',
          uuid: 'c4517f49-3f10-11e4-adec-0800271c1b75',
          datatype: 'Coded',
          conceptClass: 'Misc',
          conceptHandler: null,
          answers: [
            {
              uuid: 'c4526510-3f10-11e4-adec-0800271c1b75',
              name: {
                display: 'Cephalic',
                uuid: 'c4526bb2-3f10-11e4-adec-0800271c1b75',
                name: 'Cephalic',
                locale: 'en',
                localePreferred: true,
                conceptNameType: 'FULLY_SPECIFIED',
                links: [
                ],
                resourceVersion: '1.9',
              },
              names: [
                {
                  display: 'Cephalic',
                  uuid: 'c4526bb2-3f10-11e4-adec-0800271c1b75',
                  name: 'Cephalic',
                  locale: 'en',
                  localePreferred: true,
                  conceptNameType: 'FULLY_SPECIFIED',
                  links: [
                  ],
                  resourceVersion: '1.9',
                },
                {
                  display: 'Cephalic',
                  uuid: '57626fe7-a25e-404f-8c5e-427b407f97aa',
                  name: 'Cephalic',
                  locale: 'en',
                  localePreferred: false,
                  conceptNameType: 'SHORT',
                  links: [
                  ],
                  resourceVersion: '1.9',
                },
              ],
              displayString: 'Cephalic',
              resourceVersion: '2.0',
              translationKey: 'CEPHALIC_7',
            },
            {
              uuid: 'c45329de-3f10-11e4-adec-0800271c1b75',
              name: {
                display: 'Breech',
                uuid: 'c45330f0-3f10-11e4-adec-0800271c1b75',
                name: 'Breech',
                locale: 'en',
                localePreferred: true,
                conceptNameType: 'FULLY_SPECIFIED',
                links: [

                ],
                resourceVersion: '1.9',
              },
              names: [
                {
                  display: 'Breech',
                  uuid: 'c45330f0-3f10-11e4-adec-0800271c1b75',
                  name: 'Breech',
                  locale: 'en',
                  localePreferred: true,
                  conceptNameType: 'FULLY_SPECIFIED',
                  links: [

                  ],
                  resourceVersion: '1.9',
                },
                {
                  display: 'Breech',
                  uuid: '0ab2ccd3-40e9-43ef-99c2-b6b745a49135',
                  name: 'Breech',
                  locale: 'en',
                  localePreferred: false,
                  conceptNameType: 'SHORT',
                  links: [

                  ],
                  resourceVersion: '1.9',
                },
              ],
              displayString: 'Breech',
              resourceVersion: '2.0',
              translationKey: 'BREECH_7',
            },
            {
              uuid: 'c453caa3-3f10-11e4-adec-0800271c1b75',
              name: {
                display: 'Transverse',
                uuid: 'c453d148-3f10-11e4-adec-0800271c1b75',
                name: 'Transverse',
                locale: 'en',
                localePreferred: true,
                conceptNameType: 'FULLY_SPECIFIED',
                links: [

                ],
                resourceVersion: '1.9',
              },
              names: [
                {
                  display: 'Transverse',
                  uuid: 'c453ce42-3f10-11e4-adec-0800271c1b75',
                  name: 'Transverse',
                  locale: 'en',
                  localePreferred: false,
                  conceptNameType: 'SHORT',
                  links: [

                  ],
                  resourceVersion: '1.9',
                },
                {
                  display: 'Transverse',
                  uuid: 'c453d148-3f10-11e4-adec-0800271c1b75',
                  name: 'Transverse',
                  locale: 'en',
                  localePreferred: true,
                  conceptNameType: 'FULLY_SPECIFIED',
                  links: [

                  ],
                  resourceVersion: '1.9',
                },
              ],
              displayString: 'Transverse',
              resourceVersion: '2.0',
              translationKey: 'TRANSVERSE_7',
            },
          ],
          properties: {
            allowDecimal: null,
          },
        },
        units: null,
        hiNormal: null,
        lowNormal: null,
        hiAbsolute: null,
        lowAbsolute: null,
      },
      formFieldPath: 'multiSelectThree.7/6-0/7-0',
      dataSource: {
        formFieldPath: 'multiSelectThree.7/6-0/7-0',
        obs: {
          concept: {
            name: 'P/A Presenting Part',
            uuid: 'c4517f49-3f10-11e4-adec-0800271c1b75',
            datatype: 'Coded',
            conceptClass: 'Misc',
            conceptHandler: null,
            answers: [
              {
                uuid: 'c4526510-3f10-11e4-adec-0800271c1b75',
                name: {
                  display: 'Cephalic',
                  uuid: 'c4526bb2-3f10-11e4-adec-0800271c1b75',
                  name: 'Cephalic',
                  locale: 'en',
                  localePreferred: true,
                  conceptNameType: 'FULLY_SPECIFIED',
                  links: [

                  ],
                  resourceVersion: '1.9',
                },
                names: [
                  {
                    display: 'Cephalic',
                    uuid: 'c4526bb2-3f10-11e4-adec-0800271c1b75',
                    name: 'Cephalic',
                    locale: 'en',
                    localePreferred: true,
                    conceptNameType: 'FULLY_SPECIFIED',
                    links: [

                    ],
                    resourceVersion: '1.9',
                  },
                  {
                    display: 'Cephalic',
                    uuid: '57626fe7-a25e-404f-8c5e-427b407f97aa',
                    name: 'Cephalic',
                    locale: 'en',
                    localePreferred: false,
                    conceptNameType: 'SHORT',
                    links: [

                    ],
                    resourceVersion: '1.9',
                  },
                ],
                displayString: 'Cephalic',
                resourceVersion: '2.0',
                translationKey: 'CEPHALIC_7',
              },
              {
                uuid: 'c45329de-3f10-11e4-adec-0800271c1b75',
                name: {
                  display: 'Breech',
                  uuid: 'c45330f0-3f10-11e4-adec-0800271c1b75',
                  name: 'Breech',
                  locale: 'en',
                  localePreferred: true,
                  conceptNameType: 'FULLY_SPECIFIED',
                  links: [

                  ],
                  resourceVersion: '1.9',
                },
                names: [
                  {
                    display: 'Breech',
                    uuid: 'c45330f0-3f10-11e4-adec-0800271c1b75',
                    name: 'Breech',
                    locale: 'en',
                    localePreferred: true,
                    conceptNameType: 'FULLY_SPECIFIED',
                    links: [

                    ],
                    resourceVersion: '1.9',
                  },
                  {
                    display: 'Breech',
                    uuid: '0ab2ccd3-40e9-43ef-99c2-b6b745a49135',
                    name: 'Breech',
                    locale: 'en',
                    localePreferred: false,
                    conceptNameType: 'SHORT',
                    links: [

                    ],
                    resourceVersion: '1.9',
                  },
                ],
                displayString: 'Breech',
                resourceVersion: '2.0',
                translationKey: 'BREECH_7',
              },
              {
                uuid: 'c453caa3-3f10-11e4-adec-0800271c1b75',
                name: {
                  display: 'Transverse',
                  uuid: 'c453d148-3f10-11e4-adec-0800271c1b75',
                  name: 'Transverse',
                  locale: 'en',
                  localePreferred: true,
                  conceptNameType: 'FULLY_SPECIFIED',
                  links: [

                  ],
                  resourceVersion: '1.9',
                },
                names: [
                  {
                    display: 'Transverse',
                    uuid: 'c453ce42-3f10-11e4-adec-0800271c1b75',
                    name: 'Transverse',
                    locale: 'en',
                    localePreferred: false,
                    conceptNameType: 'SHORT',
                    links: [

                    ],
                    resourceVersion: '1.9',
                  },
                  {
                    display: 'Transverse',
                    uuid: 'c453d148-3f10-11e4-adec-0800271c1b75',
                    name: 'Transverse',
                    locale: 'en',
                    localePreferred: true,
                    conceptNameType: 'FULLY_SPECIFIED',
                    links: [

                    ],
                    resourceVersion: '1.9',
                  },
                ],
                displayString: 'Transverse',
                resourceVersion: '2.0',
                translationKey: 'TRANSVERSE_7',
              },
            ],
            properties: {
              allowDecimal: null,
            },
          },
          formNamespace: 'Bahmni',
          formFieldPath: 'multiSelectThree.7/6-0/7-0',
          voided: true,
        },
        obsList: [
          {
            encounterDateTime: 1543830864000,
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
            type: 'Coded',
            encounterUuid: '28b24937-c8a9-4444-92b1-c6371ceb87d4',
            obsGroupUuid: null,
            creatorName: 'Super Man',
            conceptSortWeight: 1,
            parentConceptUuid: null,
            hiNormal: null,
            lowNormal: null,
            formNamespace: 'Bahmni',
            formFieldPath: 'multiSelectThree.7/6-0/7-0',
            interpretation: null,
            status: 'FINAL',
            complexData: null,
            conceptUuid: 'c4517f49-3f10-11e4-adec-0800271c1b75',
            concept: {
              uuid: 'c4517f49-3f10-11e4-adec-0800271c1b75',
              name: 'P/A Presenting Part',
              dataType: 'Coded',
              shortName: 'P/A Presenting Part',
              conceptClass: 'Misc',
              hiNormal: null,
              lowNormal: null,
              set: false,
              mappings: [],
            },
            valueAsString: 'Cephalic',
            voided: false,
            voidReason: null,
            unknown: false,
            uuid: 'e4bb9974-e3e6-4a35-a985-741f6a267e7b',
            observationDateTime: '2018-12-03T09:54:24.000+0000',
            orderUuid: null,
            abnormal: null,
            conceptNameToDisplay: 'P/A Presenting Part',
            comment: null,
            value: {
              uuid: 'c4526510-3f10-11e4-adec-0800271c1b75',
              name: 'Cephalic',
              dataType: 'N/A',
              shortName: 'Cephalic',
              conceptClass: 'Misc',
              hiNormal: null,
              lowNormal: null,
              set: false,
              mappings: [],
              translationKey: 'CEPHALIC_7',
            },
          },
          {
            encounterDateTime: 1543830864000,
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
            type: 'Coded',
            encounterUuid: '28b24937-c8a9-4444-92b1-c6371ceb87d4',
            obsGroupUuid: null,
            creatorName: 'Super Man',
            conceptSortWeight: 1,
            parentConceptUuid: null,
            hiNormal: null,
            lowNormal: null,
            formNamespace: 'Bahmni',
            formFieldPath: 'multiSelectThree.7/6-0/7-0',
            interpretation: null,
            status: 'FINAL',
            complexData: null,
            conceptUuid: 'c4517f49-3f10-11e4-adec-0800271c1b75',
            concept: {
              uuid: 'c4517f49-3f10-11e4-adec-0800271c1b75',
              name: 'P/A Presenting Part',
              dataType: 'Coded',
              shortName: 'P/A Presenting Part',
              conceptClass: 'Misc',
              hiNormal: null,
              lowNormal: null,
              set: false,
              mappings: [],
            },
            valueAsString: 'Breech',
            voided: false,
            voidReason: null,
            unknown: false,
            uuid: '9e469b18-2859-484a-b8f5-2f12037a0ab2',
            observationDateTime: '2018-12-03T09:54:24.000+0000',
            orderUuid: null,
            abnormal: null,
            conceptNameToDisplay: 'P/A Presenting Part',
            comment: null,
            value: {
              uuid: 'c45329de-3f10-11e4-adec-0800271c1b75',
              name: 'Breech',
              dataType: 'N/A',
              shortName: 'Breech',
              conceptClass: 'Misc',
              hiNormal: null,
              lowNormal: null,
              set: false,
              mappings: [],
              translationKey: 'BREECH_7',
            },
          },
        ],
      },
    });

    const obsArray = new ObsListMapper().getData(multiSelectCtrlRecord);

    expect(obsArray.length).to.be.equal(2);
    expect(obsArray[0].uuid).to.be.equal('e4bb9974-e3e6-4a35-a985-741f6a267e7b');
    expect(obsArray[1].uuid).to.be.equal('9e469b18-2859-484a-b8f5-2f12037a0ab2');
  });

  it('should return obs with undefined uuid if obsList is not available', () => {
    const multiSelectCtrlRecord = new ControlRecord({
      valueMapper: {},
      control: {
        type: 'obsControl',
        label: {
          translationKey: 'P/A_PRESENTING_PART_7',
          id: '7',
          units: '',
          type: 'label',
          value: 'P/A Presenting Part',
        },
        properties: {
          multiSelect: true,
        },
        id: '7',
        unsupportedProperties: [],
        concept: {
          name: 'P/A Presenting Part',
          uuid: 'c4517f49-3f10-11e4-adec-0800271c1b75',
          datatype: 'Coded',
          conceptClass: 'Misc',
          conceptHandler: null,
          answers: [
            {
              uuid: 'c4526510-3f10-11e4-adec-0800271c1b75',
              name: {
                display: 'Cephalic',
                uuid: 'c4526bb2-3f10-11e4-adec-0800271c1b75',
                name: 'Cephalic',
                locale: 'en',
                localePreferred: true,
                conceptNameType: 'FULLY_SPECIFIED',
                links: [
                ],
                resourceVersion: '1.9',
              },
              names: [
                {
                  display: 'Cephalic',
                  uuid: 'c4526bb2-3f10-11e4-adec-0800271c1b75',
                  name: 'Cephalic',
                  locale: 'en',
                  localePreferred: true,
                  conceptNameType: 'FULLY_SPECIFIED',
                  links: [
                  ],
                  resourceVersion: '1.9',
                },
                {
                  display: 'Cephalic',
                  uuid: '57626fe7-a25e-404f-8c5e-427b407f97aa',
                  name: 'Cephalic',
                  locale: 'en',
                  localePreferred: false,
                  conceptNameType: 'SHORT',
                  links: [
                  ],
                  resourceVersion: '1.9',
                },
              ],
              displayString: 'Cephalic',
              resourceVersion: '2.0',
              translationKey: 'CEPHALIC_7',
            },
            {
              uuid: 'c45329de-3f10-11e4-adec-0800271c1b75',
              name: {
                display: 'Breech',
                uuid: 'c45330f0-3f10-11e4-adec-0800271c1b75',
                name: 'Breech',
                locale: 'en',
                localePreferred: true,
                conceptNameType: 'FULLY_SPECIFIED',
                links: [

                ],
                resourceVersion: '1.9',
              },
              names: [
                {
                  display: 'Breech',
                  uuid: 'c45330f0-3f10-11e4-adec-0800271c1b75',
                  name: 'Breech',
                  locale: 'en',
                  localePreferred: true,
                  conceptNameType: 'FULLY_SPECIFIED',
                  links: [

                  ],
                  resourceVersion: '1.9',
                },
                {
                  display: 'Breech',
                  uuid: '0ab2ccd3-40e9-43ef-99c2-b6b745a49135',
                  name: 'Breech',
                  locale: 'en',
                  localePreferred: false,
                  conceptNameType: 'SHORT',
                  links: [

                  ],
                  resourceVersion: '1.9',
                },
              ],
              displayString: 'Breech',
              resourceVersion: '2.0',
              translationKey: 'BREECH_7',
            },
            {
              uuid: 'c453caa3-3f10-11e4-adec-0800271c1b75',
              name: {
                display: 'Transverse',
                uuid: 'c453d148-3f10-11e4-adec-0800271c1b75',
                name: 'Transverse',
                locale: 'en',
                localePreferred: true,
                conceptNameType: 'FULLY_SPECIFIED',
                links: [

                ],
                resourceVersion: '1.9',
              },
              names: [
                {
                  display: 'Transverse',
                  uuid: 'c453ce42-3f10-11e4-adec-0800271c1b75',
                  name: 'Transverse',
                  locale: 'en',
                  localePreferred: false,
                  conceptNameType: 'SHORT',
                  links: [

                  ],
                  resourceVersion: '1.9',
                },
                {
                  display: 'Transverse',
                  uuid: 'c453d148-3f10-11e4-adec-0800271c1b75',
                  name: 'Transverse',
                  locale: 'en',
                  localePreferred: true,
                  conceptNameType: 'FULLY_SPECIFIED',
                  links: [

                  ],
                  resourceVersion: '1.9',
                },
              ],
              displayString: 'Transverse',
              resourceVersion: '2.0',
              translationKey: 'TRANSVERSE_7',
            },
          ],
          properties: {
            allowDecimal: null,
          },
        },
        units: null,
        hiNormal: null,
        lowNormal: null,
        hiAbsolute: null,
        lowAbsolute: null,
      },
      formFieldPath: 'multiSelectThree.7/6-0/7-0',
      value: {
        value: [
          {
            uuid: 'c4526510-3f10-11e4-adec-0800271c1b75',
            name: {
              display: 'Cephalic',
              uuid: 'c4526bb2-3f10-11e4-adec-0800271c1b75',
              name: 'Cephalic',
              locale: 'en',
              localePreferred: true,
              conceptNameType: 'FULLY_SPECIFIED',
              links: [

              ],
              resourceVersion: '1.9',
            },
            names: [
              {
                display: 'Cephalic',
                uuid: 'c4526bb2-3f10-11e4-adec-0800271c1b75',
                name: 'Cephalic',
                locale: 'en',
                localePreferred: true,
                conceptNameType: 'FULLY_SPECIFIED',
                links: [

                ],
                resourceVersion: '1.9',
              },
              {
                display: 'Cephalic',
                uuid: '57626fe7-a25e-404f-8c5e-427b407f97aa',
                name: 'Cephalic',
                locale: 'en',
                localePreferred: false,
                conceptNameType: 'SHORT',
                links: [

                ],
                resourceVersion: '1.9',
              },
            ],
            displayString: 'Cephalic',
            resourceVersion: '2.0',
            translationKey: 'CEPHALIC_7',
          },
          {
            uuid: 'c45329de-3f10-11e4-adec-0800271c1b75',
            name: {
              display: 'Breech',
              uuid: 'c45330f0-3f10-11e4-adec-0800271c1b75',
              name: 'Breech',
              locale: 'en',
              localePreferred: true,
              conceptNameType: 'FULLY_SPECIFIED',
              links: [

              ],
              resourceVersion: '1.9',
            },
            names: [
              {
                display: 'Breech',
                uuid: 'c45330f0-3f10-11e4-adec-0800271c1b75',
                name: 'Breech',
                locale: 'en',
                localePreferred: true,
                conceptNameType: 'FULLY_SPECIFIED',
                links: [

                ],
                resourceVersion: '1.9',
              },
              {
                display: 'Breech',
                uuid: '0ab2ccd3-40e9-43ef-99c2-b6b745a49135',
                name: 'Breech',
                locale: 'en',
                localePreferred: false,
                conceptNameType: 'SHORT',
                links: [

                ],
                resourceVersion: '1.9',
              },
            ],
            displayString: 'Breech',
            resourceVersion: '2.0',
            translationKey: 'BREECH_7',
          },
        ],
        comment: null,
        interpretation: null,
      },
      active: true,
      enabled: true,
      hidden: false,
      showAddMore: true,
      showRemove: false,
      errors: [],
      dataSource: {
        formFieldPath: 'multiSelectThree.7/6-0/7-0',
        obs: {
          concept: {
            name: 'P/A Presenting Part',
            uuid: 'c4517f49-3f10-11e4-adec-0800271c1b75',
            datatype: 'Coded',
            conceptClass: 'Misc',
            conceptHandler: null,
            answers: [
              {
                uuid: 'c4526510-3f10-11e4-adec-0800271c1b75',
                name: {
                  display: 'Cephalic',
                  uuid: 'c4526bb2-3f10-11e4-adec-0800271c1b75',
                  name: 'Cephalic',
                  locale: 'en',
                  localePreferred: true,
                  conceptNameType: 'FULLY_SPECIFIED',
                  links: [

                  ],
                  resourceVersion: '1.9',
                },
                names: [
                  {
                    display: 'Cephalic',
                    uuid: 'c4526bb2-3f10-11e4-adec-0800271c1b75',
                    name: 'Cephalic',
                    locale: 'en',
                    localePreferred: true,
                    conceptNameType: 'FULLY_SPECIFIED',
                    links: [

                    ],
                    resourceVersion: '1.9',
                  },
                  {
                    display: 'Cephalic',
                    uuid: '57626fe7-a25e-404f-8c5e-427b407f97aa',
                    name: 'Cephalic',
                    locale: 'en',
                    localePreferred: false,
                    conceptNameType: 'SHORT',
                    links: [

                    ],
                    resourceVersion: '1.9',
                  },
                ],
                displayString: 'Cephalic',
                resourceVersion: '2.0',
                translationKey: 'CEPHALIC_7',
              },
              {
                uuid: 'c45329de-3f10-11e4-adec-0800271c1b75',
                name: {
                  display: 'Breech',
                  uuid: 'c45330f0-3f10-11e4-adec-0800271c1b75',
                  name: 'Breech',
                  locale: 'en',
                  localePreferred: true,
                  conceptNameType: 'FULLY_SPECIFIED',
                  links: [

                  ],
                  resourceVersion: '1.9',
                },
                names: [
                  {
                    display: 'Breech',
                    uuid: 'c45330f0-3f10-11e4-adec-0800271c1b75',
                    name: 'Breech',
                    locale: 'en',
                    localePreferred: true,
                    conceptNameType: 'FULLY_SPECIFIED',
                    links: [

                    ],
                    resourceVersion: '1.9',
                  },
                  {
                    display: 'Breech',
                    uuid: '0ab2ccd3-40e9-43ef-99c2-b6b745a49135',
                    name: 'Breech',
                    locale: 'en',
                    localePreferred: false,
                    conceptNameType: 'SHORT',
                    links: [

                    ],
                    resourceVersion: '1.9',
                  },
                ],
                displayString: 'Breech',
                resourceVersion: '2.0',
                translationKey: 'BREECH_7',
              },
              {
                uuid: 'c453caa3-3f10-11e4-adec-0800271c1b75',
                name: {
                  display: 'Transverse',
                  uuid: 'c453d148-3f10-11e4-adec-0800271c1b75',
                  name: 'Transverse',
                  locale: 'en',
                  localePreferred: true,
                  conceptNameType: 'FULLY_SPECIFIED',
                  links: [

                  ],
                  resourceVersion: '1.9',
                },
                names: [
                  {
                    display: 'Transverse',
                    uuid: 'c453ce42-3f10-11e4-adec-0800271c1b75',
                    name: 'Transverse',
                    locale: 'en',
                    localePreferred: false,
                    conceptNameType: 'SHORT',
                    links: [

                    ],
                    resourceVersion: '1.9',
                  },
                  {
                    display: 'Transverse',
                    uuid: 'c453d148-3f10-11e4-adec-0800271c1b75',
                    name: 'Transverse',
                    locale: 'en',
                    localePreferred: true,
                    conceptNameType: 'FULLY_SPECIFIED',
                    links: [

                    ],
                    resourceVersion: '1.9',
                  },
                ],
                displayString: 'Transverse',
                resourceVersion: '2.0',
                translationKey: 'TRANSVERSE_7',
              },
            ],
            properties: {
              allowDecimal: null,
            },
          },
          formNamespace: 'Bahmni',
          formFieldPath: 'multiSelectThree.7/6-0/7-0',
          voided: true,
        },
        obsList: [],
      },
    });

    const obsArray = new ObsListMapper().getData(multiSelectCtrlRecord);

    expect(obsArray.length).to.be.equal(2);
    expect(obsArray[0].uuid).to.be.equal(undefined);
    expect(obsArray[1].uuid).to.be.equal(undefined);
  });
});
