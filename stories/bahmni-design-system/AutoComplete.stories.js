import React from 'react';
import { httpInterceptor } from 'src/helpers/httpInterceptor';
import { AutoComplete } from 'src/components/bahmni-design-system/AutoComplete';
import { codedConceptAnswers } from './fixtures';

export default {
  title: 'Atomic Controls/Bahmni Design System/AutoComplete',
  tags: ['autodocs'],
  component: AutoComplete,
  args: {
    options: codedConceptAnswers,
    asynchronous: false,
    minimumInput: 0,
    enabled: true,
    multiSelect: false,
    formFieldPath: 'test/1-0',
    validate: false,
    validateForm: false,
    validations: [],
    labelKey: 'display',
    valueKey: 'uuid',
    conceptUuid: 'autocomplete-concept-uuid',
  },
  argTypes: {
    onValueChange: { action: 'onValueChange' },
    onBlur: { action: 'onBlur' },
    enabled: { control: 'boolean' },
    multiSelect: { control: 'boolean' },
    asynchronous: { control: 'boolean' },
    minimumInput: { control: 'number' },
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

Bahmni Design System rendering of the searchable coded control. It renders Carbon's **ComboBox** (from \`@bahmni/design-system\`) for single-select, or a Carbon **FilterableMultiSelect** when \`multiSelect\` is \`true\`. Supports synchronous local option lists (\`asynchronous: false\`) as well as debounced, on-demand HTTP loading (\`asynchronous: true\`) for large concept sets.

**Value stored:** the selected option object (or an array in multi-select mode).

## When to use

- Selecting from large coded sets — medications, diagnoses — where type-to-filter helps.
- Set \`asynchronous: true\` to fetch options on demand via \`optionsUrl\`; \`multiSelect: true\` to allow several selections.
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
};

export const Asynchronous = {
  decorators: [
    (Story) => {
      const original = httpInterceptor.get;
      httpInterceptor.get = () => Promise.resolve({ results: codedConceptAnswers });
      const result = <Story />;
      httpInterceptor.get = original;
      return result;
    },
  ],
  args: {
    asynchronous: true,
    options: [],
    minimumInput: 2,
    optionsUrl: '/openmrs/ws/rest/v1/concept?v=full&q=',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Async loading mode: options are fetched via `httpInterceptor.get(optionsUrl + input)` as the ' +
          'user types (debounced 300ms). The HTTP call is mocked here; type at least 2 characters to ' +
          'trigger the mocked fetch.',
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
