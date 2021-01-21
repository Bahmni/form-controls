import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { displayRowControls, getGroupedControls } from '../helpers/controlsParser';
import isEmpty from 'lodash/isEmpty';
import ControlRecordTreeBuilder from 'src/helpers/ControlRecordTreeBuilder';
import ControlRecordTreeMgr from 'src/helpers/ControlRecordTreeMgr';
import ScriptRunner from 'src/helpers/scriptRunner';
import addMoreDecorator from './AddMoreDecorator';
import ObservationMapper from '../helpers/ObservationMapper';
import NotificationContainer from '../helpers/Notification';
import Constants from '../constants';
import { IntlProvider } from 'react-intl';
import { executeEventsFromCurrentRecord } from '../helpers/ExecuteEvents';

export class Container extends addMoreDecorator(Component) {
  constructor(props) {
    super(props);
    this.childControls = {};
    const { observations, metadata } = this.props;
    const controlRecordTree = new ControlRecordTreeBuilder().build(metadata, observations);
    this.state = { errors: [], data: controlRecordTree,
      collapse: props.collapse, notification: {} };
    this.storeChildRef = this.storeChildRef.bind(this);
    this.onValueChanged = this.onValueChanged.bind(this);
    this.onControlAdd = this.onControlAdd.bind(this);
    this.onControlRemove = this.onControlRemove.bind(this);
    this.onEventTrigger = this.onEventTrigger.bind(this);
    this.showNotification = this.showNotification.bind(this);
  }

  componentWillMount() {
    const initScript = this.props.metadata.events && this.props.metadata.events.onFormInit;
    let updatedTree;
    if (initScript) {
      updatedTree = new ScriptRunner(this.state.data, this.props.patient).execute(initScript);
      this.setState({ data: updatedTree });
    }
    updatedTree = updatedTree || this.state.data;
    updatedTree = executeEventsFromCurrentRecord(updatedTree, updatedTree, this.props.patient);
    this.setState({
      data: updatedTree,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ collapse: nextProps.collapse });
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
  }


  getAddMoreMessage(rootTree, formFieldPath) {
    const targetRecordTree = ControlRecordTreeMgr.find(rootTree, formFieldPath);
    const name = targetRecordTree.getConceptName() || targetRecordTree.control.label.value;
    const type = targetRecordTree.getConceptType();
    return (`A new ${name} ${type} has been added`);
  }

  onControlAdd(formFieldPath, isNotificationShown = true) {
    let updatedRecordTree = ControlRecordTreeMgr.add(this.state.data, formFieldPath);
    const parentRecordTree = new ControlRecordTreeMgr()
            .findParentTree(updatedRecordTree, formFieldPath);
    updatedRecordTree = executeEventsFromCurrentRecord(parentRecordTree, updatedRecordTree);
    const addMoreMessage = this.getAddMoreMessage(this.state.data, formFieldPath);
    if (isNotificationShown) {
      this.setState({
        data: updatedRecordTree,
        notification: { message: addMoreMessage, type: Constants.messageType.success },
      });
    } else {
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

  render() {
    const { metadata: { controls,
      name: formName, version: formVersion }, validate, translations, patient } = this.props;
    const formTranslations = { ...translations.labels, ...translations.concepts };
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
    };
    const groupedRowControls = getGroupedControls(controls, 'row');
    const records = this.state.data.getActive().children.toArray();
    return (
      <IntlProvider locale="en" messages={formTranslations}>
        <div>
          <NotificationContainer
            notification={this.state.notification}
          />
          {displayRowControls(groupedRowControls, records, childProps)}
        </div>
      </IntlProvider>
    );
  }
}

Container.propTypes = {
  collapse: PropTypes.bool.isRequired,
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
  observations: PropTypes.array.isRequired,
  onValueUpdated: PropTypes.func,
  patient: PropTypes.object.isRequired,
  translations: PropTypes.object.isRequired,
  validate: PropTypes.bool.isRequired,
  validateForm: PropTypes.bool.isRequired,
};

