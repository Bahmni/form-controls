import React from 'react';
import { CarbonContainer } from 'src/components/bahmni-design-system/CarbonContainer';
import StoryWrapper from '../StoryWrapper';
import { carbonContainerCommonProps, buildFormMetadata } from './complexFixtures';
import '../../styles/styles.scss';

const FORM_NAME = 'Review Of Systems Form';

const ROS_GROUP_UUID = 'carbon-ros-grp-uuid-001';
const FEVER_UUID = 'carbon-fever-uuid';
const COUGH_UUID = 'carbon-cough-uuid';
const FATIGUE_UUID = 'carbon-fatigue-uuid';

const booleanChild = (id, name, uuid, column, row) => ({
  type: 'obsControl',
  label: { type: 'label', value: name },
  displayType: 'Button',
  options: [{ name: 'Yes', value: true }, { name: 'No', value: false }],
  properties: { mandatory: false, location: { column, row } },
  id,
  concept: { name, uuid, datatype: 'Boolean' },
});

const reviewOfSystemsGroup = () => ({
  type: 'obsGroupControl',
  concept: { name: 'Review of Systems', uuid: ROS_GROUP_UUID, datatype: 'N/A' },
  label: { type: 'label', value: 'Review of Systems' },
  properties: { mandatory: false, location: { column: 0, row: 0 } },
  id: '1',
  controls: [
    booleanChild('2', 'Fever', FEVER_UUID, 0, 0),
    booleanChild('3', 'Cough', COUGH_UUID, 1, 0),
    booleanChild('4', 'Fatigue', FATIGUE_UUID, 0, 1),
  ],
});

const defaultForm = buildFormMetadata(200, 'carbon-obsgroup-default-uuid', FORM_NAME, [reviewOfSystemsGroup()]);
const expandedForm = buildFormMetadata(201, 'carbon-obsgroup-expanded-uuid', FORM_NAME, [reviewOfSystemsGroup()]);
const disabledForm = buildFormMetadata(202, 'carbon-obsgroup-disabled-uuid', FORM_NAME, [reviewOfSystemsGroup()]);
const nestedForm = buildFormMetadata(203, 'carbon-obsgroup-nested-uuid', FORM_NAME, [reviewOfSystemsGroup()]);

const GROUP_FIELD_PATH = `${FORM_NAME}.1/1-0`;

const childObservation = (controlId, name, uuid, value) => ({
  observationDateTime: '2026-08-10T09:00:00.000+0000',
  uuid: `obs-${uuid}`,
  value,
  formNamespace: 'bahmni',
  formFieldPath: `${FORM_NAME}.1/${controlId}-0`,
  concept: { name, uuid, datatype: 'Boolean' },
});

const nestedObservations = [
  {
    observationDateTime: '2026-08-10T09:00:00.000+0000',
    uuid: 'obs-ros-group',
    formNamespace: 'bahmni',
    formFieldPath: GROUP_FIELD_PATH,
    concept: { name: 'Review of Systems', uuid: ROS_GROUP_UUID, datatype: 'N/A' },
    groupMembers: [
      childObservation('2', 'Fever', FEVER_UUID, true),
      childObservation('3', 'Cough', COUGH_UUID, false),
      childObservation('4', 'Fatigue', FATIGUE_UUID, true),
    ],
  },
];

export default {
  title: 'Complex Controls/Bahmni Design System/ObsGroupControl',
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

Bahmni Design System rendering of \`ObsGroupControl\`, driven end-to-end through \`CarbonContainer\`. It renders Carbon's **Accordion** + **AccordionItem** (from \`@bahmni/design-system\`) to group related child observations — here Fever / Cough / Fatigue under a "Review of Systems" panel — beneath a single collapsible heading.

**Value stored:** the group itself is an \`N/A\`-datatype concept with no value of its own. Its \`groupMembers\` are the child observations, each resolved independently to its own Bahmni Design System widget via \`concept.datatype\`.

## When to use

- Capturing a structured cluster of related observations as one logical unit (a review-of-systems panel, a physical exam section).
- The Accordion's collapse/expand toggle preserves partially entered child data without unmounting.

## Binding child observations

An obs group is **one** parent observation whose \`groupMembers\` array holds the children — not a flat list of child observations. \`ControlRecordTreeBuilder\` walks \`groupMembers\` recursively, so children passed at the top level never bind and the Accordion renders empty.

Two details matter when writing the fixture:

1. The control's \`type\` must be exactly \`'obsGroupControl'\`. \`CarbonContainer\` resolves the *component* case-insensitively, but \`MapperStore\` matches the \`type\` string **case-sensitively** to pick \`ObsGroupMapper\`. Get the casing wrong and the Accordion still renders — via the case-insensitive component lookup — while the mapper silently falls back to \`ObsMapper\`, whose \`getChildren()\` returns nothing, so every child renders blank.
2. Child \`formFieldPath\`s stay **flat** (\`FormName.1/<childId>-0\`), not nested under the group. \`ControlRecordTreeBuilder\` only prefixes child paths with the parent's when add-more is in play.
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

export const WithNestedObservations = {
  render: () => (
    <StoryWrapper json={nestedForm}>
      <CarbonContainer
        {...carbonContainerCommonProps}
        metadata={nestedForm}
        observations={nestedObservations}
        collapse={false}
      />
    </StoryWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Pre-populated child observations (Fever: Yes, Cough: No, Fatigue: Yes) bound through the ' +
          "parent group's `groupMembers` and rendered inside the expanded Accordion.",
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
