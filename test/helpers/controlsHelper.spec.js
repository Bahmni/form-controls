/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import { expect } from 'chai';
import { getValidations } from 'src/helpers/controlsHelper';
import constants from 'src/constants';

describe('ControlsHelper', () => {
  describe('should test getValidations', () => {
    it('get mandatory, allowDecimal validations from properties', () => {
      const props = { mandatory: true };
      const conceptProperties = { allowDecimal: false };
      const validations = getValidations(props, conceptProperties);

      expect(validations.length).to.equals(2);
      expect(validations[0]).to.equals(constants.validations.mandatory);
      expect(validations[1]).to.equals(constants.validations.allowDecimal);
    });

    it('get mandatory validations from properties', () => {
      const props = { mandatory: true };
      const validations = getValidations(props, undefined);

      expect(validations.length).to.equals(1);
      expect(validations[0]).to.equals(constants.validations.mandatory);
    });

    it('get allowFutureDates validations from properties', () => {
      const props = { allowFutureDates: false };
      const validations = getValidations(props, undefined);

      expect(validations.length).to.equals(1);
      expect(validations[0]).to.equals(constants.validations.allowFutureDates);
    });

    it('get allowDecimal validations from properties', () => {
      let conceptProperties = { allowDecimal: false };
      let validations = getValidations({}, conceptProperties);

      expect(validations.length).to.equals(1);
      expect(validations[0]).to.equals(constants.validations.allowDecimal);

      conceptProperties = { allowDecimal: true };
      validations = getValidations({}, conceptProperties);
      expect(validations.length).to.equals(0);
    });

    it('should not throw exceptions for properties without validations', () => {
      const validations = getValidations(undefined, undefined);

      expect(validations.length).to.equals(0);
    });
  });
});
