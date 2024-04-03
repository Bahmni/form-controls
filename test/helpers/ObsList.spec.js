import { expect } from 'chai';
import { ObsList } from 'src/helpers/ObsList';
import { List } from 'immutable';
import { Obs } from 'src/helpers/Obs';

describe('ObsList', () => {
  const concept = {
    uuid: '70645842-be6a-4974-8d5f-45b52990e132',
    name: 'Pulse',
    dataType: 'Text',
  };

  const formFieldPath = 'formName.1/1-0';

  it('should create a default obsList', () => {
    const obsList = new ObsList();
    expect(obsList).to.have.property('obsList');
    expect(obsList.obsList.size).to.eql(0);
    expect(obsList).to.have.property('formFieldPath').and.equal(undefined);
    expect(obsList).to.have.property('obs').and.equal(undefined);
  });

  it('should create the obs with default values', () => {
    const obs = { concept, formFieldPath };
    const observationList = List.of(obs);
    const obsList = new ObsList({ formFieldPath, obs, obsList: observationList });

    expect(obsList).to.have.property('obsList');
    expect(obsList).to.have.property('formFieldPath').and.equal(formFieldPath);
    expect(obsList).to.have.property('obs').and.equal(obs);
    expect(obsList.obsList.size).to.eql(1);
  });

  it('should test all getters of obs', () => {
    const obs = { concept, formFieldPath };
    const observationList = List.of(obs);
    const obsList = new ObsList({ formFieldPath, obs, obsList: observationList });

    expect(obsList.getObs()).to.deep.eql(obs);
    expect(obsList.getObsList()).to.deep.eql(observationList);
  });

  it('should set obsList', () => {
    const obs = { concept, formFieldPath };
    const observationList = List.of(obs);
    const obsList = new ObsList({ formFieldPath, obs });

    const updatedObsList = obsList.setObsList(observationList);
    expect(updatedObsList.getObsList()).to.deep.eql(observationList);
  });

  it('should clone for add more', () => {
    const obs = new Obs({ concept, formFieldPath });
    const nextFormFieldPath = 'nextFormFieldPath';
    const formNameSpace = 'Bahmni';

    const observationList = List.of(obs);
    const obsList = new ObsList({ formFieldPath, obs, obsList: observationList, formNameSpace });

    const updatedObsList = obsList.cloneForAddMore(nextFormFieldPath);

    const expectedObsList = new ObsList({
      formFieldPath: nextFormFieldPath,
      formNameSpace,
      obs: new Obs({ concept, formFieldPath: nextFormFieldPath }),
      obsList: new List(),
    });

    expect(updatedObsList.toJS()).to.deep.eql(expectedObsList.toJS());
  });

  it('should void obsList', () => {
    const obs = new Obs({ concept, formFieldPath });
    const obs1 = new Obs({ concept, formFieldPath, value: 2 });
    const obs2 = new Obs({ concept, formFieldPath });
    const observationList = List.of(obs1, obs2);
    const formNameSpace = 'Bahmni';
    const obsList = new ObsList({ formFieldPath, obs, obsList: observationList, formNameSpace });

    const voidedObsList = obsList.void();

    expect(voidedObsList.obsList.get(0).voided).to.deep.eql(true);
    expect(voidedObsList.obsList.get(0).value).to.deep.eql(undefined);
    expect(voidedObsList.obsList.get(1).voided).to.deep.eql(true);
    expect(voidedObsList.obsList.get(1).value).to.deep.eql(undefined);
  });

  it('should return true if all obs are voided', () => {
    const obs = new Obs({ concept, formFieldPath });
    const obs1 = new Obs({ concept, formFieldPath, value: 2, voided: true });
    const obs2 = new Obs({ concept, formFieldPath, voided: true });
    const observationList = List.of(obs1, obs2);
    const formNameSpace = 'Bahmni';
    const obsList = new ObsList({ formFieldPath, obs, obsList: observationList, formNameSpace });

    expect(obsList.isVoided()).to.deep.eql(true);
  });

  it('should return false if all obs are not voided', () => {
    const obs = new Obs({ concept, formFieldPath });
    const obs1 = new Obs({ concept, formFieldPath, value: 2, voided: true });
    const obs2 = new Obs({ concept, formFieldPath });
    const observationList = List.of(obs1, obs2);
    const formNameSpace = 'Bahmni';
    const obsList = new ObsList({ formFieldPath, obs, obsList: observationList, formNameSpace });

    expect(obsList.isVoided()).to.deep.eql(false);
  });

  it('should clone for add more', () => {
    const obs = new Obs({ concept, formFieldPath });
    const nextFormFieldPath = 'nextFormFieldPath';
    const formNameSpace = 'Bahmni';
    const observationList = List.of(obs);
    const obsList = new ObsList({ formFieldPath, obs, obsList: observationList, formNameSpace });
    const updatedObsList = obsList.cloneForAddMore(nextFormFieldPath);
    const expectedObsList = new ObsList({
      formFieldPath: nextFormFieldPath,
      formNameSpace,
      obs: new Obs({ concept, formFieldPath: nextFormFieldPath }),
      obsList: new List(),
    });
    expect(updatedObsList.toJS()).to.deep.eql(expectedObsList.toJS());
  });
  it('should void obsList', () => {
    const obs = new Obs({ concept, formFieldPath });
    const obs1 = new Obs({ concept, formFieldPath, value: 2 });
    const obs2 = new Obs({ concept, formFieldPath });
    const observationList = List.of(obs1, obs2);
    const obsList = new ObsList({ formFieldPath, obs, obsList: observationList });
    const voidedObsList = obsList.void();
    expect(voidedObsList.obsList.get(0).voided).to.deep.eql(true);
    expect(voidedObsList.obsList.get(0).value).to.deep.eql(undefined);
    expect(voidedObsList.obsList.get(1).voided).to.deep.eql(true);
    expect(voidedObsList.obsList.get(1).value).to.deep.eql(undefined);
  });
  it('should return flattened observation list', () => {
    const obs = new Obs({ concept, formFieldPath });
    const observationList = List.of(obs);
    const obsList = new ObsList({ formFieldPath, obs, obsList: observationList });
    const flattenedList = obsList.getObject(obsList);
    expect(flattenedList).to.deep.eql([obs.toObject()]);
  });
});
