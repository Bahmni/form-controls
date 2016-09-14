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
    const componentDescriptor = window.componentStore.getRegisteredComponent(displayType);
    if (componentDescriptor) {
      return React.createElement(componentDescriptor.control, {
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

const descriptor = {
  control: ObsControl,
  designProperties: {
    displayName: 'Obs',
    isTopLevelComponent: true,
  },
  metadata: {
    attributes: [
      {
        name: 'type',
        dataType: 'text',
        defaultValue: 'obsControl',
      },
      {
        name: 'displayType',
        dataType: 'text',
        defaultValue: 'text',
      },
      {
        name: 'concept',
        dataType: 'complex',
        attributes: [
          {
            name: 'uuid',
            dataType: 'text',
          },
          {
            name: 'name',
            dataType: 'text',
          },
        ],
      },
    ],
  },
};

window.componentStore.registerComponent('obsControl', descriptor);
