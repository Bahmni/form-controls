import React, { Component, PropTypes } from 'react';
import { Label } from 'components/Label.jsx';
import 'src/helpers/componentStore';
import find from 'lodash/find';
import { ObsMapper } from 'src/helpers/ObsMapper';
import { Obs } from 'src/helpers/Obs';

export class ObsControl extends Component {

  constructor(props) {
    super(props);
    this.childControl = undefined;
    const obs = new Obs(props.formUuid, props.metadata, props.obs);
    this.mapper = new ObsMapper(obs);
    this.getValue = this.getValue.bind(this);
    this.storeChildRef = this.storeChildRef.bind(this);
  }

  getValue() {
    return this.childControl.getValue();
  }

  getErrors() {
    return this.childControl.getErrors();
  }

  storeChildRef(ref) {
    this.childControl = ref;
  }

  displayObsControl(registeredComponent) {
    const { errors, formUuid, metadata } = this.props;
    return React.createElement(registeredComponent, {
      errors,
      formUuid,
      metadata,
      mapper: this.mapper,
      ref: this.storeChildRef,
    });
  }

  markMandatory() {
    const { properties } = this.props.metadata;
    const isMandatory = find(properties, (value, key) => (key === 'mandatory' && value));
    if (isMandatory) {
      return <span className="form-builder-asterisk">*</span>;
    }
    return null;
  }

  render() {
    const { concept, label } = this.props.metadata;
    const registeredComponent = window.componentStore.getRegisteredComponent(concept.datatype);
    if (registeredComponent) {
      return (
        <div>
          <Label metadata={label} />
          {this.markMandatory()}
          {this.displayObsControl(registeredComponent)}
        </div>
      );
    }
    return null;
  }
}

ObsControl.propTypes = {
  errors: PropTypes.array.isRequired,
  formUuid: PropTypes.string.isRequired,
  metadata: PropTypes.shape({
    concept: PropTypes.object.isRequired,
    displayType: PropTypes.string,
    id: PropTypes.string.isRequired,
    label: PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }).isRequired,
    properties: PropTypes.object,
    type: PropTypes.string.isRequired,
  }),
  obs: PropTypes.object,
};

window.componentStore.registerComponent('obsControl', ObsControl);
