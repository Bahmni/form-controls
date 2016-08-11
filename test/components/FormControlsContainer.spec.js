import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { FormControlsContainer } from 'components/FormControlsContainer';
import { Label } from 'components/Label';
import { TextBox } from 'components/TextBox';

chai.use(chaiEnzyme());

describe('FormControlsContainer', () => {
  const controls = [
    <Label key="1" value="labelText" />,
    <TextBox key="2" type="text" />,
    <TextBox key="3" type="numeric" />,
  ];

  it('should render form', () => {
    const wrapper = shallow(<FormControlsContainer controls={controls} />);

    expect(wrapper).to.have.exactly(1).descendants('Label');
    expect(wrapper).to.have.exactly(2).descendants('TextBox');
    expect(wrapper).to.have.exactly(3).descendants; // eslint-disable-line
  });
});
