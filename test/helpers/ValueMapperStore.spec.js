import { expect } from 'chai';
import ValueMapperStore from '../../src/helpers/ValueMapperStore';
import { BooleanValueMapper } from '../../src/mapper/BooleanValueMapper';
import { CodedValueMapper } from '../../src/mapper/CodedValueMapper';


describe('ValueMapperStore', () => {
  it('should get undefined when given obs control\'s type is not boolean or coded', () => {
    const obsControls = [
      { concept: { datatype: 'Text' } },
      { concept: { datatype: 'Date' } },
      { concept: { datatype: 'Datetime' } },
      { concept: { datatype: 'Numeric' } },
    ];

    obsControls.forEach(obsControl => {
      const datatypeMapper = ValueMapperStore.getMapper(obsControl);

      expect(datatypeMapper).to.equal(undefined);
    });
  });

  it('should get boolean control mapper when given boolean obs control', () => {
    const booleanObsControl = {
      concept: {
        datatype: 'Boolean',
      },
    };

    const datatypeMapper = ValueMapperStore.getMapper(booleanObsControl);

    expect(datatypeMapper instanceof BooleanValueMapper).to.equal(true);
  });


  it('should get coded control mapper when given coded obs control', () => {
    const codedObsControl = {
      concept: {
        datatype: 'Coded',
      },
    };

    const datatypeMapper = ValueMapperStore.getMapper(codedObsControl);

    expect(datatypeMapper instanceof CodedValueMapper).to.equal(true);
  });
});

