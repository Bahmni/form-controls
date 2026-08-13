import React from 'react';
import { Comment } from 'src/components/bahmni-design-system/Comment';

export default {
  title: 'Atomic Controls/Bahmni Design System/Comment',
  tags: ['autodocs'],
  component: Comment,
  args: {
    conceptUuid: 'comment-concept-uuid',
    datatype: 'Text',
  },
  argTypes: {
    onCommentChange: { action: 'onCommentChange' },
    forceOpen: { control: 'boolean' },
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

Bahmni Design System rendering of the observation-level notes control. It renders an "Add note" **Link** (from \`@bahmni/design-system\`) that toggles a Carbon **TextArea** (from \`@bahmni/design-system\`) below the observation. The section opens automatically on mount when \`forceOpen\` is \`true\` or an existing \`comment\` is passed in.

**Value stored:** the trimmed comment string (\`undefined\` once the field is emptied).

## When to use

- Letting a clinician attach a free-text note to any observation without permanently taking up screen space.
- Set \`forceOpen: true\` to keep the note field open by default, e.g. for observations that usually need annotation.
        `,
      },
    },
  },
};

export const Default = {};

export const WithExistingNote = {
  args: {
    comment: 'Patient reports mild fever since yesterday evening.',
  },
  parameters: {
    docs: {
      description: {
        story:
          'When a non-empty `comment` is passed in, the note section opens automatically on mount and ' +
          'the "Add note" link is shown in its active/has-notes state.',
      },
    },
  },
};

export const ForceOpen = {
  args: {
    forceOpen: true,
  },
  parameters: {
    docs: {
      description: {
        story: '`forceOpen: true` keeps the note TextArea expanded on mount even without an existing comment.',
      },
    },
  },
};

export const ForComplexMedia = {
  args: {
    datatype: 'Complex',
    conceptHandler: 'ImageUrlHandler',
    value: 'patient-uuid-12345/chest-xray-2024.jpg',
  },
  parameters: {
    docs: {
      description: {
        story:
          'For complex-media concepts (an `ImageUrlHandler` or `VideoUrlHandler` concept with ' +
          '`datatype: \'Complex\'`), the "Add note" link is suppressed entirely — the TextArea renders ' +
          'directly, and only when a `value` (the uploaded file) is present. Without `value` this story ' +
          'would render nothing at all.',
      },
    },
  },
};
