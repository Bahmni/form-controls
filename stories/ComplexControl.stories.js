/* global componentStore */
import React from 'react';
import PropTypes from 'prop-types';
import { ComplexControl } from 'src/components/ComplexControl.jsx';
import StoryWrapper from './StoryWrapper';

// Register a simple mock component as a conceptHandler for story demonstration.
// ComplexControl looks up the conceptHandler key in componentStore and renders
// whatever component is stored there, passing all its own props down.
const MockWeightWidget = ({ conceptHandler }) => (
  <div style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '4px' }}>
    <label htmlFor="mock-weight">
      Weight (kg) — rendered by conceptHandler &quot;{conceptHandler}&quot;
    </label>
    <input
      id="mock-weight"
      placeholder="Enter weight"
      style={{ display: 'block', marginTop: '4px', width: '200px' }}
      type="number"
    />
  </div>
);

MockWeightWidget.propTypes = {
  conceptHandler: PropTypes.string.isRequired,
};

const MockVitalsWidget = ({ addMore, conceptHandler }) => (
  <div style={{ border: '2px solid #4a90d9', padding: '12px', borderRadius: '4px' }}>
    <strong>Vitals Complex Widget — conceptHandler: &quot;{conceptHandler}&quot;</strong>
    <div style={{ marginTop: '8px' }}>
      <label htmlFor="mock-bp">Blood Pressure</label>
      <input
        id="mock-bp"
        placeholder="e.g. 120/80"
        style={{ display: 'block', marginTop: '4px' }}
        type="text"
      />
    </div>
    <div style={{ marginTop: '8px' }}>
      <label htmlFor="mock-hr">Heart Rate</label>
      <input
        id="mock-hr"
        placeholder="bpm"
        style={{ display: 'block', marginTop: '4px' }}
        type="number"
      />
    </div>
    {addMore && (
      <p style={{ color: '#777', fontSize: '0.85em' }}>Add More is enabled for this complex control.</p>
    )}
  </div>
);

MockVitalsWidget.propTypes = {
  addMore: PropTypes.bool,
  conceptHandler: PropTypes.string.isRequired,
};

const MockEcgWidget = ({ conceptHandler }) => (
  <div style={{ border: '2px solid #e67e22', padding: '12px', borderRadius: '4px' }}>
    <strong>ECG Recording Widget — conceptHandler: &quot;{conceptHandler}&quot;</strong>
    <div style={{ marginTop: '8px', background: '#111', padding: '8px', borderRadius: '3px' }}>
      <span style={{ color: '#0f0', fontFamily: 'monospace', fontSize: '0.8em' }}>
        ♥ ── ECG waveform data stored as complexData binary reference ──
      </span>
    </div>
    <p style={{ color: '#777', fontSize: '0.85em', marginTop: '6px' }}>
      In production, this widget encodes the waveform as a binary file and submits it
      via the OpenMRS complex obs handler registered for the ECG concept.
    </p>
  </div>
);

MockEcgWidget.propTypes = {
  conceptHandler: PropTypes.string.isRequired,
};

componentStore.registerComponent('weightHandler', MockWeightWidget);
componentStore.registerComponent('vitalsHandler', MockVitalsWidget);
componentStore.registerComponent('ecgHandler', MockEcgWidget);

// Metadata shapes used for the JSON visualisation panel
const weightMetadata = {
  type: 'complex',
  conceptHandler: 'weightHandler',
  id: '10',
  label: { type: 'label', value: 'Weight' },
  properties: { mandatory: false, location: { column: 0, row: 0 } },
  concept: {
    name: 'Weight',
    uuid: 'weight-concept-uuid-0001',
    datatype: 'Complex',
  },
};

const vitalsMetadata = {
  type: 'complex',
  conceptHandler: 'vitalsHandler',
  id: '11',
  label: { type: 'label', value: 'Vitals' },
  properties: { mandatory: false, addMore: true, location: { column: 0, row: 0 } },
  concept: {
    name: 'Vitals Panel',
    uuid: 'vitals-concept-uuid-0002',
    datatype: 'Complex',
  },
};

