import React, { Component, PropTypes } from 'react';
import 'src/helpers/componentStore';
import { displayRowControls, getGroupedControls } from 'src/helpers/controlsParser';
import { createFormNamespace } from 'src/helpers/formNamespace';
import { getErrorsFromChildControls, getObsFromChildControls } from 'src/helpers/controlsHelper';
import isEmpty from 'lodash/isEmpty';

class Mapper {
  constructor(obs) {
    this.obs = obs;
    this.obs.groupMembers = [];
  }

  mapTo(groupMembers) {
    const filteredMembers = groupMembers.filter(obs => obs !== undefined);
    if (isEmpty(filteredMembers)) { return undefined; }
    const voided = filteredMembers.every((obs) => obs.voided);
    return Object.assign({}, this.obs, { groupMembers: filteredMembers }, { voided });
  }
}

export class ObsGroupControl extends Component {

  constructor(props) {
    super(props);
    this.childControls = {};
    const formNamespace = createFormNamespace(props.formUuid, props.metadata.id);
    const concept = props.metadata.concept;
    const obs = Object.assign({}, { concept }, props.obs, { formNamespace });
    this.mapper = new Mapper(obs);
    this.getValue = this.getValue.bind(this);
    this.storeChildRef = this.storeChildRef.bind(this);
  }

  getValue() {
    const observations = getObsFromChildControls(this.childControls);
    const groupMembers = [].concat.apply([], observations).filter(obs => obs !== undefined);
    return this.mapper.mapTo(groupMembers);
  }

  getErrors() {
    return getErrorsFromChildControls(this.childControls);
  }

  storeChildRef(ref) {
    if (ref) this.childControls[ref.props.id] = ref;
  }

  render() {
    const { errors, formUuid, metadata: { controls, concept }, obs } = this.props;
    const childProps = { errors, formUuid, ref: this.storeChildRef };
    const obsGroupMembers = (obs && obs.groupMembers) ? obs.groupMembers : [];
    const groupedRowControls = getGroupedControls(controls, 'row');
    return (
      <fieldset className="form-builder-fieldset">
        <legend>{concept.name}</legend>
        <div className="obsGroup-controls">
          {displayRowControls(groupedRowControls, obsGroupMembers, childProps)}
        </div>
      </fieldset>
    );
  }
}

ObsGroupControl.propTypes = {
  errors: PropTypes.array.isRequired,
  formUuid: PropTypes.string.isRequired,
  metadata: PropTypes.shape({
    controls: PropTypes.array.isRequired,
    id: PropTypes.string.isRequired,
    concept: PropTypes.object.isRequired,
    properties: PropTypes.object,
  }),
  obs: PropTypes.object,
};

window.componentStore.registerComponent('obsGroupControl', ObsGroupControl);
