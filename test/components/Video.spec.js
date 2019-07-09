import React from 'react';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { Video } from 'src/components/Video.jsx';
import sinon from 'sinon';
import constants from 'src/constants';
import { Error } from 'src/Error';
import { Util } from 'src/helpers/Util';

chai.use(chaiEnzyme());
const sinonStubPromise = require('sinon-stub-promise');
sinonStubPromise(sinon);


describe('Video Control', () => {
  context('Video Upload', () => {
    let onChangeSpy;
    let wrapper;
    let addMoreSpy;
    let showNotificationSpy;
    const formFieldPath = 'test1.1/1-0';
    beforeEach(() => {
      onChangeSpy = sinon.spy();
      addMoreSpy = sinon.spy();
      showNotificationSpy = sinon.spy();

      wrapper = mount(
      <Video
        addMore
        formFieldPath={formFieldPath}
        onChange={onChangeSpy}
        onControlAdd={addMoreSpy}
        showNotification={showNotificationSpy}
        validate={false}
        validations={[]}
      />);
    });

    it('should render ComplexControl Video', () => {
      const fileFormat = '.mkv,.flv,.ogg,video/*,audio/3gpp';
      expect(wrapper.find('input')).to.have.prop('type').to.eql('file');
      expect(wrapper.find('input')).to.have.prop('accept').to.eql(fileFormat);
    });

    it('should display the video which been uploaded', () => {
      wrapper.setProps({ value: 'someValue' });

      expect(wrapper.find('video')).length.to.be(1);
    });

    it('should upload video file to server', () => {
    // given result of onloadend
      const result = 'data:video/flv;base64,/9j/4SumRXhpZgAATU';
      const stub = sinon.stub(FileReader.prototype, 'readAsDataURL').callsFake(function func() {
        this.onloadend({ target: { result } });
      });
    // spy on uploadFile
      const uploadSpy = sinon.spy(Util, 'uploadFile');
    // given response of fetch
      const response = {
        json: () => {},
      };
      window.fetch = () => {};
      const fetchPromise = sinon.stub(window, 'fetch').returnsPromise();
      const responsePromise = sinon.stub(response, 'json').returnsPromise();
      fetchPromise.resolves(response);
      responsePromise.resolves({ url: 'someUrl' });

      wrapper.find('input').simulate('change', { target: { files: [{ type: 'video/mp4' }] } });

      sinon.assert.calledOnce(uploadSpy.withArgs(result));
      sinon.assert.calledOnce(onChangeSpy.withArgs({ value: 'someUrl', errors: [] }));
      stub.restore();
      uploadSpy.restore();
    });

    it('should not upload if file type is not supported', () => {
      wrapper.find('input').simulate('change', { target: { files: [{ type: 'random' }] } });
      const uploadSpy = sinon.spy();
      sinon.assert.calledOnce(showNotificationSpy.withArgs(
      constants.errorMessage.fileTypeNotSupported,
      constants.messageType.error));
      sinon.assert.notCalled(uploadSpy);
    });

    it('should show restore button when click the delete button', () => {
      wrapper.setProps({ value: 'someValue' });

      wrapper.find('.delete-button').simulate('click');
      wrapper.setProps({ value: 'someValuevoided' });

      expect(wrapper.find('.restore-button')).length.to.be(1);
    });

    it('should one add more complex control without notification', () => {
      wrapper.setProps({ value: 'someValue' });

      sinon.assert.calledOnce(addMoreSpy.withArgs(formFieldPath, false));
    });

    it('should not add more complex control when there is no uploaded file', () => {
      wrapper.setProps({ value: undefined });

      sinon.assert.notCalled(addMoreSpy);
    });

    it('should not add more when the addMore property of complex control is false', () => {
      wrapper.setProps({ addMore: false });

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

      sinon.assert.called(onChangeSpy.withArgs({ value: undefined, errors: [mandatoryError] }));
      expect(wrapper.find('input')).to.have.className('form-builder-error');
    });

    it('should throw error on fail of validations during component update', () => {
      const validations = [constants.validations.mandatory];
      const mandatoryError = new Error({ message: validations[0] });
      wrapper.setProps({ validations, value: 'someValue' });

      wrapper.setProps({ validate: true, value: 'someValuevoided' });

      sinon.assert.calledOnce(onChangeSpy.withArgs({ value: 'someValuevoided',
        errors: [mandatoryError] }));
    });

    it('should not throw error when the complex control is created by add more', () => {
      const validations = [constants.validations.mandatory];
      wrapper.setProps({ validations, value: 'someValue', formFieldPath: 'test1.1/1-1' });

      wrapper.find('.delete-button').simulate('click');
      wrapper.setProps({ validate: true, value: 'someValuevoided' });

      sinon.assert.calledOnce(onChangeSpy.withArgs({ value: 'someValuevoided', errors: [] }));
    });

    it('should not update the component when the value is not change', () => {
      wrapper.setProps({ value: 'someValue' });
      wrapper.setProps({ value: 'someValue' });

      sinon.assert.notCalled(onChangeSpy.withArgs({ value: 'someValue', errors: [] }));
    });

    it('should check disabled attribute when enabled prop is false', () => {
      wrapper.setProps({ enabled: false });

      expect(wrapper.find('input').props().disabled).to.equal(true);
    });

    it('should show spinner when the file is uploading', () => {
      wrapper.find('input').simulate('change',
        { target: { files: [new Blob(['fileContent'], { type: 'video/mp4' })] } });

      expect(wrapper.find('Spinner').props().show).to.equal(true);
    });

    it('should not show spinner when the file is already uploaded', () => {
      wrapper.instance().update('someValue', []);

      expect(wrapper.find('Spinner').props().show).to.equal(false);
    });
  });
});
