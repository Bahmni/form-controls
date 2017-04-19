import React, { Component, PropTypes } from 'react';
import ComponentStore from 'src/helpers/componentStore';
import { SectionMapper } from '../../mapper/SectionMapper';
import { GridDesigner as Grid } from 'components/designer/Grid.jsx';
import { LabelDesigner } from 'components/designer/Label.jsx';

export class SectionDesigner extends Component {

  constructor(props) {
    super(props);
    this.metadata = props.metadata;
    this.mapper = new SectionMapper();
    this.storeGridRef = this.storeGridRef.bind(this);
    this.storeLabelRef = this.storeLabelRef.bind(this);
    this.deleteControl = this.deleteControl.bind(this);
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
    const { metadata: { label, id } } = this.props;
    const data = Object.assign({}, label, { id });
    return (
      <LabelDesigner
        metadata={ data }
        ref={ this.storeLabelRef }
        showDeleteButton={ false }
      />
    );
  }

  deleteControl(event) {
    this.props.deleteControl();
    this.props.clearSelectedControl(event);
  }

  showDeleteButton() {
    if (this.props.showDeleteButton) {
      return (
        <button className="remove-control-button" onClick={this.deleteControl}>
          <i aria-hidden="true" className="fa fa-trash"></i>
        </button>
      );
    }
    return null;
  }

  stopEventPropagation(event) {
    this.props.dispatch();
    event.stopPropagation();
  }

  render() {
    const { metadata } = this.props;
    const controls = metadata.controls || [];
    return (
        <fieldset
          className="form-builder-fieldset"
          onClick={ (e) => this.stopEventPropagation(e) }
        >
          {this.showDeleteButton()}
          {this.displayLabel()}
          <div className="obsGroup-controls">
            <Grid
              controls={ controls }
              idGenerator={this.props.idGenerator}
              minRows={2}
              ref={ this.storeGridRef }
              showDeleteButton
              wrapper={this.props.wrapper}
            />
          </div>
        </fieldset>
    );
  }
}

SectionDesigner.propTypes = {
  clearSelectedControl: PropTypes.func.isRequired,
  deleteControl: PropTypes.func.isRequired,
  dispatch: PropTypes.func,
  idGenerator: PropTypes.object.isRequired,
  metadata: PropTypes.shape({
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
  showDeleteButton: PropTypes.bool,
  wrapper: PropTypes.func.isRequired,
};

const descriptor = {
  control: SectionDesigner,
  designProperties: {
    displayName: 'Section',
    isTopLevelComponent: true,
  },
  metadata: {
    attributes: [
      {
        name: 'type',
        dataType: 'text',
        defaultValue: 'section',
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
            defaultValue: 'Section',
          },
        ],
      },
      {
        name: 'properties',
        dataType: 'complex',
        attributes: [],
      },
    ],
  },
};

ComponentStore.registerDesignerComponent('section', descriptor);
