export class FormValidationError extends Error {
  constructor(errors) {
    super('Form has validation errors');
    this.name = 'FormValidationError';
    this.errors = errors;
  }

  static fromFieldErrors(rawErrors) {
    return new FormValidationError(
      rawErrors.flat().map((err) => ({ type: err.type, message: err.message, source: 'field' }))
    );
  }

  static fromScriptError(scriptError) {
    return new FormValidationError([{
      type: 'error',
      message: scriptError instanceof Error ? scriptError.message : String(scriptError),
      source: 'script',
    }]);
  }
}

export default FormValidationError;
