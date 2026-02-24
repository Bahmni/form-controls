/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import { Component } from 'react';

export class Draggable extends Component {
  constructor(data) {
    super(data);
    this.data = data;
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(context) {
    return (e) => {
      e.stopPropagation();
      if (this.data.parentRef) {
        this.data.parentRef.notifyMove(e, context);
      }
    };
  }

  onDragStart(context) {
    return (e) => {
      const modifiedContext = this.processDragStart(context);
      e.dataTransfer.setData('data', JSON.stringify(modifiedContext));
      e.stopPropagation();
    };
  }

  processDragStart(context) {
    return context;
  }
}
