import React from 'react';
import { Button } from 'src/components/bahmni-design-system/Button';
import { codedConceptAnswers } from './fixtures';

export default {
  title: 'Atomic Controls/Bahmni Design System/Button',
  tags: ['autodocs'],
  component: Button,
  args: {
    options: codedConceptAnswers,
    enabled: true,
    validate: false,
    validateForm: false,
    validations: [],
    formFieldPath: 'test/1-0',
    conceptUuid: 'button-concept-uuid',
  },
  argTypes: {
    onValueChange: { action: 'onValueChange' },
    enabled: { control: 'boolean' },
    validate: { control: 'boolean' },
    validateForm: { control: 'boolean' },
    multiSelect: { control: 'boolean' },
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

Bahmni Design System rendering of the coded button-group control. It renders one Carbon **SelectableTag** (from \`@bahmni/design-system\`) per coded option in place of the legacy button markup, with a single controlled \`value\` — or an array of values when \`multiSelect\` is \`true\` — and Carbon's own invalid/disabled styling.

**Value stored:** a single option object, or an array of option objects when \`multiSelect\` is \`true\`.

## When to use

- Single- or multi-select from a small, finite coded option set where every option should be visible at once as tappable pills.
- Use **RadioButton** instead when a strictly single-select Carbon radio list is preferred over tags.
        `,
      },
    },
  },
};

export const Default = {};

export const SingleSelect = {
  args: {
    multiSelect: false,
    value: codedConceptAnswers[1],
  },
  parameters: {
    docs: {
      description: {
        story:
          '`multiSelect` defaults to falsy, so single-select is also what `Default` renders — this ' +
          'variant makes the intent explicit and pre-selects one pill so the mode is visible. In ' +
          'single-select mode `value` is a single option object: picking another pill replaces it, ' +
          'and picking the selected pill again clears it.',
      },
    },
  },
};

export const MultiSelect = {
  args: {
    multiSelect: true,
    value: [codedConceptAnswers[0], codedConceptAnswers[2]],
  },
  parameters: {
    docs: {
      description: {
        story:
          'When `multiSelect` is `true`, Button stores an array of selected option objects and each ' +
          'pill toggles independently.',
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
    formFieldPath: 'test/1-1',
  },
  parameters: {
    docs: {
      description: {
        story:
          'A mandatory Button with no value, rendered with Carbon\'s invalid styling. The ' +
          '`formFieldPath` ends in `-1` on purpose: `Button` only applies a computed error to state ' +
          'at mount when `_isCreateByAddMore()` is true, which it derives from the path suffix ' +
          '(`formFieldPath.split(\'-\')[1] !== \'0\'`). With the default `test/1-0` path the mandatory ' +
          'error is computed and then discarded, so nothing visible would change.',
      },
    },
  },
};

export const PreSelected = {
  args: {
    value: codedConceptAnswers[0],
  },
};
