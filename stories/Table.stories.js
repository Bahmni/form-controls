/* global componentStore */
import React from 'react';
import { Table } from 'src/components/Table.jsx';
import { Container } from 'src/components/Container.jsx';
import StoryWrapper from './StoryWrapper';
import { registerCoreComponents } from './componentRegistry';
import { SYSTOLIC_UUID, DIASTOLIC_UUID } from './mockData';

registerCoreComponents();
componentStore.registerComponent('table', Table);

// Basic table: Lab results with three column headers and matching row controls
const basicTableForm = {
  id: 10,
  name: 'Lab Results',
  version: '1',
  uuid: 'lab-results-form-uuid-001',
  controls: [
    {
      type: 'table',
      label: { type: 'label', value: 'Lab Results' },
      properties: { mandatory: false, location: { column: 0, row: 0 } },
      id: '1',
      columnHeaders: [
        { type: 'label', value: 'Test Name' },
        { type: 'label', value: 'Result' },
        { type: 'label', value: 'Normal Range' },
      ],
      controls: [
        {
          type: 'obsControl',
          label: { type: 'label', value: 'Haemoglobin' },
          properties: { mandatory: false, location: { column: 0, row: 0 } },
          id: '2',
          concept: {
            name: 'Haemoglobin',
            uuid: 'haemoglobin-uuid-001',
            datatype: 'Numeric',
            lowNormal: 12,
            hiNormal: 17,
          },
        },
        {
          type: 'obsControl',
          label: { type: 'label', value: 'White Blood Cell Count' },
          properties: { mandatory: false, location: { column: 0, row: 1 } },
          id: '3',
          concept: {
            name: 'White Blood Cell Count',
            uuid: 'wbc-count-uuid-001',
            datatype: 'Numeric',
            lowNormal: 4,
            hiNormal: 11,
          },
        },
        {
          type: 'obsControl',
          label: { type: 'label', value: 'Platelets' },
          properties: { mandatory: false, location: { column: 0, row: 2 } },
          id: '4',
          concept: {
            name: 'Platelets',
            uuid: 'platelets-uuid-001',
            datatype: 'Numeric',
            lowNormal: 150,
            hiNormal: 400,
          },
        },
      ],
    },
  ],
};

// Table with pre-populated observations (data binding)
const tableWithDataForm = {
  id: 11,
  name: 'Vitals Table',
  version: '1',
  uuid: 'vitals-table-form-uuid-001',
  controls: [
    {
      type: 'table',
      label: { type: 'label', value: 'Vitals Measurements' },
      properties: { mandatory: false, location: { column: 0, row: 0 } },
      id: '5',
      columnHeaders: [
        { type: 'label', value: 'Measurement' },
        { type: 'label', value: 'Value' },
      ],
      controls: [
        {
          type: 'obsControl',
          label: { type: 'label', value: 'Systolic BP' },
          properties: { mandatory: true, location: { column: 0, row: 0 } },
          id: '6',
          concept: {
            name: 'Systolic',
            uuid: SYSTOLIC_UUID,
            datatype: 'Numeric',
          },
        },
        {
          type: 'obsControl',
          label: { type: 'label', value: 'Diastolic BP' },
          properties: { mandatory: true, location: { column: 0, row: 1 } },
          id: '7',
          concept: {
            name: 'Diastolic',
            uuid: DIASTOLIC_UUID,
            datatype: 'Numeric',
          },
        },
        {
          type: 'obsControl',
          label: { type: 'label', value: 'Temperature (C)' },
          properties: { mandatory: false, location: { column: 0, row: 2 } },
          id: '8',
          concept: {
            name: 'Temperature (C)',
            uuid: 'temp-concept-uuid-001',
            datatype: 'Numeric',
          },
        },
      ],
    },
  ],
};

const tableWithDataObservations = [
  {
    observationDateTime: '2026-04-28T09:00:00.000+0000',
    uuid: 'obs-systolic-uuid',
    value: 120,
    formNamespace: 'bahmni',
    formFieldPath: 'Vitals Table.1/6-0',
    concept: { name: 'Systolic', uuid: SYSTOLIC_UUID, datatype: 'Numeric' },
  },
  {
    observationDateTime: '2026-04-28T09:00:00.000+0000',
    uuid: 'obs-diastolic-uuid',
    value: 80,
    formNamespace: 'bahmni',
    formFieldPath: 'Vitals Table.1/7-0',
    concept: { name: 'Diastolic', uuid: DIASTOLIC_UUID, datatype: 'Numeric' },
  },
];

