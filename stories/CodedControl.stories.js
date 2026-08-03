import React from 'react';
import { injectIntl } from 'react-intl';
// Side-effect import: registers 'button' in ComponentStore, required for CodedControl button display
import 'src/components/Button.jsx';
// Side-effect import: registers 'autoComplete' in ComponentStore, required for CodedControl autocomplete display
import 'src/components/AutoComplete.jsx';
// Side-effect import: registers 'dropDown' in ComponentStore, required for CodedControl dropdown display
import 'src/components/DropDown.jsx';
import { CodedControl } from 'src/components/CodedControl.jsx';

const CodedControlWithIntl = injectIntl(CodedControl);

const codedOptions = [
  { name: 'Never', uuid: 'never-uuid', translationKey: '' },
  { name: 'Rarely', uuid: 'rarely-uuid', translationKey: '' },
  { name: 'Sometimes', uuid: 'sometimes-uuid', translationKey: '' },
  { name: 'Often', uuid: 'often-uuid', translationKey: '' },
  { name: 'Always', uuid: 'always-uuid', translationKey: '' },
];

export default {
  title: 'Atomic Controls/Legacy Components/CodedControl',
  tags: ['autodocs'],
  component: CodedControl,
  render: (args) => <CodedControlWithIntl {...args} />,
  args: {
    validate: false,
    validateForm: false,
    validations: [],
    enabled: true,
    formFieldPath: 'test/1-0',
    conceptUuid: 'coded-concept-uuid',
    options: codedOptions,
    properties: { multiSelect: false, autoComplete: false, dropDown: false },
  },
  argTypes: {
    onChange: { action: 'onChange' },
    showNotification: { action: 'showNotification' },
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

Coded concept selector that renders as buttons (default), a dropdown, or an autocomplete. The display mode is chosen via the \`properties\` prop:

- \`properties.dropDown: true\` — render as a dropdown (takes precedence over autoComplete).
- \`properties.autoComplete: true\` — render as a searchable autocomplete.
- \`properties.multiSelect: true\` — allow multiple selections.

**Value stored:** a concept option object (or an array when \`multiSelect\` is enabled).

## When to use

- Selecting one or more coded answers for a concept, when you want a single control that can switch presentation as the answer set grows.
        `,
      },
    },
  },
};

export const ButtonDisplay = {};

export const DropDownDisplay = {
  args: {
    properties: { multiSelect: false, autoComplete: false, dropDown: true },
  },
};

export const AutoCompleteDisplay = {
  args: {
    properties: { multiSelect: false, autoComplete: true, dropDown: false },
  },
};

export const MultiSelectButtonDisplay = {
  args: {
    properties: { multiSelect: true, autoComplete: false, dropDown: false },
  },
};

export const Disabled = {
  args: {
    enabled: false,
    value: { name: 'Sometimes', uuid: 'sometimes-uuid', translationKey: '' },
    properties: { multiSelect: false, autoComplete: false, dropDown: false },
  },
};

export const WithValidationError = {
  args: {
    validate: true,
    validations: ['mandatory'],
    properties: { multiSelect: false, autoComplete: false, dropDown: false },
  },
};
