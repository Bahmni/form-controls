import { ObsMapper } from 'src/mapper/ObsMapper';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { ControlRecord } from '../../src/helpers/ControlRecordTreeBuilder';

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
    answers: [],
    datatype: 'Numeric',
    description: [],
    name: 'Pulse',
    properties: {
      allowDecimal: true,
    },
    uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
  };
  const control = {
    concept: pulseConcept,
    hiAbsolute: null,
    hiNormal: 72,
    id: '1',
    label: {
      type: 'label',
      value: 'Pulse(/min)',
    },
    lowAbsolute: null,
    lowNormal: 72,
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
    units: '/min',
  };
  const observation = [
    {
      concept: pulseConcept,
      formFieldPath: 'SingleObs.1/1-0',
      formNamespace: 'Bahmni',
      voided: true,
    },
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
      value: { value: 1, comment: undefined },
      dataSource: observation[0],
    });

    const updatedObs = mapper.getData(record);

    expect(updatedObs.value).to.equal(1);
    expect(updatedObs.comment).to.equal(undefined);
    expect(updatedObs.interpretation).to.equal(undefined);
    expect(updatedObs.formFieldPath).to.equal(formFieldPath);
  });

  it('should get correct obs when given obs control with boolean type', () => {
    const booleanConcept = {
      answers: [],
      datatype: 'Boolean',
      name: 'Smoking History',
      properties: {
        allowDecimal: null,
      },
      uuid: 'c2a43174-c9db-4e54-8516-17372c83537f',
    };
    const booleanControl = {
      concept: booleanConcept,
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
    const formFieldPath = 'ComplexTest.4/23-0';
    const booleanDataSource = {
      concept: booleanConcept,
      formFieldPath,
      formNamespace: 'Bahmni',
      voided: true,
    };

    const record = new ControlRecord({
      control: booleanControl,
      formFieldPath,
      value: { value: false, comment: undefined },
      dataSource: booleanDataSource,
    });

    const updatedObs = mapper.getData(record);

    expect(updatedObs.value).to.equal(false);
    expect(updatedObs.voided).to.equal(false);
  });

  it('should trim spaces of value when given text control with string value', () => {
    const valueWithSpaces = '   stringValue  ';
    const record = new ControlRecord({
      control: {},
      formFieldPath: 'someUuid',
      value: { value: valueWithSpaces },
      dataSource: {},
    });

    const updatedObs = mapper.getData(record);

    expect(updatedObs.value).to.eql(valueWithSpaces.trim());
  });

  it('should return null when given text control with empty string', () => {
    const emptyString = '';
    const record = new ControlRecord({
      control: {},
      formFieldPath: 'someUuid',
      value: { value: emptyString },
      dataSource: {},
    });

    const updatedObs = mapper.getData(record);

    expect(updatedObs).to.eql(null);
  });

  it('should mark voided of obs as true when given obs control ' +
    'with complex media type and the value contains voided', () => {
    const complexConcept = {
      answers: [],
      datatype: 'Complex',
      conceptHandler: 'ImageUrlHandler',
      name: 'Image',
      uuid: 'c2a43174-c9db-4e54-8516-17372c83537f',
    };
    const complexControl = {
      concept: complexConcept,
    };
    const formFieldPath = 'ComplexTest.4/23-0';
    const complexDataSource = {
      concept: complexConcept,
      formFieldPath,
      formNamespace: 'Bahmni',
      voided: false,
    };

    const record = new ControlRecord({
      control: complexControl,
      formFieldPath,
      value: { value: 'valueAsvoided', comment: undefined },
      dataSource: complexDataSource,
    });

    const updatedObs = mapper.getData(record);

    expect(updatedObs.voided).to.equal(true);
  });

  it('should remove void obs created by add more when obsControl with complex media type', () => {
    const complexConcept = {
      answers: [],
      datatype: 'Complex',
      name: 'Image',
      uuid: 'c2a43174-c9db-4e54-8516-17372c83537f',
    };
    const complexControl = {
      concept: complexConcept,
    };
    const formFieldPath = 'ComplexTest.4/23-1';
    const complexDataSource = {
      concept: complexConcept,
      formFieldPath,
      formNamespace: 'Bahmni',
      voided: false,
    };

    const record = new ControlRecord({
      control: complexControl,
      formFieldPath,
      value: { value: undefined, comment: undefined },
      dataSource: complexDataSource,
    });

    const updatedObs = mapper.getData(record);

    expect(updatedObs).to.equal(null);
  });
});