// Real-world example matching standard_config: an ECG complex control
const ecgMetadata = {
  type: 'complex',
  conceptHandler: 'ecgHandler',
  id: '20',
  label: { type: 'label', value: 'ECG Recording' },
  properties: {
    mandatory: false,
    location: { column: 0, row: 0 },
    notes: true,
  },
  concept: {
    name: 'ECG Recording',
    uuid: 'ecg-concept-uuid-0003',
    datatype: 'Complex',
    description: 'Captures a multi-lead ECG waveform observation.',
  },
};

const commonProps = {
  onChange: () => {},
  onControlAdd: () => {},
  showNotification: () => {},
  validate: false,
  validations: [],
  properties: { mandatory: false },
};

export default {
  title: 'Complex Controls/Legacy Components/ComplexControl',
  component: ComplexControl,
  argTypes: {
    conceptHandler: { control: 'text', description: 'componentStore key used to look up the registered widget' },
    addMore: { control: 'boolean', description: 'Show Add More button above the widget' },
    validate: { control: 'boolean', description: 'Trigger field-level validation' },
    onChange: { action: 'onChange' },
    showNotification: { action: 'showNotification' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'ComplexControl is a dynamic dispatcher that resolves the actual rendering component at ' +
          'runtime by looking up `conceptHandler` in the global `componentStore` singleton. ' +
          'This allows third-party modules (e.g. image capture, ECG, audio recording) to register ' +
          'themselves and be embedded inside any form without any changes to the form-engine core.\n\n' +
          '**How it works**:\n' +
          '1. The form metadata specifies `type: "complex"` and a `conceptHandler` string.\n' +
          '2. At render time, `ComplexControl` calls `componentStore.getRegisteredComponent(conceptHandler)`.\n' +
          '3. If a matching component is found, it is instantiated with all of `ComplexControl`\'s props.\n' +
          '4. If no component is registered for that key, `ComplexControl` renders `null`.\n\n' +
          '**Data model**: A `datatype: "Complex"` observation in OpenMRS stores its value as a ' +
          'reference to binary data rather than a primitive. The `complexData` field on the ' +
          'observation record points to a file managed by the OpenMRS complex obs handler for ' +
          'that concept. The registered conceptHandler component is responsible for encoding ' +
          'and decoding this binary value.\n\n' +
          '**Real-world example**: An ECG module registers itself as ' +
          '`componentStore.registerComponent("ecg", EcgWidget)` and the form metadata uses ' +
          '`conceptHandler: "ecg"` to embed it.\n\n' +
          'Accessibility (WCAG 2.1 AA): The responsibility for accessible markup lies with each ' +
          'registered conceptHandler component. At minimum, each complex widget must associate its ' +
          'inputs with visible labels, support keyboard navigation, and expose error states via ' +
          '`aria-describedby`. The ComplexControl wrapper itself does not add extra DOM structure.',
      },
    },
  },
};

export const DefaultConceptHandlerLookup = {
  args: {
    conceptHandler: 'weightHandler',
  },
  render: (args) => (
    <StoryWrapper json={weightMetadata}>
      <ComplexControl
        {...commonProps}
        formFieldPath="form/10-0"
        properties={{ mandatory: false }}
        {...args}
      />
    </StoryWrapper>
  ),
};

export const WithNestedChildControls = {
  args: {
    conceptHandler: 'vitalsHandler',
    addMore: true,
  },
  render: (args) => (
    <StoryWrapper json={vitalsMetadata}>
      <ComplexControl
        {...commonProps}
        formFieldPath="form/11-0"
        properties={{ mandatory: false, addMore: true }}
        {...args}
      />
    </StoryWrapper>
  ),
};

export const EcgConceptHandlerExample = {
  args: {
    conceptHandler: 'ecgHandler',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Real-world ECG recording control using a dedicated `ecgHandler` mock registered in ' +
          '`componentStore`. In production, an ECG module calls ' +
          '`componentStore.registerComponent("ecgHandler", EcgWidget)` and the form metadata ' +
          'uses `conceptHandler: "ecgHandler"` to embed it. The widget is responsible for ' +
          'encoding the waveform as binary data and submitting it via the OpenMRS complex obs handler.',
      },
    },
  },
  render: (args) => (
    <StoryWrapper json={ecgMetadata}>
      <ComplexControl
        {...commonProps}
        formFieldPath="form/20-0"
        properties={{ mandatory: false, notes: true }}
        {...args}
      />
    </StoryWrapper>
  ),
};
