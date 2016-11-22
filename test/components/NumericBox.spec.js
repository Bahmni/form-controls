import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { NumericBox } from 'components/NumericBox.jsx';
import sinon from 'sinon';
import constants from 'src/constants';

chai.use(chaiEnzyme());

describe('NumericBox', () => {
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
      <NumericBox onChange={onChangeSpy} validate={false} validations={[]} />
    );
    expect(wrapper.find('input').props().type).to.be.eql('number');
    expect(wrapper.find('input')).to.have.value(undefined);
  });


  it('should render NumericBox with default value', () => {
    const wrapper = shallow(
      <NumericBox onChange={onChangeSpy} validate={false} validations={[]} value={'50'} />
    );
    expect(wrapper.find('input').props().type).to.be.eql('number');
    expect(wrapper.find('input')).to.have.value('50');
  });

  it('should get user entered value of the NumericBox', () => {
    const wrapper = shallow(
      <NumericBox onChange={onChangeSpy} validate={false} validations={[]} value={'50'} />
    );
    wrapper.find('input').simulate('change', { target: { value: '999' } });
    sinon.assert.calledOnce(onChangeSpy.withArgs('999', []));
  });

  it('should throw error on fail of validations', () => {
    const wrapper = shallow(
      <NumericBox onChange={onChangeSpy} validate={false} validations={validations} />
    );
    wrapper.find('input').simulate('change', { target: { value: '50.32' } });
    sinon.assert.calledOnce(onChangeSpy.withArgs('50.32', [{ errorType: validations[0] }]));
    expect(wrapper.find('input')).to.have.className('form-builder-error');
  });

  it('should validate Numeric box when validate is set to true', () => {
    const wrapper = shallow(
      <NumericBox onChange={onChangeSpy} validate={false} validations={validations} />
    );
    wrapper.setProps({ validate: true, value: '98.6' });
    expect(wrapper.find('input')).to.have.className('form-builder-error');
  });

  it('should render NumericBox on change of value', () => {
    const wrapper = shallow(
      <NumericBox onChange={onChangeSpy} validate={false} validations={validations} />
    );
    wrapper.setProps({ value: '98.6' });
    expect(wrapper.find('input')).to.have.value('98.6');
  });

  it('should throw error when the value is not in correct range', () => {
    const wrapper = shallow(
        <NumericBox errors={[]} maxNormal="50" minNormal="20"
          onChange={onChangeSpy} validations={validations}
        />
    );
    wrapper.find('input').simulate('change', { target: { value: '50.32' } });
    sinon.assert.calledOnce(onChangeSpy.withArgs('50.32', [{ errorType: validations[0] }]));
    expect(wrapper.find('input')).to.have.className('form-builder-error');
  });
});
