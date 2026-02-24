/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import { Container } from 'components/Container.jsx';
import React from 'react';
import ReactDOM from 'react-dom';
import ControlRecordTreeBuilder from 'src/helpers/ControlRecordTreeBuilder';
import ObservationMapper from 'src/helpers/ObservationMapper';
import ScriptRunner from 'src/helpers/scriptRunner';

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
