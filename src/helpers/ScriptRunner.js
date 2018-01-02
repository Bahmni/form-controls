import FormContext from './FormContext';

export default class ScriptRunner {

  constructor(formRecords, patient) {
    this.formContext = new FormContext(formRecords, patient);
  }

  execute(eventJs) {
    const formContext = this.formContext;
    if (eventJs) {
      const executiveJs = `(${eventJs})(formContext)`;
      /* eslint-disable */
      eval(executiveJs);
    }
    return formContext.getRecords();
  }

}
