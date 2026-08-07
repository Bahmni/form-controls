import React from 'react';
import { Date } from 'src/components/bahmni-design-system/Date';

export default {
  title: 'Atomic Controls/Bahmni Design System/Date',
  tags: ['autodocs'],
  component: Date,
  args: {
    validate: false,
    validateForm: false,
    validations: [],
    enabled: true,
    formFieldPath: 'test/1-0',
    conceptUuid: 'date-concept-uuid',
    label: 'Date',
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

Bahmni Design System rendering of the date observation control. It renders Carbon's **DatePicker** and **DatePickerInput** (from \`@bahmni/design-system\`) in single-date mode, in place of the legacy native date input.

**Value stored:** an ISO 8601 string (\`YYYY-MM-DD\`).

## When to use

- Capturing a calendar date — e.g. date of onset, last menstrual period.
- When only the date matters; use **DateTime** if a time-of-day is also required.
        `,
      },
    },
  },
};

export const Default = {};

export const WithValue = {
  args: {
    value: '2024-01-15',
  },
};

export const Disabled = {
  args: {
    enabled: false,
    value: '2024-01-15',
  },
};

export const WithValidationError = {
  args: {
    validate: true,
    validations: ['mandatory'],
  },
};
