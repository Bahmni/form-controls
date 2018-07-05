import { Container } from 'components/Container.jsx';
import React from 'react';
import ReactDOM from 'react-dom';

window.renderWithControls =
  function renderWithControls(formDetails, observations, nodeId,
                              collapse, patient, validateForm, locale, formTranslations) {
    const container = <Container
      metadata={formDetails}
      observations={observations}
      validate={true}
      validateForm={validateForm}
      collapse={collapse}
      patient={patient}
      locale={locale}
      translations={formTranslations} />;
    return ReactDOM.render(container, document.getElementById(nodeId));
  };

window.unMountForm = (container) => {
  if (container) return ReactDOM.unmountComponentAtNode(container);
  return false;
};
