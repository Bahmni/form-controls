import { expect } from 'chai';
import DatatypeStore from '../../src/helpers/DatatypeStore';
import BooleanControlMapper from '../../src/mapper/BooleanControlMapper';
import CodedControlMapper from '../../src/mapper/CodedControlMapper';


describe('DatatypeStore', () => {
  it('should get undefined when given obs control\'s type is not boolean or coded', () => {
    const obsControls = [
      { concept: { datatype: 'Text' } },
      { concept: { datatype: 'Date' } },
      { concept: { datatype: 'Datetime' } },
      { concept: { datatype: 'Numeric' } },
    ];

    obsControls.forEach(obsControl => {
      const datatypeMapper = DatatypeStore.getMapper(obsControl);

      expect(datatypeMapper).to.equal(undefined);
    });
  });

  it('should get boolean control mapper when given boolean obs control', () => {
    const booleanObsControl = {
      concept: {
        datatype: 'Boolean',
      },
    };

    const datatypeMapper = DatatypeStore.getMapper(booleanObsControl);

    expect(datatypeMapper instanceof BooleanControlMapper).to.equal(true);
  });


  it('should get coded control mapper when given coded obs control', () => {
    const codedObsControl = {
      concept: {
        datatype: 'Coded',
      },
    };

    const datatypeMapper = DatatypeStore.getMapper(codedObsControl);

    expect(datatypeMapper instanceof CodedControlMapper).to.equal(true);
  });
});

