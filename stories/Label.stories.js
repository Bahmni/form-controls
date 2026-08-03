import React from 'react';
import { action } from '@storybook/addon-actions';
import { injectIntl } from 'react-intl';
import { Label } from 'src/components/Label.jsx';
import { TextBox } from 'src/components/TextBox.jsx';

const LabelWithIntl = injectIntl(Label);

const defaultMetadata = {
  value: 'Systolic Blood Pressure',
  uuid: 'systolic-bp-uuid',
  type: 'label',
  translationKey: '',
};

export default {
  title: 'Atomic Controls/Legacy Components/Label',
  tags: ['autodocs'],
  component: Label,
  render: (args) => <LabelWithIntl {...args} />,
  args: {
    metadata: defaultMetadata,
    enabled: true,
  },
  argTypes: {
    enabled: { control: 'boolean' },
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

Static display label rendered alongside a form control. Supports i18n via \`translationKey\` and an optional unit suffix.

**Value stored:** none.

## When to use

- Adding descriptive text or a field caption to a form.
- **Not** an observation control — it has no value binding and stores nothing.
        `,
      },
    },
  },
};

export const Default = {};

export const WithUnits = {
  args: {
    metadata: {
      value: 'Systolic Blood Pressure',
      uuid: 'systolic-bp-uuid',
      type: 'label',
      units: 'mmHg',
      translationKey: '',
    },
  },
};

export const Disabled = {
  args: {
    metadata: {
      value: 'Chief Complaint',
      uuid: 'chief-complaint-uuid',
      type: 'label',
      translationKey: '',
    },
    enabled: false,
  },
};

export const LabelWithTextBoxInForm = {
  render: () => (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 400, padding: 16 }}>
      <LabelWithIntl
        metadata={{
          value: 'Chief Complaint',
          uuid: 'chief-complaint-input-uuid',
          type: 'label',
          translationKey: '',
        }}
        enabled={true}
      />
      <TextBox
        onChange={action('onChange')}
        validate={false}
        validateForm={false}
        validations={[]}
        enabled={true}
        formFieldPath="visitForm/1-0"
        conceptUuid="chief-complaint-input-uuid"
      />
    </div>
  ),
};
