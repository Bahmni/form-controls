import React from 'react';
import { NumericBox } from 'src/components/bahmni-design-system/NumericBox';

export default {
  title: 'Atomic Controls/Bahmni Design System/NumericBox',
  tags: ['autodocs'],
  component: NumericBox,
  args: {
    validate: false,
    validateForm: false,
    validations: [],
    enabled: true,
    formFieldPath: 'test/1-0',
  },
  argTypes: {
    onChange: { action: 'onChange' },
    enabled: { control: 'boolean' },
    validate: { control: 'boolean' },
    validateForm: { control: 'boolean' },
    value: { control: 'number' },
    lowNormal: { control: 'number' },
    hiNormal: { control: 'number' },
    lowAbsolute: { control: 'number' },
    hiAbsolute: { control: 'number' },
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

Bahmni Design System rendering of the numeric observation control. It renders Carbon's **NumberInput** (from \`@bahmni/design-system\`); the normal range (\`lowNormal\`–\`hiNormal\`) is formatted as a \`(min - max)\` hint next to the field, matching the legacy range-display behaviour.

**Value stored:** a number.

## When to use

- Recording a single numeric measurement — e.g. pulse, temperature, weight.
- When you need normal-range display (\`lowNormal\` / \`hiNormal\`) and absolute-limit validation (\`lowAbsolute\` / \`hiAbsolute\`).
        `,
      },
    },
  },
};

export const Default = {};

export const WithValue = {
  args: {
    value: 72,
  },
};

export const WithNormalRange = {
  args: {
    value: 72,
    lowNormal: 60,
    hiNormal: 100,
  },
  parameters: {
    docs: {
      description: {
        story:
          'The `(60 - 100)` normal-range hint renders next to the NumberInput whenever both ' +
          '`lowNormal` and `hiNormal` are supplied.',
      },
    },
  },
};

export const OutOfRangeWarning = {
  args: {
    value: 180,
    lowNormal: 60,
    hiNormal: 100,
    lowAbsolute: 40,
    hiAbsolute: 220,
    validate: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'A value outside the normal range but inside the absolute range raises the `allowRange` ' +
          'warning rather than a hard error.',
      },
    },
  },
};

export const Disabled = {
  args: {
    enabled: false,
    value: 98.6,
  },
};

export const WithValidationError = {
  args: {
    value: 300,
    lowAbsolute: 40,
    hiAbsolute: 220,
    validate: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'A value outside the absolute range (`lowAbsolute`–`hiAbsolute`) raises a hard error via the ' +
          '`minMaxRange` validator, which NumericBox always applies.',
      },
    },
  },
};
