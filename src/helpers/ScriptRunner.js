import FormContext from "./FormContext";

export default class ScriptRunner {

  constructor(formData) {
    this.formContext = new FormContext(formData);
  }

  execute(eventJs) {
    const form = this.formContext;
    if (eventJs) {
      const executiveJs = `(${eventJs})()`;
      eval(executiveJs);
    }
    return form.getData();
  }

};