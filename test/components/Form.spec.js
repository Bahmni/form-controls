import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { Form } from 'components/Form';

chai.use(chaiEnzyme());

describe('Form', () => {
  const formDetail = {
    name: 'Vitals',
    controls: [
      {
        id: '200',
        type: 'obsControl',
        controls: [
          {
            id: '100',
            type: 'label',
            value: 'Pulse',
          },
          {
            id: '101',
            type: 'text',
            properties: {
              mandatory: true,
              concept: {
                fullySpecifiedName: 'Pulse',
              },
            },
          },
        ],
      },
      {
        id: '201',
        type: 'obsControl',
        controls: [
          {
            id: '102',
            type: 'label',
            value: 'Temperature',
          },
          {
            id: '103',
            type: 'numeric',
            properties: {
              mandatory: true,
              concept: {
                fullySpecifiedName: 'Temperature',
              },
            },
          },
        ],
      },
      {
        id: '201',
        type: 'somethingRandom',
        controls: [],
      },
    ],
  };

  it('should render form', () => {
    const wrapper = shallow(<Form formDetail={formDetail} />);

    expect(wrapper.find('.form-name').text()).to.eql('Vitals');
    expect(wrapper).to.have.exactly(2).descendants('ObsControl');
    expect(wrapper).to.have.exactly(3).descendants; // eslint-disable-line
  });
});
