import { SectionMapper } from 'src/mapper/SectionMapper';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { List } from 'immutable';
import { ObsList } from 'src/helpers/ObsList';
import { Obs } from 'src/helpers/Obs';
import { createFormNamespaceAndPath } from 'src/helpers/formNamespace';
import sinon from 'sinon';
import MapperStore from 'src/helpers/MapperStore';
import { ObsGroupMapper } from 'src/mapper/ObsGroupMapper';
import { getKeyPrefixForControl } from '../../src/helpers/formNamespace';

chai.use(chaiEnzyme());

describe('SectionMapper', () => {
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
  const sectionControl = {
    type: 'section',
    id: '1',
    controls: [obsControl],
    properties: {},
  };

  const sectionControlFormFieldPath =
    createFormNamespaceAndPath(formName, formVersion, sectionControl.id).formFieldPath;
  const obsControlFormFieldPath =
    createFormNamespaceAndPath(formName, formVersion, obsControl.id).formFieldPath;

  beforeEach(() => {
    mapper = new SectionMapper();
  });

  context('getInitialObject', () => {
    it('should return initial object when obs has no value', () => {
      expect(mapper.obs).to.eql(undefined);

      const initObjectArray = mapper.getInitialObject(formName, formVersion, sectionControl, []);

      expect(initObjectArray.length).to.eql(1);
      expect(initObjectArray[0].getObsList().size).to.eql(0);
      expect(initObjectArray[0].formFieldPath).to.eql(sectionControlFormFieldPath);
    });

    it('should return initial object with default value', () => {
      const observations = [{
        formFieldPath: obsControlFormFieldPath,
        concept,
      }];

      const initObjectArray =
        mapper.getInitialObject(formName, formVersion, sectionControl, observations);

      expect(initObjectArray.length).to.eql(1);
      expect(initObjectArray[0].getObsList().size).to.eql(1);
      expect(initObjectArray[0].formFieldPath).to.eql(sectionControlFormFieldPath);
    });

    it('should return initial object with default value when section is nested', () => {
      const sectionLayer2 = {
        type: 'section',
        id: '3',
        controls: [obsControl],
        properties: {},
      };

      const sectionLayer1 = {
        type: 'section',
        id: '1',
        controls: [sectionLayer2],
        properties: {},
      };

      const observations = [{
        formFieldPath: obsControlFormFieldPath,
        concept,
      }];

      const layer1 = mapper.getInitialObject(formName, formVersion, sectionLayer1, observations);

      expect(layer1.length).to.eql(1);
      const layer2 = layer1[0].getObsList().get(0).getObsList();
      expect(layer2.size).to.eql(1);
      expect(layer2.get(0).formFieldPath).to.eql(obsControlFormFieldPath);
    });

    it('should use mapper store to fetch mapper for children', () => {
      const obsControl2 = {
        type: 'obsGroupControl',
        id: '2',
        concept,
        properties: {},
      };

      const sectionLayer1 = {
        type: 'section',
        id: '1',
        controls: [obsControl2],
        properties: {},
      };

      const observations = [{
        formFieldPath: obsControlFormFieldPath,
        concept,
      }];

      const mapperStub = sinon.stub(MapperStore, 'getMapper').callsFake(() => new ObsGroupMapper());
      const layer1 = mapper.getInitialObject(formName, formVersion, sectionLayer1, observations);

      expect(mapperStub.calledOnce).to.eql(true);
      expect(layer1.length).to.eql(1);
      const layer2 = layer1[0].getObsList();
      expect(layer2.size).to.eql(1);
      expect(layer2.get(0).formFieldPath).to.eql(obsControlFormFieldPath);
      mapperStub.restore();
    });

    it('should return more than one obs when observations come from addMore controls', () => {
      const formFieldPathPrefix =
        getKeyPrefixForControl(formName, formVersion, obsControl.id).formFieldPath;
      const observations = [{
        formFieldPath: `${formFieldPathPrefix}-0`,
        concept,
      },
      {
        formFieldPath: `${formFieldPathPrefix}-1`,
        concept,
      }];

      const initObjectArray =
        mapper.getInitialObject(formName, formVersion, sectionControl, observations);

      expect(initObjectArray.length).to.eql(1);
      const initObject = initObjectArray[0].toJS();
      expect(initObject.formFieldPath).to.eql(sectionControlFormFieldPath);
      expect(initObject.obsList.length).to.eql(2);
    });
  });

  context('getObject', () => {
    it('should return empty observations when obslist is empty', () => {
      expect(mapper.getObject(new ObsList())).to.eql([]);
    });

    it('should return observations when oblist is not empty', () => {
      const obs = new Obs();
      let observationList = new List();
      observationList = observationList.push(obs);
      const obsList = new ObsList({ obsList: observationList });

      expect(mapper.getObject(obsList).length).to.eql(1);
      expect(mapper.getObject(obsList)).to.eql([obs.toJS()]);
    });
  });

  context('setValue', () => {
    it('should return obslist when set a new obs', () => {
      const obs = new Obs();
      const obsList = new List();

      expect(mapper.setValue(new ObsList({ obsList }), obs).getObsList().size).to.eql(1);
    });

    it('should return obslist when set a old obs', () => {
      const existingObs = new Obs({ formFieldPath: 'someFieldPath', value: 'old' });
      const obsList = (new List()).push(existingObs);
      const updatedObs = new Obs({ formFieldPath: 'someFieldPath', value: 'updated' });

      const updatedObsList = mapper.setValue(new ObsList({ obsList }), updatedObs).getObsList();

      expect(updatedObsList.size).to.eql(1);
      expect(updatedObsList.get(0).value).to.eql('updated');
    });
  });
});
