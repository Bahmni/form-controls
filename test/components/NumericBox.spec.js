import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { NumericBox } from 'components/NumericBox.jsx';
import sinon from 'sinon';
import constants from 'src/constants';

chai.use(chaiEnzyme());

describe.skip('NumericBox', () => {
  before(() => {
    window.componentStore.registerComponent('numeric', NumericBox);
  });

  after(() => {
    window.componentStore.deRegisterComponent('numeric');
  });

  const onChangeSpy = sinon.spy();

  const validations = [constants.validations.allowDecimal, constants.validations.mandatory];

  it('should render NumericBox', () => {
    const wrapper = shallow(
      <NumericBox errors={[]} onChange={onChangeSpy} validations={[]} />
    );
    expect(wrapper.find('input').props().type).to.be.eql('number');
    expect(wrapper.find('input')).to.have.value(undefined);
  });


  it('should render NumericBox with default value', () => {
    const wrapper = shallow(
      <NumericBox errors={[]} onChange={onChangeSpy} validations={[]} value={'50'} />
    );
    expect(wrapper.find('input').props().type).to.be.eql('number');
    expect(wrapper.find('input')).to.have.value('50');
  });

  it('should get user entered value of the NumericBox', () => {
    const wrapper = shallow(
      <NumericBox errors={[]} onChange={onChangeSpy} validations={[]} value={'50'} />
    );
    wrapper.find('input').simulate('change', { target: { value: '999' } });
    sinon.assert.calledOnce(onChangeSpy.withArgs('999', []));
  });

  it('should render NumericBox with errors if error is present', () => {
    const errors = [constants.validations.mandatory];
    const wrapper = shallow(
      <NumericBox errors={errors} onChange={onChangeSpy} validations={[]} />
    );
    expect(wrapper.find('input')).to.have.className('form-builder-error');
  });

  it('should throw error on fail of validations', () => {
    const wrapper = shallow(
      <NumericBox errors={[]} onChange={onChangeSpy} validations={validations} />
    );
    wrapper.find('input').simulate('change', { target: { value: '50.32' } });
    sinon.assert.calledOnce(onChangeSpy.withArgs('50.32', [{ errorType: validations[0] }]));
    expect(wrapper.find('input')).to.have.className('form-builder-error');
  });
});
