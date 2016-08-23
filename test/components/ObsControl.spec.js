import React from 'react';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { ObsControl } from 'components/ObsControl.jsx';
import { TextBox } from 'components/TextBox.jsx';
import { NumericBox } from 'components/NumericBox.jsx';

chai.use(chaiEnzyme());

describe('ObsControl', () => {
  before(() => {
    window.componentStore.registerComponent('obsControl', ObsControl);
    window.componentStore.registerComponent('text', TextBox);
    window.componentStore.registerComponent('numeric', NumericBox);
  });

  after(() => {
    window.componentStore.deRegisterComponent('obsControl');
    window.componentStore.deRegisterComponent('text');
    window.componentStore.deRegisterComponent('numeric');
  });

  const concept = {
    uuid: '70645842-be6a-4974-8d5f-45b52990e132',
    name: 'Pulse',
    dataType: 'Text',
  };

  it('should render TextBox', () => {
    const metadata = {
      id: '100',
      type: 'obsControl',
      displayType: 'text',
      concept,
    };

    const wrapper = mount(<ObsControl metadata={metadata} />);
    expect(wrapper).to.have.exactly(1).descendants('TextBox');
    expect(wrapper.find('input').at(0).props().type).to.be.eql('text');
  });

  it('should render NumericBox', () => {
    const metadata = {
      id: '100',
      type: 'obsControl',
      displayType: 'numeric',
      concept,
    };

    const wrapper = mount(<ObsControl metadata={metadata} />);
    expect(wrapper).to.have.exactly(1).descendants('NumericBox');
    expect(wrapper.find('input').at(0).props().type).to.be.eql('number');
  });

  it('should return the obsControl value', () => {
    const metadata = {
      id: '100',
      type: 'obsControl',
      displayType: 'text',
      concept,
    };

    const obs = {
      value: 'someInputValue',
    };

    const expectedObs = {
      concept,
      value: 'someInputValue',
    };

    const obsControl = mount(<ObsControl metadata={metadata} obs={obs} />);
    const instance = obsControl.instance();
    const obsControlValue = instance.getValue();

    expect(obsControlValue).to.deep.eql(expectedObs);
  });
});
