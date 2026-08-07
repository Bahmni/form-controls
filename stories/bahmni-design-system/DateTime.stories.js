import React from 'react';
import { DateTime } from 'src/components/bahmni-design-system/DateTime';

export default {
  title: 'Atomic Controls/Bahmni Design System/DateTime',
  tags: ['autodocs'],
  component: DateTime,
  args: {
    validate: false,
    validateForm: false,
    validations: [],
    enabled: true,
    formFieldPath: 'test/1-0',
    conceptUuid: 'datetime-concept-uuid',
    label: 'Date and Time',
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

Bahmni Design System rendering of the datetime observation control. It renders a Carbon **DatePicker** + **DatePickerInput** side by side with a Carbon **TimePicker** (all from \`@bahmni/design-system\`), replacing the legacy combined date/time widget. Both fields must be filled for a complete value — filling only the date or only the time leaves the observation incomplete.

**Value stored:** a string in \`YYYY-MM-DD HH:mm\` format, in local browser time with **no** timezone offset. Consumers are responsible for timezone interpretation — the stored string carries no TZ information.

## When to use

- Capturing an exact moment — e.g. time of admission, sample collection time.
- When the time-of-day matters; use **Date** if only the calendar date is needed.
        `,
      },
    },
  },
};

export const Default = {};

export const WithValue = {
  args: {
    value: '2024-01-15 14:30',
  },
};

export const Disabled = {
  args: {
    enabled: false,
    value: '2024-01-15 09:00',
  },
};

export const WithValidationError = {
  args: {
    validate: true,
    validations: ['mandatory'],
  },
};
