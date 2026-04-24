import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { IntlProvider, injectIntl } from 'react-intl';
import { List } from 'immutable';
import { Section } from 'components/bahmni-design-system/Section';
import { ControlRecord } from 'src/helpers/ControlRecordTreeBuilder';
import ComponentStore from 'src/helpers/componentStore';
import { ObsControlWithIntl as ObsControl } from 'components/ObsControl.jsx';
import { NumericBox } from 'components/NumericBox.jsx';
import * as controlsParser from 'src/helpers/controlsParser';

const SectionWithIntl = injectIntl(Section);

const renderWithIntl = (component) =>
  render(
    <IntlProvider locale="en" messages={{ TEST_KEY: 'Patient History' }}>
      {component}
    </IntlProvider>
  );

const obsConcept = {
  answers: [], datatype: 'Numeric', name: 'Pulse', uuid: 'pulse-uuid',
  properties: { allowDecimal: false },
};

const obsControl = {
  concept: obsConcept, id: '2',
  label: { type: 'label', value: 'Pulse' },
  properties: { location: { column: 0, row: 0 }, mandatory: false, notes: false },
  type: 'obsControl',
};

const children = List.of(new ControlRecord({
  control: obsControl,
  formFieldPath: 'TestForm.1/2-0',
  dataSource: {
    concept: obsConcept,
    formFieldPath: 'TestForm.1/2-0',
    formNamespace: 'Bahmni',
    voided: true,
  },
}));

const metadata = {
  controls: [],
  id: '1',
  label: { type: 'label', translationKey: 'TEST_KEY', value: 'Patient History' },
  properties: { location: { column: 0, row: 0 } },
  type: 'section',
};

const metadataWithControls = {
  ...metadata,
  controls: [obsControl],
};

const defaultProps = {
  children: List.of(),
  collapse: false,
  formName: 'TestForm',
  formVersion: '1',
  metadata,
  onValueChanged: jest.fn(),
  showNotification: jest.fn(),
  validate: false,
  validateForm: false,
};

describe('Carbon Section', () => {
  it('should render label as accordion title', () => {
    renderWithIntl(<SectionWithIntl {...defaultProps} />);

    expect(screen.getByText('Patient History')).toBeInTheDocument();
  });

  it('should render accordion open when collapse is false', () => {
    renderWithIntl(<SectionWithIntl {...defaultProps} collapse={false} />);

    expect(document.querySelector('.cds--accordion__item')).toHaveClass('cds--accordion__item--active');
  });

  it('should render accordion closed when collapse is true', () => {
    renderWithIntl(<SectionWithIntl {...defaultProps} collapse />);

    expect(document.querySelector('.cds--accordion__item')).not.toHaveClass('cds--accordion__item--active');
  });

  it('should toggle open/close when heading is clicked', () => {
    renderWithIntl(<SectionWithIntl {...defaultProps} collapse={false} />);

    const heading = document.querySelector('.cds--accordion__heading');
    const item = document.querySelector('.cds--accordion__item');

    expect(item).toHaveClass('cds--accordion__item--active');
    fireEvent.click(heading);
    expect(item).not.toHaveClass('cds--accordion__item--active');
    fireEvent.click(heading);
    expect(item).toHaveClass('cds--accordion__item--active');
  });

  it('should apply disabled class to content when enabled is false', () => {
    renderWithIntl(<SectionWithIntl {...defaultProps} enabled={false} />);

    expect(document.querySelector('.obsGroup-controls')).toHaveClass('disabled');
  });

  it('should render translated label when translationKey is provided', () => {
    const translatedMetadata = {
      ...metadata,
      label: { type: 'label', translationKey: 'TEST_KEY', value: 'Fallback Label' },
    };

    renderWithIntl(<SectionWithIntl {...defaultProps} metadata={translatedMetadata} />);

    expect(screen.getByText('Patient History')).toBeInTheDocument();
    expect(screen.queryByText('Fallback Label')).not.toBeInTheDocument();
  });

  it('should update collapse state when collapse prop changes', () => {
    const { rerender } = renderWithIntl(<SectionWithIntl {...defaultProps} collapse={false} />);

    expect(document.querySelector('.cds--accordion__item')).toHaveClass('cds--accordion__item--active');

    rerender(
      <IntlProvider locale="en" messages={{ TEST_KEY: 'Patient History' }}>
        <SectionWithIntl {...defaultProps} collapse />
      </IntlProvider>
    );

    expect(document.querySelector('.cds--accordion__item')).not.toHaveClass('cds--accordion__item--active');
  });

  it('should render child controls inside accordion', () => {
    ComponentStore.registerComponent('obsControl', ObsControl);
    ComponentStore.registerComponent('numeric', NumericBox);

    const props = { ...defaultProps, children, metadata: metadataWithControls };
    renderWithIntl(<SectionWithIntl {...props} />);

    expect(screen.getByRole('spinbutton')).toBeInTheDocument();

    ComponentStore.deRegisterComponent('obsControl');
    ComponentStore.deRegisterComponent('numeric');
  });

  it('should have test-section-label class on section title', () => {
    renderWithIntl(<SectionWithIntl {...defaultProps} />);

    expect(document.querySelector('.test-section-label')).toBeInTheDocument();
  });

  it('should render AddMore control above accordion header when addMore is enabled', () => {
    const addMoreMetadata = {
      ...metadata,
      properties: { ...metadata.properties, addMore: true },
    };

    renderWithIntl(
      <SectionWithIntl
        {...defaultProps}
        metadata={addMoreMetadata}
        showAddMore
        showRemove={false}
      />
    );

    const fieldset = document.querySelector('.form-builder-fieldset');
    expect(fieldset.firstChild).toHaveClass('form-builder-clone');
    expect(fieldset.children[1]).toHaveClass('cds--accordion');
  });

  it('should pass prop collapse value to children regardless of internal toggle state', () => {
    const displayRowControlsSpy = jest
      .spyOn(controlsParser, 'displayRowControls')
      .mockImplementation(() => null);

    renderWithIntl(<SectionWithIntl {...defaultProps} collapse={true} />);

    // Click heading to open - internal state.collapse becomes false, prop stays true
    fireEvent.click(document.querySelector('.cds--accordion__heading'));

    expect(displayRowControlsSpy).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({ collapse: true })
    );

    displayRowControlsSpy.mockRestore();
  });
});
