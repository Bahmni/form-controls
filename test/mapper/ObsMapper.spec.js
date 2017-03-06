import { ObsMapper } from 'src/mapper/ObsMapper';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { Obs } from 'src/helpers/Obs';
import {ControlRecord} from "../../src/helpers/ControlRecordTreeBuilder";

chai.use(chaiEnzyme());

describe('ObsMapper', () => {
  const obs = {
    value: undefined,
    comment: undefined,
  };

  const mapper = new ObsMapper();

  const formName = 'SingleObs';
  const formVersion = '1';
  const pulseConcept = {
    "answers": [],
    "datatype": "Numeric",
    "description": [],
    "name": "Pulse",
    "properties": {
      "allowDecimal": true
    },
    "uuid": "c36bc411-3f10-11e4-adec-0800271c1b75"
  };
  const control = {
    "concept": pulseConcept,
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
  };
  const observation = [
    {
      "concept": pulseConcept,
      "formFieldPath": "SingleObs.1/1-0",
      "formNamespace": "Bahmni",
      "voided": true
    }
  ];

  it('should return value same as obs`s value', () => {
    obs.value = 'test value';

    expect(mapper.getValue(obs).value).to.equal(obs.value);
  });

  it('should return comment same as obs`s comment', () => {
    obs.comment = 'test comment';

    expect(mapper.getValue(obs).comment).to.equal(obs.comment);
  });

  it('should return empty-children', () => {
    expect(mapper.getChildren(obs).length).to.equal(0);
  });

  it('should return expected obsArray when getInitialObject be triggered', () => {
    const obsArray = mapper.getInitialObject(formName, formVersion, control, observation);

    expect(obsArray[0].concept).to.equal(pulseConcept);
    expect(obsArray[0].formFieldPath).to.equal('SingleObs.1/1-0');
  });

  it('should convert obs from record when getData be triggered', () => {
    const formFieldPath = 'SingleObs.1/1-0';
    const record = new ControlRecord({
      control,
      formFieldPath,
      value: {value: 1, comment: undefined},
      dataSource: observation[0],
    });

    const updatedObs = mapper.getData(record);

    expect(updatedObs.value).to.equal(1);
    expect(updatedObs.comment).to.equal(undefined);
    expect(updatedObs.formFieldPath).to.equal(formFieldPath);
  });

});
