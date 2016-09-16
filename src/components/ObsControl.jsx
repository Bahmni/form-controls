import React, { Component, PropTypes } from 'react';
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

  storeChildRef(ref) {
    this.childControl = ref;
  }

  displayObsControl() {
    const { metadata, metadata: { displayType } } = this.props;
    const registeredComponent = window.componentStore.getRegisteredComponent(displayType);
    if (registeredComponent) {
      return React.createElement(registeredComponent, {
        formUuid: this.props.formUuid,
        metadata,
        obs: this.props.obs,
        ref: this.storeChildRef,
      });
    }
    return null;
  }

  render() {
    return (
      <div>{this.displayObsControl()}</div>
    );
  }
}

ObsControl.propTypes = {
  formUuid: PropTypes.string.isRequired,
  metadata: PropTypes.shape({
    concept: PropTypes.object.isRequired,
    displayType: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }),
  obs: PropTypes.object,
};

window.componentStore.registerComponent('obsControl', ObsControl);
