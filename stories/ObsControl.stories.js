import React from 'react';
import { ObsControlWithIntl as ObsControl } from 'src/components/ObsControl.jsx';
import StoryWrapper from './StoryWrapper';
import '../styles/styles.scss';
import { SYSTOLIC_UUID, DIASTOLIC_UUID } from './mockData';

const form = {
  controls: [
    {
      type: 'obsControl',
      label: { id: 'systolic', type: 'label', value: 'Systolic' },
      properties: { mandatory: true, allowDecimal: false, addMore: true, location: { column: 0, row: 0 } },
      id: '1',
      concept: { name: 'Systolic', uuid: SYSTOLIC_UUID, datatype: 'Numeric' },
    },
    {
      type: 'obsControl',
      label: { id: 'diastolic', type: 'label', value: 'Diastolic' },
      properties: { mandatory: true, location: { column: 0, row: 0 } },
      id: '2',
      concept: { name: 'Diastolic', uuid: DIASTOLIC_UUID, datatype: 'Text' },
    },
    {
      options: [{ name: 'Yes', value: true }, { name: 'No', value: false }],
      displayType: 'button',
      type: 'obsControl',
      label: { type: 'label', value: 'Smoking History' },
      properties: { mandatory: true, notes: false, location: { column: 0, row: 0 } },
      id: '3',
      concept: {
        name: 'Smoking History',
        uuid: 'c2a43174-c9db-4e54-8516-17372c83537f',
        datatype: 'Boolean',
        properties: { allowDecimal: null },
      },
    },
    {
      type: 'obsControl',
      label: { type: 'label', value: 'Coded concept' },
      properties: { mandatory: true, notes: false, autoComplete: false, location: { column: 0, row: 0 } },
      id: '5',
      concept: {
        name: 'Coded concept',
        uuid: 'c2a43174-c990-4e54-8516-17372c83537f',
        datatype: 'Coded',
        answers: [
          { display: 'Answer1', name: 'Answer1', uuid: 'answer1uuid' },
          { display: 'Answer2', name: 'Answer2', uuid: 'answer2uuid' },
        ],
      },
    },
    {
      type: 'obsControl',
      label: { id: 'systolic', type: 'label', value: 'Systolic' },
      properties: { mandatory: true, allowDecimal: false, location: { column: 0, row: 0 } },
      id: '6',
      concept: { name: 'Systolic', uuid: SYSTOLIC_UUID, datatype: 'Date' },
    },
    {
      type: 'obsControl',
      label: { id: 'systolic', type: 'label', value: 'Systolic' },
      properties: { mandatory: true, allowDecimal: false, location: { column: 0, row: 0 } },
      id: '7',
      concept: { name: 'Systolic', uuid: SYSTOLIC_UUID, datatype: 'DateTime' },
    },
    {
      type: 'obsControl',
      label: { type: 'label', value: 'Coded concept' },
      properties: {
        mandatory: true, notes: false, autoComplete: false, dropDown: true, location: { column: 0, row: 0 },
      },
      id: '8',
      concept: {
        name: 'Coded concept',
        uuid: 'c2a43174-c990-4e54-8516-17372c83537f',
        datatype: 'Coded',
        answers: [
          { display: 'Answer1', name: 'Answer1', uuid: 'answer1uuid' },
          { display: 'Answer2', name: 'Answer2', uuid: 'answer2uuid' },
        ],
      },
    },
  ],
};

const addMoreControl = {
  type: 'obsControl',
  label: { id: 'headache', type: 'label', value: 'Headache' },
  properties: { mandatory: true, addMore: true, location: { column: 0, row: 0 } },
  id: '20',
  concept: { name: 'Headache', uuid: 'c379aaff-3f10-11e4-adec-0800271c1b75', datatype: 'Text' },
};

const commonProps = {
  onValueChanged: () => {},
  showNotification: () => {},
  onControlAdd: () => {},
  onControlRemove: () => {},
  validate: false,
  validateForm: false,
  formFieldPath: 'test/1-0',
};

const emptyValue = { value: undefined, comment: undefined, interpretation: undefined };

