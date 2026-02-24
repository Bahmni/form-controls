/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import ValueMapperStore from '../helpers/ValueMapperStore';

export class BooleanValueMapper {

  getValue(control, value) {
    const [option] = control.options.filter(opt => opt.value === value);
    return option && option.name;
  }

  setValue(control, value) {
    const [option] = control.options.filter(opt => opt.name === value);
    return option && option.value;
  }

}

ValueMapperStore.registerValueMapper('Boolean', new BooleanValueMapper());
