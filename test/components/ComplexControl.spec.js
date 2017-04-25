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
  const formFieldPath = 'test1.1/1-0';
  beforeEach(() => {
    onChangeSpy = sinon.spy();
    addMoreSpy = sinon.spy();

    wrapper = mount(
      <ComplexControl
        formFieldPath={formFieldPath}
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
    const stub = sinon.stub(FileReader.prototype, 'readAsDataURL', function func() {
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

  it('should display the file with a link which been uploaded', () => {
    wrapper.setProps({ value: 'someValue' });

    expect(wrapper.find('a')).to.have.prop('href').to.eql('/document_images/someValue');
    expect(wrapper.find('a')).to.have.prop('target').to.eql('_blank');
  });

  it('should show restore button when click the delete button', () => {
    wrapper.setProps({ value: 'someValue' });

    wrapper.find('.delete-button').simulate('click');
    wrapper.setProps({ value: 'someValuevoided' });

    expect(wrapper.find('.restore-button')).length.to.be(1);
  });

  it('should hide the restore button when click the restore button', () => {
    wrapper.setProps({ value: 'someValue' });
    wrapper.find('.delete-button').simulate('click');
    wrapper.setProps({ value: 'someValuevoided' });

    wrapper.find('.restore-button').simulate('click');
    wrapper.setProps({ value: 'someValue' });

    expect(wrapper.find('.restore-button')).length.to.be(0);
  });

  it('should one add more complex control without notification when there is an uploaded file', () => {
    wrapper.setProps({ value: 'someValue' });

    sinon.assert.calledOnce(addMoreSpy.withArgs(formFieldPath, false));
  });

  it('should one add more complex control with notification after uploading the file', () => {
    sinon.stub(FileReader.prototype, 'readAsDataURL').returns('');

    wrapper.find('input').simulate('change', { target: { files: '' } });

    sinon.assert.calledOnce(addMoreSpy.withArgs(formFieldPath, true));
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

  it('should add more control when there is value and switch the tab', () => {
    wrapper.unmount();
    wrapper.mount();
    wrapper.setProps({ value: 'someValue' });

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
    wrapper.setProps({ validations, value: 'someValue' });

    wrapper.setProps({ validate: true, value: 'someValuevoided' });

    sinon.assert.calledOnce(onChangeSpy.withArgs('someValuevoided', [mandatoryError]));
  });

  it('should not throw error when the complex control is created by add more', () => {
    const validations = [constants.validations.mandatory];
    wrapper.setProps({ validations, value: 'someValue', formFieldPath: 'test1.1/1-1' });

    wrapper.find('.delete-button').simulate('click');
    wrapper.setProps({ validate: true, value: 'someValuevoided' });

    sinon.assert.calledOnce(onChangeSpy.withArgs('someValuevoided', []));
  });

  it('should not update the component when the value is not change', () => {
    wrapper.setProps({ value: 'someValue' });
    wrapper.setProps({ value: 'someValue' });

    sinon.assert.notCalled(onChangeSpy.withArgs('someValue'));
  });

  it('should check disabled attribute when enabled prop is false', () => {
    wrapper.setProps({ enabled: false });

    expect(wrapper.find('input').props().disabled).to.equal(true);
  });

  it('should show spinner when the file is uploading', () => {
    wrapper.find('input').simulate('change', { target: { files: [{}] } });

    expect(wrapper.find('Spinner').props().show).to.equal(true);
  });

  it('should not show spinner when the file is already uploaded', () => {
    wrapper.instance().update('someValue', []);

    expect(wrapper.find('Spinner').props().show).to.equal(false);
  });

  it('should not show spinner when the file is already uploaded', () => {
    wrapper.instance().update('someValue', []);

    expect(wrapper.find('Spinner').props().show).to.equal(false);
  });
});
