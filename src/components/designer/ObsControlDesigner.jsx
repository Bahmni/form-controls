import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { LabelDesigner } from 'components/designer/Label.jsx';
import { CommentDesigner } from 'components/designer/Comment.jsx';
import { AddMoreDesigner } from 'components/designer/AddMore.jsx';
import ComponentStore from 'src/helpers/componentStore';
import find from 'lodash/find';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { Concept } from 'src/helpers/Concept';

export class ObsControlDesigner extends Component {

  constructor(props) {
    super(props);
    this.metadata = props.metadata;
    this.storeChildRef = this.storeChildRef.bind(this);
    this.storeLabelRef = this.storeLabelRef.bind(this);
    this.deleteButton = this.deleteButton.bind(this);
  }

  getJsonDefinition() {
    if (!this.childControl) {
      return undefined;
    }
    const childJsonDefinition = this.childControl.getJsonDefinition();
    const { description } = childJsonDefinition.concept;
    const labelJsonDefinition = this.labelControl && this.labelControl.getJsonDefinition();
    if (description && !description.translationKey) {
      description.translationKey = `${labelJsonDefinition.translationKey}_DESC`;
    }
    return Object.assign({}, childJsonDefinition, { label: labelJsonDefinition });
  }

  storeChildRef(ref) {
    this.childControl = ref;
  }

  storeLabelRef(ref) {
    this.labelControl = ref;
  }

  displayObsControl(designerComponent) {
    const { metadata, setError } = this.props;
    return React.createElement(designerComponent.control, {
      metadata,
      ref: this.storeChildRef,
      setError,
      ...this._numericContext(metadata),
    });
  }

  _numericContext(metadata) {
    return {
      units: metadata.units,
      hiNormal: metadata.hiNormal,
      lowNormal: metadata.lowNormal,
      hiAbsolute: metadata.hiAbsolute,
      lowAbsolute: metadata.lowAbsolute,
    };
  }

  _getUnits(units) {
    return units ? `(${units})` : '';
  }

  displayLabel() {
    const { metadata, metadata: { properties, label, id } } = this.props;
    const hideLabel = find(properties, (value, key) => (key === 'hideLabel' && value));
    const units = this._getUnits(metadata.units);
    const labelMetadata = Object.assign({ id, units }, label) ||
      { type: 'label', value: metadata.concept.name, id };
    if (!hideLabel) {
      return (
          <LabelDesigner
            metadata={ labelMetadata }
            onSelect={ (event) => this.props.onSelect(event, metadata) }
            ref={ this.storeLabelRef }
            showDeleteButton={false}
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
    const { concept: { description } } = this.props.metadata;
    const showHintButton = this.state && this.state.showHintButton;
    if (description && description.value) {
      return (
        <div className={classNames('form-builder-tooltip-wrap',
           { active: showHintButton === true })}>
          <i className="fa fa-question-circle form-builder-tooltip-trigger"
            onClick={() => this.setState({ showHintButton: !showHintButton })}
          >
          </i>
          <p className="form-builder-tooltip-description">
            <i className="fa fa-caret-down"></i>
            <span className="details hint">{description.value}</span>
          </p>
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

  showScriptButton() {
    const scripts = this.props.metadata.events;
    if (scripts && scripts.onValueChange && scripts.onValueChange !== '') {
      return (
        <i aria-hidden="true" className="fa fa-code script-circle" />
      );
    }
    return null;
  }

  showAbnormalButton() {
    const { properties } = this.props.metadata;
    const isAbnormal = find(properties, (value, key) => (key === 'abnormal' && value));
    if (isAbnormal) {
      return (
        <button className="abnormal-button">
          <span>Abnormal</span>
        </button>
      );
    }
    return null;
  }

  render() {
    const { metadata, metadata: { concept } } = this.props;
    const designerComponent = concept && ComponentStore.getDesignerComponent(concept.datatype);
    if (designerComponent) {
      return (
        <div className="form-field-wrap clearfix"
          onClick={ (event) => this.props.onSelect(event, metadata) }
        >
          {this.showDeleteButton()}
          {this.showScriptButton()}
          <div className="label-wrap fl">
            {this.displayLabel()}
            {this.markMandatory()}
            {this.showHelperText()}
          </div>
          {this.displayObsControl(designerComponent)}
          {this.showAbnormalButton()}
          {this.showAddMore()}
          {this.showComment()}
        </div>
      );
    }
    return (
      <div className="control-wrapper-content"
        onClick={ (event) => this.props.onSelect(event, metadata) }
      >
        {this.showDeleteButton()}
        Select Obs Source
      </div>
    );
  }
}

ObsControlDesigner.propTypes = {
  clearSelectedControl: PropTypes.func.isRequired,
  deleteControl: PropTypes.func.isRequired,
  metadata: PropTypes.shape({
    concept: PropTypes.object,
    displayType: PropTypes.string,
    events: PropTypes.object,
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
  setError: PropTypes.func,
  showDeleteButton: PropTypes.bool,
};

ObsControlDesigner.injectConceptToMetadata = (metadata, concept) => {
  const filteredConcepts = {
    name: concept.name.name,
    uuid: concept.uuid,
    description: !isEmpty(concept.descriptions)
      ? { value: get(concept, 'descriptions[0].display') } : undefined,
    datatype: concept.datatype.name,
    conceptClass: concept.conceptClass.name,
    conceptHandler: concept.handler,
    answers: concept.answers,
    properties: {
      allowDecimal: concept.allowDecimal,
    },
  };
  const label = {
    type: 'label',
    value: concept.name.name,
  };

  return Object.assign(
    {},
    metadata,
    { concept: filteredConcepts },
    { label },
    { ...(new Concept(concept).getNumericContext()) }
  );
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
            name: 'addMore',
            dataType: 'boolean',
            defaultValue: false,
          },
          {
            name: 'hideLabel',
            dataType: 'boolean',
            defaultValue: false,
          },
          {
            name: 'controlEvent',
            dataType: 'boolean',
            defaultValue: false,
            elementType: 'button',
            elementName: 'Editor',
          },
        ],
      },
    ],
  },
};

ComponentStore.registerDesignerComponent('obsControl', descriptor);
