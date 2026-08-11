import React from 'react';
import { CarbonContainer } from 'src/components/bahmni-design-system/CarbonContainer';
import StoryWrapper from '../StoryWrapper';
import { carbonContainerCommonProps, buildFormMetadata, buildColumnHeader } from './complexFixtures';
import '../../styles/styles.scss';

const VITALS_FORM = 'Vitals Table Form';

const SYSTOLIC_UUID = 'carbon-systolic-uuid';
const DIASTOLIC_UUID = 'carbon-diastolic-uuid';

const textCell = (id, name, uuid, column, row) => ({
  type: 'obsControl',
  label: { type: 'label', value: name },
  properties: { mandatory: false, location: { column, row } },
  id,
  concept: { name, uuid, datatype: 'Text' },
});

const booleanCell = (id, name, uuid, column, row) => ({
  type: 'obsControl',
  label: { type: 'label', value: name },
  displayType: 'Button',
  options: [{ name: 'Yes', value: true }, { name: 'No', value: false }],
  properties: { mandatory: false, location: { column, row } },
  id,
  concept: { name, uuid, datatype: 'Boolean' },
});

const labResultsTable = () => ({
  type: 'table',
  label: { type: 'label', value: 'Lab Results' },
  properties: { mandatory: false, location: { column: 0, row: 0 } },
  id: '1',
  columnHeaders: [
    buildColumnHeader('col-lab-test', 'Lab Test'),
  ],
  controls: [
    textCell('2', 'Haemoglobin', 'carbon-haemoglobin-uuid', 0, 0),
    textCell('3', 'White Blood Cell Count', 'carbon-wbc-uuid', 0, 1),
    textCell('4', 'Platelets', 'carbon-platelets-uuid', 0, 2),
  ],
});

const screeningTable = () => ({
  type: 'table',
  label: { type: 'label', value: 'Screening Results' },
  properties: { mandatory: false, location: { column: 0, row: 0 } },
  id: '1',
  columnHeaders: [
    buildColumnHeader('col-screening-test', 'Screening Test'),
    buildColumnHeader('col-screening-referred', 'Referred'),
  ],
  controls: [
    textCell('2', 'Blood Glucose (Fasting)', 'carbon-glucose-uuid', 0, 0),
    booleanCell('3', 'Referred for Glucose', 'carbon-glucose-referred-uuid', 1, 0),
    textCell('4', 'BMI', 'carbon-bmi-uuid', 0, 1),
    booleanCell('5', 'Referred for BMI', 'carbon-bmi-referred-uuid', 1, 1),
  ],
});

const vitalsTable = () => ({
  type: 'table',
  label: { type: 'label', value: 'Vitals Measurements' },
  properties: { mandatory: false, location: { column: 0, row: 0 } },
  id: '1',
  columnHeaders: [
    buildColumnHeader('col-systolic', 'Systolic BP'),
    buildColumnHeader('col-diastolic', 'Diastolic BP'),
  ],
  controls: [
    textCell('2', 'Systolic', SYSTOLIC_UUID, 0, 0),
    textCell('3', 'Diastolic', DIASTOLIC_UUID, 1, 0),
  ],
});

const vitalsTableObservations = [
  {
    observationDateTime: '2026-08-10T09:00:00.000+0000',
    uuid: 'obs-vitals-systolic',
    value: '120',
    formNamespace: 'bahmni',
    formFieldPath: `${VITALS_FORM}.1/2-0`,
    concept: { name: 'Systolic', uuid: SYSTOLIC_UUID, datatype: 'Text' },
  },
  {
    observationDateTime: '2026-08-10T09:00:00.000+0000',
    uuid: 'obs-vitals-diastolic',
    value: '80',
    formNamespace: 'bahmni',
    formFieldPath: `${VITALS_FORM}.1/3-0`,
    concept: { name: 'Diastolic', uuid: DIASTOLIC_UUID, datatype: 'Text' },
  },
];

const defaultForm = buildFormMetadata(400, 'carbon-table-default-uuid', 'Lab Results Form', [labResultsTable()]);
const multiColumnForm = buildFormMetadata(401, 'carbon-table-multicolumn-uuid', 'Screening Form', [screeningTable()]);
const withValuesForm = buildFormMetadata(402, 'carbon-table-values-uuid', VITALS_FORM, [vitalsTable()]);
const disabledForm = buildFormMetadata(403, 'carbon-table-disabled-uuid', 'Lab Results Disabled Form',
  [labResultsTable()]);

export default {
  title: 'Complex Controls/Bahmni Design System/Table',
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

Bahmni Design System rendering of \`Table\`, driven end-to-end through \`CarbonContainer\`. It renders Carbon's composable table primitives — **Table**, **TableHead**, **TableRow**, **TableHeader**, **TableBody**, **TableCell** (all from \`@carbon/react\`) — rather than Carbon's stateful \`DataTable\` wrapper, since this control needs fixed column headers and repeating observation rows without built-in sorting, filtering or selection.

**Value stored:** Table has no value of its own — each cell hosts an independent \`obsControl\` bound via \`Container\`'s \`ControlRecordTree\`.

## When to use

- Presenting a structured grid of observations with fixed column headers and repeating rows (lab panels, screening results).

## Laying out cells

One \`TableCell\` is rendered **per entry in \`metadata.columnHeaders\`**, and each cell is filled from the controls whose \`properties.location.column\` matches that cell's index. Two consequences worth respecting when writing fixtures:

- The number of column headers must match the number of distinct \`column\` indices the controls use. Declaring three headers while every control sits at \`column: 0\` leaves two empty columns on every row.
- Every column header needs a unique \`id\`; it is used as the React \`key\` for the rendered \`TableHeader\`.

## Known limitation

These stories use \`Text\`-datatype \`obsControl\`s (→ \`TextBox\`) rather than \`Numeric\` (→ \`NumericBox\`), even for naturally numeric fields such as Haemoglobin or Systolic BP. \`NumericBox\` is the only leaf control that re-spreads its whole prop bag onto Carbon's \`NumberInput\`, so the bookkeeping props \`ObsControl\` passes to every leaf (\`conceptUuid\`, \`patientUuid\`, \`componentStore\`, \`onControlAdd\`, \`onEventTrigger\`, \`addMore\`, \`showNotification\`, \`conceptClass\`, \`conceptHandler\`) reach the DOM and log nine React errors. That is a pre-existing \`src/\` defect unrelated to the Table primitive, tracked separately rather than worked around here.
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
      />
    </StoryWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A single-column table: one lab test per row under one column header.',
      },
    },
  },
};

export const WithMultipleColumns = {
  render: () => (
    <StoryWrapper json={multiColumnForm}>
      <CarbonContainer
        {...carbonContainerCommonProps}
        metadata={multiColumnForm}
        observations={[]}
      />
    </StoryWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Each row pairs a screening measurement (column 0) with a referred-for-follow-up boolean ' +
          '(column 1), under two matching column headers.',
      },
    },
  },
};

export const WithObservationValues = {
  render: () => (
    <StoryWrapper json={withValuesForm}>
      <CarbonContainer
        {...carbonContainerCommonProps}
        metadata={withValuesForm}
        observations={vitalsTableObservations}
      />
    </StoryWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A two-column blood-pressure row pre-populated from observations (Systolic 120, Diastolic 80).',
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
        readonly
      />
    </StoryWrapper>
  ),
};
