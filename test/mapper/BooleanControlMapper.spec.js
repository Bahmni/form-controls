import { expect } from 'chai';
import BooleanControlMapper from '../../src/mapper/BooleanControlMapper';


describe('BooleanControlMapper', () => {
  const booleanObsControl = {
    concept: {
      answers: [],
      datatype: 'Boolean',
      name: 'Smoking History',
      uuid: 'c2a43174-c9db-4e54-8516-17372c83537f',
    },
    label: {
      type: 'label',
      value: 'Smoking History',
    },
    options: [
      {
        name: 'Yes',
        value: true,
      },
      {
        name: 'No',
        value: false,
      },
    ],
    type: 'obsControl',
  };

  const mapper = new BooleanControlMapper();

  it('should get value when given option value', () => {
    const originalValue = false;

    const value = mapper.getValue(booleanObsControl, originalValue);

    expect(value).to.equal('No');
  });

  it('should set value when given option name', () => {
    const originalValue = 'Yes';

    const value = mapper.setValue(booleanObsControl, originalValue);

    expect(value).to.equal(true);
  });
});

