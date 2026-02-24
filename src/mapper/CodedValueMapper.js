/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import ValueMapperStore from '../helpers/ValueMapperStore';

export class CodedValueMapper {

  getValue(control, value) {
    return value && (value.displayString || value.name);
  }

  setValue(control, value) {
    const [answer] = control.concept.answers.filter(obj => obj.displayString === value);
    return answer;
  }

}


ValueMapperStore.registerValueMapper('Coded', new CodedValueMapper());
