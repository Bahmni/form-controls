import { List } from 'immutable';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { ControlRecord } from '../../src/helpers/ControlRecordTreeBuilder';
import ObservationMapper from '../../src/helpers/ObservationMapper';

chai.use(chaiEnzyme());

describe('ObservationMapper', () => {
  it('should get obs exclude label record', () => {
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
    const obsRecord = new ControlRecord({
      control: obsControl,
      formFieldPath: obsFormFieldPath,
      value: { value: false, comment: undefined },
      dataSource: obsDataSource,
    });
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
});
