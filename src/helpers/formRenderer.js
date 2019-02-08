import { Container } from 'components/Container.jsx';
import React from 'react';
import ReactDOM from 'react-dom';

window.renderWithControls =
  function renderWithControls(formDetails, observations, nodeId,
                              collapse, patient, validateForm, locale, formTranslations) {
    const container = (<Container
      collapse={collapse}
      locale={locale}
      metadata={formDetails}
      observations={observations}
      patient={patient}
      translations={formTranslations}
      validate
      validateForm={validateForm}
    />);
    return ReactDOM.render(container, document.getElementById(nodeId));
  };

window.unMountForm = (container) => {
  if (container) return ReactDOM.unmountComponentAtNode(container);
  return false;
};
