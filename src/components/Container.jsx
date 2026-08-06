import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import ControlRecordTreeBuilder from 'src/helpers/ControlRecordTreeBuilder';
import ControlRecordTreeMgr from 'src/helpers/ControlRecordTreeMgr';
import ScriptRunner from 'src/helpers/scriptRunner';
import { IntlProvider } from 'react-intl';
import { displayRowControls, getGroupedControls } from '../helpers/controlsParser';
import addMoreDecorator from './AddMoreDecorator';
import ObservationMapper from '../helpers/ObservationMapper';
import NotificationContainer from '../helpers/Notification';
import Constants from '../constants';
import { executeEventsFromCurrentRecord } from '../helpers/ExecuteEvents';
import { deepUnescapeStrings } from '../helpers/encodingUtils';
import { getObservationsFromFhir } from 'src/helpers/FhirObservationTransformer';
import { buildFhirObservationTransactionBundle, buildFhirObservationCollection } from 'src/helpers/FhirBundleBuilder';
import { hasObservationChanges } from 'src/helpers/ObservationComparator';
import { FormValidationError } from 'src/helpers/FormValidationError';

const deriveObservations = (props) =>
  props.fhirObservations ? getObservationsFromFhir(props.fhirObservations) : props.observations;

export class Container extends addMoreDecorator(Component) {
  constructor(props) {
    super(props);
    this.childControls = {};
    const observations = deriveObservations(this.props);
    this.initialObservations = observations;
    this.metadata = deepUnescapeStrings(this.props.metadata);
    const controlRecordTree = new ControlRecordTreeBuilder().build(this.metadata, observations);
    this.updatedControlRecordTree = controlRecordTree;
    const formTranslations = this.getDecodedTranslations(props.translations);
    this.state = { errors: [], data: controlRecordTree,
      collapse: props.collapse, notification: {}, formTranslations };
    this.storeChildRef = this.storeChildRef.bind(this);
    this.onValueChanged = this.onValueChanged.bind(this);
    this.onControlAdd = this.onControlAdd.bind(this);
    this.onControlRemove = this.onControlRemove.bind(this);
    this.onEventTrigger = this.onEventTrigger.bind(this);
    this.showNotification = this.showNotification.bind(this);
    this.clearNotification = this.clearNotification.bind(this);

    const initScript = this.metadata.events && this.metadata.events.onFormInit;
    let updatedTree;
    try {
      if (initScript) {
        updatedTree = new ScriptRunner(this.state.data, this.props.patient).execute(initScript);
      }
      updatedTree = updatedTree || this.state.data;
      updatedTree = executeEventsFromCurrentRecord(updatedTree, updatedTree, this.props.patient);
    } catch (error) {
      console.error('Error executing form init script:', error);
    }
    if (updatedTree) {
      this.state.data = updatedTree;
    }
  }

