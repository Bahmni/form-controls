import { expect } from 'chai';
import { ObsList } from 'src/helpers/ObsList';
import { List } from 'immutable';

describe('ObsList', () => {
  const concept = {
    uuid: '70645842-be6a-4974-8d5f-45b52990e132',
    name: 'Pulse',
    dataType: 'Text',
  };

  const formNamespace = 'formUuid/1';

  it('should create a default obsList', () => {
    const obsList = new ObsList();
    expect(obsList).to.have.property('obsList');
    expect(obsList.obsList.size).to.eql(0);
    expect(obsList).to.have.property('formNamespace').and.equal(undefined);
    expect(obsList).to.have.property('obs').and.equal(undefined);
  });

  it('should create the obs with default values', () => {
    const obs = { concept, formNamespace };
    const observationList = List.of(obs);
    const obsList = new ObsList({ formNamespace, obs, obsList: observationList });

    expect(obsList).to.have.property('obsList');
    expect(obsList).to.have.property('formNamespace').and.equal(formNamespace);
    expect(obsList).to.have.property('obs').and.equal(obs);
    expect(obsList.obsList.size).to.eql(1);
  });

  it('should test all getters of obs', () => {
    const obs = { concept, formNamespace };
    const observationList = List.of(obs);
    const obsList = new ObsList({ formNamespace, obs, obsList: observationList });

    expect(obsList.getObs()).to.deep.eql(obs);
    expect(obsList.getObsList()).to.deep.eql(observationList);
  });

  it('should set obsList', () => {
    const obs = { concept, formNamespace };
    const observationList = List.of(obs);
    const obsList = new ObsList({ formNamespace, obs });

    const updatedObsList = obsList.setObsList(observationList);
    expect(updatedObsList.getObsList()).to.deep.eql(observationList);
  });
});
