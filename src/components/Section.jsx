import React, { Component, PropTypes } from 'react';
import 'src/helpers/componentStore';
import { displayRowControls, getGroupedControls } from 'src/helpers/controlsParser';
import { getErrorsFromChildControls, getObsFromChildControls } from 'src/helpers/controlsHelper';

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
    return getErrorsFromChildControls(this.childControls);
  }

  storeChildRef(ref) {
    if (ref) this.childControls[ref.props.id] = ref;
  }

  render() {
    const { errors, formUuid, metadata: { controls, value }, obs } = this.props;
    const childProps = { errors, formUuid, ref: this.storeChildRef };
    const groupedRowControls = getGroupedControls(controls, 'row');
    return (
      <fieldset className="form-builder-fieldset">
        <legend>{value}</legend>
        <div className="section-controls">
          {displayRowControls(groupedRowControls, obs, childProps)}
        </div>
      </fieldset>
    );
  }
}

Section.propTypes = {
  errors: PropTypes.array.isRequired,
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
