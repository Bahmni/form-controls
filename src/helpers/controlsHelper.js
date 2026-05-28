/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import constants from 'src/constants';

export function getValidations(properties, conceptProperties) {
  const validations = [];
  if (properties && properties.mandatory) validations.push(constants.validations.mandatory);
  if (conceptProperties && conceptProperties.allowDecimal === false) {
    validations.push(constants.validations.allowDecimal);
  }
  if (properties && properties.allowFutureDates === false) {
    validations.push(constants.validations.allowFutureDates);
  }
  return validations;
}
