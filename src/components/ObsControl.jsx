import React, { Component, PropTypes } from 'react';
import { Label } from 'components/Label.jsx';
import 'src/helpers/componentStore';

export class ObsControl extends Component {

  constructor(props) {
    super(props);
    this.childControl = undefined;
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
    const { metadata } = this.props;
    return React.createElement(registeredComponent, {
      formUuid: this.props.formUuid,
      metadata,
      obs: this.props.obs,
      ref: this.storeChildRef,
    });
  }

  render() {
    const { concept, label } = this.props.metadata;
    const registeredComponent = window.componentStore.getRegisteredComponent(concept.datatype);
    if (registeredComponent) {
      return (
        <div>
          <Label metadata={label} />
          {this.displayObsControl(registeredComponent)}
        </div>
      );
    }
    return null;
  }
}

ObsControl.propTypes = {
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
