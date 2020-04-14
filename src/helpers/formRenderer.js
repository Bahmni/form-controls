import { Container } from 'components/Container.jsx';
import React from 'react';
import ReactDOM from 'react-dom';
import ControlRecordTreeBuilder from 'src/helpers/ControlRecordTreeBuilder';
import ScriptRunner from './ScriptRunner';
import ObservationMapper from 'src/helpers/ObservationMapper';

window.renderWithControls =
  function renderWithControls(formDetails, observations, nodeId,
                              collapse, patient, validateForm, locale, formTranslations) {
    const container = React.createElement(Container,
      { metadata: formDetails, observations, validate: true,
        validateForm, collapse, patient, locale, translations: formTranslations });
    return ReactDOM.render(container, document.getElementById(nodeId));
  };

window.unMountForm = (container) => {
  if (container) return ReactDOM.unmountComponentAtNode(container);
  return false;
};

window.getRecordTree = (formDef, observations) =>
    new ControlRecordTreeBuilder().build(formDef, observations);

window.runEventScript = (formData, eventScript, patient) => new ScriptRunner(formData, patient)
      .execute(eventScript);

window.getObservations = (records) => (new ObservationMapper()).from(records);
