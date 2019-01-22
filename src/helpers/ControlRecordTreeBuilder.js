import { Record, List } from 'immutable';
import MapperStore from 'src/helpers/MapperStore';
import constants from 'src/constants';
import isEmpty from 'lodash/isEmpty';
import ValueMapperStore from './ValueMapperStore';
import { isAnyAncestorOrControlHasAddMore,
    getCurrentFormFieldPathIfAddMore } from 'src/helpers/ControlUtil';
import { Obs } from './Obs';

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
  voided: false,
  getObject() {
    return this.mapper.getObject(this.obs);
  },

  getControlId() {
    return this.control && this.control.id;
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
  remove(formFieldPath) {
    function findIfNodeHasDataSourceWithValueInDatabase(parent) {
      if (parent.dataSource.uuid
        || (parent.dataSource.obsList &&
          parent.dataSource.obsList.find(o => o.uuid !== undefined))) return true;

      if (parent.children) {
        for (let i = 0; i < parent.children.size; i++) {
          if (findIfNodeHasDataSourceWithValueInDatabase(parent.children.get(i))) return true;
        }
      }
      return false;
    }
    if (this.children) {
      let updatedChildren = this.children.filter(child => child.formFieldPath !== formFieldPath);
      if (updatedChildren.size === this.children.size) {
        updatedChildren = this.children.map((child) => child.remove(formFieldPath));
      } else {
        const removedChild = this.children.find(child => child.formFieldPath === formFieldPath);
        if (findIfNodeHasDataSourceWithValueInDatabase(removedChild) && removedChild) {
          let voidedChildRecord = removedChild.set('active', false).set('voided', true)
            .voidChildRecords();
          if (voidedChildRecord.dataSource.obsList) {
            const newDataSource = voidedChildRecord.dataSource.set('obsList',
              voidedChildRecord.dataSource.obsList.map(o => o.set('voided', true)));
            voidedChildRecord = voidedChildRecord.set('dataSource', newDataSource);
          }
          updatedChildren = updatedChildren.insert(updatedChildren.size, voidedChildRecord);
        }
      }
      return this.set('children', updatedChildren);
    }
    return this;
  },

  update(formFieldPath, value, errors) {
    if (this.formFieldPath === formFieldPath) {
      return this
        .set('value', value)
        .set('errors', errors);
    }

    if (this.children) {
      const childRecord = this.children.map(
        r => r.update(formFieldPath, value, errors) || r
      );
      return this.set('children', childRecord);
    }
    return null;
  },

  voidChildRecords() {
    if (this.children) {
      const childRecord = this.children.map(record => record.voidChildRecords());
      return this.set('children', childRecord);
    }
    return this.set('errors', []).set('voided', true);
  },
  removeObsUuidsInDataSource() {
    if (this.dataSource && this.active) {
      let newRecord = this;
      if (this.dataSource.uuid) {
        const newDataSource = this.dataSource.set('uuid', undefined);
        newRecord = this.set('dataSource', newDataSource);
      }
      if (this.dataSource.obsList) {
        const newObsList = this.dataSource.obsList.map((ol) => ol.set('uuid', undefined)
        );
        const newDataSource = this.dataSource.set('obsList', newObsList);
        newRecord = this.set('dataSource', newDataSource);
      }
      if (this.children) {
        const newChildren = this.children.map(child => child.removeObsUuidsInDataSource());
        newRecord = newRecord.set('children', newChildren);
      }
      return newRecord;
    }
    return this;
  },
  getErrors() {
    const errorArray = [];
    const errors = this.get('errors');
    if (!errors) {
      return errorArray;
    }
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

  getRecords(controls, formName, formVersion, currentLayerObs, allObs, parentFormFieldPath) {
    let recordList = new List();
    controls.forEach(control => {
      const mapper = MapperStore.getMapper(control);
      const obsArray = mapper.getInitialObject(
        formName,
        formVersion,
        control,
        currentLayerObs,
        allObs,
        parentFormFieldPath
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
            allObs,
            isAnyAncestorOrControlHasAddMore(control, parentFormFieldPath) ? data.formFieldPath :
            getCurrentFormFieldPathIfAddMore(formName, formVersion, control, parentFormFieldPath)
          ),
        });

        recordList = recordList.push(record);
      });
    });
    return recordList;
  }

  parseObs(obs) {
    let newObs = new Obs({
      ...obs,
    });
    if (obs.groupMembers) {
      newObs = newObs.set('groupMembers',
        newObs.groupMembers.map(gm => this.parseObs(gm)));
    }
    return newObs;
  }

  build(metadata, observation) {
    const immutableObservations = observation.map((obs) => this.parseObs(obs));
    const records = this.getRecords(
      metadata.controls,
      metadata.name,
      metadata.version,
      immutableObservations,
      immutableObservations
    );
    return new ControlRecord({ children: records });
  }
}
