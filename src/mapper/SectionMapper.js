import { Obs } from 'src/helpers/Obs';
import isEmpty from 'lodash/isEmpty';
import each from 'lodash/each';
import filter from 'lodash/filter';
import { ObsList } from 'src/helpers/ObsList';
import { List } from 'immutable';
import { createFormNamespaceAndPath } from 'src/helpers/formNamespace';


export class SectionMapper {
  getInitialObject(formName, formVersion, control, bahmniObservations) {
    let formNamespaceAndPath;
    let obsList = new List();
    each(control.controls, (item) => {
      formNamespaceAndPath = createFormNamespaceAndPath(formName, formVersion, item.id);
      const { formFieldPath } = formNamespaceAndPath;
      const filteredObs = filter(bahmniObservations,
          (observation) => observation.formFieldPath === formFieldPath);

      if (!isEmpty(filteredObs)) {
        obsList = obsList.push(new Obs(filteredObs[0]));
      }
    });

    const { formFieldPath } = createFormNamespaceAndPath(formName, formVersion, control.id);
    return new ObsList({ obsList, formFieldPath });
  }

  setValue(obsListRecord, obs) {
    let obsList = obsListRecord.getObsList();
    const index = obsList.findIndex(o => o.formFieldPath === obs.formFieldPath);

    if (index === -1) {
      obsList = obsList.push(obs);
    }

    obsList = obsList.setIn([index], obs);

    return obsListRecord.setObsList(obsList);
  }

  getObject(obsListRecord) {
    const observations = [];
    obsListRecord.getObsList().forEach((obs) => {
      observations.push(obs.getObject(obs));
    });

    return [].concat(...observations);
  }
}
