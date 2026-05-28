/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

const Constants = {
  Grid: {
    defaultRowWidth: 1,
    minColumns: 1,
    minRows: 4,
  },
  validations: {
    mandatory: 'mandatory',
    allowDecimal: 'allowDecimal',
    allowRange: 'allowRange',
    minMaxRange: 'minMaxRange',
    allowFutureDates: 'allowFutureDates',
    dateTimeError: 'dateTimeError',
  },
  errorTypes: {
    warning: 'warning',
    error: 'error',
  },
  bahmni: 'Bahmni',

  messageType: {
    success: 'success',
    error: 'error',
  },

  errorMessage: {
    fileTypeNotSupported: 'File Type not supported',
  },

  toastTimeout: 4000,
};

export default Constants;
