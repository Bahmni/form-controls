export const NUMBER = 'number';
export const STRING = 'string';
export const BOOLEAN = 'boolean';
export const OBJECT = 'object';

const Constants = {
  Grid: {
    defaultRowWidth: 1,
    minColumns: 1,
    minRows: 4,
  },
  validations: {
    mandatory: 'mandatory',
    allowDecimal: 'allowDecimal',
    allowRange: 'allowRange',
    minMaxRange: 'minMaxRange',
    allowFutureDates: 'allowFutureDates',
    dateTimeError: 'dateTimeError',
  },
  errorTypes: {
    warning: 'warning',
    error: 'error',
  },
  bahmni: 'Bahmni',
  NUMBER,
  STRING,
  BOOLEAN,
  OBJECT,

  messageType: {
    success: 'success',
    error: 'error',
  },

  errorMessage: {
    fileTypeNotSupported: 'File Type not supported',
    uploadFailed: 'File size exceeds 5MB. Please upload a smaller file.',
  },

  dataTypes: {
    date: "Date", dateTime: "Datetime"
  },

  toastTimeout: 4000,
};

export default Constants;
