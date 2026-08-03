import React from 'react';
import { httpInterceptor } from 'src/helpers/httpInterceptor';
import { AutoComplete } from 'src/components/AutoComplete.jsx';

const medicationOptions = [
  { uuid: 'med-uuid-1', name: 'Paracetamol', display: 'Paracetamol' },
  { uuid: 'med-uuid-2', name: 'Ibuprofen', display: 'Ibuprofen' },
  { uuid: 'med-uuid-3', name: 'Amoxicillin', display: 'Amoxicillin' },
  { uuid: 'med-uuid-4', name: 'Metformin', display: 'Metformin' },
  { uuid: 'med-uuid-5', name: 'Atorvastatin', display: 'Atorvastatin' },
];

export default {
  title: 'Atomic Controls/Legacy Components/AutoComplete',
  tags: ['autodocs'],
  component: AutoComplete,
  args: {
    options: medicationOptions,
    asynchronous: false,
    minimumInput: 0,
    searchable: false,
    enabled: true,
    multiSelect: false,
    formFieldPath: 'test/1-0',
    validations: [],
    labelKey: 'display',
    valueKey: 'uuid',
    conceptUuid: 'autocomplete-concept-uuid',
  },
  argTypes: {
    onValueChange: { action: 'onValueChange' },
    enabled: { control: 'boolean' },
    searchable: { control: 'boolean' },
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

Searchable select control for coded observations. Supports synchronous option lists, client-side search filtering, and asynchronous HTTP loading for large concept sets.

**Value stored:** the selected option object (or an array in multi-select mode).

## When to use

- Selecting from large coded sets — medications, diagnoses — where type-to-filter helps.
- Set \`asynchronous: true\` to fetch options on demand; \`multiSelect: true\` to allow several selections.
        `,
      },
    },
  },
};

export const SynchronousSelect = {};

export const SearchableSelect = {
  args: {
    searchable: true,
    minimumInput: 0,
  },
};

export const MultiSelect = {
  args: {
    multiSelect: true,
    searchable: true,
    minimumInput: 0,
  },
};

export const AsynchronousSelect = {
  decorators: [
    (Story) => {
      const original = httpInterceptor.get;
      httpInterceptor.get = () => Promise.resolve({ results: medicationOptions });
      const result = <Story />;
      httpInterceptor.get = original;
      return result;
    },
  ],
  args: {
    asynchronous: true,
    options: [],
    minimumInput: 2,
    searchable: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Async loading mode (AC 7.1): options are fetched via httpInterceptor.get on user input. ' +
          'The HTTP call is mocked here; in production it queries the OpenMRS concept API. ' +
          'Type at least 2 characters to trigger the mocked fetch.',
      },
    },
  },
};

export const Disabled = {
  args: {
    enabled: false,
    value: { uuid: 'med-uuid-1', name: 'Paracetamol', display: 'Paracetamol' },
  },
};

export const WithValidationError = {
  args: {
    validate: true,
    validations: ['mandatory'],
  },
};
