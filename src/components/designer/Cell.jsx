import React, { PropTypes } from 'react';
import { DropTarget } from 'src/components/DropTarget.jsx';
import Constants from 'src/constants';


const style = {
  display: 'inline-block',
  width: '60px',
  height: '40px',
  border: '1px solid',
  padding: '2px 2px 2px 2px',
  background: 'white',
};

const cellPosition = (row, column) => (Constants.Grid.defaultRowWidth * row + column);
const cellDefaultControl = (cellName) => () => (<span>{cellName}</span>);

export class CellDesigner extends DropTarget {
  constructor(props) {
    super(props);
    const { row, column } = props.location;
    this.occupied = false;
    this.cellPosition = cellPosition(row, column);
    this.state = {
      component: React.createElement(cellDefaultControl(`cell${this.cellPosition}`)),
    };
  }

  postDropProcess(type) {
    if (!this.occupied) {
      const control = window.componentStore.getDesignerComponent(type).control;
      const component = React.createElement(control, {metadata:{value: 'LBL', type: 'label'}})
      this.occupied = true;
      this.setState({ component });
    }
  }

  render() {
    console.log('cell', this.state.component);
    return (
      <div
        className={`cell${this.cellPosition}` }
        onDragOver={ this.onDragOver }
        onDrop={ this.onDrop }
        pos={ this.cellPosition }
        style={style}
      >{this.state.component}</div>
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
