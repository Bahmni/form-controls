import React from 'react';
import { CarbonContainer } from 'src/components/bahmni-design-system/CarbonContainer';
import StoryWrapper from '../StoryWrapper';
import { carbonContainerCommonProps, buildFormMetadata } from './complexFixtures';
import '../../styles/styles.scss';

const textControl = (id, name, uuid, column, row) => ({
  type: 'obsControl',
  label: { type: 'label', value: name },
  properties: { mandatory: false, location: { column, row } },
  id,
  concept: { name, uuid, datatype: 'Text' },
});

const booleanControl = (id, name, uuid, column, row) => ({
  type: 'obsControl',
  label: { type: 'label', value: name },
  displayType: 'Button',
  options: [{ name: 'Yes', value: true }, { name: 'No', value: false }],
  properties: { mandatory: false, location: { column, row } },
  id,
  concept: { name, uuid, datatype: 'Boolean' },
});

const patientHistorySection = () => ({
  type: 'section',
  label: { type: 'label', value: 'Patient History' },
  properties: { mandatory: false, location: { column: 0, row: 0 } },
  id: '1',
  controls: [
    textControl('2', 'Chief Complaint', 'carbon-chief-complaint-uuid', 0, 0),
    textControl('3', 'Duration', 'carbon-duration-uuid', 1, 0),
  ],
});

const vitalsNotesSection = () => ({
  type: 'section',
  label: { type: 'label', value: 'Vitals Notes' },
  properties: { mandatory: false, location: { column: 0, row: 0 } },
  id: '4',
  controls: [
    textControl('5', 'General Notes', 'carbon-general-notes-uuid', 0, 0),
    booleanControl('6', 'Fever', 'carbon-section-fever-uuid', 1, 0),
    booleanControl('7', 'Follow-up Required', 'carbon-followup-uuid', 0, 1),
  ],
});

const defaultForm = buildFormMetadata(300, 'carbon-section-default-uuid', 'Section Default Form',
  [patientHistorySection()]);
const expandedForm = buildFormMetadata(301, 'carbon-section-expanded-uuid', 'Section Expanded Form',
  [patientHistorySection()]);
const multiForm = buildFormMetadata(302, 'carbon-section-multi-uuid', 'Section Multi Control Form',
  [vitalsNotesSection()]);
const disabledForm = buildFormMetadata(303, 'carbon-section-disabled-uuid', 'Section Disabled Form',
  [patientHistorySection()]);

export default {
  title: 'Complex Controls/Bahmni Design System/Section',
  tags: ['autodocs'],
  component: CarbonContainer,
  parameters: {
    docs: {
      toc: {
        headingSelector: 'h2, h3',
        title: 'Table of Contents',
      },
      description: {
        component: `
## Overview

Bahmni Design System rendering of \`Section\`, driven end-to-end through \`CarbonContainer\`. It renders Carbon's **Accordion** + **AccordionItem** (from \`@bahmni/design-system\`) to visually and semantically group related controls under a single collapsible heading.

**Value stored:** Section has no value of its own — it is a pure layout/grouping control whose children are independent observations bound via \`Container\`'s \`ControlRecordTree\`.

## When to use

- Organising a complex clinical form into logical, collapsible panels (e.g. "Patient History", "Vitals Notes").
- Sections can nest other sections for multi-level hierarchical layouts.
        `,
      },
    },
  },
};

export const Default = {
  render: () => (
    <StoryWrapper json={defaultForm}>
      <CarbonContainer
        {...carbonContainerCommonProps}
        metadata={defaultForm}
        observations={[]}
        collapse
      />
    </StoryWrapper>
  ),
};

export const Expanded = {
  render: () => (
    <StoryWrapper json={expandedForm}>
      <CarbonContainer
        {...carbonContainerCommonProps}
        metadata={expandedForm}
        observations={[]}
        collapse={false}
      />
    </StoryWrapper>
  ),
};

export const WithMultipleControls = {
  render: () => (
    <StoryWrapper json={multiForm}>
      <CarbonContainer
        {...carbonContainerCommonProps}
        metadata={multiForm}
        observations={[]}
        collapse={false}
      />
    </StoryWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Three controls spread across two rows (`properties.location.row`/`column`), showing how ' +
          'Section lays out grouped controls within the Accordion content.',
      },
    },
  },
};

export const Disabled = {
  render: () => (
    <StoryWrapper json={disabledForm}>
      <CarbonContainer
        {...carbonContainerCommonProps}
        metadata={disabledForm}
        observations={[]}
        collapse={false}
        readonly
      />
    </StoryWrapper>
  ),
};
