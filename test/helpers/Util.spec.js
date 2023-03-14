import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { Util } from '../../src/helpers/Util';
import fetchMock from 'fetch-mock';

chai.use(chaiEnzyme());

describe('Util', () => {
  it('should convert string to number', () => {
    const stringNum = '100';

    const num = Util.toInt(stringNum);

    expect(num).to.equal(100);
  });

  it('should increment one when Util.increment be called', () => {
    const originNum = 100;

    const targetNum = Util.increment(originNum);

    expect(targetNum).to.equal(originNum + 1);
  });

  describe('Util.getAnswers', () => {
    afterEach(() => {
      fetchMock.restore();
      fetchMock.reset();
    });

    it('should return reponse when Util.getAnswers status is 200', (done) => {
      fetchMock.mock('*', [
        {
          conceptName: 'someName',
          conceptUuid: 'someUuid',
          matchedName: 'someName',
          conceptSystem: 'someSystem',
        },
      ]);
      Util.getAnswers('/someUrl').then(res => {
        expect(fetchMock.calls().matched.length).to.eql(1);
        expect(res[0].conceptName).to.eql('someName');
        done();
      });
    });

    it('should throw an error when Util.getAnswers status is not 2xx', (done) => {
      fetchMock.mock('*', 404);
      Util.getAnswers('/someUrl')
        .then(() => {})
        .catch(err => {
          expect(err.response.status).to.eql(404);
          done();
        });
    });
  });
});
