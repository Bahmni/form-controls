import React from 'react';
import { Video } from 'src/components/Video.jsx';

export default {
  title: 'Atomic Controls/Legacy Components/Video',
  tags: ['autodocs'],
  component: Video,
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

File upload control for video observations (MP4, MKV, OGG, etc.). Shows an "Upload Video" label before a file is selected and a video player after upload. Full upload requires a Bahmni backend — these stories demonstrate the UI states only.

**Value stored:** \`"<patientUuid>/<filename>"\` after a successful upload to the Bahmni visitDocument API.

**Camera capture:** not natively invoked — the file input carries no \`capture\` attribute, so the OS file picker opens rather than the camera directly.

## When to use

- Attaching a video observation to an encounter — e.g. a gait or seizure recording.
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
          'in its "file already uploaded" state with a video player and a delete/void option. ' +
          'The video src will 404 in Storybook without a Bahmni backend.',
      },
    },
  },
  args: {
    value: 'patient-uuid-12345/consultation-video-2024.mp4',
  },
};

export const WithValidationError = {
  args: {
    validate: true,
    validations: ['mandatory'],
  },
};
