import { expect } from 'chai';
import { Obs, createObsFromControl } from 'src/helpers/Obs';
import { List } from 'immutable';
import sinon from 'sinon';

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

  it('should return false if the obs value is same', () => {
    const valueObj = { uuid: 'someUuid', value: 'someValue' };
    const obs = new Obs({ uuid, value: valueObj });
    expect(obs.isDirty(valueObj)).to.be.eql(false);
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

  it('should return true when the obs belongs to a numeric concept', () => {
    const obs = new Obs({ concept: {
      name: 'Pulse',
      uuid: 'pulseUuid',
      datatype: 'Numeric',
    },
      formNamespace,
      value,
    });

    expect(obs.isNumeric()).to.be.eql(true);
  });

  it('should add a new obs to the groupMembers when addGroupMembers method is invoked', () => {
    const obs = new Obs({ concept: {
      name: 'Pulse',
      uuid: 'pulseUuid',
      datatype: 'Numeric',
    },
      formNamespace, uuid, value });

    expect(obs.getGroupMembers()).to.be.eql(undefined);

    const childObs = new Obs({ formNamespace: 'formUuid/5', uuid: 'test' });

    const obsUpdated = obs.addGroupMember(childObs);
    expect(obsUpdated.getGroupMembers()).to.be.not.eql(undefined);
    expect(obsUpdated.getGroupMembers().size).to.be.eql(1);
    expect(obsUpdated.getGroupMembers().includes(childObs)).to.be.eql(true);
  });

  it('should ignore adding a childObs when it already exists', () => {
    const childObs = new Obs({ formNamespace: 'formUuid/5', uuid: 'test' });
    const obs = new Obs({ concept: {
      name: 'Pulse',
      uuid: 'pulseUuid',
      datatype: 'Numeric',
    },
      groupMembers: List.of(childObs),
      formNamespace, uuid, value });

    expect(obs.getGroupMembers().size).to.be.eql(1);
    const obsUpdated = obs.addGroupMember(childObs);
    expect(obsUpdated).to.be.eql(obs);
  });

  it('should replace child obs with the same concept in the groupMember', () => {
    const childObs = new Obs({ concept: {
      name: 'Pulse',
      uuid: 'pulseUuid',
      datatype: 'Numeric',
    }, formNamespace: 'formUuid/5', uuid: 'test' });

    const parentObs = new Obs({ concept: {
      name: 'Pulse Data',
      uuid: 'pulseDataUuid',
      datatype: 'Misc',
    },
      groupMembers: List.of(childObs),
      formNamespace, uuid, value });

    const childObsUpdated = childObs.setValue('72');
    const parentObsUpdated = parentObs.addGroupMember(childObsUpdated);

    expect(parentObsUpdated.getGroupMembers().size).to.be.eql(1);
  });

  it('should return a child obs which has Abnormal class', () => {
    const pulseAbnormalObs = new Obs({ concept: {
      name: 'PulseAbnormal',
      uuid: 'pulseAbnormalUuid',
      datatype: 'Boolean',
      conceptClass: 'Abnormal',
    }, formNamespace: 'formUuid/5', uuid: 'childObs2Uuid' });

    const pulseNumericObs = new Obs({ concept: {
      name: 'Pulse',
      uuid: 'pulseUuid',
      datatype: 'Numeric',
      conceptClass: 'Misc',
    }, formNamespace: 'formUuid/6', uuid: 'childObs1Uuid' });

    const pulseDataObs = new Obs({ concept: {
      name: 'Pulse Data',
      uuid: 'pulseDataUuid',
      datatype: 'Misc',
    },
      groupMembers: List.of(pulseNumericObs, pulseAbnormalObs),
      formNamespace, uuid, value });

    const abnormalChildObs = pulseDataObs.getAbnormalChildObs();
    expect(pulseAbnormalObs).to.be.eql(abnormalChildObs);
  });

  it('should clone obs for AddMore', () => {
    const formFieldPath = 'formName.1/5-0';
    const originalObs = new Obs({
      concept,
      formFieldPath,
      formNamespace: 'Bahmni',
      uuid: 'childObs2Uuid',
    });

    const clonedObs = originalObs.cloneForAddMore(formFieldPath);

    const expectedClonedObs = new Obs({
      formFieldPath,
      concept,
      formNamespace: 'Bahmni',
      voided: true,
    });
    expect(clonedObs).to.deep.eql(expectedClonedObs);
  });

  it('getObject should process groupMembers', () => {
    const booleanObs = new Obs({
      value: undefined,
      formNamespace: 'formUuid/5',
      uuid: 'booleanUuid',
    });
    sinon.spy(booleanObs, 'getObject');
    const obs = new Obs({ concept, formNamespace, value, groupMembers: List.of(booleanObs) });

    obs.getObject(obs);

    sinon.assert.calledOnce(booleanObs.getObject);
  });

  describe('exact match id in form field path', () => {
    const formName = '3116_2';
    const formVersion = '1';

    it('should get obs given form path exist in observations', () => {
      const controlExistInObservations = { id: '1' };
      const bahmniObservations = [
        { formFieldPath: '3116_2.1/18-0' },
        { formFieldPath: '3116_2.1/1-0' },
      ];

      const result = createObsFromControl(formName,
        formVersion, controlExistInObservations, bahmniObservations);

      expect(result.length).to.be.eqls(1);
      const existingObs = result[0];
      expect(existingObs.formFieldPath).to.be.eqls('3116_2.1/1-0');
    });

    it('should create a obs given form path not exist in observations', () => {
      const controlNotExistInObservations = { id: '2' };
      const bahmniObservations = [
        { formFieldPath: '3116_2.1/28-0' },
        { formFieldPath: '3116_2.1/1-0' },
      ];

      const result = createObsFromControl(formName,
        formVersion, controlNotExistInObservations, bahmniObservations);

      expect(result.length).to.be.eqls(1);
      const newCreatedObs = result[0];
      expect(newCreatedObs.formFieldPath).to.be.eqls('3116_2.1/2-0');
    });
  });
});
