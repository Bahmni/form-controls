/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React, { PureComponent } from 'react';

export class AddMoreDesigner extends PureComponent {

  render() {
    return (
      <div className="form-builder-clone">
        <button className="form-builder-add-more"><i className="fa fa-plus"></i></button>
        <button className="form-builder-remove"><i className="fa fa-remove"></i></button>
      </div>
    );
  }

}
