import { Record, List } from 'immutable';
import MapperStore from 'src/helpers/MapperStore';
import constants from 'src/constants';
import isEmpty from 'lodash/isEmpty';
import ValueMapperStore from './ValueMapperStore';

export const ControlRecord = new Record({
  valueMapper: undefined,
  control: undefined,
  formFieldPath: '',
  children: undefined,
  value: {},
  active: true,
  enabled: true,
  hidden: false,
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
    return this.control && this.control.concept && this.control.concept.name;
  },

  getConceptType() {
    return this.control && this.control.type;
  },

  getLabelName() {
    return this.control && (this.control.value || this.control.label.value);
  },

  setValue(value) {
    if (this.valueMapper) {
      return this.valueMapper.setValue(this.control, value);
    }
    return value;
  },

  getValue() {
    const value = this.value.value;
    if (this.valueMapper) {
      return this.valueMapper.getValue(this.control, value);
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
    const filteredErrors = errors.filter((err) => err.type === constants.errorTypes.error);
    const filteredMandatoryErrors =
      filteredErrors.filter((err) => err.message !== constants.validations.mandatory ||
    err.message === constants.validations.mandatory && this.enabled && !this.hidden);
    if (errors && !isEmpty(filteredMandatoryErrors)) {
      errorArray.push(filteredMandatoryErrors);
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
          valueMapper: ValueMapperStore.getMapper(control),
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
