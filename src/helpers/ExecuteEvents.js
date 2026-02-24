/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import ScriptRunner from 'src/helpers/scriptRunner';

export function executeEventsFromCurrentRecord(currentRecord, rootRecord, patient) {
  let recordTree = rootRecord || currentRecord;
  if (!currentRecord.children) {
    return recordTree;
  }
  currentRecord.children.forEach(record => {
    recordTree = executeEventsFromCurrentRecord(record, recordTree);
    if (record.control && record.control.events) {
      const eventKeys = Object.keys(record.control.events);
      eventKeys.forEach(eventKey => {
        const script = record.control.events[eventKey];
        recordTree = new ScriptRunner(recordTree, patient, currentRecord)
          .execute(script);
      });
    }
  });
  return recordTree;
}
