import React, { Component, PropTypes } from 'react';
import { LabelDesigner } from 'components/designer/Label.jsx';
import 'src/helpers/componentStore';

export class ObsControlDesigner extends Component {

  constructor() {
    super();
    this.childControl = undefined;
    this.labelControl = undefined;
    this.storeChildRef = this.storeChildRef.bind(this);
    this.storeLabelRef = this.storeLabelRef.bind(this);
  }

  getJsonDefinition() {
    const childJsonDefinition = this.childControl.getJsonDefinition();
    const labelJsonDefinition = this.labelControl.getJsonDefinition();
    return Object.assign({}, childJsonDefinition, { label: labelJsonDefinition });
  }

  storeChildRef(ref) {
    this.childControl = ref;
  }

  storeLabelRef(ref) {
    this.labelControl = ref;
  }

  displayObsControl(designerComponent) {
    const { metadata } = this.props;
    return React.createElement(designerComponent.control, {
      metadata,
      ref: this.storeChildRef,
    });
  }

  render() {
    const { concept, displayType, id } = this.props.metadata;
    const designerComponent = displayType && window.componentStore.getDesignerComponent(displayType); // eslint-disable-line max-len
    if (concept && designerComponent) {
      const labelMetadata = { id: `label-${id}`, type: 'label', value: concept.name };
      return (
        <div onClick={ (event) => this.props.onSelect(event, id) }>
          <LabelDesigner metadata={labelMetadata} ref={this.storeLabelRef} />
          {this.displayObsControl(designerComponent)}
        </div>
      );
    }
    return <div onClick={ (event) => this.props.onSelect(event, id) }>Select Obs Source</div>;
  }
}

ObsControlDesigner.propTypes = {
  metadata: PropTypes.shape({
    concept: PropTypes.object,
    displayType: PropTypes.string,
    id: PropTypes.string.isRequired,
    properties: PropTypes.object,
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
      {
        name: 'properties',
        dataType: 'complex',
        attributes: [],
      },
    ],
  },
};

window.componentStore.registerDesignerComponent('obsControl', descriptor);
