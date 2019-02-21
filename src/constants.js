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

  messageType: {
    success: 'success',
    error: 'error',
  },

  errorMessage: {
    fileTypeNotSupported: 'File Type not supported',
  },

  toastTimeout: 4000,
};

export default Constants;