// Table embedded in form metadata context matching standard_config pattern
const tableInFormContext = {
  id: 12,
  name: 'Annual Checkup',
  version: '1',
  uuid: 'annual-checkup-form-uuid-001',
  controls: [
    {
      type: 'table',
      label: { type: 'label', value: 'Screening Results' },
      properties: { mandatory: false, location: { column: 0, row: 0 } },
      id: '15',
      columnHeaders: [
        { type: 'label', value: 'Screening Test' },
        { type: 'label', value: 'Result' },
        { type: 'label', value: 'Referred' },
      ],
      controls: [
        {
          type: 'obsControl',
          label: { type: 'label', value: 'Blood Glucose (Fasting)' },
          properties: { mandatory: false, location: { column: 0, row: 0 } },
          id: '16',
          concept: {
            name: 'Blood Glucose (Fasting)',
            uuid: 'blood-glucose-uuid-001',
            datatype: 'Numeric',
            lowNormal: 70,
            hiNormal: 100,
          },
        },
        {
          type: 'obsControl',
          label: { type: 'label', value: 'Referred for Glucose' },
          displayType: 'Button',
          options: [{ name: 'Yes', value: true }, { name: 'No', value: false }],
          properties: { mandatory: false, location: { column: 1, row: 0 } },
          id: '17',
          concept: {
            name: 'Referred for Glucose',
            uuid: 'referred-glucose-uuid-001',
            datatype: 'Boolean',
          },
        },
        {
          type: 'obsControl',
          label: { type: 'label', value: 'BMI' },
          properties: { mandatory: false, location: { column: 0, row: 1 } },
          id: '18',
          concept: {
            name: 'BMI',
            uuid: 'bmi-uuid-001',
            datatype: 'Numeric',
            lowNormal: 18.5,
            hiNormal: 24.9,
          },
        },
        {
          type: 'obsControl',
          label: { type: 'label', value: 'Referred for BMI' },
          displayType: 'Button',
          options: [{ name: 'Yes', value: true }, { name: 'No', value: false }],
          properties: { mandatory: false, location: { column: 1, row: 1 } },
          id: '19',
          concept: {
            name: 'Referred for BMI',
            uuid: 'referred-bmi-uuid-001',
            datatype: 'Boolean',
          },
        },
      ],
    },
  ],
};

export default {
  title: 'Complex Controls/Legacy Components/Table',
  component: Container,
  argTypes: {
    collapse: { control: 'boolean', description: 'Render the table in its collapsed state' },
    validate: { control: 'boolean', description: 'Trigger field-level validation' },
    validateForm: { control: 'boolean', description: 'Trigger form-level validation' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Table renders a structured grid of form controls with fixed column headers and ' +
          'repeating rows. Each row contains one or more observation controls that together ' +
          'form a logical record (e.g., a lab test name, result, and normal range in one row).\n\n' +
          '**Column headers**: The `metadata.columnHeaders` array defines the header labels ' +
          'rendered above the control grid. Headers support i18n via `translationKey`.\n\n' +
          '**Row controls**: Child controls are grouped by `properties.location.row` using ' +
          '`getGroupedControls`. Each resulting group is rendered as a row inside ' +
          '`.table-controls`. Controls within the same row share horizontal space.\n\n' +
          '**Data binding**: Like other container controls, Table is rendered by `Container` ' +
          'which builds a `ControlRecordTree` from form metadata and existing observations. ' +
          'Updated values flow back via `onValueChanged(formFieldPath, value, errors)`.\n\n' +
          '**Rendering**: Table is registered in `componentStore` as `"table"` so `Container` ' +
          'can resolve and instantiate it dynamically when it encounters `type: "table"` in the ' +
          'form metadata.\n\n' +
          'Accessibility (WCAG 2.1 AA): Column headers are rendered as `<strong>` elements ' +
          'inside `.header`. For full WCAG compliance, implementers should consider replacing ' +
          'the `.header` / `.test-Rows` div structure with a semantic `<table>` element with ' +
          '`<thead>` and `<tbody>` so that screen readers can associate data cells with their ' +
          'column headers via the table structure. All child input controls retain their ' +
          'individual `<label>` associations regardless of layout.',
      },
    },
  },
};

export const BasicTableWithHeaders = {
  render: (args) => (
    <StoryWrapper json={basicTableForm}>
      <Container
        collapse={false}
        validate={false}
        validateForm={false}
        metadata={basicTableForm}
        observations={[]}
        patient={{}}
        translate={false}
        translations={{ labels: {}, concepts: {} }}
        {...args}
      />
    </StoryWrapper>
  ),
};

export const TableWithDataBinding = {
  render: (args) => (
    <StoryWrapper json={tableWithDataForm}>
      <Container
        collapse={false}
        validate={false}
        validateForm={false}
        metadata={tableWithDataForm}
        observations={tableWithDataObservations}
        patient={{}}
        translate={false}
        translations={{ labels: {}, concepts: {} }}
        {...args}
      />
    </StoryWrapper>
  ),
};

export const TableInFormMetadataContext = {
  render: (args) => (
    <StoryWrapper json={tableInFormContext}>
      <Container
        collapse={false}
        validate={false}
        validateForm={false}
        metadata={tableInFormContext}
        observations={[]}
        patient={{}}
        translate={false}
        translations={{ labels: {}, concepts: {} }}
        {...args}
      />
    </StoryWrapper>
  ),
};
