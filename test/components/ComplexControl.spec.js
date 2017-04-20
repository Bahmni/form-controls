import React from 'react';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { ComplexControl } from 'src/components/ComplexControl.jsx';
import sinon from 'sinon';
import constants from 'src/constants';
import { Error } from 'src/Error';

chai.use(chaiEnzyme());
const sinonStubPromise = require('sinon-stub-promise');
sinonStubPromise(sinon);


describe('ComplexControl', () => {
  let onChangeSpy;
  let wrapper;
  let addMoreSpy;
  beforeEach(() => {
    onChangeSpy = sinon.spy();
    addMoreSpy = sinon.spy();

    wrapper = mount(
      <ComplexControl
        formFieldPath="test1.1/1-0"
        onChange={onChangeSpy}
        onControlAdd={addMoreSpy}
        validate={false}
        validations={[]}
      />);
  });

  it('should render ComplexControl', () => {
    expect(wrapper.find('input')).to.have.prop('type').to.eql('file');
  });

  it('should upload file to server', () => {
    // given result of onloadend
    const result = 'data:image/jpeg;base64,/9j/4SumRXhpZgAATU';
    const stub = sinon.stub(FileReader.prototype, 'readAsDataURL', function () {
      this.onloadend({ target: { result } });
    });
    // spy on uploadFile
    const uploadSpy = sinon.spy(wrapper.instance(), 'uploadFile');
    // given response of fetch
    const response = {
      json: () => {},
    };
    window.fetch = () => {};
    const fetchPromise = sinon.stub(window, 'fetch').returnsPromise();
    const responsePromise = sinon.stub(response, 'json').returnsPromise();
    fetchPromise.resolves(response);
    responsePromise.resolves({ url: 'someUrl' });

    wrapper.find('input').simulate('change', { target: { files: [{}] } });

    sinon.assert.calledOnce(uploadSpy.withArgs(result));
    sinon.assert.calledOnce(onChangeSpy.withArgs('someUrl'));
    stub.restore();
  });

  it('should display the file which been uploaded', () => {
    wrapper.setProps({ value: 'someValue' });

    expect(wrapper.find('img')).length.to.be(1);
  });

  it('should hide uploaded file and delete button and show restore button when click the delete button',
    () => {
      wrapper.setProps({ value: 'someValue' });

      wrapper.find('.delete-button').simulate('click');
      wrapper.setProps({ value: undefined });

      sinon.assert.calledOnce(onChangeSpy.withArgs(undefined));
      expect(wrapper.find('img')).length.to.be(0);
      expect(wrapper.find('.delete-button')).length.to.be(0);
      expect(wrapper.find('.restore-button')).length.to.be(1);
    });

  it('should display uploaded file and delete button and hide the restore button when click the restore button', () => {
    wrapper.setProps({ value: 'someValue' });
    wrapper.instance().previewUrl = 'someValue';
    wrapper.find('.delete-button').simulate('click');
    wrapper.setProps({ value: undefined });

    wrapper.find('.restore-button').simulate('click');
    wrapper.setProps({ value: 'someValue' });

    sinon.assert.calledOnce(onChangeSpy.withArgs('someValue'));
    expect(wrapper.find('img')).length.to.be(1);
    expect(wrapper.find('.delete-button')).length.to.be(1);
    expect(wrapper.find('.restore-button')).length.to.be(0);
  });

  it('should one add more complex control when there is an uploaded file', () => {
    wrapper.setProps({ value: 'someValue' });

    sinon.assert.calledOnce(addMoreSpy);
  });

  it('should not add more complex control when there is no uploaded file', () => {
    wrapper.setProps({ value: undefined });

    sinon.assert.notCalled(addMoreSpy);
  });

  it('should only one add more complex control when there is an re-uploaded file', () => {
    wrapper.setProps({ value: 'someValue' });

    wrapper.setProps({ value: 'newValue' });

    sinon.assert.calledOnce(addMoreSpy);
  });

  it('should throw error on fail of validations', () => {
    const validations = [constants.validations.mandatory];
    const mandatoryError = new Error({ message: validations[0] });
    wrapper.setProps({ validations });

    wrapper.find('input').simulate('change', { target: { files: undefined } });

    sinon.assert.called(onChangeSpy.withArgs(undefined, [mandatoryError]));
    expect(wrapper.find('input')).to.have.className('form-builder-error');
  });

  it('should throw error on fail of validations during component update', () => {
    const validations = [constants.validations.mandatory];
    const mandatoryError = new Error({ message: validations[0] });
    wrapper.setProps({ validations });
    wrapper.setProps({ value: 'someValue' });

    wrapper.setProps({ validate: true, value: undefined });
    sinon.assert.calledOnce(onChangeSpy.withArgs(undefined, [mandatoryError]));
  });

  it('should not update the component when the value is not change', () => {
    wrapper.setProps({ value: 'someValue' });
    wrapper.setProps({ value: 'someValue' });
    sinon.assert.notCalled(onChangeSpy.withArgs('someValue'));
  });
});
