import React from 'react';
import { Image } from 'src/components/bahmni-design-system/Image';

export default {
  title: 'Atomic Controls/Bahmni Design System/Image',
  tags: ['autodocs'],
  component: Image,
  args: {
    validate: false,
    validations: [],
    enabled: true,
    formFieldPath: 'test/1-0',
    patientUuid: 'patient-uuid-12345',
    addMore: false,
  },
  argTypes: {
    onChange: { action: 'onChange' },
    onControlAdd: { action: 'onControlAdd' },
    showNotification: { action: 'showNotification' },
    enabled: { control: 'boolean' },
    validate: { control: 'boolean' },
    addMore: { control: 'boolean' },
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

Bahmni Design System rendering of the image/document upload control. It renders Carbon's **FileUploaderButton** and **FileUploaderItem** (from \`@carbon/react\`), with a Carbon **Loading** spinner (from \`@bahmni/design-system\`) shown while an upload is in progress. Full upload requires a Bahmni backend — these stories demonstrate the UI states only.

**Value stored:** \`"<patientUuid>/<filename>"\` after a successful upload to the Bahmni visitDocument API.

**Camera capture:** not natively invoked — the file input carries no \`capture\` attribute, so the OS file picker opens rather than the camera directly.

## When to use

- Attaching a photo or scanned document to an encounter — e.g. a wound photo or a lab-report PDF.
        `,
      },
    },
  },
};

export const Default = {};

export const Disabled = {
  args: {
    enabled: false,
  },
};

export const WithUploadedFile = {
  parameters: {
    docs: {
      description: {
        story:
          'Pre-uploaded state: the component receives an existing value (filename) and renders ' +
          'a Carbon FileUploaderItem in its "file already uploaded" state with a delete/void option. ' +
          'The image src will 404 in Storybook without a Bahmni backend.',
      },
    },
  },
  args: {
    value: 'patient-uuid-12345/chest-xray-2024.jpg',
  },
};

export const WithValidationError = {
  args: {
    validate: true,
    validations: ['mandatory'],
  },
};
