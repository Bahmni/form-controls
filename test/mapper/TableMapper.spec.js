import { TableMapper } from 'src/mapper/TableMapper';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { ObsList } from 'src/helpers/ObsList';
import { createFormNamespaceAndPath } from 'src/helpers/formNamespace';
import { getKeyPrefixForControl } from '../../src/helpers/formNamespace';
import { ControlRecord } from '../../src/helpers/ControlRecordTreeBuilder';
import { List } from 'immutable';

chai.use(chaiEnzyme());

describe('TableMapper', () => {
  let mapper;
  const formName = 'someName';
  const formVersion = '1';
  const concept = {
    name: 'Pulse',
    uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
  };
  const obsControl = {
    type: 'obsControl',
    id: '2',
    concept,
    properties: {},
  };
  const tableControl = {
    type: 'table',
    id: '1',
    controls: [obsControl],
    properties: {},
  };

  const tableControlFormFieldPath =
    createFormNamespaceAndPath(formName, formVersion, tableControl.id).formFieldPath;
  const obsControlFormFieldPath =
    createFormNamespaceAndPath(formName, formVersion, obsControl.id).formFieldPath;

  beforeEach(() => {
    mapper = new TableMapper();
  });

  context('getInitialObject', () => {
    it('should return initial object with empty obs list and'
    + 'table form field path when obs has no value', () => {
      const initObjectArray = mapper.getInitialObject(
        formName, formVersion, tableControl, null, []);

      expect(initObjectArray.length).to.eql(1);
      expect(initObjectArray[0].getObsList().length).to.eql(0);
      expect(initObjectArray[0].formFieldPath).to.eql(tableControlFormFieldPath);
    });

    it('should return initial object with obs list, form field path'
    + 'when an obs with concept is passed', () => {
      const observations = [{
        formFieldPath: obsControlFormFieldPath,
        concept,
      }];

      const initObjectArray =
        mapper.getInitialObject(formName, formVersion, tableControl, null, observations);

      expect(initObjectArray.length).to.eql(1);
      expect(initObjectArray[0].getObsList().length).to.eql(1);
      expect(initObjectArray[0].formFieldPath).to.eql(tableControlFormFieldPath);
    });
    it('should return an array of 2 initial obejct when a table' +
    'is inside an add more section', () => {
      const observationCtrl = {
        type: 'obsControl',
        id: '3',
        concept,
        properties: {},
      };

      const tableCtrl = {
        type: 'table',
        id: '2',
        controls: [observationCtrl],
        properties: {
          addMore: true,
        },
      };
      const parentFormFieldPath = createFormNamespaceAndPath(formName, formVersion, 1)
          .formFieldPath;

      const formFieldPathPrefix =
              getKeyPrefixForControl(formName, formVersion, tableCtrl.id, parentFormFieldPath)
                  .formFieldPath;
      const firstObsFormFieldPathInSection = `${formFieldPathPrefix}-0/3-0`;
      const secondObsFormFieldPathInSection = `${formFieldPathPrefix}-0/3-1`;
      const obsFormFieldPathInAddMoreSection = `${formFieldPathPrefix}-1/3-0`;

      const observations = [{
        formFieldPath: firstObsFormFieldPathInSection,
        concept,
      },
      {
        formFieldPath: secondObsFormFieldPathInSection,
        concept,
      },
      {
        formFieldPath: obsFormFieldPathInAddMoreSection,
        concept,
      }];

      const initObjects = mapper.getInitialObject(formName, formVersion, tableCtrl, null,
              observations, parentFormFieldPath);
      expect(initObjects.length).to.eql(2);

      const initObjectArray = [initObjects[0].toJS(), initObjects[1].toJS()];
      expect([initObjectArray[0].formFieldPath, initObjectArray[1].formFieldPath])
              .to.have.members([`${formFieldPathPrefix}-0`, `${formFieldPathPrefix}-1`]);

      let sectionObj = initObjectArray.find(obj =>
          (obj.formFieldPath === `${formFieldPathPrefix}-0` ? obj : undefined));
      expect(sectionObj.obsList.length).to.eql(2);
      expect(sectionObj.obsList.map(obs => obs.formFieldPath))
              .to.have.members([firstObsFormFieldPathInSection, secondObsFormFieldPathInSection]);

      sectionObj = initObjectArray.find(obj =>
          (obj.formFieldPath === `${formFieldPathPrefix}-1` ? obj : undefined));

      expect(sectionObj.obsList.length).to.eql(1);
      expect(sectionObj.obsList[0].formFieldPath).to.eql(obsFormFieldPathInAddMoreSection);
    });


    it('should get flatten data from records', () => {
      const child = new ControlRecord({
        control: {
          type: 'obsControl',
          properties: {},
          id: '3',
          concept: {
            name: 'HEIGHT',
            uuid: '5090AAAAAAAAAAAAAAAAAAAAAAAAAAAA',
            description: [],
            datatype: 'Numeric',
            answers: [],
          },
        },
        formFieldPath: 'section.1/3-0',
        value: { value: '2', comment: undefined },
        active: true,
        dataSource: {
          concept: {
            name: 'HEIGHT',
            uuid: '5090AAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          }, formNamespace: 'Bahmni',
          formFieldPath: 'section.1/3-0',
        },
      });

      const records = new ControlRecord({
        control: {
          type: 'table',
          id: '1',
          controls: [{
            type: 'obsControl',
            label: { type: 'label', value: 'HEIGHT' },
            id: '3',
            concept: {
              name: 'HEIGHT',
              uuid: '5090AAAAAAAAAAAAAAAAAAAAAAAAAAAA',
            },
          }],
        },
        formFieldPath: 'table.1/1-0',
        children: List.of(child),
        active: true,
        dataSource: { formFieldPath: 'table.1/1-0', obsList: [] },
      });

      const data = mapper.getData(records);

      expect(data.length).to.equal(1);
      expect(data[0].value).to.equal('2');
    });

    it('should return null object when call getValue', () => {
      expect(mapper.getValue()).to.eql({});
    });

    it('should get observations for children records', () => {
      const data = new ObsList({
        formFieldPath: 'table.1/1-0',
        obsList: [{
          groupMembers: [],
          formFieldPath: 'table.1/3-0',
          concept: {
            uuid: '5090AAAAAAAAAAAAAAAAAAAAAAAAAAAA',
            name: 'HEIGHT',
            dataType: 'Numeric',
            shortName: 'HEIGHT',
            conceptClass: 'Misc',
          },
          valueAsString: '2.0',
          voided: false,
          voidReason: null,
          conceptUuid: '5090AAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          unknown: false,
          uuid: '22a41779-e637-44b6-a827-34d6b8df7159',
          value: 2,
        }],
      });

      expect(mapper.getChildren(data).length).to.equal(1);
      expect(mapper.getChildren(data)[0].value).to.equal(2);
    });
  });
});
