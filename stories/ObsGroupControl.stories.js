/* global componentStore */
import React from 'react';
import { ObsGroupControlWithIntl as ObsGroupControl } from 'src/components/ObsGroupControl.jsx';
import { ObsGroupMapper } from 'src/mapper/ObsGroupMapper';
import { Obs } from 'src/helpers/Obs';
import { List } from 'immutable';
import StoryWrapper from './StoryWrapper';
import { registerCoreComponents } from './componentRegistry';
import { pulseDataMetadata, SYSTOLIC_UUID, DIASTOLIC_UUID } from './mockData';

registerCoreComponents();

// Vitals group — demonstrates a richer multi-field obs group
const vitalsMetadata = {
  type: 'ObsGroupControl',
  concept: {
    name: 'Vitals',
    uuid: 'vitals-grp-uuid-001',
    datatype: 'N/A',
  },
  label: { type: 'label', value: 'Vitals' },
  properties: { mandatory: false, location: { column: 0, row: 0 } },
  id: '30',
  controls: [
    {
      type: 'obsControl',
      label: { type: 'label', value: 'Systolic' },
      properties: { mandatory: true, location: { column: 0, row: 0 } },
      id: '31',
      concept: {
        name: 'Systolic',
        uuid: SYSTOLIC_UUID,
        datatype: 'Numeric',
        lowNormal: 90,
        hiNormal: 140,
      },
    },
    {
      type: 'obsControl',
      label: { type: 'label', value: 'Diastolic' },
      properties: { mandatory: true, location: { column: 1, row: 0 } },
      id: '32',
      concept: {
        name: 'Diastolic',
        uuid: DIASTOLIC_UUID,
        datatype: 'Numeric',
        lowNormal: 60,
        hiNormal: 90,
      },
    },
    {
      type: 'obsControl',
      label: { type: 'label', value: 'Temperature (C)' },
      properties: { mandatory: false, location: { column: 0, row: 1 } },
      id: '33',
      concept: {
        name: 'Temperature (C)',
        uuid: 'temp-concept-uuid-001',
        datatype: 'Numeric',
        lowNormal: 36,
        hiNormal: 37.5,
      },
    },
  ],
};

// Form-level metadata for the real form usage story
const formWithObsGroup = {
  id: 2,
  name: 'Vitals Form',
  version: '1',
  uuid: 'vitals-form-uuid-0001',
  controls: [vitalsMetadata],
};

const commonGroupProps = {
  children: List(),
  errors: [],
  formName: 'f',
  formVersion: '1',
  mapper: new ObsGroupMapper(),
  onValueChanged: () => {},
  validate: false,
  validateForm: false,
  showNotification: () => {},
};

export default {
  title: 'Complex Controls/Legacy Components/ObsGroupControl',
  component: ObsGroupControl,
  argTypes: {
    collapse: { control: 'boolean', description: 'Render the group in its collapsed state' },
    validate: { control: 'boolean', description: 'Trigger field-level validation' },
    validateForm: { control: 'boolean', description: 'Trigger form-level validation' },
    onValueChanged: { action: 'onValueChanged' },
    showNotification: { action: 'showNotification' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'ObsGroupControl renders a collapsible fieldset that groups related observations under ' +
          'a shared parent concept (the obs group). It is the primary mechanism for capturing ' +
          'structured clinical data such as Vitals, Pulse Data, or any custom panel.\n\n' +
          '**Data model**: An obs group is represented as an `Obs` whose `groupMembers` is an ' +
          'immutable `List` of child `Obs` records. The `ObsGroupMapper` is responsible for ' +
          'reading and writing this nested structure to/from the flat OpenMRS observation API.\n\n' +
          '**Collapse / expand**: Clicking the legend toggles `state.collapse`. When collapsed the ' +
          'child controls are hidden via a CSS class (`closing-group-controls`) without unmounting, ' +
          'so partial data is preserved.\n\n' +
          '**Add More**: When `showAddMore` is true (controlled by the parent AddMoreDecorator) an ' +
          'Add button appears above the legend, enabling repeated instances of the group within ' +
          'a single encounter (e.g., multiple blood pressure readings).\n\n' +
          'Accessibility (WCAG 2.1 AA): The group is wrapped in a `<fieldset>` with a `<legend>` ' +
          'providing a programmatic label for screen readers. The collapse toggle is a clickable ' +
          'legend element — keyboard users can focus it and activate with Enter or Space. ' +
          'Child controls inherit their individual `aria-required` and `aria-describedby` attributes ' +
          'from their own ObsControl implementations.',
      },
    },
  },
};