export default {
  title: 'Complex Controls/Legacy Components/ObsControl',
  component: ObsControl,
  argTypes: {
    validate: { control: 'boolean', description: 'Trigger field-level validation' },
    validateForm: { control: 'boolean', description: 'Trigger form-level validation' },
    onValueChanged: { action: 'onValueChanged' },
    showNotification: { action: 'showNotification' },
    onControlAdd: { action: 'onControlAdd' },
    onControlRemove: { action: 'onControlRemove' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'ObsControl is the primary observation control that binds a single concept to a form field. ' +
          'It wraps the underlying input widget (NumericBox, TextBox, BooleanControl, CodedControl, etc.) ' +
          'based on the concept datatype resolved at render time via componentStore.\n\n' +
          '**Concept binding**: The `metadata.concept` object identifies which OpenMRS concept is being ' +
          'captured. The `concept.datatype` drives which widget renders (Numeric → NumericBox, ' +
          'Text → TextBox, Boolean → BooleanControl / Button, Coded → AutoComplete or DropDown).\n\n' +
          '**Value wrapping**: ObsControl receives and emits values as `{ value, comment, interpretation }` ' +
          'objects. When a user changes the input the `onValueChanged(formFieldPath, value, errors)` ' +
          'callback is fired with the updated wrapped value so the parent Container can update its ' +
          'ControlRecordTree.\n\n' +
          '**Add More**: When `properties.addMore` is true, the control renders Add / Remove buttons ' +
          'via AddMoreDecorator, allowing the clinician to capture repeated observations for the same ' +
          'concept within a single encounter.\n\n' +
          'Accessibility (WCAG 2.1 AA): Each input is associated with a `<label>` via `htmlFor` / `id` ' +
          'pairing. Mandatory fields include `aria-required="true"`. Validation error messages are ' +
          'rendered adjacent to the field and referenced with `aria-describedby` so screen readers ' +
          'announce them immediately. Keyboard navigation is fully supported for all widget types.',
      },
    },
  },
};

export const NumericObsControl = {
  render: (args) => (
    <StoryWrapper json={form.controls[0]}>
      <ObsControl
        {...commonProps}
        {...args}
        formUuid={'fbc5d897-64e4-4cc1-90a3-47fde7a98026'}
        metadata={form.controls[0]}
        value={emptyValue}
      />
    </StoryWrapper>
  ),
};

export const TextBoxObsControl = {
  render: (args) => (
    <StoryWrapper json={form.controls[1]}>
      <ObsControl
        {...commonProps}
        {...args}
        formUuid={'fbc5d897-64e4-4cc1-90a3-47fde7a98026'}
        metadata={form.controls[1]}
        value={emptyValue}
      />
    </StoryWrapper>
  ),
};

export const TextBoxObsControlWithAddMoreEnabled = {
  render: (args) => (
    <StoryWrapper json={addMoreControl}>
      <ObsControl
        {...commonProps}
        {...args}
        formUuid={'fbc5d897-64e4-4cc1-90a3-47fde7a98026'}
        metadata={addMoreControl}
        value={emptyValue}
      />
    </StoryWrapper>
  ),
};

export const BooleanObsControl = {
  render: (args) => (
    <StoryWrapper json={form.controls[2]}>
      <ObsControl
        {...commonProps}
        {...args}
        formUuid={'fbc5d897-64e4-4cc1-90a3-47fde7a98026'}
        metadata={form.controls[2]}
        value={emptyValue}
      />
    </StoryWrapper>
  ),
};

export const CodedObsControl = {
  render: (args) => (
    <StoryWrapper json={form.controls[3]}>
      <ObsControl
        {...commonProps}
        {...args}
        metadata={form.controls[3]}
        value={emptyValue}
      />
    </StoryWrapper>
  ),
};

export const DateObsControl = {
  render: (args) => (
    <StoryWrapper json={form.controls[4]}>
      <ObsControl
        {...commonProps}
        {...args}
        metadata={form.controls[4]}
        value={{ value: '1999-03-03', comment: undefined, interpretation: undefined }}
      />
    </StoryWrapper>
  ),
};

export const DateTimeObsControl = {
  render: (args) => (
    <StoryWrapper json={form.controls[5]}>
      <ObsControl
        {...commonProps}
        {...args}
        metadata={form.controls[5]}
        value={{ value: '2016-12-31 14:21', comment: undefined, interpretation: undefined }}
      />
    </StoryWrapper>
  ),
};

export const CodedObsControlDropDown = {
  render: (args) => (
    <StoryWrapper json={form.controls[6]}>
      <ObsControl
        {...commonProps}
        {...args}
        metadata={form.controls[6]}
        value={emptyValue}
      />
    </StoryWrapper>
  ),
};
