/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React from 'react';
import { storiesOf,action } from '@kadira/storybook';
import { AddMore } from 'src/components/AddMore.jsx';

storiesOf('Simple Controls', module)
    .add('AddMore component with add button', () =>
        <AddMore canAdd={true} canRemove={false} onAdd={ action('add-clicked') } onRemove={ action('delete-clicked')}/>
  ).add('AddMore component with delete button', () =>
        <AddMore canAdd={false} canRemove={true} onAdd={ action('add-clicked') } onRemove={ action('delete-clicked')}/>
  ).add('AddMore component with add and delete button', () =>
    <AddMore canAdd={true} canRemove={true} onAdd={ action('add-clicked') } onRemove={ action('delete-clicked')}/>
);
