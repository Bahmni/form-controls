import { expect } from 'chai';
import { Obs } from 'src/helpers/Obs';

describe('Obs', () => {
  const concept = {
    uuid: '70645842-be6a-4974-8d5f-45b52990e132',
    name: 'Pulse',
    dataType: 'Text',
  };
  const properties = {
    location: {
      row: 0,
      column: 0,
    },
    mandatory: true,
  };

  const metadata = {
    id: '100',
    type: 'text',
    concept,
    properties,
  };

  const existingObs = {
    concept,
    value: 'someValue',
    formNamespace: 'formUuid/100',
    observationDateTime: '2016-09-08T10:10:38.000+0530',
    uuid: 'someUuid',
  };

  it('should create a default obs when obs is not passed', () => {
    const obs = new Obs('formUuid', metadata, undefined);
    expect(obs).to.have.property('concept').and.equal(concept);
    expect(obs).to.have.property('formNamespace').and.equal('formUuid/100');
    expect(obs.getValue()).to.be.eql(undefined);
  });

  it('should update the obs on setting a value', () => {
    const obs = new Obs('formUuid', metadata, undefined);
    const expectedObs = {
      concept,
      formNamespace: 'formUuid/100',
      observationDateTime: null,
      value: '345',
      voided: false,
    };
    obs.setValue('345');

    expect(obs).to.deep.eql(expectedObs);
    expect(obs.getValue()).to.be.eql('345');
  });

  it('should update an existing obs on setting a value', () => {
    const obs = new Obs('formUuid', metadata, existingObs);
    const expectedObs = {
      concept,
      formNamespace: 'formUuid/100',
      observationDateTime: null,
      value: '345',
      voided: false,
      uuid: 'someUuid',
      comment: undefined,
    };

    expect(obs.getValue()).to.be.eql('someValue');

    obs.setValue('345');
    expect(obs).to.deep.eql(expectedObs);
    expect(obs.getValue()).to.be.eql('345');
  });

  it('should not update an existing obs if value is same', () => {
    const obs = new Obs('formUuid', metadata, existingObs);
    expect(obs.getValue()).to.be.eql('someValue');

    obs.setValue('someValue');

    expect(obs.observationDateTime).to.be.eql('2016-09-08T10:10:38.000+0530');
  });

  it('should void an obs', () => {
    const obs = new Obs('formUuid', metadata, existingObs);
    const expectedObs = {
      concept,
      formNamespace: 'formUuid/100',
      observationDateTime: '2016-09-08T10:10:38.000+0530',
      value: 'someValue',
      voided: true,
      uuid: 'someUuid',
      comment: undefined,
    };

    obs.void();

    expect(obs).to.deep.eql(expectedObs);
  });

  it('should return equal when value of two obs are same', () => {
    const obs = new Obs('formUuid', metadata, existingObs);
    const otherObs = new Obs('formUuid', metadata, existingObs);

    expect(obs.equals(otherObs)).to.be.eql(true);
  });

  it('should not return equal when value of two obs are different', () => {
    const obs = new Obs('formUuid', metadata, existingObs);
    const otherObs = new Obs('formUuid', metadata, { value: 'somethingElse' });

    expect(obs.equals(otherObs)).to.be.eql(false);
  });

  it('should add comment to obs', () => {
    const obs = new Obs('formUuid', metadata, existingObs);
    obs.setComment('New Comment');
    expect(obs).to.have.property('comment').and.equal('New Comment');
  });

  it('should get comment from obs', () => {
    const obs = new Obs('formUuid', metadata, existingObs);
    obs.setComment('New Comment');
    expect(obs.getComment()).and.equal('New Comment');
  });
});
