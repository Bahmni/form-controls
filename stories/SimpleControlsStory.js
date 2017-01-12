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
