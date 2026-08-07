import React from 'react';
import { TextBox } from 'src/components/bahmni-design-system/TextBox';

export default {
  title: 'Atomic Controls/Bahmni Design System/TextBox',
  tags: ['autodocs'],
  component: TextBox,
  args: {
    validate: false,
    validateForm: false,
    validations: [],
    enabled: true,
    formFieldPath: 'test/1-0',
    conceptUuid: 'textbox-concept-uuid',
  },
  argTypes: {
    onChange: { action: 'onChange' },
    enabled: { control: 'boolean' },
    validate: { control: 'boolean' },
    validateForm: { control: 'boolean' },
    value: { control: 'text' },
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

Bahmni Design System rendering of the multi-line text observation control. It renders Carbon's **TextArea** (from \`@bahmni/design-system\`) in place of the legacy plain \`<textarea>\` — the field still auto-sizes to 3 rows, but gains Carbon's \`invalid\`/\`warn\` states and focus styling.

**Value stored:** a plain string.

## When to use

- Capturing unstructured clinical narrative — chief complaint, history, notes.
- When the answer is free prose rather than a coded or numeric value.
        `,
      },
    },
  },
};

export const Default = {};

export const WithValue = {
  args: {
    value: 'Patient reports mild headache since yesterday morning.',
  },
};

export const Disabled = {
  args: {
    enabled: false,
  },
};

export const ReadOnly = {
  args: {
    enabled: false,
    value: 'Chief complaint: fever for 3 days.',
  },
};

export const WithValidationError = {
  args: {
    validate: true,
    validations: ['mandatory'],
    value: undefined,
  },
};
