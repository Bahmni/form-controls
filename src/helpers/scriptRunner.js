/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import FormContext from './FormContext';
import { httpInterceptor } from '../helpers/httpInterceptor';
import { base64ToUtf8 } from './encodingUtils';

export default class ScriptRunner {

  constructor(rootRecord, patient, parentRecord) {
    this.formContext = new FormContext(rootRecord, patient, parentRecord);
    this.interceptor = httpInterceptor;
  }

  convertToUTF8(str) {
    try {
      return base64ToUtf8(str);
    } catch (error) {
      console.log('Error in decoding script from base64, executing as is.', error);
      return str;
    }
  }

  execute(eventJs) {
    const formContext = this.formContext;
    const interceptor = this.interceptor;
    if (eventJs && interceptor) {
      const decodedScript = this.convertToUTF8(eventJs);
      const executiveJs = `(${decodedScript})(formContext,interceptor)`;
      /* eslint-disable */
      eval(executiveJs);
    }
    return formContext.getRecords();
  }

}
