import React from 'react';
import { action } from '@storybook/addon-actions';
import { AddMore } from 'src/components/AddMore.jsx';

export default {
  title: 'Complex Controls/Legacy Components/Add More Controls',
  component: AddMore,
  parameters: {
    docs: {
      description: {
        component:
          'AddMore renders Add (+) and Remove (×) buttons that allow clinicians to record multiple ' +
          'instances of the same control within a single encounter. It is used by AddMoreDecorator to ' +
          'wrap any repeatable obs or obs group.',
      },
    },
  },
};

export const AddMoreWithAddButton = {
  render: () => (
    <AddMore canAdd={true} canRemove={false} onAdd={action('add-clicked')} onRemove={action('delete-clicked')} />
  ),
};

export const AddMoreWithDeleteButton = {
  render: () => (
    <AddMore canAdd={false} canRemove={true} onAdd={action('add-clicked')} onRemove={action('delete-clicked')} />
  ),
};

export const AddMoreWithAddAndDeleteButton = {
  render: () => (
    <AddMore canAdd={true} canRemove={true} onAdd={action('add-clicked')} onRemove={action('delete-clicked')} />
  ),
};
