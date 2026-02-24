/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import ValueMapperStore from '../helpers/ValueMapperStore';

export class CodedMultiSelectValueMapper {

  getValue(control, value) {
    if (value === undefined) {
      return [];
    }
    const selectedValues = [];
    value.forEach(selectedValue => {
      const displayValue = selectedValue.displayString
        ? selectedValue.displayString : selectedValue.name.name;
      selectedValues.push(displayValue);
    });
    return selectedValues;
  }

  setValue(control, value) {
    if (value === undefined || !Array.isArray(value)) {
      return [];
    }
    const answer = control.concept.answers.filter(obj => value.includes(obj.displayString));
    return answer;
  }

}


ValueMapperStore.registerValueMapper('CodedMultiSelect', new CodedMultiSelectValueMapper());
