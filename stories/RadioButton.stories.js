import React from 'react';
import { action } from '@storybook/addon-actions';
import { RadioButton } from 'src/components/RadioButton.jsx';
import { TextBox } from 'src/components/TextBox.jsx';
import { injectIntl } from 'react-intl';
import { Label } from 'src/components/Label.jsx';

const LabelWithIntl = injectIntl(Label);

const yesNoOptions = [
  { name: 'Yes', value: 'yes' },
  { name: 'No', value: 'no' },
];

const frequencyOptions = [
  { name: 'Never', value: 'never' },
  { name: 'Occasionally', value: 'occasionally' },
  { name: 'Daily', value: 'daily' },
  { name: 'Multiple times per day', value: 'multiple' },
];

export default {
  title: 'Atomic Controls/Legacy Components/RadioButton',
  tags: ['autodocs'],
  component: RadioButton,
  args: {
    validate: false,
    validations: [],
    conceptUuid: 'radio-concept-uuid',
    options: yesNoOptions,
  },
  argTypes: {
    onValueChange: { action: 'onValueChange' },
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

Radio button group for single-select coded observations. Each option maps to a stored value; clicking an option sets the observation to that option's \`value\` field.

**Value stored:** the selected option's \`value\` field.

## When to use

- Single-select from a small set where every option should be visible at once.
- Use **DropDown** or **AutoComplete** instead when the option list is long.
        `,
      },
    },
  },
};

export const Default = {};

export const WithSelection = {
  args: {
    value: 'yes',
  },
};

export const MultipleOptions = {
  args: {
    options: frequencyOptions,
    value: 'occasionally',
    conceptUuid: 'smoking-frequency-uuid',
  },
};

export const Disabled = {
  parameters: {
    docs: {
      description: {
        story:
          'RadioButton does not expose an enabled prop. This story uses a <fieldset disabled> ' +
          'wrapper, which disables native <input> elements and is announced as disabled by screen readers (SC 4.1.2).',
      },
    },
  },
  render: (args) => (
    <fieldset disabled style={{ border: 'none', padding: 0, margin: 0 }}>
      <RadioButton {...args} />
    </fieldset>
  ),
  args: {
    options: yesNoOptions,
    value: 'yes',
  },
};

export const WithValidationError = {
  args: {
    validate: true,
    validations: ['mandatory'],
  },
};

export const InObservationForm = {
  render: () => (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 400, padding: 16 }}>
      <div style={{ marginBottom: 8 }}>
        <LabelWithIntl
          metadata={{
            value: 'Smoking History',
            uuid: 'smoking-history-uuid',
            type: 'label',
            translationKey: '',
          }}
          enabled={true}
        />
      </div>
      <RadioButton
        onValueChange={action('onValueChange')}
        validate={false}
        validations={[]}
        conceptUuid="smoking-history-uuid"
        options={yesNoOptions}
      />
      <div style={{ marginTop: 12 }}>
        <LabelWithIntl
          metadata={{
            value: 'Additional Notes',
            uuid: 'smoking-notes-uuid',
            type: 'label',
            translationKey: '',
          }}
          enabled={true}
        />
      </div>
      <TextBox
        onChange={action('notesOnChange')}
        validate={false}
        validateForm={false}
        validations={[]}
        enabled={true}
        formFieldPath="smokingForm/1-0"
        conceptUuid="smoking-notes-uuid"
      />
    </div>
  ),
};
