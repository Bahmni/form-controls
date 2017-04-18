import React, { PropTypes, Component } from 'react';
import { displayRowControls, getGroupedControls } from '../helpers/controlsParser';
import isEmpty from 'lodash/isEmpty';
import ControlRecordTreeBuilder from 'src/helpers/ControlRecordTreeBuilder';
import ControlRecordTreeMgr from 'src/helpers/ControlRecordTreeMgr';
import ScriptRunner from 'src/helpers/ScriptRunner';
import addMoreDecorator from './AddMoreDecorator';
import ObservationMapper from '../helpers/ObservationMapper';
import NotificationContainer from '../helpers/Notification';
import Constants from '../constants';
import { addLocaleData, IntlProvider } from 'react-intl';

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
  }

  componentWillMount() {
    const initScript = this.props.metadata.events && this.props.metadata.events.onFormInit;
    if (initScript) {
      const updatedTree = new ScriptRunner(this.state.data).execute(initScript);
      this.setState({ data: updatedTree });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ collapse: nextProps.collapse });
  }

  onEventTrigger(sender, eventName) {
    const eventScripts = ControlRecordTreeMgr.find(this.state.data, sender).getEventScripts();
    const script = eventScripts && eventScripts[eventName];
    if (script) {
      const updatedTree = new ScriptRunner(this.state.data).execute(script);
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
    }), onActionDone);
  }


  getAddMoreMessage(rootTree, formFieldPath) {
    const targetRecordTree = ControlRecordTreeMgr.find(rootTree, formFieldPath);
    const name = targetRecordTree.getConceptName();
    const type = targetRecordTree.getConceptType();
    return (`A new ${name} ${type} has been added`);
  }

  onControlAdd(formFieldPath) {
    const updatedRecordTree = ControlRecordTreeMgr.add(this.state.data, formFieldPath);

    const addMoreMessage = this.getAddMoreMessage(this.state.data, formFieldPath);

    this.setState({
      data: updatedRecordTree,
      notification: { message: addMoreMessage, type: Constants.messageType.success },
    });

    setTimeout(() => {
      this.setState({ notification: {} });
    }, Constants.toastTimeout);
  }

  onControlRemove(formFieldPath) {
    this.setState((previousState) => (
      {
        ...previousState,
        data: previousState.data.update(formFieldPath, {}, [], true),
        collapse: undefined,
      }
    ));
  }

  getValue() {
    const records = this.state.data;
    const observations = (new ObservationMapper()).from(records);
    const errors = records.getErrors();

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

  render() {
    const { metadata: { controls, name: formName, version: formVersion }, validate } = this.props;
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
      validate,
    };
    const groupedRowControls = getGroupedControls(controls, 'row');
    const records = this.state.data.getActive().children.toArray();
    if (this.props.locale && this.props.locale !== 'en') {
      addLocaleData({
        locale: this.props.locale,
        parentLocale: 'en',
      });
    }

    const message = this.props.metadata.locale[this.props.locale];
    return (
      <IntlProvider locale={this.props.locale} messages={message}>
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
  metadata: PropTypes.shape({
    controls: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        type: PropTypes.string.isRequired,
      })).isRequired,
    id: PropTypes.number.isRequired,
    uuid: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    version: PropTypes.string.isRequired,
  }),
  observations: PropTypes.array.isRequired,
  validate: PropTypes.bool.isRequired,
};

