import { ObsMapper } from '../../src/helpers/ObsMapper';
import sinon from 'sinon';

describe('ObsMapper', () => {
  const obs = {
    get: sinon.spy(),
    equals: sinon.spy(),
    set: sinon.spy(),
    void: sinon.spy(),
  };

  it('should return value of obs', () => {
    const mapper = new ObsMapper();
    mapper.getValue(obs);
    sinon.assert.calledOnce(obs.get);
  });

  it('should compare the obs', () => {
    const mapper = new ObsMapper();
    mapper.equals(obs, obs);
    sinon.assert.calledOnce(obs.equals.withArgs(obs));
  });

  it('should set the value to obs if value is present', () => {
    const mapper = new ObsMapper();
    mapper.setValue(obs, '123')
    sinon.assert.calledOnce(obs.set.withArgs('123'));
  });

  it('should void the obs if value is not present', () => {
    const mapper = new ObsMapper();
    mapper.setValue(obs, undefined)
    sinon.assert.calledOnce(obs.void);
  });
});
