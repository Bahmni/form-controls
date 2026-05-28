/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import MapperStore from 'src/helpers/MapperStore';
import flattenDeep from 'lodash/flattenDeep';

export default class ObservationMapper {
  from(records) {
    const result = records.children.map((r) => {
      const mapper = MapperStore.getMapper(r.control);
      return mapper.getData(r);
    });
    const filteredResult = result.filter(r => r && (r.concept || !r.voided));

    return flattenDeep(filteredResult.toJS());
  }
}
