import React from 'react';
import { DropDown } from 'src/components/DropDown.jsx';

const bloodGroupOptions = [
  { name: 'A+', uuid: 'bg-uuid-ap', display: 'A+' },
  { name: 'A-', uuid: 'bg-uuid-am', display: 'A-' },
  { name: 'B+', uuid: 'bg-uuid-bp', display: 'B+' },
  { name: 'B-', uuid: 'bg-uuid-bm', display: 'B-' },
  { name: 'AB+', uuid: 'bg-uuid-abp', display: 'AB+' },
  { name: 'AB-', uuid: 'bg-uuid-abm', display: 'AB-' },
  { name: 'O+', uuid: 'bg-uuid-op', display: 'O+' },
  { name: 'O-', uuid: 'bg-uuid-om', display: 'O-' },
];

export default {
  title: 'Atomic Controls/Legacy Components/DropDown',
  tags: ['autodocs'],
  component: DropDown,
  args: {
    options: bloodGroupOptions,
    enabled: true,
    searchable: false,
    validations: [],
    labelKey: 'display',
    valueKey: 'uuid',
  },
  argTypes: {
    onValueChange: { action: 'onValueChange' },
    enabled: { control: 'boolean' },
    searchable: { control: 'boolean' },
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

Non-searchable dropdown select for coded single-select observations. Uses **AutoComplete** internally with \`asynchronous=false\`.

**Value stored:** the selected coded option.

## When to use

- Single-select from a small, finite option set (e.g. blood group).
- **Not** for multi-select — use **CodedControl** with \`properties.multiSelect: true\`. Option groups are not supported; all options render in a flat list.
        `,
      },
    },
  },
};

export const EmptyOptions = {
  parameters: {
    docs: {
      description: {
        story: 'Intentional empty state — options array is empty. Represents a dropdown before concept answers are loaded.',
      },
    },
  },
  args: {
    options: [],
  },
};

export const WithOptions = {};

export const Searchable = {
  args: {
    searchable: true,
  },
};

export const Disabled = {
  args: {
    enabled: false,
    value: { name: 'O+', uuid: 'bg-uuid-op', display: 'O+' },
  },
};

export const WithValidationError = {
  args: {
    validate: true,
    validations: ['mandatory'],
    options: bloodGroupOptions,
  },
};
