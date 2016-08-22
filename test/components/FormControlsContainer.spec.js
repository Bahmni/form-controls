/* eslint-disable no-undef */
import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { FormControlsContainer } from 'components/FormControlsContainer.jsx';
import { Label } from 'components/Label.jsx';
import { TextBox } from 'components/TextBox.jsx';
import { NumericBox } from 'components/NumericBox.jsx';
import { ObsControl } from 'components/ObsControl.jsx';

chai.use(chaiEnzyme());

describe('FormControlsContainer', () => {
  before(() => {
    componentStore.registerComponent('label', Label);
    componentStore.registerComponent('text', TextBox);
    componentStore.registerComponent('numeric', NumericBox);
    componentStore.registerComponent('obsControl', ObsControl);
  });

  after(() => {
    componentStore.deRegisterComponent('label');
    componentStore.deRegisterComponent('text');
    componentStore.deRegisterComponent('numeric');
    componentStore.deRegisterComponent('obsControl');
  });

  const metadata = {
    name: 'Vitals',
    controls: [
      {
        id: '100',
        type: 'label',
        value: 'Pulse',
      },
      {
        id: '101',
        type: 'obsControl',
        displayType: 'text',
        concept: {
          uuid: '1234567890',
          fullySpecifiedName: 'Pulse',
        },
      },
      {
        id: '102',
        type: 'obsControl',
        displayType: 'numeric',
        concept: {
          uuid: '0987654321',
          fullySpecifiedName: 'Temperature',
        },
      },
    ],
  };

  describe('render', () => {
    it('should render form', () => {
      const wrapper = shallow(<FormControlsContainer metadata={metadata} obs={[]} />);

      expect(wrapper).to.have.exactly(1).descendants('Label');
      expect(wrapper).to.have.exactly(2).descendants('ObsControl');
    });

    it('should render form without controls when it is empty', () => {
      const wrapper = shallow(<FormControlsContainer metadata={{ controls: [] }} obs={[]} />);

      expect(wrapper).to.be.blank();
    });

    it('should render form with only the registered controls', () => {
      componentStore.deRegisterComponent('label');

      const wrapper = shallow(<FormControlsContainer metadata={metadata} obs={[]} />);

      expect(wrapper).to.not.have.descendants('Label');
      expect(wrapper).to.have.exactly(2).descendants('ObsControl');

      componentStore.registerComponent('label', Label);
    });
  });
});
/* eslint-enable no-undef */
