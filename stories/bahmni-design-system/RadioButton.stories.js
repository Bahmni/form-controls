import React from 'react';
import { RadioButton } from 'src/components/bahmni-design-system/RadioButton';
import { codedConceptAnswers } from './fixtures';

export default {
  title: 'Atomic Controls/Bahmni Design System/RadioButton',
  tags: ['autodocs'],
  component: RadioButton,
  args: {
    validate: false,
    validations: [],
    enabled: true,
    formFieldPath: 'test/1-0',
    conceptUuid: 'radio-concept-uuid',
    options: codedConceptAnswers,
  },
  argTypes: {
    onValueChange: { action: 'onValueChange' },
    onBlur: { action: 'onBlur' },
    enabled: { control: 'boolean' },
    validate: { control: 'boolean' },
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

Bahmni Design System rendering of the coded radio-button control. It renders Carbon's **RadioButtonGroup** and **RadioButton** (from \`@carbon/react\`) in place of the legacy radio markup, with Carbon's own invalid/disabled styling.

**Value stored:** the selected option object.

## When to use

- Single-select from a small set where every option should be visible at once.
- Use **DropDown** or **AutoComplete** instead when the option list is long.
        `,
      },
    },
  },
};

export const Default = {};

export const WithValue = {
  args: {
    value: codedConceptAnswers[0],
  },
};

export const Disabled = {
  args: {
    enabled: false,
    value: codedConceptAnswers[0],
  },
};

export const WithValidationError = {
  args: {
    validate: true,
    validations: ['mandatory'],
  },
};
