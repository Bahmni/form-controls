import React from 'react';
import { FreeTextAutoComplete } from 'src/components/FreeTextAutoComplete.jsx';

const suggestionOptions = [
  { label: 'Headache', value: 'headache' },
  { label: 'Fever', value: 'fever' },
  { label: 'Cough', value: 'cough' },
  { label: 'Nausea', value: 'nausea' },
  { label: 'Fatigue', value: 'fatigue' },
];

export default {
  title: 'Atomic Controls/Legacy Components/FreeTextAutoComplete',
  tags: ['autodocs'],
  component: FreeTextAutoComplete,
  args: {
    options: [],
    multi: false,
    clearable: false,
    backspaceRemoves: false,
    deleteRemoves: false,
    conceptUuid: 'free-text-concept-uuid',
  },
  argTypes: {
    onChange: { action: 'onChange' },
    multi: { control: 'boolean' },
    clearable: { control: 'boolean' },
    backspaceRemoves: { control: 'boolean' },
    deleteRemoves: { control: 'boolean' },
  },
  parameters: {
    docs: {
      toc: {
        headingSelector: 'h2, h3',
        title: 'Table of Contents',
      },
      description: {
        component: `
## Overview

Creatable select input that combines free-text entry with predefined suggestions — users can type any value or pick from the options. Supports single and multi-select modes (\`multi: true\`).

**Value stored:** the typed or selected value(s).

## When to use

- When clinicians should be able to pick a suggestion **or** enter a new value not in the list.
- For open-ended coded fields where the option set is not exhaustive.
        `,
      },
    },
  },
};

export const Default = {};

export const WithOptions = {
  args: {
    options: suggestionOptions,
  },
};

export const MultiSelect = {
  args: {
    options: suggestionOptions,
    multi: true,
    clearable: true,
  },
};

export const Clearable = {
  args: {
    options: suggestionOptions,
    clearable: true,
    value: { label: 'Headache', value: 'headache' },
  },
};

export const Disabled = {
  parameters: {
    docs: {
      description: {
        story:
          'FreeTextAutoComplete does not expose an enabled/isDisabled prop. ' +
          'A <fieldset disabled> wrapper is used so screen readers announce the group as disabled (SC 4.1.2), ' +
          'consistent with the RadioButton disabled pattern.',
      },
    },
  },
  render: (args) => (
    <fieldset disabled style={{ border: 'none', padding: 0, margin: 0 }}>
      <FreeTextAutoComplete {...args} />
    </fieldset>
  ),
  args: {
    options: suggestionOptions,
    value: { label: 'Headache', value: 'headache' },
  },
};

export const WithValidationError = {
  parameters: {
    docs: {
      description: {
        story:
          'FreeTextAutoComplete does not implement its own validation logic. ' +
          'Validation errors are managed by the parent ObsControl and surface via CSS class injection. ' +
          'This story simulates the error wrapper applied by the parent.',
      },
    },
  },
  render: (args) => (
    <div className="form-builder-error">
      <FreeTextAutoComplete {...args} />
    </div>
  ),
  args: {
    options: suggestionOptions,
  },
};
