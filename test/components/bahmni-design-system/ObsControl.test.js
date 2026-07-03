import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { ObsControlWithIntl } from 'components/bahmni-design-system/ObsControl';
import ComponentStore from 'src/helpers/componentStore';

const MockInput = () => <input type="text" data-testid="mock-input" />;

const defaultMetadata = {
  concept: {
    datatype: 'Text',
    description: {},
    name: 'Test',
    uuid: 'test-uuid',
    answers: [],
    properties: {},
  },
  id: '1',
  label: { type: 'label', value: 'Test Label', translationKey: 'TEST_LABEL' },
  properties: {},
  type: 'obsControl',
};

const abnormalMetadata = {
  ...defaultMetadata,
  properties: { abnormal: true },
};

const defaultProps = {
  formFieldPath: 'test/1-0',
  metadata: defaultMetadata,
  onValueChanged: jest.fn(),
  value: { value: undefined, comment: undefined, interpretation: null },
  validate: false,
  validateForm: false,
  showNotification: jest.fn(),
};

const renderWithIntl = (component) => render(
  <IntlProvider locale="en" messages={{}}>
    {component}
  </IntlProvider>
);

describe('Carbon ObsControl', () => {
  beforeEach(() => {
    ComponentStore.registerComponent('Text', MockInput);
  });

  afterEach(() => {
    ComponentStore.deRegisterComponent('Text');
    jest.clearAllMocks();
  });

  describe('Abnormal button', () => {
    it('should not render the abnormal button when abnormal property is not set', () => {
      renderWithIntl(
        <ObsControlWithIntl
          {...defaultProps}
          value={{ value: 120, comment: undefined, interpretation: null }}
        />
      );

      expect(screen.queryByText('Abnormal')).not.toBeInTheDocument();
    });

    it('should render Abnormal as a SelectableTag when abnormal property is enabled', () => {
      renderWithIntl(
        <ObsControlWithIntl
          {...defaultProps}
          metadata={abnormalMetadata}
          value={{ value: 120, comment: undefined, interpretation: null }}
        />
      );

      expect(screen.getByText('Abnormal')).toBeInTheDocument();
    });

    it('should disable the abnormal button when no value is set', () => {
      renderWithIntl(
        <ObsControlWithIntl
          {...defaultProps}
          metadata={abnormalMetadata}
          value={{ value: undefined, comment: undefined, interpretation: null }}
        />
      );

      const abnormalBtn = screen.getByText('Abnormal').closest('button');
      expect(abnormalBtn).toBeDisabled();
    });

    it('should enable the abnormal button when value is set', () => {
      renderWithIntl(
        <ObsControlWithIntl
          {...defaultProps}
          metadata={abnormalMetadata}
          value={{ value: 120, comment: undefined, interpretation: null }}
        />
      );

      const abnormalBtn = screen.getByText('Abnormal').closest('button');
      expect(abnormalBtn).not.toBeDisabled();
    });

    it('should show abnormal button as selected when interpretation is ABNORMAL', () => {
      renderWithIntl(
        <ObsControlWithIntl
          {...defaultProps}
          metadata={abnormalMetadata}
          value={{ value: 120, comment: undefined, interpretation: 'ABNORMAL' }}
        />
      );

      const abnormalBtn = screen.getByText('Abnormal').closest('button');
      expect(abnormalBtn).toHaveAttribute('aria-pressed', 'true');
    });

    it('should show abnormal button as not selected when interpretation is null', () => {
      renderWithIntl(
        <ObsControlWithIntl
          {...defaultProps}
          metadata={abnormalMetadata}
          value={{ value: 120, comment: undefined, interpretation: null }}
        />
      );

      const abnormalBtn = screen.getByText('Abnormal').closest('button');
      expect(abnormalBtn).toHaveAttribute('aria-pressed', 'false');
    });

    it('should call onValueChanged with ABNORMAL interpretation when clicked', () => {
      const mockOnValueChanged = jest.fn();
      renderWithIntl(
        <ObsControlWithIntl
          {...defaultProps}
          metadata={abnormalMetadata}
          onValueChanged={mockOnValueChanged}
          value={{ value: 120, comment: undefined, interpretation: null }}
        />
      );

      fireEvent.click(screen.getByText('Abnormal').closest('button'));
      expect(mockOnValueChanged).toHaveBeenCalledWith(
        'test/1-0',
        { value: 120, comment: undefined, interpretation: 'ABNORMAL' },
        undefined
      );
    });

    it('should clear ABNORMAL interpretation when clicked again', () => {
      const mockOnValueChanged = jest.fn();
      renderWithIntl(
        <ObsControlWithIntl
          {...defaultProps}
          metadata={abnormalMetadata}
          onValueChanged={mockOnValueChanged}
          value={{ value: 120, comment: undefined, interpretation: 'ABNORMAL' }}
        />
      );

      fireEvent.click(screen.getByText('Abnormal').closest('button'));
      expect(mockOnValueChanged).toHaveBeenCalledWith(
        'test/1-0',
        { value: 120, comment: undefined, interpretation: null },
        undefined
      );
    });

    it('should not call onValueChanged when abnormal button is clicked with no value', () => {
      const mockOnValueChanged = jest.fn();
      renderWithIntl(
        <ObsControlWithIntl
          {...defaultProps}
          metadata={abnormalMetadata}
          onValueChanged={mockOnValueChanged}
          value={{ value: undefined, comment: undefined, interpretation: null }}
        />
      );

      fireEvent.click(screen.getByText('Abnormal').closest('button'));
      expect(mockOnValueChanged).not.toHaveBeenCalled();
    });
  });

  describe('Notes (showComment)', () => {
    it('should not render the notes section when notes property is not set', () => {
      renderWithIntl(<ObsControlWithIntl {...defaultProps} />);
      expect(screen.queryByRole('button', { name: /add note/i })).not.toBeInTheDocument();
    });

    it('should render the add note link when notes property is enabled', () => {
      const notesMetadata = { ...defaultMetadata, properties: { notes: true } };
      renderWithIntl(
        <ObsControlWithIntl {...defaultProps} metadata={notesMetadata} />
      );
      expect(screen.getByRole('button', { name: /add note/i })).toBeInTheDocument();
      expect(screen.queryByPlaceholderText('Notes')).not.toBeInTheDocument();
    });

    it('should auto-open textarea when notesOpen is true', () => {
      const notesOpenMetadata = {
        ...defaultMetadata,
        properties: { notes: true, notesOpen: true },
      };
      renderWithIntl(
        <ObsControlWithIntl {...defaultProps} metadata={notesOpenMetadata} />
      );
      expect(screen.getByRole('button', { name: /add note/i })).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Notes')).toBeInTheDocument();
    });
  });
});
