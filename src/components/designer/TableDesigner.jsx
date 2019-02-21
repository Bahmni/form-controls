import { Component } from 'react';
import ComponentStore from '../../helpers/componentStore';
import PropTypes from 'prop-types';
import React from 'react';
import { LabelDesigner } from 'components/designer/Label.jsx';
import { GridDesigner } from 'components/designer/Grid.jsx';

const supportedControlTypes = ['obsControl'];
const unsupportedProperties = ['addMore'];

export class TableDesigner extends Component {

  constructor(props) {
    super(props);
    this.metadata = props.metadata;
    this.labelControls = [];
    this.handleDropTarget = this.handleControlDrop.bind(this);
    this.storeGridRef = this.storeGridRef.bind(this);
    this.storeLabelRef = this.storeLabelRef.bind(this);
    this.storeHeaderRef = this.storeHeaderRef.bind(this);
    this.deleteControl = this.deleteControl.bind(this);
  }

  getJsonDefinition() {
    if (!this.gridRef) return undefined;
    const controls = [];
    const { metadata } = this.props;
    if (this.labelControls.length > 0) {
      this.labelControls.forEach(
        (labelControl) => {
          controls.push(labelControl.getJsonDefinition());
        });
    }
    const headerJsonDefinition = this.headerControl && this.headerControl.getJsonDefinition();
    if (metadata) {controls.push(...this.gridRef.getControls());}
    return Object.assign({}, metadata, { controls }, { label: headerJsonDefinition });
  }

  storeGridRef(ref) {
    if (ref) {
      this.gridRef = ref;
    }
  }

  storeLabelRef(ref) {
    if (ref) {
      this.labelControls.push(ref);
    }
  }

  storeHeaderRef(ref) {
    if (ref) {
      this.headerControl = ref;
    }
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

  displayLabel(value) {
    const { metadata: { label, id } } = this.props;
    const data = Object.assign({}, label, { id, value });
    return (
      <LabelDesigner
        metadata={data}
        ref={this.storeLabelRef}
        showDeleteButton={false}
      />
    );
  }

  displayTableHeader() {
    const { metadata: { label, id } } = this.props;
    const data = Object.assign({}, label, { id });
    return (
      <LabelDesigner
        metadata={data}
        ref={this.storeHeaderRef}
        showDeleteButton={false}
      />
    );
  }

  stopEventPropagation(event) {
    this.props.dispatch();
    event.stopPropagation();
  }

  handleControlDrop(metadata, cellMetadata, successCallback) {
    const hasOnlySupportedControlTypes = supportedControlTypes.includes(metadata.type);
    const hasNoElementInCell = cellMetadata.length === 0;
    if (hasOnlySupportedControlTypes && hasNoElementInCell) {
      successCallback(Object.assign({}, metadata, { unsupportedProperties }));
    }
  }

  render() {
    const { metadata } = this.props;
    const controls = metadata.controls || [];
    return (
      <fieldset
        className="form-builder-fieldset"
        onClick={(event) => {
          this.stopEventPropagation(event);
          this.props.onSelect(event, metadata);
        }}
      >
        {this.displayTableHeader()}
        {this.showDeleteButton()}
        <div className="table-controls">
          <div className="header">
            {this.displayLabel(controls[0] ? controls[0].value : 'Column1')}
            {this.displayLabel(controls[1] ? controls[1].value : 'Column2')}
          </div>
          <GridDesigner
            controls={controls.slice(2)}
            idGenerator={this.props.idGenerator}
            minColumns={2}
            minRows={2}
            onControlDrop ={this.handleControlDrop}
            ref={this.storeGridRef}
            showDeleteButton
            wrapper={this.props.wrapper}
          />
        </div>
      </fieldset>
    );
  }
}

TableDesigner.propTypes = {
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
        column: PropTypes.number,
        row: PropTypes.number,
      }),
    }),
    type: PropTypes.string.isRequired,
  }),
  onSelect: PropTypes.func.isRequired,
  showDeleteButton: PropTypes.bool,
  wrapper: PropTypes.func.isRequired,
};

const descriptor = {
  control: TableDesigner,
  designProperties: {
    displayName: 'Table',
    isTopLevelComponent: true,
  },
  metadata: {
    attributes: [
      {
        name: 'type',
        dataType: 'text',
        defaultValue: 'table',
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
            defaultValue: 'Table',
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
ComponentStore.registerDesignerComponent('table', descriptor);
