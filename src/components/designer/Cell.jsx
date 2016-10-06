import React, { PropTypes } from 'react';
import { DropTarget } from 'src/components/DropTarget.jsx';
import Constants from 'src/constants';
import map from 'lodash/map';


const style = {
  display: 'inline-block',
  width: '60px',
  height: '40px',
  border: '1px solid',
  padding: '2px 2px 2px 2px',
  background: 'white',
};

const cellPosition = (row, column) => (Constants.Grid.defaultRowWidth * row + column);
const cellDefaultControl = (cellName) => () => (<span>{ cellName }</span>);

export class CellDesigner extends DropTarget {
  constructor(props) {
    super(props);
    const { row, column } = props.location;
    this.cellPosition = cellPosition(row, column);
    this.state = {
      defaultComponent: React.createElement(cellDefaultControl(`cell${this.cellPosition}`)),
      controlContexts: [],
    };
    this.getCellDefinition = this.getCellDefinition.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    this.updateMetadata = this.updateMetadata.bind(this);
  }

  processMove(context) {
    if (context.data && context.data.id) {
      const controlContexts = this.state.controlContexts.filter(
        (controlContext) => controlContext.data.id !== context.data.id
      );
      this.setState({ controlContexts });
    }
  }

  processDrop(context) {
    const controlContexts = this.state.controlContexts;
    controlContexts.push(context);
    this.changeHandler(this.cellPosition);
    this.setState({ controlContexts });
  }

  updateMetadata(newMetadata) {
    var updatedControlContexts = map(this.state.controlContexts, (context) => {
      if (context.data.id === newMetadata.id) {
        return Object.assign({}, context, {data: newMetadata});
      }
      return context;
    });
    this.setState( { controlContexts: updatedControlContexts });
  }

  getComponents() {
    if (this.state.controlContexts.length > 0) {
      return this.state.controlContexts.map((context, idx) => {
        return React.cloneElement(this.props.children, { context , parentRef: this, onUpdateMetadata: this.updateMetadata });
      });
    }
    return this.state.defaultComponent;
  }

  changeHandler(cellLocation) {
    this.props.onChange(cellLocation);
  }

  getCellDefinition() {
    return map(this.state.controlContexts, (controlContext) => controlContext.data) || [];
  }

  render() {
    return (
      <div
        className={ `cell${this.cellPosition}` }
        onDragOver={ this.onDragOver }
        onDrop={ this.onDrop }
        onChange={ this.changeHandler }
        style={style}
      >{ this.getComponents() }</div>
    );
  }
}

CellDesigner.propTypes = {
  location: PropTypes.shape({
    column: PropTypes.number,
    row: PropTypes.number,
  }),
};

CellDesigner.defaultProps = {
  location: {
    column: 0,
    row: 0,
  },
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
            defaultValue: 0,
          },
          {
            name: 'row',
            dataType: 'number',
            defaultValue: 0,
          },
        ],
      },
    ],
  },
};

window.componentStore.registerDesignerComponent('cell', descriptor);
