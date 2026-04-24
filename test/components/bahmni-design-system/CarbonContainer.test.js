import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CarbonContainer } from 'components/bahmni-design-system/CarbonContainer';
import { NumericBox } from 'components/NumericBox.jsx';
import { Label } from 'components/Label.jsx';
import { ObsControlWithIntl as ObsControl } from 'components/ObsControl.jsx';
import { ObsGroupControlWithIntl as ObsGroupControl } from 'components/ObsGroupControl.jsx';
import ComponentStore from 'src/helpers/componentStore';

const obsGroupMetadata = {
  controls: [{
    concept: { datatype: 'N/A', name: 'Vitals', set: true, setMembers: [], uuid: 'vitals-uuid' },
    controls: [],
    id: '1',
    label: { type: 'label', value: 'Vitals' },
    properties: { location: { column: 0, row: 0 } },
    type: 'obsGroupControl',
  }],
  id: 3, name: 'ObsGroupForm', uuid: 'form-uuid-3', version: '1', defaultLocale: 'en',
};

const sectionMetadata = {
  controls: [{
    controls: [],
    id: '1',
    label: { type: 'label', value: 'Patient History' },
    properties: { location: { column: 0, row: 0 } },
    type: 'section',
  }],
  id: 4, name: 'SectionForm', uuid: 'form-uuid-4', version: '1', defaultLocale: 'en',
};

const defaultProps = {
  collapse: false,
  locale: 'en',
  observations: [],
  patient: { age: 10, gender: 'M', uuid: 'patient-uuid' },
  translations: { labels: {}, concepts: {} },
  validate: false,
  validateForm: false,
};

const textMetadata = {
  controls: [{
    concept: { answers: [], datatype: 'Text', description: [], name: 'Notes',
      properties: { allowDecimal: null }, uuid: 'text-uuid' },
    id: '1', label: { type: 'label', value: 'Notes' },
    properties: { addMore: false, hideLabel: false, location: { column: 0, row: 0 },
      mandatory: false, notes: false },
    type: 'obsControl', hiAbsolute: null, hiNormal: null, lowAbsolute: null, lowNormal: null,
  }],
  id: 1, name: 'TextForm', uuid: 'form-uuid-1', version: '1', defaultLocale: 'en',
};

const numericMetadata = {
  controls: [{
    concept: { answers: [], datatype: 'Numeric', description: [], name: 'Pulse',
      properties: { allowDecimal: true }, uuid: 'pulse-uuid' },
    id: '1', label: { type: 'label', value: 'Pulse' },
    properties: { addMore: false, hideLabel: false, location: { column: 0, row: 0 },
      mandatory: false, notes: false },
    type: 'obsControl', hiAbsolute: null, hiNormal: null, lowAbsolute: null, lowNormal: null,
  }],
  id: 2, name: 'NumericForm', uuid: 'form-uuid-2', version: '1', defaultLocale: 'en',
};

describe('CarbonContainer', () => {
  beforeEach(() => {
    ComponentStore.registerComponent('label', Label);
    ComponentStore.registerComponent('numeric', NumericBox);
    ComponentStore.registerComponent('obsControl', ObsControl);
    ComponentStore.registerComponent('obsGroupControl', ObsGroupControl);
  });

  afterEach(() => {
    ComponentStore.deRegisterComponent('label');
    ComponentStore.deRegisterComponent('numeric');
    ComponentStore.deRegisterComponent('obsControl');
    ComponentStore.deRegisterComponent('obsGroupControl');
  });

  it('should render Carbon TextArea for text-type controls', () => {
    render(<CarbonContainer {...defaultProps} metadata={textMetadata} />);
    expect(screen.getByRole('textbox')).toHaveClass('cds--text-area');
  });

  it('should fall back to global ComponentStore for non-Carbon types', () => {
    render(<CarbonContainer {...defaultProps} metadata={numericMetadata} />);
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
  });

  it('should render Carbon Accordion for obsGroupControl type', () => {
    render(<CarbonContainer {...defaultProps} metadata={obsGroupMetadata} />);
    expect(document.querySelector('.cds--accordion')).toBeInTheDocument();
  });

  it('should render obsGroupControl label as accordion title', () => {
    render(<CarbonContainer {...defaultProps} metadata={obsGroupMetadata} />);
    expect(screen.getByText('Vitals')).toBeInTheDocument();
  });

  it('should render obsGroupControl open when collapse is false', () => {
    render(<CarbonContainer {...defaultProps} metadata={obsGroupMetadata} collapse={false} />);
    expect(document.querySelector('.cds--accordion__item')).toHaveClass('cds--accordion__item--active');
  });

  it('should render obsGroupControl closed when collapse is true', () => {
    render(<CarbonContainer {...defaultProps} metadata={obsGroupMetadata} collapse />);
    expect(document.querySelector('.cds--accordion__item')).not.toHaveClass('cds--accordion__item--active');
  });

  it('should render Carbon Accordion for section type', () => {
    render(<CarbonContainer {...defaultProps} metadata={sectionMetadata} />);
    expect(document.querySelector('.cds--accordion')).toBeInTheDocument();
  });

  it('should render section label as accordion title', () => {
    render(<CarbonContainer {...defaultProps} metadata={sectionMetadata} />);
    expect(screen.getByText('Patient History')).toBeInTheDocument();
  });

  it('should render section open when collapse is false', () => {
    render(<CarbonContainer {...defaultProps} metadata={sectionMetadata} collapse={false} />);
    expect(document.querySelector('.cds--accordion__item')).toHaveClass('cds--accordion__item--active');
  });

  it('should render section closed when collapse is true', () => {
    render(<CarbonContainer {...defaultProps} metadata={sectionMetadata} collapse />);
    expect(document.querySelector('.cds--accordion__item')).not.toHaveClass('cds--accordion__item--active');
  });

  it('should forward ref to the underlying Container', () => {
    const ref = React.createRef();
    render(<CarbonContainer ref={ref} {...defaultProps} metadata={textMetadata} />);
    expect(ref.current).toBeTruthy();
    expect(typeof ref.current.getValue).toBe('function');
  });
});
