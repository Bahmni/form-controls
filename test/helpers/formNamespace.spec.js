import { expect } from 'chai';
import Constants from 'src/constants';
import { createFormNamespaceAndPath, getKeyPrefixForControl } from 'src/helpers/formNamespace';

describe('FormNamespace Helper', () => {
  describe('createFormNamespace', () => {
    it('should create formNamespace from form uuid and controlId', () => {
      const expectedDetails = {
        formNamespace: `${Constants.bahmni}`,
        formFieldPath: 'someFormName.1/someControlId-0',
      };

      expect(createFormNamespaceAndPath('someFormName', '1', 'someControlId'))
        .to.deep.eql(expectedDetails);
    });

    it('should return object containing formNamespace and formFieldPath', () => {
      const expectedDetails = {
        formNamespace: `${Constants.bahmni}`,
        formFieldPath: 'formName.1/1',
      };

      expect(getKeyPrefixForControl('formName', '1', '1')).to.deep.eql(expectedDetails);
    });
  });
});
