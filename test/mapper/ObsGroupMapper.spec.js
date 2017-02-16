import { expect } from 'chai';
import { Obs } from 'src/helpers/Obs';
import { List } from 'immutable';
import { ObsGroupMapper } from 'src/mapper/ObsGroupMapper';
import sinon from 'sinon';

describe('ObsGroupMapper', () => {
  const booleanObs = new Obs({
    concept: {
      name: 'Smoking history',
      uuid: 'uuid',
      dataType: 'Boolean',
      conceptClass: 'Misc',
    },
    value: undefined,
    formNamespace: 'formUuid/5',
    uuid: 'booleanUuid',
  });
  const numericObs = new Obs({ concept: {
    name: 'Pulse',
    uuid: 'pulseUuid',
    datatype: 'Numeric',
    conceptClass: 'Misc',
  }, value: 10, formNamespace: 'formUuid/6', uuid: 'childObs1Uuid' });

  const obsGroup = new Obs({ concept: {
    name: 'Pulse Data',
    uuid: 'pulseDataUuid',
    datatype: 'Misc',
  },
    groupMembers: List.of(numericObs, booleanObs),
    formNamespace: 'formUuid/4', uuid: 'pulseDataObsUuid' });

  const mapper = new ObsGroupMapper();

  it('should set value for obs group member', () => {
    const booleanObsUpdated = booleanObs.setValue(true);
    const obsGroupUpdated = mapper.setValue(obsGroup, booleanObsUpdated);

    expect(obsGroupUpdated.getGroupMembers().get(1).getValue()).to.be.eql(true);
  });

  it('should void obsGroup if child obs are not having any value', () => {
    const numericObsUpdated = numericObs.void();
    const booleanObsUpdated = booleanObs.void();
    const obsGroupWithOutValue = new Obs({ concept: {
      name: 'Pulse Data',
      uuid: 'pulseDataUuid',
      datatype: 'Misc',
    },
      groupMembers: List.of(numericObsUpdated, booleanObsUpdated),
      formNamespace: 'formUuid/4', uuid: 'pulseDataObsUuid' });
    const obsGroupUpdated = mapper.setValue(obsGroupWithOutValue, booleanObsUpdated);

    expect(obsGroupUpdated.isVoided()).to.be.eql(true);
  });

  it('should void obsGroup if child obs are voided', () => {
    const numericObsUpdated = numericObs.void();
    const booleanObsUpdated = booleanObs.void();
    const obsGroupWithChildVoided = new Obs({ concept: {
      name: 'Pulse Data',
      uuid: 'pulseDataUuid',
      datatype: 'Misc',
    },
      groupMembers: List.of(numericObsUpdated, booleanObsUpdated),
      formNamespace: 'formUuid/4', uuid: 'pulseDataObsUuid' });
    const obsGroupUpdated = mapper.setValue(obsGroupWithChildVoided, numericObsUpdated);

    expect(obsGroupUpdated.isVoided()).to.be.eql(true);
  });

  it('should not void obsGroup if any of child obs has value', () => {
    const numericObsUpdated = numericObs.setValue(20);
    const obsGroupUpdated = mapper.setValue(obsGroup, numericObsUpdated);

    expect(obsGroupUpdated.isVoided()).to.be.eql(false);
    expect(obsGroupUpdated.getGroupMembers().get(0).getValue()).to.be.eql(20);
    expect(obsGroupUpdated.getGroupMembers().get(1).getValue()).to.be.eql(undefined);
  });

  it('should not void parent obs if the obs inside another child obs has a value', () => {
    const numericObsUpdated = new Obs({ concept: {
      name: 'Numeric Obs',
      uuid: 'numericDataUuid',
      datatype: 'Misc',
    },
      groupMembers: List.of(numericObs),
      formNamespace: 'numericFormUuid/4', uuid: 'numericDataObsUuid' });
    const booleanObsUpdated = booleanObs.void();
    const obsGroupWithChildVoided = new Obs({ concept: {
      name: 'Pulse Data',
      uuid: 'pulseDataUuid',
      datatype: 'Misc',
    },
      groupMembers: List.of(numericObsUpdated, booleanObsUpdated),
      formNamespace: 'formUuid/4', uuid: 'pulseDataObsUuid' });
    const obsGroupUpdated = mapper.setValue(obsGroupWithChildVoided, numericObsUpdated);

    expect(obsGroupUpdated.isVoided()).to.be.eql(false);
  });

  it('should return final object', () => {
    sinon.spy(numericObs, 'getObject');
    const obsGroupWithSpyMember = obsGroup.set('groupMembers', List.of(numericObs, booleanObs));
    const observationGroup = mapper.getObject(obsGroupWithSpyMember);
    expect(observationGroup.groupMembers.length).to.eql(2);
    expect(observationGroup.formNamespace).to.eql('formUuid/4');
    expect(observationGroup.groupMembers[0].value).to.eql(10);
    expect(observationGroup.groupMembers[1].value).to.eql(undefined);
    sinon.assert.calledOnce(numericObs.getObject);
  });

  it('should return same amount obsGroups when call obsGroupMapper\'s getInitialObject methods', () => {
    const formName = 'Test1';
    const formVersion = '1';
    const control = {
      "concept": {
        "datatype": "N/A",
        "name": "Bacteriology Additional Attributes",
        "setMembers": [
          {
            "datatype": "Text",
            "name": "Consultation Note",
            "properties": {
              "allowDecimal": null
            },
            "uuid": "81d6e852-3f10-11e4-adec-0800271c1b75"
          }
        ],
        "uuid": "695e99d6-12b2-11e6-8c00-080027d2adbd"
      },
      "controls": [
        {
          "concept": {
            "datatype": "Text",
            "name": "Consultation Note",
            "properties": {
              "allowDecimal": null
            },
            "uuid": "81d6e852-3f10-11e4-adec-0800271c1b75"
          },
          "id": "2",
          "label": {
            "type": "label",
            "value": "Consultation Note"
          },
          "properties": {
            "addMore": false,
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
      "id": "1",
      "label": {
        "type": "label",
        "value": "Bacteriology Additional Attributes"
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
    };
    const observation = [
      {
        "concept": {
          "dataType": "N/A",
          "name": "Bacteriology Additional Attributes",
          "uuid": "695e99d6-12b2-11e6-8c00-080027d2adbd"
        },
        "formFieldPath": "Test1.1/1-0",
        "groupMembers": [
          {
            "concept": {
              "dataType": "Text",
              "name": "Consultation Note",
              "uuid": "81d6e852-3f10-11e4-adec-0800271c1b75"
            },
            "formFieldPath": "Test1.1/2-0",
            "groupMembers": [],
            "obsGroupUuid": "26a81979-d28c-4e7b-b490-d86dd53b23d7",
            "uuid": "20f2e76a-63f2-4f05-9b3a-5cc80af1cdba",
            "value": "1",
          }
        ],
        "uuid": "26a81979-d28c-4e7b-b490-d86dd53b23d7",
        "value": "1",
        "voided": false
      },
      {
        "concept": {
          "dataType": "N/A",
          "name": "Bacteriology Additional Attributes",
          "uuid": "695e99d6-12b2-11e6-8c00-080027d2adbd"
        },
        "formFieldPath": "Test1.1/1-1",
        "groupMembers": [
          {
            "concept": {
              "dataType": "Text",
              "name": "Consultation Note",
              "uuid": "81d6e852-3f10-11e4-adec-0800271c1b75"
            },
            "formFieldPath": "Test1.1/2-1",
            "groupMembers": [],
            "obsGroupUuid": "09f0ddbe-45a2-41d8-8a99-416059f61b21",
            "type": "Text",
            "uuid": "d16dee4e-ac4f-4ad7-ba35-89b73d39220d",
            "value": "2",
            "voided": false
          }
        ],
        "uuid": "09f0ddbe-45a2-41d8-8a99-416059f61b21",
        "value": "2",
        "voided": false
      }
    ];

    const obsArray = new ObsGroupMapper().getInitialObject(formName, formVersion, control, observation);

    expect(obsArray.length).to.equal(observation.length);
  });
});
