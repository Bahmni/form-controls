import React from 'react';
import { httpInterceptor } from 'src/helpers/httpInterceptor';
import { Provider } from 'src/components/Provider.jsx';

const mockProviders = [
  { id: 201, name: 'Dr. John Smith', uuid: 'prov-uuid-201' },
  { id: 202, name: 'Dr. Aisha Patel', uuid: 'prov-uuid-202' },
  { id: 203, name: 'Dr. Carlos Rivera', uuid: 'prov-uuid-203' },
  { id: 204, name: 'Nurse Mary Johnson', uuid: 'prov-uuid-204' },
  { id: 205, name: 'Dr. Fatima Al-Hassan', uuid: 'prov-uuid-205' },
];

export default {
  title: 'Atomic Controls/Legacy Components/Provider',
  tags: ['autodocs'],
  component: Provider,
  decorators: [
    (Story) => {
      const original = httpInterceptor.get;
      httpInterceptor.get = () => Promise.resolve({ results: mockProviders });
      const result = <Story />;
      httpInterceptor.get = original;
      return result;
    },
  ],
  args: {
    validate: false,
    validations: [],
    enabled: true,
    formFieldPath: 'test/1-0',
    properties: {},
    conceptUuid: 'provider-concept-uuid',
  },
  argTypes: {
    onChange: { action: 'onChange' },
    showNotification: { action: 'showNotification' },
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

Healthcare provider selector that fetches the provider list from the OpenMRS REST API on mount (the HTTP call is mocked with local test data in these stories).

**Value stored:** the provider id (as a string).

## When to use

- Selecting the responsible clinician or provider for an observation.
- Set \`properties.style="autocomplete"\` to enable searchable mode.
        `,
      },
    },
  },
};

export const Default = {};

export const AutocompleteStyle = {
  args: {
    properties: { style: 'autocomplete' },
  },
};

export const Disabled = {
  parameters: {
    docs: {
      description: {
        story:
          'Disabled empty state. No pre-selected value is passed to avoid triggering the ' +
          'loading spinner (the component renders a spinner when value is truthy but providerData is not yet loaded).',
      },
    },
  },
  args: {
    enabled: false,
  },
};

export const WithValidationError = {
  args: {
    validate: true,
    validations: ['mandatory'],
  },
};
