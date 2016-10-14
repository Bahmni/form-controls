import React, { PropTypes } from 'react';
import { DropTarget } from 'src/components/DropTarget.jsx';
import Constants from 'src/constants';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';

const style = {
  display: 'inline-block',
  minWidth: '60px',
  minHeight: '40px',
  height: 'auto',
  width: 'auto',
  border: '1px solid',
  padding: '2px 2px 2px 2px',
  background: 'white',
};

const cellPosition = (row, column) => (Constants.Grid.defaultRowWidth * row + column);
const defaultCellControl = React.createElement(() => <div className="cell" ></div>);

export class CellDesigner extends DropTarget {
  constructor(props) {
    super(props);
    this.state = { data: props.cellData };
    const { row, column } = props.location;
    this.cellPosition = cellPosition(row, column);
    this.getCellDefinition = this.getCellDefinition.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    this.updateMetadata = this.updateMetadata.bind(this);
  }

  processMove(metadata) {
    const filteredData = this.state.data.filter((data) => data.id !== metadata.id);
    this.setState({ data: filteredData });
  }

  processDrop(metadata) {
    const dataClone = this.state.data.slice();
    const metadataClone = Object.assign({}, metadata);
    const location = { location: this.props.location };
    metadataClone.properties = Object.assign({}, metadata.properties, location);
    dataClone.push(metadataClone);
    this.changeHandler(this.cellPosition);
    this.setState({ data: dataClone });
  }

  updateMetadata(newMetadata) {
    const updatedData = map(this.state.data, (data) => {
      if (data.id === newMetadata.id) return newMetadata;
      return data;
    }
  );
    this.setState({ data: updatedData });
  }

  getComponents() {
    const data = this.state.data;
    if (isEmpty(data)) {
      return defaultCellControl;
    }
    return data.map(metadata =>
      React.cloneElement(this.props.children,
        { metadata, parentRef: this, onUpdateMetadata: this.updateMetadata }
      )
    );
  }

  changeHandler(cellLocation) {
    this.props.onChange(cellLocation);
  }

  getCellDefinition() {
    return this.state.data;
  }

  render() {
    return (
      <div
        className="cell-container"
        onChange={ this.changeHandler }
        onDragOver={ this.onDragOver }
        onDrop={ this.onDrop }
        style={ style }
      >
        { this.getComponents() }
      </div>
    );
  }
}

CellDesigner.propTypes = {
  cellData: PropTypes.array.isRequired,
  location: PropTypes.shape({
    column: PropTypes.number,
    row: PropTypes.number,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
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

window.componentStore.registerDesignerComponent('cell', descriptor);
