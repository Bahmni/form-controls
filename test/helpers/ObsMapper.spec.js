import { ObsMapper } from '../../src/helpers/ObsMapper';
import sinon from 'sinon';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
chai.use(chaiEnzyme());

describe('ObsMapper', () => {
  const obs = {
    getValue: sinon.stub(),
    getUuid: sinon.stub(),
    equals: sinon.spy(),
    setValue: sinon.spy(),
    void: sinon.spy(),
    isVoided: sinon.stub(),
  };

  describe('getValue', () => {
    it('should return undefined when obs value is empty', () => {
      obs.getValue.returns('');

      const mapper = new ObsMapper(obs);
      expect(mapper.getValue()).to.eql(undefined);
    });

    it('should return undefined when obs value is undefined', () => {
      obs.getValue.returns(undefined);

      const mapper = new ObsMapper(obs);
      expect(mapper.getValue()).to.eql(undefined);
    });

    it('should return undefined when obs has value but is voided', () => {
      obs.getValue.returns('someValue');
      obs.isVoided.returns(true);

      const mapper = new ObsMapper(obs);
      expect(mapper.getValue()).to.eql(undefined);
    });

    it('should return value when obs has value', () => {
      obs.getValue.returns('someValue');
      obs.isVoided.returns(false);

      const mapper = new ObsMapper(obs);
      expect(mapper.getValue()).to.eql('someValue');
    });

    it('should return value when obs has value false', () => {
      obs.getValue.returns(false);
      obs.isVoided.returns(false);

      const mapper = new ObsMapper(obs);
      expect(mapper.getValue()).to.eql(false);
    });
  });

  describe('getObs', () => {
    it('should return undefined when value is empty', () => {
      obs.getValue.returns('');
      const mapper = new ObsMapper(obs);
      expect(mapper.getObs()).to.eql(undefined);
    });

    it('should return undefined when value is undefined', () => {
      obs.getValue.returns(undefined);
      const mapper = new ObsMapper(obs);
      expect(mapper.getObs()).to.eql(undefined);
    });

    it('should return undefined when obs is voided and uuid is not present', () => {
      obs.getValue.returns('someValue');
      obs.isVoided.returns(true);
      obs.getUuid.returns(undefined);
      const mapper = new ObsMapper(obs);
      expect(mapper.getObs()).to.eql(undefined);
    });

    it('should return value when obs is voided', () => {
      obs.getValue.returns('someValue');
      obs.isVoided.returns(true);
      obs.getUuid.returns('someOldUuid');
      const mapper = new ObsMapper(obs);
      expect(mapper.getObs()).to.deep.eql(obs);
    });
  });

  it('should compare the obs', () => {
    const mapper = new ObsMapper(obs);
    mapper.equals(obs);
    sinon.assert.calledOnce(obs.equals.withArgs(obs));
  });

  it('should set the value to obs if value is present', () => {
    const mapper = new ObsMapper(obs);
    mapper.setValue('123');
    sinon.assert.calledOnce(obs.setValue.withArgs('123'));
  });

  it('should void the obs if value is not present', () => {
    const mapper = new ObsMapper(obs);
    mapper.setValue(undefined);
    sinon.assert.calledOnce(obs.void);
  });
});
