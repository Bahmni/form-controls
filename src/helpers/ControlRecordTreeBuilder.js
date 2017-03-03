import { Record, List } from 'immutable';
import MapperStore from 'src/helpers/MapperStore';
import constants from 'src/constants';
import isEmpty from 'lodash/isEmpty';

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

  update(formFieldPath, value, errors) {
    if (this.formFieldPath === formFieldPath) {
      return this.set('value', value).set('errors', errors);
    }

    if (this.children) {
      const childRecord = this.children.map(r => r.update(formFieldPath, value, errors) || r);
      return this.set('children', childRecord);
    }
  },

  getErrors() {
    let errorArray = [];
    const errors = this.get('errors');
    if (errors && !isEmpty(errors.filter((err) => err.type === constants.errorTypes.error))) {
      errorArray.push(errors);
    }

    if (this.children) {
      return errorArray.concat(...this.children.map(r => r.getErrors()));
    }

    return errorArray;
  }

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
}