export const DefaultGroupWithChildObservations = {
  render: (args) => {
    const pulseObs = new Obs({
      concept: pulseDataMetadata.controls[0].concept,
      formFieldPath: 'f.1/6-0',
      formNamespace: 'bahmni',
    });
    const pulseAbnormalObs = new Obs({
      concept: pulseDataMetadata.controls[1].concept,
      formFieldPath: 'f.1/7-0',
      formNamespace: 'bahmni',
    });
    const pulseDataObs = new Obs({
      concept: pulseDataMetadata.concept,
      formNamespace: 'f/5',
      groupMembers: List.of(pulseObs, pulseAbnormalObs),
    });
    return (
      <StoryWrapper json={pulseDataMetadata}>
        <ObsGroupControl
          {...commonGroupProps}
          {...args}
          metadata={pulseDataMetadata}
          value={pulseDataObs}
        />
      </StoryWrapper>
    );
  },
};

export const CollapsedGroup = {
  args: {
    collapse: true,
  },
  render: (args) => {
    const pulseObs = new Obs({
      concept: pulseDataMetadata.controls[0].concept,
      formFieldPath: 'f.1/6-0',
      formNamespace: 'bahmni',
    });
    const pulseDataObs = new Obs({
      concept: pulseDataMetadata.concept,
      formNamespace: 'f/5',
      groupMembers: List.of(pulseObs),
    });
    return (
      <StoryWrapper json={pulseDataMetadata}>
        <ObsGroupControl
          {...commonGroupProps}
          {...args}
          metadata={pulseDataMetadata}
          value={pulseDataObs}
        />
      </StoryWrapper>
    );
  },
};

export const AddMoreGroup = {
  parameters: {
    docs: {
      description: {
        story:
          'When `showAddMore` is true (set by the parent AddMoreDecorator in production), an Add ' +
          'button appears above the group legend, allowing clinicians to record multiple instances ' +
          'of the same obs group within one encounter — e.g., repeated blood pressure readings.',
      },
    },
  },
  render: (args) => {
    const pulseObs = new Obs({
      concept: pulseDataMetadata.controls[0].concept,
      formFieldPath: 'f.1/6-0',
      formNamespace: 'bahmni',
    });
    const pulseDataObs = new Obs({
      concept: pulseDataMetadata.concept,
      formNamespace: 'f/5',
      groupMembers: List.of(pulseObs),
    });
    return (
      <StoryWrapper json={pulseDataMetadata}>
        <ObsGroupControl
          {...commonGroupProps}
          {...args}
          metadata={pulseDataMetadata}
          value={pulseDataObs}
          showAddMore={true}
          onControlAdd={() => {}}
          onControlRemove={() => {}}
        />
      </StoryWrapper>
    );
  },
};

export const RealFormUsageVitalsGroup = {
  render: (args) => {
    const systolicObs = new Obs({
      concept: vitalsMetadata.controls[0].concept,
      formFieldPath: 'VitalsForm.1/31-0',
      formNamespace: 'bahmni',
    });
    const diastolicObs = new Obs({
      concept: vitalsMetadata.controls[1].concept,
      formFieldPath: 'VitalsForm.1/32-0',
      formNamespace: 'bahmni',
    });
    const temperatureObs = new Obs({
      concept: vitalsMetadata.controls[2].concept,
      formFieldPath: 'VitalsForm.1/33-0',
      formNamespace: 'bahmni',
    });
    const vitalsGroupObs = new Obs({
      concept: vitalsMetadata.concept,
      formNamespace: 'VitalsForm/30',
      groupMembers: List.of(systolicObs, diastolicObs, temperatureObs),
    });
    return (
      <StoryWrapper json={formWithObsGroup}>
        <ObsGroupControl
          {...commonGroupProps}
          {...args}
          formName="VitalsForm"
          metadata={vitalsMetadata}
          value={vitalsGroupObs}
        />
      </StoryWrapper>
    );
  },
};
