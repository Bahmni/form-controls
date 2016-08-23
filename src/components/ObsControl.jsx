import React, { Component, PropTypes } from 'react';
import get from 'lodash/get';
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
    const metadata = this.props.metadata;
    const displayType = get(metadata, 'displayType');
    const component = window.componentStore.getRegisteredComponent(displayType);
    if (component)
      return React.createElement(component, { metadata, obs: this.props.obs, ref: this.storeChildRef });
  }

  render() {
    return (
      <div>{this.displayObsControl()}</div>
    );
  }
}

ObsControl.propTypes = {
  metadata: PropTypes.shape({
    concept: PropTypes.object.isRequired,
    displayType: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }),
  obs: PropTypes.object,
};

window.componentStore.registerComponent('obsControl', ObsControl);
