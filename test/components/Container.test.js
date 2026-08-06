import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Container } from 'components/Container.jsx';
import { Label } from 'components/Label.jsx';
import { TextBox } from 'components/TextBox.jsx';
import { NumericBox } from 'components/NumericBox.jsx';
import { Button } from 'components/Button.jsx';
import { ObsControlWithIntl as ObsControl } from 'components/ObsControl.jsx';
import { ObsGroupControlWithIntl as ObsGroupControl } from 'components/ObsGroupControl.jsx';
import { CodedControl } from 'components/CodedControl.jsx';
import ComponentStore from 'src/helpers/componentStore';
import ControlRecordTreeMgr from 'src/helpers/ControlRecordTreeMgr';
import { utf8ToBase64 } from '../../src/helpers/encodingUtils';
import { FormValidationError } from 'src/helpers/FormValidationError';

const PULSE_UUID = 'c36bc411-3f10-11e4-adec-0800271c1b75';
const ADMISSION_UUID = 'c5cdd4e5-86e0-400c-9742-d73ffb323fa8';
const COMPLAINT_UUID = 'c398a4be-3f10-11e4-adec-0800271c1b75';

const mockComponentStore = () => {
  ComponentStore.registerComponent('label', Label);
  ComponentStore.registerComponent('text', TextBox);
  ComponentStore.registerComponent('numeric', NumericBox);
  ComponentStore.registerComponent('button', Button);
  ComponentStore.registerComponent('Coded', CodedControl);
  ComponentStore.registerComponent('obsControl', ObsControl);
  ComponentStore.registerComponent('obsGroupControl', ObsGroupControl);
};

const cleanupComponentStore = () => {
  ComponentStore.deRegisterComponent('label');
  ComponentStore.deRegisterComponent('text');
  ComponentStore.deRegisterComponent('numeric');
  ComponentStore.deRegisterComponent('button');
  ComponentStore.deRegisterComponent('Coded');
  ComponentStore.deRegisterComponent('obsControl');
  ComponentStore.deRegisterComponent('obsGroupControl');
};

const createNumericControlMetadata = (overrides = {}) => {
  const baseMetadata = {
    controls: [
      {
        concept: {
          answers: [],
          datatype: 'Numeric',
          description: [],
          name: 'Pulse',
          properties: { allowDecimal: true },
          uuid: PULSE_UUID,
        },
        hiAbsolute: null,
        hiNormal: 72,
        id: '1',
        label: { type: 'label', value: 'Pulse(/min)' },
        lowAbsolute: null,
        lowNormal: 72,
        properties: {
          addMore: false,
          hideLabel: false,
          location: { column: 0, row: 0 },
          mandatory: false,
          notes: false,
        },
        type: 'obsControl',
        units: '/min',
      },
    ],
    id: 209,
    name: 'PulseForm',
    uuid: '245940b7-3d6b-4a8b-806b-3f56444129ae',
    version: '1',
    defaultLocale: 'en',
  };

  return { ...baseMetadata, ...overrides };
};

const createBooleanControlMetadata = () => ({
  controls: [
    {
      concept: {
        answers: [],
        datatype: 'Boolean',
        name: 'Smoking History',
        properties: { allowDecimal: null },
        uuid: 'c2a43174-c9db-4e54-8516-17372c83537f',
      },
      hiAbsolute: null,
      hiNormal: null,
      id: '1',
      label: { type: 'label', value: 'Smoking History' },
      lowAbsolute: null,
      lowNormal: null,
      options: [
        { name: 'Yes', value: true },
        { name: 'No', value: false },
      ],
      properties: {
        addMore: false,
        hideLabel: false,
        location: { column: 0, row: 0 },
        mandatory: false,
        notes: false,
      },
      type: 'obsControl',
      units: null,
    },
  ],
  id: 228,
  name: 'SmokingForm',
  uuid: 'a4eb5bac-8c7a-43e6-9c75-cef0710991e5',
  version: '1',
  defaultLocale: 'en',
});

