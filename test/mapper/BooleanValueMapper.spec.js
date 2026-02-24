/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import { expect } from 'chai';
import { BooleanValueMapper } from '../../src/mapper/BooleanValueMapper';


describe('BooleanValueMapper', () => {
  const booleanObsControl = {
    concept: {
      answers: [],
      datatype: 'Boolean',
      name: 'Smoking History',
      uuid: 'c2a43174-c9db-4e54-8516-17372c83537f',
    },
    label: {
      type: 'label',
      value: 'Smoking History',
    },
    options: [
      {
        name: 'Yes',
        value: true,
      },
      {
        name: 'No',
        value: false,
      },
    ],
    type: 'obsControl',
  };

  const mapper = new BooleanValueMapper();

  it('should get value when given option value', () => {
    const originalValue = false;

    const value = mapper.getValue(booleanObsControl, originalValue);

    expect(value).to.equal('No');
  });

  it('should set value when given option name', () => {
    const originalValue = 'Yes';

    const value = mapper.setValue(booleanObsControl, originalValue);

    expect(value).to.equal(true);
  });
});

