import { createObsFromControl, Obs } from 'src/helpers/Obs';
import isEmpty from 'lodash/isEmpty';
import each from 'lodash/each';
import filter from 'lodash/filter';

import { List } from 'immutable';
import { createFormNamespaceAndPath } from 'src/helpers/formNamespace';


export class SectionMapper {
  getInitialObject(formName, formVersion, control, bahmniObservations) {
    let formNamespaceAndPath;
    let obsList = new List();
    each(control.controls, (item)=>{
      formNamespaceAndPath = createFormNamespaceAndPath(formName, formVersion, item.id);
      const { formFieldPath } = formNamespaceAndPath;
      const filteredObs = filter(bahmniObservations,
          (observation) => observation.formFieldPath === formFieldPath);

      if(!isEmpty(filteredObs)){
        obsList = obsList.push(new Obs(filteredObs[0]));
      }
    });
    
    return obsList;
  }

  setValue(obsList, obs) {
    const index = obsList.findIndex(o => o.formFieldPath === obs.formFieldPath);
    
    if (index === -1) {
      return obsList.push(obs);
    }

    return obsList.setIn([index], obs);
  }

  getObject(obsGroup) {
    return obsGroup.toJS();
  }
}
