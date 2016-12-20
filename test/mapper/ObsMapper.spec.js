import { ObsMapper } from 'src/mapper/ObsMapper';
import sinon from 'sinon';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { Obs } from 'src/helpers/Obs';

chai.use(chaiEnzyme());

describe('ObsMapper', () => {
  const obs = {
    getValue: sinon.stub(),
    getUuid: sinon.stub(),
    setValue: sinon.spy(),
    void: sinon.spy(),
    isVoided: sinon.stub(),
    setComment: sinon.spy(),
    getComment: sinon.stub(),
  };

  describe('getValue', () => {
    it('should return undefined when obs value is empty', () => {
      obs.getValue.returns('');

      const mapper = new ObsMapper();
      expect(mapper.getValue(obs)).to.eql(undefined);
    });

    it('should return undefined when obs value is undefined', () => {
      obs.getValue.returns(undefined);

      const mapper = new ObsMapper();
      expect(mapper.getValue(obs)).to.eql(undefined);
    });

    it('should return undefined when obs has value but is voided', () => {
      obs.getValue.returns('someValue');
      obs.isVoided.returns(true);

      const mapper = new ObsMapper();
      expect(mapper.getValue(obs)).to.eql(undefined);
    });

    it('should return value when obs has value', () => {
      obs.getValue.returns('someValue');
      obs.isVoided.returns(false);

      const mapper = new ObsMapper();
      expect(mapper.getValue(obs)).to.eql('someValue');
    });

    it('should return value when obs has value false', () => {
      obs.getValue.returns(false);
      obs.isVoided.returns(false);

      const mapper = new ObsMapper();
      expect(mapper.getValue(obs)).to.eql(false);
    });
  });

  describe('getObs', () => {
    it('should return undefined when value is empty', () => {
      obs.getValue.returns('');
      const mapper = new ObsMapper();
      expect(mapper.getObs(obs)).to.eql(undefined);
    });

    it('should return undefined when value is undefined', () => {
      obs.getValue.returns(undefined);
      const mapper = new ObsMapper();
      expect(mapper.getObs(obs)).to.eql(undefined);
    });

    it('should return undefined when obs is voided and uuid is not present', () => {
      obs.getValue.returns('someValue');
      obs.isVoided.returns(true);
      obs.getUuid.returns(undefined);
      const mapper = new ObsMapper();
      expect(mapper.getObs(obs)).to.eql(undefined);
    });

    it('should return value when obs is voided', () => {
      obs.getValue.returns('someValue');
      obs.isVoided.returns(true);
      obs.getUuid.returns('someOldUuid');
      const mapper = new ObsMapper();
      expect(mapper.getObs(obs)).to.deep.eql(obs);
    });
  });

  it('should set the value to obs if value is present', () => {
    const mapper = new ObsMapper();
    mapper.setValue(obs, '123');
    sinon.assert.calledOnce(obs.setValue.withArgs('123'));
  });

  it('should void the obs if value is not present', () => {
    const mapper = new ObsMapper();
    mapper.setValue(obs, undefined);
    sinon.assert.calledOnce(obs.void);
  });

  it('should set comment to obs', () => {
    const mapper = new ObsMapper();
    mapper.setComment(obs, 'Some Comment');
    sinon.assert.calledOnce(obs.setComment.withArgs('Some Comment'));
  });

  it('should get comment from obs', () => {
    obs.getComment.returns('New Comment');
    const mapper = new ObsMapper();
    expect(mapper.getComment(obs)).to.eql('New Comment');
  });

  describe('getObject', () => {
    it('should return final object', () => {
      const mapper = new ObsMapper();
      const observation = { value: '72', concept: { name: 'someName' } };
      const updatedObs = new Obs(observation);

      expect(mapper.getObject(updatedObs).value).to.deep.eql(observation.value);
      expect(mapper.getObject(updatedObs).concept).to.deep.eql(observation.concept);
      expect(mapper.getObject(updatedObs).uuid).to.deep.eql(undefined);
    });
  });
});
