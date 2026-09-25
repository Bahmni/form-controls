import { Component } from 'react';
import ComponentStore from '../../helpers/componentStore';
import PropTypes from 'prop-types';
import React from 'react';
import { LabelDesigner } from 'components/designer/Label.jsx';
import { GridDesigner } from 'components/designer/Grid.jsx';
import { CellDesigner } from 'components/designer/Cell.jsx';

const supportedControlTypes = ['obsControl'];
const unsupportedProperties = ['addMore'];

const NO_OF_TABLE_COLUMNS = 3;

export class TableDesigner extends Component {

  constructor(props) {
    super(props);
    this.metadata = props.metadata;
    this.labelControls = [];
    this.handleControlDrop = this.handleControlDrop.bind(this);
    this.storeGridRef = this.storeGridRef.bind(this);
    this.storeLabelRef = this.storeLabelRef.bind(this);
    this.storeHeaderRef = this.storeHeaderRef.bind(this);
    this.deleteControl = this.deleteControl.bind(this);
  }

  getJsonDefinition() {
    if (!this.gridRef) return undefined;
    const controls = [];
    const columnHeaders = [];
    const { metadata } = this.props;
    if (this.labelControls.length > 0) {
      this.labelControls.forEach(
        (labelControl) => {
          columnHeaders.push(labelControl.getJsonDefinition());
        });
    }
    const headerJsonDefinition = this.headerControl && this.headerControl.getJsonDefinition();
    if (metadata) {controls.push(...this.gridRef.getControls());}
    return Object.assign({}, metadata, { controls }, { label: headerJsonDefinition },
        { columnHeaders });
  }

  getColumnHeaderLabelObject(columnIndex) {
    const columnHeaders = this.props.metadata.columnHeaders;
    return columnHeaders && columnHeaders.length > 0 ? columnHeaders[columnIndex]
        : { type: 'label' };
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

  displayLabel(value, columnIndex) {
    const { metadata: { id } } = this.props;
    const label = this.getColumnHeaderLabelObject(columnIndex);
    const data = Object.assign({}, label, { id, value });
    return (
      <LabelDesigner
        key={value}
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

  displayColumnHeaders(columnHeaders) {
    const columnHeaderLabels = [];
    for (let columnIndex = 0; columnIndex < NO_OF_TABLE_COLUMNS; columnIndex++) {
      columnHeaderLabels.push(this.displayLabel(columnHeaders.length > 0 ?
         columnHeaders[columnIndex].value : `Column${columnIndex + 1}`, columnIndex));
    }
    return columnHeaderLabels;
  }

  stopEventPropagation(event) {
    this.props.dispatch();
    event.stopPropagation();
  }

  handleControlDrop({ metadata, cellMetadata, successCallback, dropCell }) {
    const dragSourceCell = this.props.dragSourceCell;
    function onSuccessfulControlDrop() {
      const hasOnlySupportedControlTypes = supportedControlTypes.includes(metadata.type);
      const hasNoElementInCell = cellMetadata.length === 0;
      if (hasOnlySupportedControlTypes && hasNoElementInCell) {
        successCallback(Object.assign({}, metadata, { unsupportedProperties }));
      } else if (dragSourceCell) {
        dragSourceCell.updateMetadata(metadata);
      }
    }
    this.props.onControlDrop({ metadata, cellMetadata,
      successCallback: onSuccessfulControlDrop, dropCell });
  }

  render() {
    const { metadata } = this.props;
    const controls = metadata.controls || [];
    const columnHeaders = metadata.columnHeaders || [];
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
            {this.displayColumnHeaders(columnHeaders)}
          </div>
          <GridDesigner
            controls={controls}
            dragSourceCell={this.props.dragSourceCell}
            idGenerator={this.props.idGenerator}
            isBeingDragged ={this.props.isBeingDragged}
            loadFormJson={this.props.loadFormJson}
            minColumns={NO_OF_TABLE_COLUMNS}
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
  dragSourceCell: PropTypes.instanceOf(CellDesigner),
  idGenerator: PropTypes.object.isRequired,
  isBeingDragged: PropTypes.bool,
  loadFormJson: PropTypes.func,
  metadata: PropTypes.shape({
    columnHeaders: PropTypes.arrayOf(PropTypes.string),
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
  onControlDrop: PropTypes.func,
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
