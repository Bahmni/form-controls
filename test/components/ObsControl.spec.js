import React from 'react';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { ObsControl } from 'components/ObsControl';

chai.use(chaiEnzyme());

describe('ObsControl', () => {
  it('should render label and text box observation controls', () => {
    const controls = [
      {
        id: '100',
        type: 'label',
        value: 'History Notes',
      },
      {
        id: '101',
        type: 'text',
      },
      {
        id: '102',
        type: 'numeric',
      },
      {
        id: '103',
        type: 'somethingRandom',
      },
    ];

    const wrapper = mount(<ObsControl controls={controls} />);

    expect(wrapper).to.have.exactly(1).descendants('Label');
    expect(wrapper).to.have.exactly(2).descendants('TextBox');
    expect(wrapper).to.have.exactly(3).descendants; // eslint-disable-line

    expect(wrapper.find('input').at(0).props().type).to.be.eql('text');
    expect(wrapper.find('input').at(1).props().type).to.be.eql('number');
  });

  it('should return the value of the controls as an array of values', () => {
    const controls = [
      {
        id: 'c1',
        type: 'text',
        value: 'text1',
      },
      {
        id: 'c2',
        type: 'text',
        value: 'text2',
      },
    ];
    const obsControl = mount(<ObsControl controls={controls} />);
    const instance = obsControl.instance();
    const obsControlValue = instance.getValue();

    expect(obsControlValue).to.deep.eql([
      {
        id: 'c1',
        value: 'text1',
      },
      {
        id: 'c2',
        value: 'text2',
      },
    ]);
  });

  it('should return empty array if the controls are just labels', () => {
    const controls = [
      {
        id: 'c1',
        type: 'label',
        value: 'label1',
      },
      {
        id: 'c2',
        type: 'label',
        value: 'label2',
      },
    ];
    const obsControl = mount(<ObsControl controls={controls} />);
    const instance = obsControl.instance();

    const obsControlValue = instance.getValue();

    expect(obsControlValue).to.deep.eql([]);
  });
});
