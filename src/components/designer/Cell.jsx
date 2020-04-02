import React from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'src/components/DropTarget.jsx';
import Constants from 'src/constants';
import each from 'lodash/each';
import isEmpty from 'lodash/isEmpty';
import classNames from 'classnames';
import ComponentStore from 'src/helpers/componentStore';

const cellPosition = (row, column) => (Constants.Grid.defaultRowWidth * row + column);
const defaultCellControl = React.createElement(() => <div className="cell"></div>);

export class CellDesigner extends DropTarget {
  constructor(props) {
    super(props);
    this.state = { data: props.cellData };
    const { row, column } = props.location;
    this.cellPosition = cellPosition(row, column);
    this.getCellDefinition = this.getCellDefinition.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    this.childControls = {};
    this.storeChildRef = this.storeChildRef.bind(this);
    this.deleteControl = this.deleteControl.bind(this);
    this.updateMetadata = this.updateMetadata.bind(this);
    this._setActiveClass(false);
  }

  deleteControl(controlId) {
    const newStateData = this.state.data.filter((control) => control.id !== controlId);
    delete this.childControls[controlId];
    this.setState({ data: newStateData });
  }

  _setActiveClass(active = false) {
    this.className = classNames('form-builder-column', { active });
  }

  processMove(metadata) {
    const filteredData = this.state.data.filter((data) => data.id !== metadata.id);
    this.setState({ data: filteredData });
  }

  processDragEnter() {
    this._setActiveClass(true);
    this.forceUpdate();
  }

  processDragLeave() {
    this._setActiveClass(false);
    this.forceUpdate();
  }
  updateMetadata(newMetadata) {
    const arrayOfMetadata = [];
    arrayOfMetadata.push(newMetadata);
    this.setState({ data: arrayOfMetadata });
  }
  /* eslint-disable no-param-reassign */
  processDrop(metadata) {
    const { data } = this.state;
    const { onControlDrop } = this.props;
    const successCallback = (dropControlMetadata) => {
      if (this.props.dragAllowed === false) {
        return;
      }
      const dataClone = data.slice();
      const metadataClone = Object.assign({}, dropControlMetadata);
      const location = { location: this.props.location };
      metadataClone.properties = Object.assign({}, dropControlMetadata.properties, location);
      dataClone.push(metadataClone);
      this.changeHandler(this.cellPosition);
      this.className = classNames('form-builder-column', { active: false });
      this.setState({ data: dataClone });
    };

    if (this.props.dragAllowed !== false) {
      onControlDrop({ cellMetadata: data, dropCell: this, successCallback, metadata });
    }
  }

  storeChildRef(ref) {
    if (ref) this.childControls[ref.props.metadata.id] = ref;
  }

  getComponents() {
    const data = this.state.data;
    if (isEmpty(data)) {
      return defaultCellControl;
    }
    return data.map((metadata, key) => React.createElement(this.props.wrapper,
      {
        key,
        idGenerator: this.props.idGenerator,
        metadata,
        parentRef: this,
        ref: this.storeChildRef,
        wrapper: this.props.wrapper,
        deleteControl: this.deleteControl,
        setError: this.props.setError,
        showDeleteButton: this.props.showDeleteButton,
        dragSourceCell: this.props.dragSourceCell,
        isBeingDragged: this.props.isBeingDragged,
        dragAllowed: this.props.dragAllowed,
      }
      ));
  }

  changeHandler(cellLocation) {
    if (this.props.onChange) {
      this.props.onChange(cellLocation);
    }
  }

  getCellDefinition() {
    const cellDefinition = [];
    each(this.childControls, (childControl) => {
      if (childControl) {
        cellDefinition.push(childControl.getJsonDefinition());
      }
    });
    return cellDefinition;
  }

  render() {
    return (
      <div className="form-builder-column-wrapper">
        {!this.props.isBeingDragged ?
          <div
            className={this.className}
            onDragOver={(e) => {e.preventDefault();}}
            onDrop={this.onDrop}
          >
          {this.getComponents()}
        </div> : <div
          className={this.className}
        >
        {this.getComponents()}
      </div>}</div>
    );
  }
}

CellDesigner.dropLoc = {
  row: 0,
  column: 0,
};

CellDesigner.propTypes = {
  cellData: PropTypes.array.isRequired,
  dragAllowed: PropTypes.bool,
  idGenerator: PropTypes.object.isRequired,
  isBeingDragged: PropTypes.bool,
  location: PropTypes.shape({
    column: PropTypes.number,
    row: PropTypes.number,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onControlDrop: PropTypes.func,
  setError: PropTypes.func,
  showDeleteButton: PropTypes.bool,
  wrapper: PropTypes.object.isRequired,
};


const descriptor = {
  control: CellDesigner,
  designProperties: {
    isTopLevelComponent: false,
  },
  metadata: {
    attributes: [
      {
        name: 'location',
        dataType: 'complex',
        attributes: [
          {
            name: 'column',
            dataType: 'number',
          },
          {
            name: 'row',
            dataType: 'number',
          },
        ],
      },
    ],
  },
};

ComponentStore.registerDesignerComponent('cell', descriptor);