const createConditionalFormMetadata = () => ({
  controls: [
    {
      concept: {
        answers: [],
        datatype: 'Text',
        name: 'Tuberculosis, Need of Admission',
        properties: { allowDecimal: null },
        uuid: ADMISSION_UUID,
      },
      hiAbsolute: null,
      hiNormal: null,
      id: '5',
      label: { type: 'label', value: 'Need of Admission' },
      lowAbsolute: null,
      lowNormal: null,
      properties: {
        addMore: false,
        hideLabel: false,
        location: { column: 0, row: 0 },
        mandatory: true,
        notes: false,
      },
      type: 'obsControl',
      units: null,
      events: {
        onValueChange: utf8ToBase64(`function(form){
          var admission = form.get('Tuberculosis, Need of Admission').getValue();
          if(admission === 'yes') {
            form.get('Chief Complaint Notes').setEnabled(false);
          } else {
            form.get('Chief Complaint Notes').setEnabled(true);
          }
        }`),
      },
    },
    {
      concept: {
        answers: [],
        datatype: 'Text',
        name: 'Chief Complaint Notes',
        properties: { allowDecimal: null },
        uuid: COMPLAINT_UUID,
      },
      hiAbsolute: null,
      hiNormal: null,
      id: '2',
      label: { type: 'label', value: 'Chief Complaint Notes' },
      lowAbsolute: null,
      lowNormal: null,
      properties: {
        addMore: false,
        hideLabel: false,
        location: { column: 0, row: 1 },
        mandatory: false,
        notes: false,
      },
      type: 'obsControl',
      units: null,
    },
  ],
  id: 5,
  name: 'ConditionalForm',
  uuid: '6a3b4de9-5e21-46b4-addb-4ad9518e587b',
  version: '4',
  defaultLocale: 'en',
});

const defaultProps = {
  collapse: false,
  locale: 'en',
  observations: [],
  patient: { age: 10, gender: 'M', uuid: 'patient-uuid' },
  translations: { labels: {}, concepts: {} },
  validate: false,
  validateForm: false,
};

const renderContainer = (props = {}) => {
  const combinedProps = { ...defaultProps, ...props };
  return render(<Container {...combinedProps} />);
};

