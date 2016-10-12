import React, { Component, PropTypes } from 'react';
import { LabelDesigner } from 'components/designer/Label.jsx';
import 'src/helpers/componentStore';

export class ObsControlDesigner extends Component {

  constructor(props) {
    super(props);
    this.childControl = undefined;
    this.labelControl = undefined;
    this.metadata = props.metadata;
    this.storeChildRef = this.storeChildRef.bind(this);
    this.storeLabelRef = this.storeLabelRef.bind(this);
    this.updateLabelMetdata = this.updateLabelMetdata.bind(this);
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

  updateLabelMetdata(newMetadata) {
    this.metadata.label = newMetadata;
    this.props.onUpdateMetadata(this.metadata);
  }

  render() {
    const { concept, id } = this.props.metadata;
    const designerComponent = concept && window.componentStore.getDesignerComponent(concept.datatype); // eslint-disable-line max-len
    if (concept && designerComponent) {
      return (
        <div onClick={ (event) => this.props.onSelect(event, id) }>
          <LabelDesigner
            metadata={ this.props.metadata.label }
            onUpdateMetadata={ this.updateLabelMetdata }
            ref={ this.storeLabelRef }
          />
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
    label: PropTypes.object.isRequired,
    properties: PropTypes.shape({
      location: PropTypes.shape({
        row: PropTypes.number,
        column: PropTypes.number,
      }),
    }),
    type: PropTypes.string.isRequired,
  }),
  onSelect: PropTypes.func.isRequired,
  onUpdateMetadata: PropTypes.func.isRequired,
};

ObsControlDesigner.injectConceptToMetadata = function (metadata, concept) {
  const filteredConcepts = {
    name: concept.name.name,
    uuid: concept.uuid,
    datatype: concept.datatype.name,
  };
  const label = {
    type: 'label',
    value: concept.name.name,
  };
  const displayType = concept.datatype.name;

  return Object.assign({}, metadata, { concept: filteredConcepts }, { label }, { displayType });
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
        name: 'label',
        dataType: 'complex',
        attributes: [
          {
            name: 'type',
            dataType: 'text',
            defaultValue: 'label',
          },
          {
            name: 'value',
            dataType: 'text',
            defaultValue: 'Label',
          },
        ],
      },
      {
        name: 'properties',
        dataType: 'complex',
        attributes: [
          {
            name: 'location',
            dataType: 'complex',
            attributes: [
              {
                name: 'row',
                dataType: 'number',
                defaultValue: 0,
              },
              {
                name: 'column',
                dataType: 'number',
                defaultValue: 0,
              },
            ],
          },
        ],
      },
    ],
  },
};

window.componentStore.registerDesignerComponent('obsControl', descriptor);
