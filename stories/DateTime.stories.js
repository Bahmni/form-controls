import React from 'react';
import { DateTime } from 'src/components/DateTime.jsx';

export default {
  title: 'Atomic Controls/Legacy Components/DateTime',
  tags: ['autodocs'],
  component: DateTime,
  args: {
    validate: false,
    validateForm: false,
    validations: [],
    enabled: true,
    formFieldPath: 'test/1-0',
    conceptUuid: 'datetime-concept-uuid',
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

Combined date and time picker for datetime observations. Both fields must be filled for a valid observation — a partial fill (date only or time only) triggers an "Incorrect Date Time" validation error.

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
