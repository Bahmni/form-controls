import React from 'react';
import { Date } from 'src/components/Date.jsx';

export default {
  title: 'Atomic Controls/Legacy Components/Date',
  tags: ['autodocs'],
  component: Date,
  args: {
    validate: false,
    validateForm: false,
    validations: [],
    enabled: true,
    formFieldPath: 'test/1-0',
    conceptUuid: 'date-concept-uuid',
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

Native date picker for date-type observations, with support for mandatory validation and enabled/disabled states.

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
