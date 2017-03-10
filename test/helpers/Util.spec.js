import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { Util } from '../../src/helpers/Util';


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
});
