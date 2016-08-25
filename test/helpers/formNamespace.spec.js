import { expect } from 'chai';
import { createFormNamespace, getFormNamespaceDetails } from 'src/helpers/formNamespace';

describe('FormNamespace Helper', () => {
  describe('createFormNamespace', () => {
    it('should create formNamespace from form uuid and controlId', () => {
      const expectedDetails = 'someFormUuid/someControlId';

      expect(createFormNamespace('someFormUuid', 'someControlId')).to.eql(expectedDetails);
    });
  });

  describe('getFormNamespaceDetails', () => {
    it('should get formUuid and controlId from the namespace', () => {
      const expectedDetails = {
        formUuid: 'FUuid',
        controlId: 'CID',
      };

      expect(getFormNamespaceDetails('FUuid/CID/randomId')).to.eql(expectedDetails);
    });
  });
});
