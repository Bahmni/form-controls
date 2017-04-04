import { expect } from 'chai';
import CodedControlMapper from '../../src/mapper/CodedControlMapper';

describe('CodedControlMapper', () => {
  const codedObsControl = {
    concept: {
      answers: [
        {
          displayString: 'Cephalic',
          uuid: 'c4526510-3f10-11e4-adec-0800271c1b75',
        },
        {
          displayString: 'Breech',
          uuid: 'c45329de-3f10-11e4-adec-0800271c1b75',
        },
        {
          displayString: 'Transverse',
          uuid: 'c453caa3-3f10-11e4-adec-0800271c1b75',
        },
      ],
      datatype: 'Coded',
      name: 'P/A Presenting Part',
      uuid: 'c4517f49-3f10-11e4-adec-0800271c1b75',
    },
    type: 'obsControl',
  };

  const mapper = new CodedControlMapper();

  it('should get value when given option value', () => {
    const name = 'Breech';
    const originalValue = {
      displayString: name,
    };

    const value = mapper.getValue(codedObsControl, originalValue);

    expect(value).to.equal(name);
  });

  it('should set value when given option name', () => {
    const originalValue = 'Breech';

    const value = mapper.setValue(codedObsControl, originalValue);

    expect(value instanceof Object).to.equal(true);
    expect(value.displayString).to.equal(originalValue);
  });
});
