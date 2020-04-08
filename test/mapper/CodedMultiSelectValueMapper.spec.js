import { expect } from 'chai';
import { CodedMultiSelectValueMapper } from '../../src/mapper/CodedMultiSelectValueMapper';

describe('CodedMultiSelectValueMapper', () => {
  const codedMultiSelectObsControl = {
    properties: { multiSelect: true },
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

  const mapper = new CodedMultiSelectValueMapper();

  it('should get the selected values as array of string when display string is available', () => {
    const selectedValues = [
      {
        name: { name: 'Breech' },
        displayString: 'Breech',
      },
      {
        name: { name: 'Transverse' },
        displayString: 'Transverse',
      },
    ];
    const value = mapper.getValue(codedMultiSelectObsControl, selectedValues);

    expect(value).to.deep.eql(['Breech', 'Transverse']);
  });

  it('should get the selected values as array of string when name is available', () => {
    const selectedValues = [
      {
        name: { name: 'Breech' },
      },
      {
        name: { name: 'Transverse' },
      },
    ];
    const value = mapper.getValue(codedMultiSelectObsControl, selectedValues);

    expect(value).to.deep.eql(['Breech', 'Transverse']);
  });

  it('should set value when given option names', () => {
    const values = [
      {
        displayString: 'Breech',
        uuid: 'c45329de-3f10-11e4-adec-0800271c1b75',
      },
      {
        displayString: 'Transverse',
        uuid: 'c453caa3-3f10-11e4-adec-0800271c1b75',
      },
    ];
    const value = mapper.setValue(codedMultiSelectObsControl, ['Breech', 'Transverse']);

    expect(value).to.deep.eql(values);
  });

  it('should return empty array when undefined is passed to get value', () => {
    const value = mapper.getValue(codedMultiSelectObsControl, undefined);

    expect(value).to.deep.eql([]);
  });

  it('should return empty array when undefined is passed to set value', () => {
    const value = mapper.setValue(codedMultiSelectObsControl, undefined);

    expect(value).to.deep.eql([]);
  });
});
