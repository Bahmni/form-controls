import React, { Component, PropTypes } from 'react';
import 'src/helpers/componentStore';
import { getControls } from 'src/helpers/controlsParser';
import { createFormNamespace } from 'src/helpers/formNamespace';

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
    const groupMembers = [];
    for (const key in this.childControls) {
      if (this.childControls.hasOwnProperty(key)) {
        groupMembers.push(this.childControls[key].getValue());
      }
    }
    return this.mapper.mapTo(groupMembers);
  }

  storeChildRef(ref) {
    if (ref) this.childControls[ref.props.metadata.id] = ref;
  }

  render() {
    const { formUuid, metadata: { controls, value }, obs } = this.props;
    const childProps = { formUuid, ref: this.storeChildRef };
    const obsGroupMembers = (obs && obs.groupMembers) ? obs.groupMembers : [];
    return (
      <fieldset>
        <legend>{value}</legend>
        <div className="obsGroup-controls">
          {getControls(controls, obsGroupMembers, childProps)}
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
  }),
  obs: PropTypes.object,
};
