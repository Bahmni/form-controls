/* global componentStore */
import React from 'react';
import StoryWrapper from './StoryWrapper';
import { Container } from 'src/components/Container.jsx';
import { Section } from 'src/components/Section.jsx';
import { registerCoreComponents } from './componentRegistry';

registerCoreComponents();
componentStore.registerComponent('section', Section);

// Section with two grouped controls (Notes + Abnormal toggle)
const sectionWithGroupedControls = {
  id: 1,
  name: 'Form Name',
  version: '1',
  uuid: 'c36bc411-3f10-11e4-adec-0800271c1asd',
  controls: [
    {
      type: 'section',
      label: { type: 'label', value: 'Section Data' },
      properties: { mandatory: false, location: { column: 0, row: 0 } },
      id: '5',
      controls: [
        {
          type: 'obsControl',
          label: { type: 'label', value: 'Notes' },
          properties: { mandatory: true, location: { column: 0, row: 0 } },
          id: '6',
          concept: {
            name: 'Notes',
            uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
            datatype: 'Text',
            conceptClass: 'Misc',
            lowNormal: 60,
            hiNormal: 120,
          },
        },
        {
          type: 'obsControl',
          displayType: 'Button',
          options: [
            { name: 'Yes', value: true },
            { name: 'No', value: false },
          ],
          label: { type: 'label', value: 'Abnormal' },
          properties: { mandatory: false, location: { column: 1, row: 0 }, hideLabel: false },
          id: '7',
          concept: {
            name: 'Pulse Abnormal',
            uuid: 'c36c7c98-3f10-11e4-adec-0800271c1b75',
            datatype: 'Boolean',
            conceptClass: 'Abnormal',
          },
        },
      ],
    },
  ],
};

// Section that renders with collapse: true to show the collapsed initial state
const collapsedSectionMetadata = {
  id: 2,
  name: 'Collapsed Form',
  version: '1',
  uuid: 'collapsed-form-uuid-0001',
  controls: [
    {
      type: 'section',
      label: { type: 'label', value: 'Patient History (collapsed)' },
      properties: { mandatory: false, location: { column: 0, row: 0 } },
      id: '10',
      controls: [
        {
          type: 'obsControl',
          label: { type: 'label', value: 'Chief Complaint' },
          properties: { mandatory: false, location: { column: 0, row: 0 } },
          id: '11',
          concept: {
            name: 'Chief Complaint',
            uuid: 'chief-complaint-uuid-001',
            datatype: 'Text',
          },
        },
        {
          type: 'obsControl',
          label: { type: 'label', value: 'Duration (days)' },
          properties: { mandatory: false, location: { column: 1, row: 0 } },
          id: '12',
          concept: {
            name: 'Duration',
            uuid: 'duration-concept-uuid-001',
            datatype: 'Numeric',
          },
        },
      ],
    },
  ],
};

// Nested sections: an outer section containing an inner section
const nestedSectionsMetadata = {
  id: 3,
  name: 'Nested Sections Form',
  version: '1',
  uuid: 'nested-sections-form-uuid-001',
  controls: [
    {
      type: 'section',
      label: { type: 'label', value: 'Outer Section' },
      properties: { mandatory: false, location: { column: 0, row: 0 } },
      id: '20',
      controls: [
        {
          type: 'obsControl',
          label: { type: 'label', value: 'General Notes' },
          properties: { mandatory: false, location: { column: 0, row: 0 } },
          id: '21',
          concept: {
            name: 'General Notes',
            uuid: 'general-notes-uuid-001',
            datatype: 'Text',
          },
        },
        {
          type: 'section',
          label: { type: 'label', value: 'Inner Section' },
          properties: { mandatory: false, location: { column: 0, row: 1 } },
          id: '22',
          controls: [
            {
              type: 'obsControl',
              label: { type: 'label', value: 'Specific Detail' },
              properties: { mandatory: false, location: { column: 0, row: 0 } },
              id: '23',
              concept: {
                name: 'Specific Detail',
                uuid: 'specific-detail-uuid-001',
                datatype: 'Text',
              },
            },
            {
              type: 'obsControl',
              label: { type: 'label', value: 'Inner Numeric' },
              properties: { mandatory: false, location: { column: 1, row: 0 } },
              id: '24',
              concept: {
                name: 'Inner Numeric',
                uuid: 'inner-numeric-uuid-001',
                datatype: 'Numeric',
              },
            },
          ],
        },
      ],
    },
  ],
};

