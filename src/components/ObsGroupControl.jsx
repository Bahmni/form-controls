import React, { Component, PropTypes } from 'react';
import 'src/helpers/componentStore';
import { displayRowControls, getGroupedControls } from 'src/helpers/controlsParser';
import { createFormNamespace } from 'src/helpers/formNamespace';
import { getObsFromChildControls } from 'src/helpers/controlsHelper';

class Mapper {
  constructor(obs) {
    this.obs = obs;
    this.obs.groupMembers = [];
  }

  mapTo(groupMembers) {
    this.obs.groupMembers = groupMembers.filter(obs => obs !== undefined);
    return (this.obs.groupMembers.length > 0) ? this.obs : undefined;
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

  storeChildRef(ref) {
    if (ref) this.childControls[ref.props.id] = ref;
  }

  render() {
    const { formUuid, metadata: { controls, concept }, obs } = this.props;
    const childProps = { formUuid, ref: this.storeChildRef };
    const obsGroupMembers = (obs && obs.groupMembers) ? obs.groupMembers : [];
    const groupedRowControls = getGroupedControls(controls, 'row');
    return (
      <fieldset>
        <legend>{concept.name}</legend>
        <div className="obsGroup-controls">
          {displayRowControls(groupedRowControls, obsGroupMembers, childProps)}
        </div>
      </fieldset>
    );
  }
}

ObsGroupControl.propTypes = {
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
