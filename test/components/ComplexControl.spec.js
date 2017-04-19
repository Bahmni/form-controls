import React from 'react';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { ComplexControl } from 'src/components/ComplexControl.jsx';
import sinon from 'sinon';
import { Error } from 'src/Error';

chai.use(chaiEnzyme());

describe('ComplexControl', () => {
  let onChangeSpy;
  let wrapper;
  beforeEach(() => {
    wrapper = mount(
      <ComplexControl
        formFieldPath="test1.1/1-0"
        onChange={onChangeSpy}
        validate={false}
        validations={[]}
      />
    );
    onChangeSpy = sinon.spy();
  });

  it('should render ComplexControl', () => {
    expect(wrapper.find('input')).to.have.prop('type').to.eql('file');
  });


});
