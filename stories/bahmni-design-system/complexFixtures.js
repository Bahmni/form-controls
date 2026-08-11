export const carbonContainerCommonProps = {
  patient: { uuid: 'demo-patient-uuid' },
  translations: {},
  validate: false,
  validateForm: false,
  collapse: false,
  locale: 'en',
  onValueUpdated: () => {},
};

export const buildFormMetadata = (id, uuid, name, controls) => ({
  id,
  uuid,
  name,
  version: '1',
  controls,
});

export const buildColumnHeader = (id, value) => ({ id, type: 'label', value });
