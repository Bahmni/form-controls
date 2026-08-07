import React from 'react';
import { BooleanControl, BooleanControlWithIntl } from 'src/components/bahmni-design-system/BooleanControl';
import { booleanYesNoOptions } from './fixtures';

export default {
  title: 'Atomic Controls/Bahmni Design System/BooleanControl',
  tags: ['autodocs'],
  component: BooleanControl,
  render: (args) => <BooleanControlWithIntl {...args} />,
  args: {
    validate: false,
    validateForm: false,
    validations: [],
    enabled: true,
    formFieldPath: 'test/1-0',
    conceptUuid: 'boolean-concept-uuid',
    options: booleanYesNoOptions,
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

Bahmni Design System rendering of the Yes/No boolean observation control. Each option renders as a Carbon **SelectableTag** (from \`@bahmni/design-system\`) instead of the legacy button group; clicking a tag selects it, and clicking the selected tag again clears the value. The control requires an \`IntlProvider\` ancestor, so it is storied via the \`BooleanControlWithIntl\` (\`injectIntl\`-wrapped) export — \`.storybook/preview.js\` already supplies an \`IntlProvider\` globally.

**Value stored:** a boolean (\`true\` / \`false\`).

## When to use

- Two-state clinical questions — e.g. "Smoking history?", "Pregnant?".
- When the answer is strictly true/false rather than a coded list.
        `,
      },
    },
  },
};

export const Default = {};

export const YesSelected = {
  args: {
    value: true,
  },
};

export const NoSelected = {
  args: {
    value: false,
  },
};

export const Disabled = {
  args: {
    enabled: false,
    value: true,
  },
};

export const WithValidationError = {
  args: {
    validate: true,
    validations: ['mandatory'],
  },
};
