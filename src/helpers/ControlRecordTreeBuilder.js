import { Record, List } from 'immutable';
import MapperStore from 'src/helpers/MapperStore';
import constants from 'src/constants';
import isEmpty from 'lodash/isEmpty';

export const ControlRecord = new Record({
  control: undefined,
  formFieldPath: '',
  children: undefined,
  value: {},
  active: true,
  enabled: true,
  showAddMore: false,
  showRemove: false,
  errors: [],
  dataSource: undefined,
  getObject() {
    return this.mapper.getObject(this.obs);
  },

  getEventScripts() {
    return this.control && this.control.events;
  },

  getConceptName() {
    return this.control && this.control.concept.name;
  },

  getValue() {
    const value = this.value.value;
    if (value !== undefined && this.control && this.control.options) {
      const [concept] = this.control.options.filter(opt => opt.value === value);
      if (concept) {
        return concept.name;
      }
    }
    return value;
  },

  update(formFieldPath, value, errors, isRemoved) {
    if (this.formFieldPath === formFieldPath) {
      return (Object.keys(value).length === 0 && isRemoved ? this.set('active', false) : this)
        .set('value', value)
        .set('errors', errors);
    }

    if (this.children) {
      const childRecord = this.children.map(
        r => r.update(formFieldPath, value, errors, isRemoved) || r
      );
      return this.set('children', childRecord);
    }
    return null;
  },

  getErrors() {
    const errorArray = [];
    const errors = this.get('errors');
    if (errors && !isEmpty(errors.filter((err) => err.type === constants.errorTypes.error))) {
      errorArray.push(errors);
    }

    if (this.children) {
      return errorArray.concat(...this.children.map(r => r.getErrors()));
    }

    return errorArray;
  },

  getActive() {
    if (this.active) {
      if (this.children) {
        const activeRecords = this.set('children', this.children.filter(r => r.active));

        const updatedActiveChildren = activeRecords.children.map(child => {
          if (child.children) {
            return child.getActive();
          }
          return child;
        });
        return activeRecords.set('children', updatedActiveChildren);
      }
      return this;
    }
    return null;
  },
});

export default class ControlRecordTreeBuilder {

  getRecords(controls, formName, formVersion, currentLayerObs, allObs) {
    let recordList = new List();

    controls.forEach(control => {
      const mapper = MapperStore.getMapper(control);

      const obsArray = mapper.getInitialObject(
        formName,
        formVersion,
        control,
        currentLayerObs,
        allObs
      );
      obsArray.forEach(data => {
        const record = new ControlRecord({
          active: !data.inactive,
          formFieldPath: data.formFieldPath,
          value: mapper.getValue(data),
          dataSource: data,
          control,
          showAddMore: true,
          children: control.controls &&
          this.getRecords(
            control.controls,
            formName,
            formVersion,
            mapper.getChildren(data),
            allObs
          ),
        });

        recordList = recordList.push(record);
      });
    });
    return recordList;
  }

  build(metadata, observation) {
    const records = this.getRecords(
      metadata.controls,
      metadata.name,
      metadata.version,
      observation,
      observation
    );
    return new ControlRecord({ children: records });
  }
}