export default {
  title: 'Complex Controls/Legacy Components/Section',
  component: Container,
  argTypes: {
    collapse: { control: 'boolean', description: 'Render the section in its collapsed state' },
    validate: { control: 'boolean', description: 'Trigger field-level validation' },
    validateForm: { control: 'boolean', description: 'Trigger form-level validation' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Section renders a collapsible `<fieldset>` that visually and semantically groups ' +
          'related form controls under a single heading (legend). It is used to organise ' +
          'observations into logical panels on complex clinical forms.\n\n' +
          '**Collapse / expand**: Clicking the legend header toggles `state.collapse`. ' +
          'When collapsed, child controls are hidden via the `closing-group-controls` CSS class ' +
          'without unmounting, preserving any partially entered data.\n\n' +
          '**Nested sections**: A Section\'s `controls` array can contain other sections, ' +
          'enabling multi-level hierarchical form layouts. Each level renders its own ' +
          '`<fieldset>` / `<legend>` pair.\n\n' +
          '**Rendering via Container**: Section is not rendered directly in production — the ' +
          '`Container` component reads the form metadata tree, resolves `type: "section"` via ' +
          '`componentStore`, and passes the appropriate child record props down. ' +
          'These stories use `Container` to replicate that full rendering pipeline.\n\n' +
          'Accessibility (WCAG 2.1 AA): The `<fieldset>` + `<legend>` combination provides a ' +
          'native grouping landmark recognised by all screen readers. The collapse toggle is on ' +
          'the `<legend>` element so it is naturally focusable and operable via keyboard. ' +
          'Disabled sections add the `disabled` CSS class and all child inputs honour the ' +
          '`enabled` prop to prevent data entry.\n\n' +
          '**Composition chain**: The full atomic-to-container hierarchy is: ' +
          '`Container` → resolves `type: "section"` via `componentStore` → renders `Section` → ' +
          'each child `type: "obsControl"` is resolved to `ObsControl` → `ObsControl` resolves ' +
          'the concept datatype to an atomic widget (`NumericBox`, `TextBox`, `BooleanControl`, etc.). ' +
          'Each layer passes `formFieldPath`, `value`, and `onValueChanged` down so state flows ' +
          'back up to the root `Container` and its `ControlRecordTree`.',
      },
    },
  },
};

export const SectionWithGroupedControls = {
  render: (args) => (
    <StoryWrapper json={sectionWithGroupedControls}>
      <Container
        collapse={false}
        validate={false}
        validateForm={false}
        metadata={sectionWithGroupedControls}
        observations={[]}
        patient={{}}
        translate={false}
        translations={{ labels: {}, concepts: {} }}
        {...args}
      />
    </StoryWrapper>
  ),
};

export const CollapsedSection = {
  args: {
    collapse: true,
  },
  render: (args) => (
    <StoryWrapper json={collapsedSectionMetadata}>
      <Container
        collapse={false}
        validate={false}
        validateForm={false}
        metadata={collapsedSectionMetadata}
        observations={[]}
        patient={{}}
        translate={false}
        translations={{ labels: {}, concepts: {} }}
        {...args}
      />
    </StoryWrapper>
  ),
};

export const NestedSections = {
  render: (args) => (
    <StoryWrapper json={nestedSectionsMetadata}>
      <Container
        collapse={false}
        validate={false}
        validateForm={false}
        metadata={nestedSectionsMetadata}
        observations={[]}
        patient={{}}
        translate={false}
        translations={{ labels: {}, concepts: {} }}
        {...args}
      />
    </StoryWrapper>
  ),
};
