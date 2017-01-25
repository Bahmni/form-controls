import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { NumericBoxDesigner } from 'components/NumericBox/NumericBoxDesigner.jsx';

chai.use(chaiEnzyme());

describe('NumericBoxDesigner', () => {
  let wrapper;
  let metadata;

  beforeEach(() => {
    metadata = {
      concept: {
        name: 'Pulse',
        uuid: 'someUuid',
      },
      displayType: 'numeric',
      type: 'obsControl',
      id: 'someId',
      properties: {},
    };
    wrapper = shallow(<NumericBoxDesigner metadata={metadata} />);
  });

  it('should render the input', () => {
    expect(wrapper).to.have.descendants('input');
    expect(wrapper.find('input').props().type).to.eql('number');
  });

  it('should return json definition', () => {
    const instance = wrapper.instance();
    expect(instance.getJsonDefinition()).to.deep.eql(metadata);
  });

  it('should render the range information when available', () => {
    const lowNormal = 5;
    const hiNormal = 10;
    metadata = {
      concept: {
        name: 'Pulse',
        uuid: 'someUuid',
      },
      displayType: 'numeric',
      type: 'obsControl',
      id: 'someId',
      properties: {},
    };
    const numericBox = shallow(
      <NumericBoxDesigner
        hiNormal={hiNormal}
        lowNormal={lowNormal}
        metadata={metadata}
      />
    );
    expect(numericBox.find('span')).to.have.text(`(${lowNormal} - ${hiNormal})`);
  });

  describe('getRange', () => {
    it('should show range when both hiNormal and lowNormal are present', () => {
      const lowNormal = 5;
      const hiNormal = 10;

      const rangeStr = NumericBoxDesigner.getRange(lowNormal, hiNormal);
      expect(rangeStr).to.eql(`(${lowNormal} - ${hiNormal})`);
    });

    it('should show range as greater than lowNormal when only it is present', () => {
      const lowNormal = 5;

      const rangeStr = NumericBoxDesigner.getRange(lowNormal);
      expect(rangeStr).to.eql(`(> ${lowNormal})`);
    });

    it('should show range as lesser than hiNormal when only it is present', () => {
      const hiNormal = 5;

      const rangeStr = NumericBoxDesigner.getRange(undefined, hiNormal);
      expect(rangeStr).to.eql(`(< ${hiNormal})`);
    });
  });
});
