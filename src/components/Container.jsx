import React, { PropTypes, Component } from 'react';
import { displayRowControls, getGroupedControls } from 'src/helpers/controlsParser';
import { getErrorsFromChildControls, getObsFromChildControls } from 'src/helpers/controlsHelper';
import isEmpty from 'lodash/isEmpty';
import { List,Map } from 'immutable'
import { BahmniRecord, ControlState, controlStateFactory} from "src/ControlState";

export class Container extends Component {
  constructor(props) {
    super(props);
    this.childControls = {};
    const { observations, metadata } = this.props;
    const data = controlStateFactory(metadata, observations);
    this.state = { errors: [], data };
    this.storeChildRef = this.storeChildRef.bind(this);
    this.onValueChanged = this.onValueChanged.bind(this);
  }
  
  componentDidMount() {
    this.initialData = new ControlState(this.state.data.getRecords());
  }
  
  onValueChanged(obs,errors){
    const data = this.state.data;
    const bahmniRecord = data.getRecord(obs.formNamespace)
      .set('obs', obs)
      .set('errors', errors);
    this.setState({ data: data.setRecord(bahmniRecord)});
  }
  // deprecated
  // getValue() {
  //   const errors = getErrorsFromChildControls(this.childControls);
  //   const childObservations = getObsFromChildControls(this.childControls);
  //   const observations = [].concat.apply([], childObservations).filter(obs => obs !== undefined);
  //   const nonVoidedObs = observations.filter(obs => obs.voided !== true);
  //
  //   if (isEmpty(nonVoidedObs) || isEmpty(errors)) {
  //     return { observations };
  //   }
  //
  //   this.setState({ errors });
  //   return { errors };
  // }

  getValue() {
    const records = this.state.data.getRecords();
    const observations = records.filter((record) => {
      return this._isValidObs(record.obs)
    }).map((record) => {
      return record.obs.toJS();
    });

    if (isEmpty(observations) || isEmpty(errors)) {
      return { observations };
    }
    this.state.data =
    this.setState({errors});
    return { errors };
  }

  _isValidObs(obs) {
    return this._hasValue(obs.getValue()) && !this._isNewVoidedObs(obs)
  }

  _hasValue(value) {
    return !(value === '' || value === undefined || value === null);
  }

  _isNewVoidedObs(obs) {
    return !obs.getUuid() && obs.isVoided();
  }

  //deprecated
  storeChildRef(ref) {
    if (ref) this.childControls[ref.props.id] = ref;
  }

  getObsList(){
    const records = this.state.data.getRecords();
    return records.map( record => record.get('obs'));
  }

  getErrors() {
    const records = this.state.data.getRecords();
    return records.map((record) => record.get('errors'));
  }

  render() {
    const { metadata: { controls, uuid: formUuid } } = this.props;

    const childProps = { errors: this.state.errors, formUuid, ref: this.storeChildRef, onValueChanged: this.onValueChanged };
    const groupedRowControls = getGroupedControls(controls, 'row');
    const obsList = this.getObsList();
    const errorList = this.getErrors();
    return (
      <div>{displayRowControls(groupedRowControls, obsList, errorList, childProps)}</div>
    );
  }
}

Container.propTypes = {
  metadata: PropTypes.shape({
    controls: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        type: PropTypes.string.isRequired,
      })).isRequired,
    id: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
  }),
  observations: PropTypes.array.isRequired,
};
