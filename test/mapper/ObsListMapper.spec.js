import { ObsListMapper } from 'src/mapper/ObsListMapper';
import sinon from 'sinon';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { List } from 'immutable';

chai.use(chaiEnzyme());

describe('ObsListMapper', () => {
  const obs = {
    getValue: sinon.stub(),
    getUuid: sinon.stub(),
    setValue: sinon.stub(),
    void: sinon.stub(),
    isVoided: sinon.stub(),
  };

  const formUuid = 'someUuid';
  const concept = { name: 'someConcept', uuid: 'uuid' };
  const control = { id: 1, concept };
  const formNamespace = `${formUuid}/${control.id}`;
  let mapper;

  beforeEach(() => {
    mapper = new ObsListMapper();
  });

  function getObs(uuid, value) {
    return { formNamespace, uuid, concept, value };
  }

  context('getInitialObject', () => {
    it('should return initial object when obs has no value', () => {
      expect(mapper.obs).to.eql(undefined);

      const initialObject = mapper.getInitialObject(formUuid, control, []);
      expect(initialObject.size).to.eql(0);
      expect(mapper.obs.concept).to.eql(concept);
      expect(mapper.obs.formNamespace).to.eql(formNamespace);
    });

    it('should return initial object with default values', () => {
      const observations = [getObs('uuid1', '72'), getObs('uuid2', 'notes')];
      const initialObject = mapper.getInitialObject(formUuid, control, observations);
      expect(initialObject.size).to.eql(2);
      expect(mapper.obs.concept).to.eql(concept);
      expect(mapper.obs.formNamespace).to.eql(`${formUuid}/${control.id}`);
    });
  });

  context('getValue', () => {
    it('should return undefined if obslist is empty', () => {
      expect(mapper.getValue(new List())).to.eql(undefined);
    });

    it('should return value when obsList having obs without value', () => {
      obs.getValue.returns(undefined);
      obs.isVoided.returns(false);

      let obsList = new List();
      obsList = obsList.push(obs);
      expect(mapper.getValue(obsList)).to.deep.eql(undefined);

      obs.getValue.returns(null);
      expect(mapper.getValue(obsList)).to.deep.eql(undefined);
    });

    it('should return value when obsList having obs with value and is voided', () => {
      obs.getValue.returns('72');
      obs.isVoided.returns(true);

      let obsList = new List();
      obsList = obsList.push(obs);
      expect(mapper.getValue(obsList)).to.deep.eql(undefined);
    });

    it('should return value when obsList having obs with value', () => {
      obs.getValue.returns(concept);
      obs.isVoided.returns(false);

      let obsList = new List();
      obsList = obsList.push(obs);
      expect(mapper.getValue(obsList)).to.deep.eql([concept]);
    });
  });

  context('setValue', () => {
    it('should return empty list when no values are set', () => {
      const obsList = new List();
      expect(mapper.setValue(obsList, undefined).size).to.eql(0);
    });

    it('should return updated obslist when values are set', () => {
      obs.setValue.returns(concept);
      mapper.obs = obs;
      const obsList = new List();
      const updatedList = mapper.setValue(obsList, [concept]);
      expect(updatedList.size).to.eql(1);
      expect(updatedList.get(0)).to.eql(concept);
    });

    it('should return updated obslist when same values are set', () => {
      let obsList = new List();
      const observation = { value: { uuid: 'someId' } };
      obsList = obsList.push(observation);
      const updatedList = mapper.setValue(obsList, [{ uuid: 'someId' }]);
      expect(updatedList.size).to.eql(1);
      expect(updatedList.get(0)).to.eql(observation);
    });

    it('should return updated obslist when obs is voided', () => {
      const voidedObs = { value: { uuid: 'someId' }, voided: true };
      obs.getUuid.returns('someId');
      obs.void.returns(voidedObs);
      let obsList = new List();
      obsList = obsList.push(obs);
      const updatedList = mapper.setValue(obsList, undefined);
      expect(updatedList.size).to.eql(1);
      expect(updatedList.get(0)).to.eql(voidedObs);
    });

    it('should return empty list when value is selected and deselected', () => {
      obs.getUuid.returns(undefined);
      let obsList = new List();
      obsList = obsList.push(obs);
      const updatedList = mapper.setValue(obsList, undefined);
      expect(updatedList.size).to.eql(0);
    });
  });
});
