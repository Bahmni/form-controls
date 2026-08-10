import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { LabelDesigner } from 'components/designer/Label.jsx';
import { CommentDesigner } from 'components/designer/Comment.jsx';
import { AddMoreDesigner } from 'components/designer/AddMore.jsx';
import { DropTarget } from 'src/components/DropTarget.jsx';
import ComponentStore from 'src/helpers/componentStore';
import find from 'lodash/find';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { Concept } from 'src/helpers/Concept';

export class ObsControlDesigner extends DropTarget {

  constructor(props) {
    super(props);
    this.metadata = props.metadata;
    this.state = { attachedControls: props.metadata.controls || [], dropActive: false };
    this.attachedControlRefs = {};
    this.storeChildRef = this.storeChildRef.bind(this);
    this.storeLabelRef = this.storeLabelRef.bind(this);
    this.storeAttachedControlRef = this.storeAttachedControlRef.bind(this);
    this.deleteButton = this.deleteButton.bind(this);
    this.deleteAttachedControl = this.deleteAttachedControl.bind(this);
  }

  deleteAttachedControl(controlId) {
    delete this.attachedControlRefs[controlId];
    this.setState({
      attachedControls: this.state.attachedControls.filter((c) => c.id !== controlId),
    });
  }

  componentWillReceiveProps(nextProps) {
    const { controlProperty } = nextProps;
    if (!controlProperty || !controlProperty.id) {
      return;
    }
    const matchIndex = this.state.attachedControls.findIndex((c) => c.id === controlProperty.id);
    if (matchIndex === -1) {
      return;
    }
    const attachedControls = this.state.attachedControls.slice();
    const existing = attachedControls[matchIndex];
    attachedControls[matchIndex] = Object.assign({}, existing, {
      properties: Object.assign({}, existing.properties, controlProperty.property),
    });
    this.setState({ attachedControls });
  }

  processDragEnter() {
    this.setState({ dropActive: true });
  }

  processDragLeave() {
    this.setState({ dropActive: false });
  }

  processDrop(context) {
    this.setState({ dropActive: false });
    if (!context || context.type !== 'label') {
      return;
    }
    if (this.state.attachedControls.some(c => c.id === context.id)) {
      return;
    }
    this.setState({
      attachedControls: [...this.state.attachedControls, context],
    });
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
    const result = Object.assign(
      {}, childJsonDefinition, { label: labelJsonDefinition }
    );
    const controls = this.state.attachedControls.map((control) => {
      const ref = this.attachedControlRefs[control.id];
      return (ref && ref.getJsonDefinition()) || control;
    });
    if (controls.length > 0) {
      result.controls = controls;
    }
    return result;
  }

  storeChildRef(ref) {
    this.childControl = ref;
  }

  storeLabelRef(ref) {
    this.labelControl = ref;
  }

  storeAttachedControlRef(controlId, ref) {
    if (ref) this.attachedControlRefs[controlId] = ref;
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
    const { concept: { description } } = this.props.metadata;
    const hideLabel = find(properties, (value, key) => (key === 'hideLabel' && value));
    const units = this._getUnits(metadata.units);
    const labelMetadata = Object.assign({ id, units }, label) ||
      { type: 'label', value: metadata.concept.name, id };
    const showHintButton = this.state && this.state.showHintButton;
    const labelComponent = (<LabelDesigner
      metadata={labelMetadata}
      onSelect={(event) => this.props.onSelect(event, metadata)}
      ref={this.storeLabelRef}
      showDeleteButton={false}
      visible={!hideLabel}
    />);
    return (
        <div>
          {labelComponent}
          {!hideLabel && this.markMandatory()}
          {(!hideLabel && description && description.value) && (
            <i className="fa fa-question-circle form-builder-tooltip-trigger"
              onClick={() => this.setState({ showHintButton: !showHintButton })}
            />)}
        </div>
    );
  }

  displayAttachedControls() {
    const { attachedControls } = this.state;
    if (!attachedControls || attachedControls.length === 0) {
      return null;
    }
    return (
      <div className="obs-attached-label">
        {attachedControls.map((control) => (
          <LabelDesigner
            deleteControl={() => this.deleteAttachedControl(control.id)}
            key={control.id}
            metadata={control}
            onSelect={(event) => this.props.onSelect(event, control)}
            ref={(ref) => this.storeAttachedControlRef(control.id, ref)}
            showDeleteButton={control.id === this.props.selectedControlId}
            visible
          />
        ))}
      </div>
    );
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
        <div className={classNames('obs-comment-wrap')}>
          <div className={classNames('obs-comment-content')}><CommentDesigner /></div>
        </div>
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
        <Fragment>
          {this.showDeleteButton()}
          <div className={classNames('form-field-wrap clearfix', 'obs-attached-label-drop',
            { active: this.state.dropActive })}
            onClick={(event) => this.props.onSelect(event, metadata)}
            onDragEnter={this.onDragEnter}
            onDragLeave={this.onDragLeave}
            onDragOver={this.onDragOver}
            onDrop={this.onDrop}
          >
            {this.showHelperText()}
            <div className="form-field-content-wrap">
              {this.showScriptButton()}
              <div className="label-wrap fl">
                {this.displayLabel()}
                {this.displayAttachedControls()}
              </div>
              <div className={classNames('obs-control-field')}>
                {this.displayObsControl(designerComponent)}
                {this.showAbnormalButton()}
                {this.showAddMore()}
                <div className="obs-hyperlink-comment-row">
                  {this.showComment()}
                </div>
              </div>
            </div>
          </div>
        </Fragment>);
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
  controlProperty: PropTypes.shape({
    id: PropTypes.string,
    property: PropTypes.object,
  }),
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
  selectedControlId: PropTypes.string,
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
