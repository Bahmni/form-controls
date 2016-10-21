import React, { Component, PropTypes } from 'react';
import 'src/helpers/componentStore';
import { displayRowControls, getGroupedControls } from 'src/helpers/controlsParser';
import { getObsFromChildControls } from 'src/helpers/controlsHelper';
import flatMap from 'lodash/flatMap';

export class Section extends Component {

  constructor(props) {
    super(props);
    this.childControls = {};
    this.getValue = this.getValue.bind(this);
    this.storeChildRef = this.storeChildRef.bind(this);
  }

  getValue() {
    const observations = getObsFromChildControls(this.childControls);
    return [].concat.apply([], observations).filter(obs => obs !== undefined);
  }

  getErrors() {
    return flatMap(this.childControls, (control) => control.getErrors());
  }

  storeChildRef(ref) {
    if (ref) this.childControls[ref.props.id] = ref;
  }

  render() {
    const { formUuid, metadata: { controls, value }, obs } = this.props;
    const childProps = { formUuid, ref: this.storeChildRef };
    const groupedRowControls = getGroupedControls(controls, 'row');
    return (
      <fieldset>
        <legend>{value}</legend>
        <div className="section-controls">
          {displayRowControls(groupedRowControls, obs, childProps)}
        </div>
      </fieldset>
    );
  }
}

Section.propTypes = {
  formUuid: PropTypes.string.isRequired,
  metadata: PropTypes.shape({
    controls: PropTypes.array.isRequired,
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    properties: PropTypes.shape({
      visualOnly: PropTypes.bool.isRequired,
    }),
  }),
  obs: PropTypes.array.isRequired,
};

window.componentStore.registerComponent('section', Section);
