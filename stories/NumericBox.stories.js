import React from 'react';
import { NumericBox } from 'src/components/NumericBox.jsx';

export default {
  title: 'Atomic Controls/Legacy Components/NumericBox',
  tags: ['autodocs'],
  component: NumericBox,
  args: {
    validate: false,
    validateForm: false,
    validations: [],
    enabled: true,
    formFieldPath: 'test/1-0',
    conceptUuid: 'numeric-concept-uuid',
  },
  argTypes: {
    onChange: { action: 'onChange' },
    enabled: { control: 'boolean' },
    validate: { control: 'boolean' },
    validateForm: { control: 'boolean' },
    value: { control: 'text' },
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

Numeric input for quantitative observations such as blood pressure, temperature, or weight.

**Value stored:** a number.

## When to use

- Recording a single numeric measurement.
- When you need normal-range display (\`lowNormal\` / \`hiNormal\`) and absolute-limit validation (\`lowAbsolute\` / \`hiAbsolute\`).
        `,
      },
    },
  },
};

export const Default = {};

export const WithRange = {
  args: {
    lowNormal: 60,
    hiNormal: 100,
    conceptUuid: 'pulse-rate-uuid',
  },
};

export const WithValue = {
  args: {
    value: '120',
    lowNormal: 90,
    hiNormal: 140,
    conceptUuid: 'systolic-bp-uuid',
  },
};

export const Disabled = {
  args: {
    enabled: false,
    value: '98.6',
    conceptUuid: 'temperature-uuid',
  },
};

export const OutOfRangeError = {
  args: {
    value: '200',
    lowAbsolute: 60,
    hiAbsolute: 180,
    lowNormal: 90,
    hiNormal: 140,
    validate: true,
    conceptUuid: 'systolic-bp-uuid',
  },
};

export const ComputedValue = {
  args: {
    value: '22.5',
    conceptClass: 'Computed',
    conceptUuid: 'bmi-uuid',
  },
};

export const IntegerOnlyValue = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the allowDecimal validator (AC 2.1): a decimal value triggers an ' +
          '"Invalid Value" error because the concept only accepts integers.',
      },
    },
  },
  args: {
    value: '98.6',
    validate: true,
    validations: ['allowDecimal'],
    conceptUuid: 'integer-concept-uuid',
  },
};