  getDecodedTranslations(translations) {
    const rawTranslations = Object.fromEntries(
      Object.entries({ ...translations.labels, ...translations.concepts })
        .filter(([key, value]) => value !== key)
    );
    return deepUnescapeStrings(rawTranslations);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.collapse !== this.props.collapse) {
      this.setState({ collapse: this.props.collapse });
    }
    if (prevProps.metadata !== this.props.metadata) {
      const prevId = prevProps.metadata?.uuid;
      const prevVersion = prevProps.metadata?.version;
      const nextId = this.props.metadata?.uuid;
      const nextVersion = this.props.metadata?.version;
      this.metadata = deepUnescapeStrings(this.props.metadata);
      if (prevId !== nextId || prevVersion !== nextVersion) {
        const observations = deriveObservations(this.props);
        this.initialObservations = observations;
        const tree = new ControlRecordTreeBuilder().build(this.metadata, observations);
        this.updatedControlRecordTree = tree;
        this.setState({ data: tree });
      }
    }
    if (prevProps.translations !== this.props.translations) {
      const formTranslations = this.getDecodedTranslations(this.props.translations);
      this.setState({ formTranslations });
    }
  }

  onEventTrigger(sender, eventName) {
    const eventScripts = ControlRecordTreeMgr.find(this.state.data, sender).getEventScripts();
    const script = eventScripts && eventScripts[eventName];
    if (script) {
      const parentRecordTree = new ControlRecordTreeMgr().findParentTree(this.state.data, sender);
      const updatedTree = new ScriptRunner(this.state.data, this.props.patient, parentRecordTree)
            .execute(script);
      this.setState({
        data: updatedTree,
      });
    }
  }

  onValueChanged(formFieldPath, value, errors, onActionDone) {
    this.setState((previousState) => ({
        ...previousState,
        data: previousState.data.update(formFieldPath, value, errors),
        collapse: undefined,
    }), () => {
        if (onActionDone) {
          onActionDone();
        }
        this.onValueUpdated();
    });
  }

  onValueUpdated() {
    const onValueUpdatedFn = this.props.onValueUpdated || null;
    if (onValueUpdatedFn) {
      this.props.onValueUpdated(this.state.data);
    }
    if (this.props.setIsFormUpdated) {
      const changed = hasObservationChanges(this.getValue().observations, this.initialObservations);
      if (changed !== this.lastHasChanges) {
        this.lastHasChanges = changed;
        this.props.setIsFormUpdated(changed);
      }
    }
  }


  getAddMoreMessage(rootTree, formFieldPath) {
    const targetRecordTree = ControlRecordTreeMgr.find(rootTree, formFieldPath);
    const name = targetRecordTree.getConceptName() || targetRecordTree.control.label.value;
    const type = targetRecordTree.getConceptType();
    return (`A new ${name} ${type} has been added`);
  }

  canAddNextFormFieldPath(controlRecordTree, formFieldPath) {
    const latestBrotherTree = new ControlRecordTreeMgr()
      .getLatestBrotherTree(controlRecordTree, formFieldPath);
    const latestFormFieldPath = latestBrotherTree ? latestBrotherTree.formFieldPath : '';
    return formFieldPath === latestFormFieldPath;
  }

  onControlAdd(formFieldPath, isNotificationShown = true) {
    if (!isNotificationShown && !this.canAddNextFormFieldPath(
      this.updatedControlRecordTree, formFieldPath)) {
      return;
    }
    let updatedRecordTree = ControlRecordTreeMgr.add(
        isNotificationShown ? this.state.data : this.updatedControlRecordTree, formFieldPath);
    const parentRecordTree = new ControlRecordTreeMgr()
            .findParentTree(updatedRecordTree, formFieldPath);
    updatedRecordTree = executeEventsFromCurrentRecord(parentRecordTree, updatedRecordTree);
    if (isNotificationShown) {
      const addMoreMessage = this.getAddMoreMessage(this.state.data, formFieldPath);
      this.updatedControlRecordTree = updatedRecordTree;
      this.setState({
        data: updatedRecordTree,
        notification: { message: addMoreMessage, type: Constants.messageType.success },
      });
    } else {
      this.updatedControlRecordTree = updatedRecordTree;
      this.setState({
        data: updatedRecordTree,
      });
    }

    this.hideNotification();
  }

  onControlRemove(formFieldPath) {
    this.setState((previousState) => (
      {
      ...previousState,
      data: previousState.data.remove(formFieldPath),
      collapse: undefined,
      }
    ));
  }

  getValue() {
    const records = this.state.data;
    const observations = (new ObservationMapper()).from(records);
    const errors = records.getErrors();

    if (!isEmpty(errors) && this.props.validateForm) {
      return { errors, observations };
    }

    if (isEmpty(observations) || this.areAllVoided(observations) || isEmpty(errors)) {
      return { observations };
    }
    return { errors, observations };
  }

  getCurrentObservationBundle(options) {
    const { observations } = this.getValue();
    return buildFhirObservationCollection(observations, options);
  }

  runFormSaveEvent() {
    const saveScript = this.metadata.events && this.metadata.events.onFormSave;
    if (!saveScript) return this.state.data;
    try {
      const updatedTree = new ScriptRunner(this.state.data, this.props.patient).execute(saveScript);
      this.setState({ data: updatedTree });
      return updatedTree;
    } catch (scriptError) {
      throw FormValidationError.fromScriptError(scriptError);
    }
  }

  getObservationBundleForSave(options) {
    const tree = this.runFormSaveEvent();
    const observations = (new ObservationMapper()).from(tree);
    const rawErrors = tree.getErrors();
    if (!isEmpty(rawErrors)) {
      throw FormValidationError.fromFieldErrors(rawErrors);
    }
    return buildFhirObservationTransactionBundle(observations, this.initialObservations, options);
  }

  // deprecated
  storeChildRef(ref) {
    if (ref) this.childControls[ref.props.id] = ref;
  }

  areAllVoided(observations) {
    return observations.every((obs) => obs.voided);
  }

  showNotification(message, notificationType) {
    this.setState({ notification: { message, type: notificationType } });
    this.hideNotification();
  }

  hideNotification() {
    setTimeout(() => {
      this.setState({ notification: {} });
    }, Constants.toastTimeout);
  }

  clearNotification() {
    this.setState({ notification: {} });
  }

  render() {
    const { controls, name: formName, version: formVersion } = this.metadata;
    const { validate, patient, readonly } = this.props;
    const formTranslations = this.state.formTranslations;
    const patientUuid = patient ? patient.uuid : undefined;
    const childProps = {
      collapse: this.state.collapse,
      errors: this.state.errors,
      formName,
      formVersion,
      ref: this.storeChildRef,
      onEventTrigger: this.onEventTrigger,
      onValueChanged: this.onValueChanged,
      onControlAdd: this.onControlAdd,
      onControlRemove: this.onControlRemove,
      patientUuid,
      showNotification: this.showNotification,
      validate,
      validateForm: this.props.validateForm,
      enabled: !readonly,
      componentStore: this.props.componentStore,
    };
    const groupedRowControls = getGroupedControls(controls, 'row');
    const records = this.state.data.getActive().children.toArray();
    return (
      <IntlProvider locale="en" messages={formTranslations}>
        <div>
          <NotificationContainer
            notification={this.state.notification}
            onClose={this.clearNotification}
          />
          {displayRowControls(groupedRowControls, records, childProps)}
        </div>
      </IntlProvider>
    );
  }
}

Container.propTypes = {
  collapse: PropTypes.bool.isRequired,
  fhirObservations: PropTypes.array,
  locale: PropTypes.string,
  metadata: PropTypes.shape({
    controls: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
      })).isRequired,
    id: PropTypes.number.isRequired,
    uuid: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    version: PropTypes.string.isRequired,
  }),
  observations: (props, propName, componentName) => {
    if (props.fhirObservations || Array.isArray(props[propName])) return null;
    return new Error(
      `${componentName}: either \`observations\` or \`fhirObservations\` must be provided as an array.`
    );
  },
  onValueUpdated: PropTypes.func,
  patient: PropTypes.object.isRequired,
  readonly: PropTypes.bool,
  setIsFormUpdated: PropTypes.func,
  translations: PropTypes.object.isRequired,
  validate: PropTypes.bool.isRequired,
  validateForm: PropTypes.bool.isRequired,
};