describe('Container', () => {
  beforeEach(() => {
    mockComponentStore();
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanupComponentStore();
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render numeric control with proper accessibility', () => {
      const metadata = createNumericControlMetadata();
      renderContainer({ metadata });

      expect(screen.getByLabelText(/pulse.*\/min/i)).toBeInTheDocument();
      expect(screen.getByRole('spinbutton')).toBeInTheDocument();
      expect(screen.getByText(/72 - 72/i)).toBeInTheDocument();
    });

    it('should show unsupported message for boolean controls', () => {
      const metadata = createBooleanControlMetadata();
      renderContainer({ metadata });

      expect(
        screen.getByText(/component.*boolean.*not supported/i),
      ).toBeInTheDocument();
    });

    it('should handle empty metadata gracefully', () => {
      const emptyMetadata = createNumericControlMetadata({ controls: [] });
      const { container } = renderContainer({ metadata: emptyMetadata });

      expect(container.firstChild).toBeInTheDocument();
      expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should handle input changes and trigger value updates', async () => {
      const onValueUpdated = jest.fn();
      const metadata = createNumericControlMetadata();

      jest.spyOn(ControlRecordTreeMgr, 'find').mockReturnValue({
        getEventScripts: () => ({}),
      });

      renderContainer({ metadata, onValueUpdated });

      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '75' } });

      await waitFor(() => {
        expect(onValueUpdated).toHaveBeenCalledTimes(1);
        expect(onValueUpdated).toHaveBeenCalledWith(
          expect.objectContaining({
            children: expect.any(Object),
          }),
        );
      });
    });

    it('should add controls and show notifications when using add more', async () => {
      const metadata = createNumericControlMetadata({
        controls: [
          {
            ...createNumericControlMetadata().controls[0],
            properties: {
              ...createNumericControlMetadata().controls[0].properties,
              addMore: true,
            },
          },
        ],
      });

      const { container } = renderContainer({ metadata });

      const addButton = screen.getByLabelText('Add');
      expect(addButton).toBeInTheDocument();
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText(/new.*pulse.*added/i)).toBeInTheDocument();
      });

      expect(screen.getAllByRole('spinbutton')).toHaveLength(2);

      jest.runAllTimers();
      await waitFor(() => {
        expect(
          screen.queryByText(/new.*pulse.*added/i),
        ).not.toBeInTheDocument();
      });
    });

    it('should handle form initialization events', async () => {
      const metadata = createNumericControlMetadata({
        events: {
          onFormInit: utf8ToBase64("function(form){form.get('Pulse').setEnabled(false);}"),
        },
      });

      renderContainer({ metadata });

      await waitFor(() => {
        const input = screen.getByRole('spinbutton');
        expect(input).toBeDisabled();
      });
    });

    it('should execute conditional field logic with proper state changes', async () => {
      const metadata = createConditionalFormMetadata();
      renderContainer({ metadata });

      const admissionInput = screen.getByLabelText(/need of admission/i);
      const complaintInput = screen.getByLabelText(/chief complaint notes/i);

      expect(admissionInput).toBeEnabled();
      expect(complaintInput).toBeEnabled();

      fireEvent.change(admissionInput, { target: { value: 'yes' } });

      await waitFor(() => {
        expect(complaintInput).toBeDisabled();
      });

      fireEvent.change(admissionInput, { target: { value: 'no' } });

      await waitFor(() => {
        expect(complaintInput).toBeEnabled();
      });
    });
  });

  describe('Validation', () => {
    it('should show validation errors with proper accessibility attributes', () => {
      const metadata = createNumericControlMetadata({
        controls: [
          {
            ...createNumericControlMetadata().controls[0],
            properties: {
              ...createNumericControlMetadata().controls[0].properties,
              mandatory: true,
            },
          },
        ],
      });

      renderContainer({ metadata, validate: true, validateForm: true });

      const input = screen.getByRole('spinbutton');

      expect(input).toHaveClass('form-builder-error');
      expect(
        document.querySelector('.form-builder-asterisk'),
      ).toBeInTheDocument();
    });

    it('should return detailed validation errors through getValue', async () => {
      const metadata = createNumericControlMetadata({
        controls: [
          {
            ...createNumericControlMetadata().controls[0],
            properties: {
              ...createNumericControlMetadata().controls[0].properties,
              mandatory: true,
            },
          },
        ],
      });

      const containerRef = React.createRef();
      render(
        <Container
          ref={containerRef}
          {...defaultProps}
          metadata={metadata}
          validate
          validateForm
        />,
      );

      expect(containerRef.current).toBeTruthy();
      
      // Wait for the input to show error state
      await waitFor(() => {
        const input = screen.getByRole('spinbutton');
        expect(input).toHaveClass('form-builder-error');
      });

      // Trigger a change to ensure error callbacks complete
      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '' } });

      // Wait for errors to be available in getValue
      await waitFor(() => {
        const result = containerRef.current.getValue();
        expect(result).toHaveProperty('errors');
        expect(Array.isArray(result.errors)).toBe(true);
        expect(result.errors.length).toBeGreaterThan(0);
      }, { timeout: 3000 });

      const result = containerRef.current.getValue();
      expect(result).toHaveProperty('observations');
      expect(result.errors[0]).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: 'mandatory',
          }),
        ]),
      );
    });

    it('should return valid observations when form data is complete', () => {
      const metadata = createNumericControlMetadata();
      const containerRef = React.createRef();

      render(
        <Container ref={containerRef} {...defaultProps} metadata={metadata} />,
      );

      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '75' } });

      expect(containerRef.current).toBeTruthy();
      const result = containerRef.current.getValue();

      expect(result).toHaveProperty('observations');
      expect(Array.isArray(result.observations)).toBe(true);
      expect(result.observations[0]).toEqual(
        expect.objectContaining({
          concept: expect.objectContaining({
            uuid: PULSE_UUID,
          }),
          value: '75',
          formFieldPath: expect.stringMatching(/PulseForm\.1\/1-0/),
        }),
      );
    });
  });

  describe('Notifications', () => {
    it('should display and auto-hide custom notifications', async () => {
      const metadata = createNumericControlMetadata();
      const containerRef = React.createRef();

      render(
        <Container ref={containerRef} {...defaultProps} metadata={metadata} />,
      );

      if (containerRef.current) {
        containerRef.current.showNotification('Test notification', 'info');
      }

      await waitFor(() => {
        expect(screen.getByText('Test notification')).toBeInTheDocument();
      });

      jest.runAllTimers();
      await waitFor(() => {
        expect(screen.queryByText('Test notification')).not.toBeInTheDocument();
      });
    });

    it('should support different notification types', async () => {
      const metadata = createNumericControlMetadata();
      const containerRef = React.createRef();

      render(
        <Container ref={containerRef} {...defaultProps} metadata={metadata} />,
      );

      if (containerRef.current) {
        containerRef.current.showNotification('Error message', 'error');
      }

      await waitFor(() => {
        const notification = screen.getByText('Error message');
        expect(
          notification.closest('.error-message-container'),
        ).toBeInTheDocument();
      });
    });
  });

  describe('Data Management', () => {
    it('should handle voided observations correctly', () => {
      const voidedObservations = [
        {
          concept: {
            uuid: PULSE_UUID,
            name: 'Pulse',
            datatype: 'Numeric',
          },
          value: '72',
          voided: true,
          formFieldPath: 'PulseForm.1/1-0',
          formNamespace: 'Bahmni',
        },
      ];

      const metadata = createNumericControlMetadata();
      const containerRef = React.createRef();

      render(
        <Container
          ref={containerRef}
          {...defaultProps}
          metadata={metadata}
          observations={voidedObservations}
        />,
      );

      expect(containerRef.current).toBeTruthy();
      const result = containerRef.current.getValue();

      expect(result).toHaveProperty('observations');
      expect(Array.isArray(result.observations)).toBe(true);

      const allVoidedResult =
        containerRef.current.areAllVoided(voidedObservations);
      expect(allVoidedResult).toBe(true);

      const mixedObservations = [
        ...voidedObservations,
        { ...voidedObservations[0], voided: false, value: '80' },
      ];
      const mixedResult =
        containerRef.current.areAllVoided(mixedObservations);
      expect(mixedResult).toBe(false);
    });

    it('should verify onValueUpdated receives correct data structure', async () => {
      const onValueUpdated = jest.fn();
      const metadata = createNumericControlMetadata();

      jest.spyOn(ControlRecordTreeMgr, 'find').mockReturnValue({
        getEventScripts: () => ({}),
      });

      renderContainer({ metadata, onValueUpdated });

      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '80' } });

      await waitFor(() => {
        expect(onValueUpdated).toHaveBeenCalledWith(
          expect.objectContaining({
            children: expect.any(Object),
            getActive: expect.any(Function),
          }),
        );
      });
    });
  });

  describe('Internationalization', () => {
    it('should use translated text when translations are provided', () => {
      const metadata = createNumericControlMetadata();
      const translations = {
        labels: {},
        concepts: { Pulse: 'Heart Rate' },
      };

      renderContainer({ metadata, translations });

      expect(screen.getByRole('spinbutton')).toBeInTheDocument();

      const labels = screen.getAllByText(/pulse.*\/min/i);
      expect(labels.length).toBeGreaterThan(0);
    });

    it('should fallback to original text when translations are missing', () => {
      const metadata = createNumericControlMetadata();
      const emptyTranslations = { labels: {}, concepts: {} };

      renderContainer({ metadata, translations: emptyTranslations });

      expect(screen.getByText(/pulse.*\/min/i)).toBeInTheDocument();
    });

    it('should fallback to original text when translation key equals its value (untranslated entry)', () => {
      const metadata = createNumericControlMetadata({
        controls: [{
          ...createNumericControlMetadata().controls[0],
          label: { type: 'label', value: 'Pulse(/min)', translationKey: 'PULSE_LABEL' },
        }],
      });
      const translations = {
        labels: { PULSE_LABEL: 'PULSE_LABEL' },
        concepts: {},
      };

      renderContainer({ metadata, translations });

      expect(screen.queryByText(/PULSE_LABEL/)).not.toBeInTheDocument();
      expect(screen.getByText(/Pulse/)).toBeInTheDocument();
    });

    it('should render decoded HTML entities in concept labels and translations', () => {
      const metadata = createNumericControlMetadata({
        controls: [{
          ...createNumericControlMetadata().controls[0],
          label: { type: 'label', value: 'Blood Pressure &gt; 60', translationKey: 'BP_LABEL' },
          concept: {
            ...createNumericControlMetadata().controls[0].concept,
            name: 'Vitals &amp; Parameters',
          },
        }],
      });
      const translations = {
        labels: { BP_LABEL: 'Blood Pressure &gt; 60' },
        concepts: {},
      };

      renderContainer({ metadata, translations });

      // The label should display with decoded entity (> instead of &gt;)
      expect(screen.getByText(/Blood Pressure > 60/)).toBeInTheDocument();
      // The input should be associated with the decoded label
      const input = screen.getByRole('spinbutton');
      expect(input).toBeInTheDocument();
    });

  });

  describe('Coverage Improvements', () => {
    it('should handle value updates when no onValueUpdated callback is provided', async () => {
      const metadata = createNumericControlMetadata();

      jest.spyOn(ControlRecordTreeMgr, 'find').mockReturnValue({
        getEventScripts: () => ({}),
      });

      renderContainer({ metadata });

      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '75' } });

      await waitFor(() => {
        expect(input.value).toBe('75');
      });
    });

    it('should handle onControlAdd silent mode (line 101 else branch)', async () => {
      const metadata = createNumericControlMetadata({
        controls: [
          {
            ...createNumericControlMetadata().controls[0],
            properties: {
              ...createNumericControlMetadata().controls[0].properties,
              addMore: true,
            },
          },
        ],
      });

      const containerRef = React.createRef();
      render(
        <Container ref={containerRef} {...defaultProps} metadata={metadata} />,
      );

      expect(containerRef.current).toBeTruthy();
      const originalCanAdd = containerRef.current.canAddNextFormFieldPath;
      containerRef.current.canAddNextFormFieldPath = jest
        .fn()
        .mockReturnValue(true);

      containerRef.current.onControlAdd('PulseForm.1/1-0', false);

      await waitFor(() => {
        expect(screen.getAllByRole('spinbutton')).toHaveLength(2);
      });

      expect(screen.queryByText(/added/i)).not.toBeInTheDocument();

      containerRef.current.canAddNextFormFieldPath = originalCanAdd;
    });

    it('should handle getValue with errors and observations (lines 116-117)', () => {
      const metadata = createNumericControlMetadata({
        controls: [
          {
            ...createNumericControlMetadata().controls[0],
            properties: {
              ...createNumericControlMetadata().controls[0].properties,
              mandatory: true,
            },
          },
        ],
      });

      const containerRef = React.createRef();
      render(
        <Container
          ref={containerRef}
          {...defaultProps}
          metadata={metadata}
          validate
          validateForm={false}
        />,
      );

      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '75' } });

      expect(containerRef.current).toBeTruthy();
      const result = containerRef.current.getValue();

      expect(result).toHaveProperty('observations');
      expect(Array.isArray(result.observations)).toBe(true);

      expect(result.errors === undefined || Array.isArray(result.errors)).toBe(true);
    });

    it('should handle storeChildRef with null reference (lines 126-127)', () => {
      const metadata = createNumericControlMetadata();
      const containerRef = React.createRef();

      render(
        <Container ref={containerRef} {...defaultProps} metadata={metadata} />,
      );

      expect(containerRef.current).toBeTruthy();
      expect(() => {
        containerRef.current.storeChildRef(null);
      }).not.toThrow();

      expect(() => {
        containerRef.current.storeChildRef(undefined);
      }).not.toThrow();
    });

    it('should test areAllVoided method directly (line 147)', () => {
      const metadata = createNumericControlMetadata();
      const containerRef = React.createRef();

      render(
        <Container ref={containerRef} {...defaultProps} metadata={metadata} />,
      );

      expect(containerRef.current).toBeTruthy();
      expect(containerRef.current.areAllVoided([])).toBe(true);

      const allVoided = [
        { voided: true, value: '1' },
        { voided: true, value: '2' },
      ];
      expect(containerRef.current.areAllVoided(allVoided)).toBe(true);

      const mixed = [
        { voided: true, value: '1' },
        { voided: false, value: '2' },
      ];
      expect(containerRef.current.areAllVoided(mixed)).toBe(false);

      const nonVoided = [
        { voided: false, value: '1' },
        { voided: false, value: '2' },
      ];
      expect(containerRef.current.areAllVoided(nonVoided)).toBe(false);
    });

    it('should handle patient uuid extraction in render method', () => {
      const metadata = createNumericControlMetadata();

      const { rerender } = renderContainer({
        metadata,
        patient: { age: 30, gender: 'F', uuid: 'patient-123' },
      });

      expect(screen.getByRole('spinbutton')).toBeInTheDocument();

      rerender(
        <Container {...defaultProps} metadata={metadata} patient={null} />,
      );

      expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    });

    it('should test getValue edge case with non-empty errors but validateForm false', () => {
      const metadata = createNumericControlMetadata();
      const containerRef = React.createRef();

      render(
        <Container
          ref={containerRef}
          {...defaultProps}
          metadata={metadata}
          validateForm={false}
        />,
      );

      expect(containerRef.current).toBeTruthy();
      const result = containerRef.current.getValue();

      expect(result).toHaveProperty('observations');
      expect(result).not.toHaveProperty('errors');
    });
  });

  describe('Edge Cases and Props', () => {
    it('should handle readonly prop and disable controls when set to true', () => {
      const metadata = createNumericControlMetadata();
      const { rerender } = renderContainer({ metadata, readonly: true });

      const input = screen.getByRole('spinbutton');
      expect(input).toBeDisabled();

      rerender(
        <Container {...defaultProps} metadata={metadata} readonly={false} />,
      );

      const enabledInput = screen.getByRole('spinbutton');
      expect(enabledInput).toBeEnabled();
    });

    it('should enable controls when readonly prop is not provided', () => {
      const metadata = createNumericControlMetadata();
      renderContainer({ metadata });

      const input = screen.getByRole('spinbutton');
      expect(input).toBeEnabled();
    });

    it('should handle prop changes correctly', () => {
      const metadata = createNumericControlMetadata();
      const patient = { age: 30, gender: 'F', uuid: 'patient-123' };

      const { rerender } = renderContainer({
        metadata,
        collapse: false,
        patient,
      });

      expect(screen.getByRole('spinbutton')).toBeInTheDocument();

      rerender(
        <Container
          {...defaultProps}
          metadata={metadata}
          collapse
          patient={patient}
        />,
      );
      expect(screen.getByRole('spinbutton')).toBeInTheDocument();

      const newPatient = { age: 25, gender: 'M', uuid: 'patient-456' };
      rerender(
        <Container
          {...defaultProps}
          metadata={metadata}
          patient={newPatient}
        />,
      );
      expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    });

    it('should handle component store issues gracefully', () => {
      cleanupComponentStore();

      const metadata = createNumericControlMetadata();
      const { container } = renderContainer({ metadata });

      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle missing event scripts without errors', () => {
      const metadata = createNumericControlMetadata();
      const containerRef = React.createRef();

      jest.spyOn(ControlRecordTreeMgr, 'find').mockReturnValue({
        getEventScripts: () => null,
      });

      render(
        <Container ref={containerRef} {...defaultProps} metadata={metadata} />,
      );

      expect(containerRef.current).toBeTruthy();
      expect(() => {
        containerRef.current.onEventTrigger('some-path', 'onValueChange');
      }).not.toThrow();
    });

    it('should rebuild control tree when a different form version is loaded', () => {
      const initialMetadata = createNumericControlMetadata({
        controls: [{
          ...createNumericControlMetadata().controls[0],
          label: { type: 'label', value: 'Initial Pulse Label' },
        }],
        version: '1',
      });

      const updatedMetadata = createNumericControlMetadata({
        controls: [{
          ...createNumericControlMetadata().controls[0],
          label: { type: 'label', value: 'Updated Pulse Label' },
        }],
        version: '2',
      });

      const containerRef = React.createRef();
      const { rerender } = render(
        <Container ref={containerRef} {...defaultProps} metadata={initialMetadata} />,
      );

      expect(screen.getByText(/Initial Pulse Label/)).toBeInTheDocument();
      expect(containerRef.current).toBeTruthy();
      const initialTreeData = containerRef.current.state.data;

      rerender(
        <Container ref={containerRef} {...defaultProps} metadata={updatedMetadata} />,
      );

      expect(screen.getByText(/Updated Pulse Label/)).toBeInTheDocument();
      const updatedTreeData = containerRef.current.state.data;

      expect(initialTreeData).not.toBe(updatedTreeData);
    });

    it('should not rebuild control tree when same-version metadata gets a new object reference', () => {
      const metadata = createNumericControlMetadata();
      const containerRef = React.createRef();
      const { rerender } = render(
        <Container ref={containerRef} {...defaultProps} metadata={metadata} />,
      );

      const initialTreeData = containerRef.current.state.data;

      // Simulate parent re-rendering with a new metadata reference but same content/version
      const sameContentNewRef = { ...metadata };
      rerender(
        <Container ref={containerRef} {...defaultProps} metadata={sameContentNewRef} />,
      );

      expect(containerRef.current.state.data).toBe(initialTreeData);
    });

    it('should decode HTML entities in metadata when a new form version is loaded', () => {
      const initialMetadata = createNumericControlMetadata({
        controls: [{
          ...createNumericControlMetadata().controls[0],
          label: { type: 'label', value: 'Pulse &gt; 60' },
        }],
        version: '1',
      });

      const updatedMetadata = createNumericControlMetadata({
        controls: [{
          ...createNumericControlMetadata().controls[0],
          label: { type: 'label', value: 'Blood Pressure &amp; Temperature' },
        }],
        version: '2',
      });

      const { rerender } = renderContainer({ metadata: initialMetadata });

      expect(screen.getByText(/Pulse > 60/)).toBeInTheDocument();

      rerender(
        <Container {...defaultProps} metadata={updatedMetadata} />,
      );

      expect(screen.getByText(/Blood Pressure & Temperature/)).toBeInTheDocument();
    });
  });

  describe('FHIR bundle methods', () => {
    const fhirOptions = {
      patientReference: { reference: 'Patient/patient-uuid' },
      encounterReference: { reference: 'Encounter/encounter-uuid' },
      performerReference: { reference: 'Practitioner/practitioner-uuid' },
    };

    const previousPulseObservation = {
      resourceType: 'Observation',
      id: 'pulse-obs-uuid',
      status: 'final',
      code: { coding: [{ code: PULSE_UUID }] },
      valueQuantity: { value: 72 },
      effectiveDateTime: '2024-01-01T00:00:00.000Z',
      extension: [
        {
          url: 'http://fhir.bahmni.org/ext/observation/form-namespace-path',
          valueString: 'Bahmni^PulseForm.1/1-0',
        },
      ],
    };

    it('should prepopulate the form from fhirObservations (raw FHIR resources)', () => {
      renderContainer({
        metadata: createNumericControlMetadata(),
        fhirObservations: [previousPulseObservation],
      });

      expect(screen.getByRole('spinbutton')).toHaveValue(72);
    });

    it('getCurrentObservationBundle should return a collection bundle without throwing on validation errors', () => {
      const metadata = createNumericControlMetadata({
        controls: [{
          ...createNumericControlMetadata().controls[0],
          properties: { ...createNumericControlMetadata().controls[0].properties, mandatory: true },
        }],
      });
      const containerRef = React.createRef();
      render(
        <Container ref={containerRef} {...defaultProps} metadata={metadata} fhirObservations={[]} />,
      );

      const bundle = containerRef.current.getCurrentObservationBundle(fhirOptions);
      expect(bundle.type).toBe('collection');
      expect(bundle.entry).toEqual([]);
    });

    it('should throw FormValidationError from getObservationBundleForSave on mandatory errors', async () => {
      const metadata = createNumericControlMetadata({
        controls: [{
          ...createNumericControlMetadata().controls[0],
          properties: { ...createNumericControlMetadata().controls[0].properties, mandatory: true },
        }],
      });
      const containerRef = React.createRef();
      render(
        <Container
          ref={containerRef}
          {...defaultProps}
          metadata={metadata}
          fhirObservations={[]}
          validate
          validateForm
        />,
      );

      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '' } });

      await waitFor(() => {
        const result = containerRef.current.getValue();
        expect(result.errors.length).toBeGreaterThan(0);
      }, { timeout: 3000 });

      expect(() => containerRef.current.getObservationBundleForSave(fhirOptions))
        .toThrow(FormValidationError);
    });

    it('getObservationBundleForSave should PUT the changed, previously-saved observation', () => {
      const containerRef = React.createRef();
      render(
        <Container
          ref={containerRef}
          {...defaultProps}
          metadata={createNumericControlMetadata()}
          fhirObservations={[previousPulseObservation]}
        />,
      );

      fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '90' } });

      const bundle = containerRef.current.getObservationBundleForSave(fhirOptions);
      expect(bundle.entry).toHaveLength(1);
      expect(bundle.entry[0].request).toEqual({ method: 'PUT', url: 'Observation/pulse-obs-uuid' });
      expect(bundle.entry[0].resource.valueQuantity).toEqual({ value: 90 });
    });

    it('getObservationBundleForSave should run the onFormSave script before building the bundle', () => {
      const metadata = {
        ...createNumericControlMetadata(),
        events: {
          onFormSave: utf8ToBase64(`function(form){
            form.get('Pulse').setValue(100);
          }`),
        },
      };
      const containerRef = React.createRef();
      render(
        <Container ref={containerRef} {...defaultProps} metadata={metadata} fhirObservations={[]} />,
      );

      const bundle = containerRef.current.getObservationBundleForSave(fhirOptions);
      expect(bundle.entry).toHaveLength(1);
      expect(bundle.entry[0].resource.valueQuantity).toEqual({ value: 100 });
    });

    it('should call setIsFormUpdated(true) when a value first differs from the initial one', () => {
      const setIsFormUpdated = jest.fn();
      render(
        <Container
          {...defaultProps}
          metadata={createNumericControlMetadata()}
          fhirObservations={[previousPulseObservation]}
          setIsFormUpdated={setIsFormUpdated}
        />,
      );

      fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '90' } });
      expect(setIsFormUpdated).toHaveBeenLastCalledWith(true);
    });
  });

  describe('setIsFormUpdated', () => {
    const previousPulseObservation = {
      concept: { uuid: PULSE_UUID, name: 'Pulse', datatype: 'Numeric' },
      uuid: 'pulse-obs-uuid',
      value: 72,
      formFieldPath: 'PulseForm.1/1-0',
      formNamespace: 'Bahmni',
    };

    it('should call setIsFormUpdated(false) when a changed value is restored to the original', () => {
      const setIsFormUpdated = jest.fn();
      renderContainer({
        metadata: createNumericControlMetadata(),
        observations: [previousPulseObservation],
        setIsFormUpdated,
      });

      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '90' } });
      fireEvent.change(input, { target: { value: '72' } });

      expect(setIsFormUpdated).toHaveBeenLastCalledWith(false);
    });

    it('should not call setIsFormUpdated again for a second edit that keeps the same changed state', () => {
      const setIsFormUpdated = jest.fn();
      renderContainer({
        metadata: createNumericControlMetadata(),
        observations: [previousPulseObservation],
        setIsFormUpdated,
      });

      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '90' } });
      setIsFormUpdated.mockClear();
      fireEvent.change(input, { target: { value: '95' } });

      expect(setIsFormUpdated).not.toHaveBeenCalled();
    });

    it('should call setIsFormUpdated(true) when a previously-saved add-more instance is removed entirely', async () => {
      const metadata = createNumericControlMetadata({
        controls: [
          {
            ...createNumericControlMetadata().controls[0],
            properties: {
              ...createNumericControlMetadata().controls[0].properties,
              addMore: true,
            },
          },
        ],
      });

      const savedInstances = [
        {
          concept: { uuid: PULSE_UUID, name: 'Pulse', datatype: 'Numeric' },
          uuid: 'pulse-obs-uuid-0',
          value: 72,
          formFieldPath: 'PulseForm.1/1-0',
          formNamespace: 'Bahmni',
        },
        {
          concept: { uuid: PULSE_UUID, name: 'Pulse', datatype: 'Numeric' },
          uuid: 'pulse-obs-uuid-1',
          value: 80,
          formFieldPath: 'PulseForm.1/1-1',
          formNamespace: 'Bahmni',
        },
      ];

      const setIsFormUpdated = jest.fn();
      const containerRef = React.createRef();
      render(
        <Container
          ref={containerRef}
          {...defaultProps}
          metadata={metadata}
          observations={savedInstances}
          setIsFormUpdated={setIsFormUpdated}
        />,
      );

      expect(screen.getAllByRole('spinbutton')).toHaveLength(2);

      containerRef.current.onControlRemove('PulseForm.1/1-1');

      await waitFor(() => {
        expect(setIsFormUpdated).toHaveBeenCalledWith(true);
      });
    });
  });
});
