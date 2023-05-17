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
});
