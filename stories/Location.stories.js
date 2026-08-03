import React from 'react';
import { httpInterceptor } from 'src/helpers/httpInterceptor';
import { Location } from 'src/components/Location.jsx';

const mockLocations = [
  { id: 101, name: 'General Ward', uuid: 'loc-uuid-101' },
  { id: 102, name: 'Emergency', uuid: 'loc-uuid-102' },
  { id: 103, name: 'Outpatient Clinic', uuid: 'loc-uuid-103' },
  { id: 104, name: 'ICU', uuid: 'loc-uuid-104' },
  { id: 105, name: 'Maternity Ward', uuid: 'loc-uuid-105' },
];

export default {
  title: 'Atomic Controls/Legacy Components/Location',
  tags: ['autodocs'],
  component: Location,
  decorators: [
    (Story) => {
      const original = httpInterceptor.get;
      httpInterceptor.get = () => Promise.resolve({ results: mockLocations });
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

Location selector that fetches the location list from the OpenMRS REST API on mount (the HTTP call is mocked with local test data in these stories).

**Value stored:** the location id (as a string).

**Location hierarchy:** the component requests only id, name, and uuid (\`v=custom:(id,name,uuid)\`). Parent/child relationships are not fetched, so all locations render as a flat list regardless of their hierarchy in OpenMRS.

## When to use

- Selecting a service-delivery location or facility for an observation.
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
  args: {
    enabled: false,
    value: '101',
  },
};

export const WithValidationError = {
  args: {
    validate: true,
    validations: ['mandatory'],
  },
};
