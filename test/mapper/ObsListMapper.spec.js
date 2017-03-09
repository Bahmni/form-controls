import { ObsListMapper } from 'src/mapper/ObsListMapper';
import sinon from 'sinon';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { List } from 'immutable';
import { ObsList } from 'src/helpers/ObsList';
import { createFormNamespaceAndPath } from 'src/helpers/formNamespace';

chai.use(chaiEnzyme());


describe('ObsListMapper', () => {
  const obs = {
    getValue: sinon.stub(),
    getUuid: sinon.stub(),
    setValue: sinon.stub(),
    void: sinon.stub(),
    isVoided: sinon.stub(),
  };

  const formName = 'someName';
  const formVersion = '1';
  const concept = { name: 'someConcept', uuid: 'uuid' };
  const control = { id: 1, concept };
  const formNamespaceAndPath = createFormNamespaceAndPath(formName, formVersion, control.id);
  const { formFieldPath } = formNamespaceAndPath;
  let mapper;

  beforeEach(() => {
    mapper = new ObsListMapper();
  });

  function getObs(uuid, value) {
    return { formFieldPath, uuid, concept, value };
  }

  context('getInitialObject', () => {
    it('should return initial object when obs has no value', () => {
      expect(mapper.obs).to.eql(undefined);

      const initialObjectArray = mapper.getInitialObject(formName, formVersion, control, []);
      expect(initialObjectArray.length).to.eql(1);
      expect(initialObjectArray[0].getObsList().size).to.eql(0);
      expect(initialObjectArray[0].getObs().concept).to.eql(concept);
      expect(initialObjectArray[0].formFieldPath).to.eql(formFieldPath);
    });

    it('should return initial object with default values', () => {
      const observations = [getObs('uuid1', '72'), getObs('uuid2', 'notes')];
      const initialObjectArray = mapper.getInitialObject(formName, formVersion,
        control, observations);

      expect(initialObjectArray.length).to.eql(1);
      expect(initialObjectArray[0].getObsList().size).to.eql(2);
      expect(initialObjectArray[0].getObs().concept).to.eql(concept);
      expect(initialObjectArray[0].formFieldPath).to.eql(formFieldPath);
    });
  });

  context('getValue', () => {
    it('should return undefined if obslist is empty', () => {
      expect(mapper.getValue(new ObsList())).to.eql(undefined);
    });

    it('should return value when obsList having obs without value', () => {
      obs.getValue.returns(undefined);
      obs.isVoided.returns(false);

      let obsList = new List();
      obsList = obsList.push(obs);
      expect(mapper.getValue(new ObsList({ obsList }))).to.deep.eql(undefined);

      obs.getValue.returns(null);
      expect(mapper.getValue(new ObsList({ obsList }))).to.deep.eql(undefined);
    });

    it('should return value when obsList having obs with value and is voided', () => {
      obs.getValue.returns('72');
      obs.isVoided.returns(true);

      let obsList = new List();
      obsList = obsList.push(obs);
      expect(mapper.getValue(new ObsList({ obsList }))).to.deep.eql(undefined);
    });

    it('should return value when obsList having obs with value', () => {
      obs.getValue.returns(concept);
      obs.isVoided.returns(false);

      let obsList = new List();
      obsList = obsList.push(obs);
      expect(mapper.getValue(new ObsList({ obsList }))).to.deep.eql([concept]);
    });
  });

  context('setValue', () => {
    it('should return empty list when no values are set', () => {
      const obsList = new List();
      expect(mapper.setValue(new ObsList({ obsList }), undefined).getObsList().size).to.eql(0);
    });

    it('should return updated obslist when values are set', () => {
      obs.setValue.returns(concept);
      const obsList = new List();
      const updatedList = mapper.setValue(new ObsList({ obs, obsList }), [concept]);
      expect(updatedList.getObsList().size).to.eql(1);
      expect(updatedList.getObsList().get(0)).to.eql(concept);
    });

    it('should return updated obslist when same values are set', () => {
      let obsList = new List();
      const observation = { value: { uuid: 'someId' } };
      obsList = obsList.push(observation);
      const updatedList = mapper.setValue(new ObsList({ obsList }), [{ uuid: 'someId' }]);
      expect(updatedList.getObsList().size).to.eql(1);
      expect(updatedList.getObsList().get(0)).to.eql(observation);
    });

    it('should return updated obslist when obs is voided', () => {
      const voidedObs = { value: { uuid: 'someId' }, voided: true };
      obs.getUuid.returns('someId');
      obs.void.returns(voidedObs);
      let obsList = new List();
      obsList = obsList.push(obs);
      const updatedList = mapper.setValue(new ObsList({ obsList }), undefined);
      expect(updatedList.getObsList().size).to.eql(1);
      expect(updatedList.getObsList().get(0)).to.eql(voidedObs);
    });

    it('should return empty list when value is selected and deselected', () => {
      obs.getUuid.returns(undefined);
      let obsList = new List();
      obsList = obsList.push(obs);
      const updatedList = mapper.setValue(new ObsList({ obsList }), undefined);
      expect(updatedList.getObsList().size).to.eql(0);
    });
  });

  context('getObject', () => {
    it('should return final object', () => {
      let observationList = new List();
      observationList = observationList.push(obs);
      const obsList = new ObsList({ obsList: observationList });

      expect(mapper.getObject(obsList).length).to.eql(1);
      expect(mapper.getObject(obsList)).to.eql([obs]);
    });
  });
});
