import React from 'react';
import { CarbonContainer } from 'src/components/bahmni-design-system/CarbonContainer';
import StoryWrapper from '../StoryWrapper';
import { carbonContainerCommonProps, buildFormMetadata } from './complexFixtures';
import '../../styles/styles.scss';

const EXAM_FINDING_UUID = 'carbon-exam-finding-concept-uuid-001';

const examFindingControl = {
  type: 'obsControl',
  label: { type: 'label', value: 'Physical Exam Finding' },
  id: '1',
  properties: { mandatory: false, location: { column: 0, row: 0 } },
  concept: { name: 'Physical Exam Finding', uuid: EXAM_FINDING_UUID, datatype: 'Text', conceptClass: 'Misc' },
};

const abnormalExamFindingControl = {
  ...examFindingControl,
  properties: { ...examFindingControl.properties, abnormal: true },
};

const mandatoryExamFindingControl = {
  ...examFindingControl,
  id: '2',
  properties: { ...examFindingControl.properties, mandatory: true },
};

const examFindingObservation = (formName, controlId, value) => ([
  {
    observationDateTime: '2026-08-10T09:00:00.000+0000',
    uuid: `obs-${controlId}`,
    value,
    formNamespace: 'bahmni',
    formFieldPath: `${formName}.1/${controlId}-0`,
    concept: { name: 'Physical Exam Finding', uuid: EXAM_FINDING_UUID, datatype: 'Text' },
  },
]);

const ValidateAfterMount = ({ metadata, observations }) => {
  const [validate, setValidate] = React.useState(false);
  React.useEffect(() => setValidate(true), []);
  return (
    <CarbonContainer
      {...carbonContainerCommonProps}
      metadata={metadata}
      observations={observations}
      validate={validate}
      validateForm={validate}
    />
  );
};

const DEFAULT_FORM = 'Exam Finding Form';
const ABNORMAL_FORM = 'Exam Finding Abnormal Form';
const MANDATORY_FORM = 'Exam Finding Mandatory Form';

const defaultForm = buildFormMetadata(100, 'carbon-obscontrol-default-uuid', DEFAULT_FORM, [examFindingControl]);
const abnormalForm = buildFormMetadata(101, 'carbon-obscontrol-abnormal-uuid', ABNORMAL_FORM, [abnormalExamFindingControl]);
const mandatoryForm = buildFormMetadata(102, 'carbon-obscontrol-mandatory-uuid', MANDATORY_FORM, [mandatoryExamFindingControl]);

export default {
  title: 'Complex Controls/Bahmni Design System/ObsControl',
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

Bahmni Design System rendering of \`ObsControl\`, driven end-to-end through \`CarbonContainer\`. ObsControl wraps a single-concept observation widget resolved from \`concept.datatype\` (Text → \`TextBox\`, Numeric → \`NumericBox\`, Boolean → \`BooleanControl\`, ...) and, when \`properties.abnormal\` is set on the control, additionally renders Carbon's **SelectableTag** (from \`@bahmni/design-system\`) beside the field so a clinician can flag the reading as clinically abnormal.

**Value stored:** \`{ value, comment, interpretation }\`, where \`interpretation\` is \`'ABNORMAL'\` once the tag is selected.

## When to use

- Any single-concept observation on a Bahmni Design System form.
- Set \`properties.abnormal\` to expose the SelectableTag for manual flagging.
- Set \`properties.mandatory\` to require the field before form submission.

## How the abnormal flag is set

The tag reflects the observation's \`interpretation\`. Two details are worth knowing when building fixtures:

1. \`ObsControl.onChange\` derives \`interpretation\` from an \`allowRange\` **warning**, which only \`NumericBox\` produces — so an automatic abnormal flag is inherently a Numeric-datatype behaviour.
2. A stored \`interpretation\` only survives mount if the leaf control passes \`calledOnMount: true\` to \`onChange\`. \`NumericBox\`, \`Date\` and \`DateTime\` do; \`TextBox\` and \`BooleanControl\` do not, so a Text-datatype control always mounts with the tag **unselected**.

These stories use a Text-datatype control, so the tag renders unselected and is toggled by clicking it. A Numeric-datatype control is deliberately avoided here: \`NumericBox\` is the only leaf that re-spreads its entire prop bag onto Carbon's \`NumberInput\`, so the bookkeeping props \`ObsControl\` passes to every leaf (\`conceptUuid\`, \`patientUuid\`, \`componentStore\`, \`onControlAdd\`, \`onEventTrigger\`, \`addMore\`, \`showNotification\`, \`conceptClass\`, \`conceptHandler\`) reach the DOM and log nine React errors. That is a pre-existing \`src/\` defect, tracked separately rather than worked around here.
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
        observations={examFindingObservation(DEFAULT_FORM, '1', 'Clear breath sounds, no distress')}
      />
    </StoryWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A plain Text observation with no `abnormal` property — no SelectableTag is rendered.',
      },
    },
  },
};

export const WithAbnormalIndicator = {
  render: () => (
    <StoryWrapper json={abnormalForm}>
      <CarbonContainer
        {...carbonContainerCommonProps}
        metadata={abnormalForm}
        observations={examFindingObservation(ABNORMAL_FORM, '1', 'Diminished breath sounds, mild wheeze')}
      />
    </StoryWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The same observation with `properties.abnormal: true`, which renders the Carbon ' +
          'SelectableTag beside the field. It starts unselected — click it to flag the finding ' +
          'as abnormal. See "How the abnormal flag is set" above for why a Text-datatype control ' +
          'cannot mount with the tag pre-selected.',
      },
    },
  },
};

export const Mandatory = {
  render: () => (
    <StoryWrapper json={mandatoryForm}>
      <CarbonContainer
        {...carbonContainerCommonProps}
        metadata={mandatoryForm}
        observations={[]}
      />
    </StoryWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A mandatory field before validation runs: marked required, but not yet in an error state ' +
          'because `validate` is false.',
      },
    },
  },
};

export const Disabled = {
  render: () => (
    <StoryWrapper json={defaultForm}>
      <CarbonContainer
        {...carbonContainerCommonProps}
        metadata={defaultForm}
        observations={examFindingObservation(DEFAULT_FORM, '1', 'Clear breath sounds, no distress')}
        readonly
      />
    </StoryWrapper>
  ),
};

export const WithValidationError = {
  render: () => (
    <StoryWrapper json={mandatoryForm}>
      <ValidateAfterMount metadata={mandatoryForm} observations={[]} />
    </StoryWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'An empty mandatory field raising the `mandatory` validation error, shown via the ' +
          "underlying TextBox's invalid state. `validate` is switched on just after mount rather " +
          'than passed directly — the leaf control only recomputes its error state on a `validate` ' +
          'transition, so a form that mounts with `validate` already true renders clean. See ' +
          '`ValidateAfterMount` in the story source.',
      },
    },
  },
};
