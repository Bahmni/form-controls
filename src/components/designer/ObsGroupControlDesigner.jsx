import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentStore from 'src/helpers/componentStore';
import { ObsGroupMapper } from '../../mapper/ObsGroupMapper';
import { GridDesigner as Grid } from 'components/designer/Grid.jsx';
import { Concept } from '../../helpers/Concept';
import { Metadata } from '../../helpers/Metadata';
import { LabelDesigner } from 'components/designer/Label.jsx';
import { AddMoreDesigner } from 'components/designer/AddMore.jsx';
import find from 'lodash/find';

export class ObsGroupControlDesigner extends Component {

  constructor(props) {
    super(props);
    this.metadata = props.metadata;
    this.mapper = new ObsGroupMapper();
    this.storeGridRef = this.storeGridRef.bind(this);
    this.storeLabelRef = this.storeLabelRef.bind(this);
    this.deleteButton = this.deleteButton.bind(this);
  }

  getJsonDefinition() {
    if (!this.gridRef) return undefined;
    const controls = this.gridRef.getControls();
    const labelJsonDefinition = this.labelControl && this.labelControl.getJsonDefinition();
    return Object.assign({}, this.props.metadata, { controls }, { label: labelJsonDefinition });
  }

  storeGridRef(ref) {
    if (ref) {
      this.gridRef = ref;
    }
  }

  storeLabelRef(ref) {
    this.labelControl = ref;
  }

  displayLabel() {
    const { metadata, metadata: { label, id } } = this.props;
    const labelMetadata = Object.assign(label, { id }) ||
      { type: 'label', value: metadata.concept.name, id };
    return (
      <LabelDesigner
        metadata={ labelMetadata }
        onSelect={ (event) => this.props.onSelect(event, metadata) }
        ref={ this.storeLabelRef }
        showDeleteButton={false}
      />
    );
  }

  deleteButton(event) {
    this.props.deleteControl();
    this.props.clearSelectedControl(event);
  }

  showDeleteButton() {
    if (this.props.showDeleteButton) {
      return (
        <button className="remove-control-button" onClick={this.deleteButton}>
          <i aria-hidden="true" className="fa fa-trash"></i>
        </button>
      );
    }
    return null;
  }

  showAddMore() {
    const { properties } = this.props.metadata;
    const isAddMoreEnabled = find(properties, (value, key) => (key === 'addMore' && value));
    if (isAddMoreEnabled) {
      return (
        <AddMoreDesigner />
      );
    }
    return null;
  }

  render() {
    const { metadata, metadata: { concept } } = this.props;
    if (concept) {
      return (
        <fieldset
          className="form-builder-fieldset"
          onClick={(event) => this.props.onSelect(event, metadata)}
        >
          {this.showAddMore()}
          {this.showDeleteButton()}
          <legend><strong>{this.displayLabel()}</strong></legend>
          <div className="obsGroup-controls">
            <Grid
              controls={ metadata.controls }
              dragAllowed={false}
              idGenerator={this.props.idGenerator}
              isShowDeleteButton={false}
              minRows={0}
              ref={ this.storeGridRef }
              wrapper={this.props.wrapper}
            />
          </div>
        </fieldset>
      );
    }
    return (
      <div className="control-wrapper-content"
        onClick={ (event) => this.props.onSelect(event, metadata) }
      >
        {this.showDeleteButton()}
        Select ObsGroup Source
      </div>);
  }
}

ObsGroupControlDesigner.propTypes = {
  clearSelectedControl: PropTypes.func.isRequired,
  deleteControl: PropTypes.func.isRequired,
  idGenerator: PropTypes.object.isRequired,
  metadata: PropTypes.shape({
    concept: PropTypes.object,
    displayType: PropTypes.string,
    id: PropTypes.string.isRequired,
    label: PropTypes.object,
    properties: PropTypes.shape({
      location: PropTypes.shape({
        row: PropTypes.number,
        column: PropTypes.number,
      }),
    }),
    type: PropTypes.string.isRequired,
  }),
  onSelect: PropTypes.func.isRequired,
  showDeleteButton: PropTypes.bool,
  wrapper: PropTypes.func.isRequired,
};

ObsGroupControlDesigner.injectConceptToMetadata = (metadata, concept, idGenerator) => {
  const conceptSet = new Concept(concept);
  const location = metadata.properties && metadata.properties.location;
  return new Metadata().getMetadataForConcept(conceptSet.getConcept(), idGenerator,
    'obsGroupControl', 'obsControl', location, metadata.id);
};

const descriptor = {
  control: ObsGroupControlDesigner,
  designProperties: {
    displayName: 'ObsGroup',
    isTopLevelComponent: true,
  },
  metadata: {
    attributes: [
      {
        name: 'type',
        dataType: 'text',
        defaultValue: 'obsGroupControl',
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
            name: 'addMore',
            dataType: 'boolean',
            defaultValue: false,
          },
        ],
      },
    ],
  },
};

ComponentStore.registerDesignerComponent('obsGroupControl', descriptor);
