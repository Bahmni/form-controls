import { Record, List } from 'immutable';
import MapperStore from 'src/helpers/MapperStore';

export const ControlRecord = new Record({
  control: undefined,
  formFieldPath: '',
  children: undefined,
  value: undefined,
  mapper: undefined,
  active: true,
  showAddMore: false,
  showRemove: false,
  errors: [],
  dataSource: undefined,
  getObject() {
    return this.mapper.getObject(this.obs);
  },
});

export default class ControlRecordTreeBuilder {

  getRecords(controls, formName, formVersion, bahmniObservations) {
    let recordList = new List();
    controls.forEach(control => {
      const mapper = MapperStore.getMapper(control);

      const obsArray = mapper.getInitialObject(formName, formVersion, control, bahmniObservations);
      obsArray.forEach(data => {
        const record = new ControlRecord({
          formFieldPath: data.formFieldPath,
          value: mapper.getValue(data),
          dataSource: data,
          control,
          enabled: false,
          showAddMore: true,
          children: control.controls && this.getRecords(control.controls, formName, formVersion, mapper.getChildren(data)),
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

  static update(recordTree, formFieldPath, value, errors) {
    const children = recordTree.children.map(r => {
      if (r.formFieldPath === formFieldPath) {
        return r.set('value', value).set('errors', errors);
      }
      return r.children ? ControlRecordTreeBuilder.update(r, formFieldPath, value) : r;
    });
    return recordTree.set('children', children);
  }
}