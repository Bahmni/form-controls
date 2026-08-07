import React from 'react';
import { FreeTextAutoComplete } from 'src/components/bahmni-design-system/FreeTextAutoComplete';
import { codedConceptAnswers } from './fixtures';

export default {
  title: 'Atomic Controls/Bahmni Design System/FreeTextAutoComplete',
  tags: ['autodocs'],
  component: FreeTextAutoComplete,
  args: {
    options: codedConceptAnswers,
    enabled: true,
    validate: false,
    validateForm: false,
    validations: [],
    formFieldPath: 'test/1-0',
    conceptUuid: 'free-text-concept-uuid',
  },
  argTypes: {
    onChange: { action: 'onChange' },
    enabled: { control: 'boolean' },
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

Bahmni Design System rendering of the free-text-with-suggestions control. It renders a Carbon **ComboBox** (from \`@bahmni/design-system\`) with \`allowCustomValue\` enabled — users may pick one of the supplied options or type a value that is not in the list.

**Value stored:** the selected option object, or the raw typed string when the entered value does not match any option.

## When to use

- When clinicians should be able to pick a suggestion **or** enter a new value not in the list.
- For open-ended coded fields where the option set is not exhaustive.
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
