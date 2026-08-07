// Shared mock data for the Atomic Controls/Bahmni Design System stories.
//
// `codedConceptAnswers` is reused, unmodified, across DropDown, AutoComplete,
// FreeTextAutoComplete and RadioButton — all four render the same "coded
// observation" shape (an option object carrying uuid/name/display/value/
// translationKey), so a single shared list avoids five near-identical copies.
// Each field is filled in because each component reads a different key:
// DropDown reads `name`, AutoComplete reads `display` (its default labelKey),
// FreeTextAutoComplete falls back to `name`, and RadioButton reads `value`
// (via its default valueKey) plus `name` (via its default nameKey).
//
// BooleanControl is intentionally NOT given this shape: it always renders
// exactly two SelectableTags with a fixed name/value/translationKey shape
// (a real boolean, not a coded uuid), so its own small options array lives
// here separately rather than being forced into the coded-answer shape.
export const codedConceptAnswers = [
  { uuid: 'malaria-uuid', name: 'Malaria', display: 'Malaria', value: 'malaria-uuid', translationKey: 'MALARIA' },
  { uuid: 'typhoid-uuid', name: 'Typhoid', display: 'Typhoid', value: 'typhoid-uuid', translationKey: 'TYPHOID' },
  { uuid: 'dengue-uuid', name: 'Dengue', display: 'Dengue', value: 'dengue-uuid', translationKey: 'DENGUE' },
  { uuid: 'cholera-uuid', name: 'Cholera', display: 'Cholera', value: 'cholera-uuid', translationKey: 'CHOLERA' },
  { uuid: 'tuberculosis-uuid', name: 'Tuberculosis', display: 'Tuberculosis', value: 'tuberculosis-uuid', translationKey: 'TUBERCULOSIS' },
];

export const booleanYesNoOptions = [
  { name: 'Yes', value: true, translationKey: '' },
  { name: 'No', value: false, translationKey: '' },
];

// HTTP mock payloads for Location/Provider, which fetch their option list
// from the OpenMRS REST API on mount.
export const mockLocations = [
  { id: 101, name: 'General Ward', uuid: 'loc-uuid-101' },
  { id: 102, name: 'Emergency', uuid: 'loc-uuid-102' },
  { id: 103, name: 'Outpatient Clinic', uuid: 'loc-uuid-103' },
  { id: 104, name: 'ICU', uuid: 'loc-uuid-104' },
  { id: 105, name: 'Maternity Ward', uuid: 'loc-uuid-105' },
];

export const mockProviders = [
  { id: 201, name: 'Dr. John Smith', uuid: 'prov-uuid-201' },
  { id: 202, name: 'Dr. Aisha Patel', uuid: 'prov-uuid-202' },
  { id: 203, name: 'Dr. Carlos Rivera', uuid: 'prov-uuid-203' },
  { id: 204, name: 'Nurse Mary Johnson', uuid: 'prov-uuid-204' },
  { id: 205, name: 'Dr. Fatima Al-Hassan', uuid: 'prov-uuid-205' },
];
