import React from 'react';
import { DropDown } from 'src/components/bahmni-design-system/DropDown';
import { codedConceptAnswers } from './fixtures';

export default {
  title: 'Atomic Controls/Bahmni Design System/DropDown',
  tags: ['autodocs'],
  component: DropDown,
  args: {
    options: codedConceptAnswers,
    enabled: true,
    multiSelect: false,
    validate: false,
    validateForm: false,
    validations: [],
    formFieldPath: 'test/1-0',
    conceptUuid: 'dropdown-concept-uuid',
  },
  argTypes: {
    onValueChange: { action: 'onValueChange' },
    enabled: { control: 'boolean' },
    multiSelect: { control: 'boolean' },
    validate: { control: 'boolean' },
    validateForm: { control: 'boolean' },
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

Bahmni Design System rendering of the coded dropdown control. It renders Carbon's **ComboBox** (from \`@bahmni/design-system\`) for single-select, or a Carbon **FilterableMultiSelect** when \`multiSelect\` is \`true\` — replacing the legacy dropdown widget in both modes.

**Value stored:** the selected coded option object (or an array of option objects in multi-select mode).

## When to use

- Single-select from a small, finite coded option set (e.g. a diagnosis list).
- Set \`multiSelect: true\` to allow several selections at once, rendered as a Carbon FilterableMultiSelect.
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

export const MultiSelect = {
  args: {
    multiSelect: true,
    value: [codedConceptAnswers[0], codedConceptAnswers[2]],
  },
  parameters: {
    docs: {
      description: {
        story:
          'When `multiSelect` is `true`, DropDown renders a Carbon FilterableMultiSelect and stores ' +
          'an array of selected option objects.',
      },
    },
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
