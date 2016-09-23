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
    const { displayType, properties: { label } } = this.props.metadata;
    const registeredComponent = window.componentStore.getRegisteredComponent(displayType);
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
    displayType: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    properties: PropTypes.shape({
      label: PropTypes.shape({
        type: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }),
  obs: PropTypes.object,
};

window.componentStore.registerComponent('obsControl', ObsControl);
