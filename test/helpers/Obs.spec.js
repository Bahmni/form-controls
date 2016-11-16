import { expect } from 'chai';
import { Obs } from 'src/helpers/Obs';

describe('Obs', () => {
  const concept = {
    uuid: '70645842-be6a-4974-8d5f-45b52990e132',
    name: 'Pulse',
    dataType: 'Text',
  };

  const formNamespace = 'formUuid/1';
  const value = '345';
  const uuid = 'uuid';
  const comment = 'comment';


  it('should create a default obs', () => {
    const obs = new Obs();
    expect(obs).to.have.property('concept').and.equal(undefined);
    expect(obs).to.have.property('formNamespace').and.equal(undefined);
    expect(obs).to.have.property('uuid').and.equal(undefined);
    expect(obs).to.have.property('value').and.equal(undefined);
    expect(obs).to.have.property('observationDateTime').and.equal(undefined);
    expect(obs).to.have.property('voided').and.equal(false);
    expect(obs).to.have.property('comment').and.equal(undefined);
  });

  it('should create the obs with default values', () => {
    const obs = new Obs({ concept, formNamespace, value });

    expect(obs).to.have.property('concept').and.equal(concept);
    expect(obs).to.have.property('formNamespace').and.equal(formNamespace);
    expect(obs).to.have.property('value').and.equal(value);
    expect(obs).to.have.property('voided').and.equal(false);
  });

  it('should test all getters of obs', () => {
    const obs = new Obs({ comment, formNamespace, uuid, value });

    expect(obs.getValue()).to.be.eql(value);
    expect(obs.getUuid()).to.be.eql(uuid);
    expect(obs.getFormNamespace()).to.be.eql(formNamespace);
    expect(obs.getComment()).to.be.eql(comment);
    expect(obs.isVoided()).to.be.eql(false);
    expect(obs.isDirty('abc')).to.be.eql(true);
  });

  it('should void an obs', () => {
    const obs = new Obs({ comment, formNamespace, uuid, value });
    const voidedObs = obs.void();
    expect(obs.isVoided()).to.be.eql(false);
    expect(voidedObs.isVoided()).to.be.eql(true);
  });

  it('should set comment to obs', () => {
    const obs = new Obs({ formNamespace, uuid, value });
    const commentObs = obs.setComment('comment');

    expect(commentObs.getComment()).to.be.eql('comment');
  });

  it('should set value', () => {
    const obs = new Obs({ formNamespace, uuid, value });
    const updatedObs = obs.setValue('9090');

    expect(updatedObs.getValue()).to.be.eql('9090');
  });

  it('should not create new obs if value is not changed', () => {
    const obs = new Obs({ formNamespace, uuid, value });
    const updatedObs = obs.setValue(value);

    expect(updatedObs).to.be.eql(obs);
  });
});
