import React, { PropTypes, Component } from 'react';
import { displayRowControls, getGroupedControls } from 'src/helpers/controlsParser';
import { getErrorsFromChildControls, getObsFromChildControls } from 'src/helpers/controlsHelper';
import isEmpty from 'lodash/isEmpty';
import {Obs} from "../helpers/Obs";
import { List, Map } from 'immutable'
import {ControlState} from "src/ControlState";

export class Container extends Component {
  constructor(props) {
    super(props);
    this.childControls = {};
    const { observations, metadata } = this.props;
    this.data = this.transformObs(observations,metadata);
    this.state = { errors: [], data: this.data };
    this.storeChildRef = this.storeChildRef.bind(this);
    this.onValueChanged = this.onValueChanged.bind(this);
  }

  onValueChanged(obs,errors){
    console.log("The value of obs changed", obs);
    const data = this.state.data;
    this.setState({ data: data.setIn([ obs.formNamespace, 0], obs).setIn( [obs.formNamespace,1], errors)});
  }

  getValue() {
    const errors = getErrorsFromChildControls(this.childControls);
    const childObservations = getObsFromChildControls(this.childControls);
    const observations = [].concat.apply([], childObservations).filter(obs => obs !== undefined);
    const nonVoidedObs = observations.filter(obs => obs.voided !== true);

    if (isEmpty(nonVoidedObs) || isEmpty(errors)) {
      return { observations };
    }

    this.setState({ errors });
    return { errors };
  }

  storeChildRef(ref) {
    if (ref) this.childControls[ref.props.id] = ref;
  }

  transformObs(observations, metadata, formUuid){
    const controlState = new ControlState();
    //Needs to be moved to a separate mapper.
    var data = new Map();
    observations.forEach((observation) => (
        data = data.set(observation.formNamespace, List.of(
            new Obs({ concept: metadata.concept, formNamespace: observation.formNamespace//createFormNamespace(formUuid,metadata.id)
              , uuid: observation.uuid,value: observation.value,observationDateTime : observation.observationDateTime,voided : observation.voided, comment: observation.comment})
            ,[],true))
    ));
    return data;
  }

  getObsList(){
    const obsList = [];
    this.state.data.map( entry => (
        obsList.push(entry.get(0))
    ));
    return obsList;
  }

  render() {
    const { metadata: { controls, uuid: formUuid } } = this.props;

    const childProps = { errors: this.state.errors, formUuid, ref: this.storeChildRef, onValueChanged: this.onValueChanged };
    const groupedRowControls = getGroupedControls(controls, 'row');
    const obsList = this.getObsList();
    return (
      <div>{displayRowControls(groupedRowControls, obsList, childProps)}</div>
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
