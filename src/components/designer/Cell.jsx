import React from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'src/components/DropTarget.jsx';
import Constants from 'src/constants';
import each from 'lodash/each';
import isEmpty from 'lodash/isEmpty';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';
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
    this._setActiveClass(false);
  }

  deleteControl() {
    this.setState({ data: [] });
  }

  _setActiveClass(active = false) {
    this.className = classNames('form-builder-column', { active });
  }

  processMove(metadata) {
    if (!isEqual(this.props.location, CellDesigner.dropLoc)) {
      const filteredData = this.state.data.filter((data) => data.id !== metadata.id);
      this.setState({ data: filteredData });
    }
  }

  processDragEnter() {
    this._setActiveClass(true);
    this.forceUpdate();
  }

  processDragLeave() {
    this._setActiveClass(false);
    this.forceUpdate();
  }

  processDrop(metadata) {
    const { data } = this.state;
    const { supportedControlTypes, allowMultipleControls } = this.props;
    if (this.props.dragAllowed === false ||
      (!allowMultipleControls && data.length >= 1)
      || !(supportedControlTypes.includes(metadata.type))) {
      return;
    }
    const oldLocation = metadata.properties.location;
    const currentLocation = this.props.location;
    CellDesigner.dropLoc = Object.assign({}, this.props.location);
    if (oldLocation && isEqual(oldLocation, currentLocation)) {
      return;
    }
    const dataClone = data.slice();
    const metadataClone = Object.assign({}, metadata);
    const location = { location: this.props.location };
    metadataClone.properties = Object.assign({}, metadata.properties, location);
    dataClone.push(metadataClone);
    this.changeHandler(this.cellPosition);
    this.className = classNames('form-builder-column', { active: false });
    this.setState({ data: dataClone });
  }

  storeChildRef(ref) {
    if (ref) this.childControls[ref.props.metadata.id] = ref;
  }

  getComponents() {
    const data = this.state.data;
    if (isEmpty(data)) {
      return defaultCellControl;
    }
    return data.map((metadata, key) =>
            React.createElement(this.props.wrapper,
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
              }
            )
        );
  }

  changeHandler(cellLocation) {
    if (this.props.onChange) {
      this.props.onChange(cellLocation);
    }
  }

  getCellDefinition() {
    const cellDefinition = [];
    each(this.childControls, (childControl) => {
      if (childControl.getWrappedInstance()) {
        cellDefinition.push(childControl.getWrappedInstance().getJsonDefinition());
      }
    });
    return cellDefinition;
  }

  render() {
    return (
            <div
              className={ this.className }
              onDragEnter={ this.onDragEnter }
              onDragLeave={ this.onDragLeave }
              onDragOver={ this.onDragOver }
              onDrop={ this.onDrop }
            >
                { this.getComponents() }
            </div>
    );
  }
}

CellDesigner.dropLoc = {
  row: 0,
  column: 0,
};

CellDesigner.propTypes = {
  allowMultipleControls: PropTypes.bool,
  cellData: PropTypes.array.isRequired,
  dragAllowed: PropTypes.bool,
  idGenerator: PropTypes.object.isRequired,
  location: PropTypes.shape({
    column: PropTypes.number,
    row: PropTypes.number,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  setError: PropTypes.func,
  showDeleteButton: PropTypes.bool,
  supportedControlTypes: PropTypes.arrayOf(PropTypes.string),
  wrapper: PropTypes.func.isRequired,
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
