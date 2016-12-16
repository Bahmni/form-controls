import React, { Component, PropTypes } from 'react';
import { LabelDesigner } from 'components/designer/Label.jsx';
import { CommentDesigner } from 'components/designer/Comment.jsx';
import ComponentStore from 'src/helpers/componentStore';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';

export class ObsControlDesigner extends Component {

  constructor(props) {
    super(props);
    this.metadata = props.metadata;
    this.storeChildRef = this.storeChildRef.bind(this);
    this.storeLabelRef = this.storeLabelRef.bind(this);
  }

  getJsonDefinition() {
    if (!this.childControl) {
      return undefined;
    }
    const childJsonDefinition = this.childControl.getJsonDefinition();
    const labelJsonDefinition = this.labelControl && this.labelControl.getJsonDefinition();
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
      ...this._numericContext(metadata),
    });
  }

  _numericContext(metadata) {
    const { concept } = metadata;
    return {
      hiNormal: concept.hiNormal,
      lowNormal: concept.lowNormal,
      hiAbsolute: concept.hiAbsolute,
      lowAbsolute: concept.lowAbsolute,
    };
  }

  displayLabel() {
    const { metadata, metadata: { properties, label } } = this.props;
    const hideLabel = find(properties, (value, key) => (key === 'hideLabel' && value));
    const labelMetadata = label || { type: 'label', value: metadata.concept.name };
    if (!hideLabel) {
      return (
          <LabelDesigner
            metadata={ labelMetadata }
            onSelect={ (event) => this.props.onSelect(event, metadata) }
            ref={ this.storeLabelRef }
          />
      );
    }
    return null;
  }

  markMandatory() {
    const { properties } = this.props.metadata;
    const isMandatory = find(properties, (value, key) => (key === 'mandatory' && value));
    if (isMandatory) {
      return <span className="form-builder-asterisk">*</span>;
    }
    return null;
  }

  showHelperText() {
    const { concept } = this.props.metadata;
    const description = concept.description && !isEmpty(concept.description) ? concept.description[0].display : undefined;
    if (description) {
      return (
        <div>
          <div>Hello</div>
          <span class="hint">{description}</span>
        </div>
      );
    }
    return null;
  }

  showComment() {
    const { properties } = this.props.metadata;
    const isAddCommentsEnabled = find(properties, (value, key) => (key === 'notes' && value));
    if (isAddCommentsEnabled) {
      return (
        <CommentDesigner />
      );
    }
    return null;
  }

  render() {
    const { metadata, metadata: { concept } } = this.props;
    const designerComponent = concept && ComponentStore.getDesignerComponent(concept.datatype);
    if (designerComponent) {
      return (
        <div className="obs-wrap" onClick={ (event) => this.props.onSelect(event, metadata) }>
          <div className="label-wrap fl">
            {this.displayLabel()}
            {this.markMandatory()}
            {this.showHelperText()}
          </div>
          {this.displayObsControl(designerComponent)}
          {this.showComment()}
        </div>
      );
    }
    return <div onClick={ (event) => this.props.onSelect(event, metadata) }>Select Obs Source</div>;
  }
}

ObsControlDesigner.propTypes = {
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
};

ObsControlDesigner.injectConceptToMetadata = (metadata, concept) => {
  const filteredConcepts = {
    name: concept.name.name,
    uuid: concept.uuid,
    description: concept.descriptions,
    datatype: concept.datatype.name,
    answers: concept.answers,
    properties: {
      allowDecimal: concept.allowDecimal,
    },
  };
  const label = {
    type: 'label',
    value: `${concept.name.name}${ObsControlDesigner.getUnits(concept)}`,
  };

  const numericContext = {
    units: concept.units,
    hiNormal: concept.hiNormal,
    lowNormal: concept.lowNormal,
    hiAbsolute: concept.hiAbsolute,
    lowAbsolute: concept.lowAbsolute,
  };
  return Object.assign(
    {},
    metadata,
    { concept: filteredConcepts },
    { label },
    { ...numericContext }
  );
};


ObsControlDesigner.getUnits = (concept) => {
  if (concept.units) {
    return `(${concept.units})`;
  }
  return '';
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
            name: 'mandatory',
            dataType: 'boolean',
            defaultValue: false,
          },
          {
            name: 'notes',
            dataType: 'boolean',
            defaultValue: false,
          },
          {
            name: 'hideLabel',
            dataType: 'boolean',
            defaultValue: false,
          },
        ],
      },
    ],
  },
};

ComponentStore.registerDesignerComponent('obsControl', descriptor);
