import { Record, List } from 'immutable';
import MapperStore from 'src/helpers/MapperStore';

export const ControlRecord = new Record({
  control: undefined,
  formFieldPath: '',
  children: undefined,
  obs: undefined,
  mapper: undefined,
  active: true,
  showAddMore: false,
  showRemove: false,
  errors: [],
});

export default class ControlRecordTreeBuilder {

  getRecords(controls, formName, formVersion, bahmniObservations) {
    let recordList = new List();
    controls.forEach(control => {
      const mapper = MapperStore.getMapper(control);
      const obsArray = mapper.getInitialObject(formName, formVersion, control, bahmniObservations);
      obsArray.forEach(obs => {
        const record = new ControlRecord({
          formFieldPath: obs.formFieldPath,
          obs,
          mapper,
          control,
          enabled: false,
          showAddMore: true,
          children: control.controls && this.getRecords(control.controls, formName, formVersion, bahmniObservations),
        });
        recordList = recordList.push(record);
      });
    });
    return recordList;
  }

  build(metadata, observation) {
    const records = this.getRecords(metadata.controls, metadata.name, metadata.version, observation);
    return new ControlRecord({children: records});
  }

}