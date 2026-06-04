import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { Util } from '../../src/helpers/Util';
import fetchMock from 'fetch-mock';
import sinon from 'sinon';
import moment from 'moment';

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

  it('Should format the concepts accordingly', () => {
    const concepts = [
      {
        conceptSystem: 'system1',
        conceptUuid: 'uuid1',
        conceptName: 'name1',
      },
      {
        conceptSystem: 'system2',
        conceptUuid: 'uuid2',
        conceptName: 'name2',
      },
    ];
    const expectedFormattedConcepts = [
      {
        uuid: 'system1/uuid1',
        name: 'name1',
        displayString: 'name1',
        codedAnswer: {
          uuid: 'system1/uuid1',
        },
      },
      {
        uuid: 'system2/uuid2',
        name: 'name2',
        displayString: 'name2',
        codedAnswer: {
          uuid: 'system2/uuid2',
        },
      },
    ];

    const formattedConcepts = Util.formatConcepts(concepts);
    expect(formattedConcepts).to.deep.equal(expectedFormattedConcepts);
  });

  describe('Util.getConfig', () => {
    afterEach(() => {
      fetchMock.restore();
      fetchMock.reset();
    });

    it('should return reponse when Util.getConfig status is 200', done => {
      fetchMock.mock('*', {
        config: {
          terminologyService: {
            limit: 20,
            system: 'SOME_SYSTEM',
          },
        },
      });
      Util.getConfig('/someUrl').then(res => {
        expect(fetchMock.calls().matched.length).to.eql(1);
        expect(res.config.terminologyService.system).to.eql('SOME_SYSTEM');
        done();
      });
    });

    it('should throw an error when Util.getConfig status is not 2xx', done => {
      fetchMock.mock('*', 404);
      Util.getConfig('/someUrl')
        .then(() => {})
        .catch(err => {
          expect(err.response.status).to.eql(404);
          done();
        });
    });
  });

  describe('Util.getAnswers', () => {
    afterEach(() => {
      fetchMock.restore();
      fetchMock.reset();
    });

    it('should return reponse when Util.getAnswers status is 200', done => {
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

    it('should throw an error when Util.getAnswers status is not 2xx', done => {
      fetchMock.mock('*', 404);
      Util.getAnswers('/someUrl')
        .then(() => {})
        .catch(err => {
          expect(err.response.status).to.eql(404);
          done();
        });
    });
  });

  describe('Util.resolveUrlTokens', () => {
    const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSSZZ';
    let clock;

    beforeEach(() => {
      clock = sinon.useFakeTimers(new Date('2026-06-01T12:00:00.000Z').getTime());
    });

    afterEach(() => {
      clock.restore();
    });

    it('should replace {NOW} with end of current day encoded', () => {
      const url = 'http://example.com?end={NOW}';
      const result = Util.resolveUrlTokens(url);
      const expected = encodeURIComponent(moment().endOf('day').format(DATE_FORMAT));
      expect(result).to.equal(`http://example.com?end=${expected}`);
    });

    it('should replace {NOW-30d} with start of day 30 days ago encoded', () => {
      const url = 'http://example.com?start={NOW-30d}';
      const result = Util.resolveUrlTokens(url);
      const expected = encodeURIComponent(
        moment().subtract(30, 'days').startOf('day').format(DATE_FORMAT)
      );
      expect(result).to.equal(`http://example.com?start=${expected}`);
    });

    it('should replace {NOW-Nd} with any number of days', () => {
      const url = 'http://example.com?start={NOW-60d}';
      const result = Util.resolveUrlTokens(url);
      const expected = encodeURIComponent(
        moment().subtract(60, 'days').startOf('day').format(DATE_FORMAT)
      );
      expect(result).to.equal(`http://example.com?start=${expected}`);
    });


    it('should replace both tokens in the same URL', () => {
      const url = 'http://example.com?start={NOW-30d}&end={NOW}';
      const result = Util.resolveUrlTokens(url);
      const expectedStart = encodeURIComponent(
        moment().subtract(30, 'days').startOf('day').format(DATE_FORMAT)
      );
      const expectedEnd = encodeURIComponent(moment().endOf('day').format(DATE_FORMAT));
      expect(result).to.equal(`http://example.com?start=${expectedStart}&end=${expectedEnd}`);
    });

    it('should leave the URL unchanged when no tokens are present', () => {
      const url = 'http://example.com?v=custom:(id,uuid)';
      expect(Util.resolveUrlTokens(url)).to.equal(url);
    });

    it('should leave unknown tokens verbatim', () => {
      const url = 'http://example.com?foo={UNKNOWN}';
      expect(Util.resolveUrlTokens(url)).to.equal('http://example.com?foo={UNKNOWN}');
    });

    it('should percent-encode the + in timezone offset', () => {
      const url = 'http://example.com?start={NOW-30d}';
      const result = Util.resolveUrlTokens(url);
      expect(result).to.not.include('+');
    });
  });

  describe('Util.debounce', () => {
    let clock;

    beforeEach(() => {
      clock = sinon.useFakeTimers();
    });

    afterEach(() => {
      clock.restore();
    });
    it('should delay the function execution', () => {
      const func = sinon.spy();
      const delay = 500;
      const debouncedFunc = Util.debounce(func, delay);

      debouncedFunc();

      sinon.assert.notCalled(func);

      clock.tick(delay);

      sinon.assert.calledOnce(func);
    });

    it('should debounce multiple function calls', () => {
      const func = sinon.spy();
      const delay = 500;
      const debouncedFunc = Util.debounce(func, delay);

      debouncedFunc();
      debouncedFunc();
      debouncedFunc();

      sinon.assert.notCalled(func);

      clock.tick(delay);

      sinon.assert.calledOnce(func);
    });

    it('should execute the function with the latest arguments', () => {
      const func = sinon.spy();
      const delay = 500;
      const debouncedFunc = Util.debounce(func, delay);

      debouncedFunc(1);
      debouncedFunc(2);
      debouncedFunc(3);

      sinon.assert.notCalled(func);

      clock.tick(delay);

      sinon.assert.calledOnce(func);
      sinon.assert.calledWith(func, 3);
    });
  });
});
