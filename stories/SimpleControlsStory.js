import React from 'react';
import { storiesOf } from '@storybook/react';
import { AddMore } from 'src/components/AddMore.jsx';
import { action } from '@storybook/addon-actions';

storiesOf('Simple Controls', module)
    .add('AddMore component with add button', () =>
        <AddMore canAdd={true} canRemove={false} onAdd={ action('add-clicked') } onRemove={ action('delete-clicked')}/>
  ).add('AddMore component with delete button', () =>
        <AddMore canAdd={false} canRemove={true} onAdd={ action('add-clicked') } onRemove={ action('delete-clicked')}/>
  ).add('AddMore component with add and delete button', () =>
    <AddMore canAdd={true} canRemove={true} onAdd={ action('add-clicked') } onRemove={ action('delete-clicked')}/>
);
