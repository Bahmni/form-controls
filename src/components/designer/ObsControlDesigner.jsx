import React, { Component, PropTypes } from 'react';
import 'src/helpers/componentStore';

export class ObsControlDesigner extends Component {

  constructor() {
    super();
    this.childControl = undefined;
    this.storeChildRef = this.storeChildRef.bind(this);
  }

  getJsonDefinition() {
    return this.childControl.getJsonDefinition();
  }

  storeChildRef(ref) {
    this.childControl = ref;
  }

  displayObsControl() {
    const { metadata, metadata: { displayType } } = this.props;
    const registeredComponent = window.componentStore.getDesignerComponent(displayType);
    if (registeredComponent) {
      return React.createElement(registeredComponent.control, {
        metadata,
        ref: this.storeChildRef,
      });
    }
    return null;
  }

  render() {
    const { concept, id } = this.props.metadata;
    if (concept) {
      return (
        <div id={id} onClick={ () => this.props.onSelect(id) }>
          {this.displayObsControl()}
        </div>
      );
    }
    return <div id={id} onClick={ () => this.props.onSelect(id) } >Select Obs Source</div>;
  }
}

ObsControlDesigner.propTypes = {
  metadata: PropTypes.shape({
    concept: PropTypes.object,
    displayType: PropTypes.string,
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }),
  onSelect: PropTypes.func.isRequired,
};

const descriptor = {
  control: ObsControlDesigner,
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
    ],
  },
};

window.componentStore.registerDesignerComponent('obsControl', descriptor);
