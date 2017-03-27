import FormContext from './FormContext';

export default class ScriptRunner {

  constructor(formRecords) {
    this.formContext = new FormContext(formRecords);
  }

  execute(eventJs) {
    const form = this.formContext;
    if (eventJs) {
      const executiveJs = `(${eventJs})()`;
      /* eslint-disable */
      eval(executiveJs);
    }
    return form.getRecords();
  }

}
