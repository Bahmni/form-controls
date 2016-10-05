import React, { Component, PropTypes } from 'react';
import { CellDesigner } from 'components/designer/Cell.jsx';
import Constants from 'src/constants';

export const rowWidth = Constants.Grid.defaultRowWidth;

export class GridDesigner extends Component {

  createCells() {
    const { columns: cols } = this.props;
    const cells = [];
    for (let i = 0; i < cols; ++i) {
      cells.push(
        <CellDesigner key={i} location={ { row: 0, column: i } } >
          { this.props.children }
        </CellDesigner>);
    }
    return cells;
  }

  render() {
    return (
      <div className="grid" >
        { this.createCells() }
      </div>
    );
  }
}

GridDesigner.propTypes = {
  columns: PropTypes.number,
};

GridDesigner.defaultProps = {
  columns: rowWidth,
};


const descriptor = {
  control: GridDesigner,
  designProperties: {
    isTopLevelComponent: false,
  },
  metadata: {
    attributes: [
      {
        name: 'columns',
        dataType: 'number',
        defaultValue: rowWidth.toString(),
      },
    ],
  },
};

window.componentStore.registerDesignerComponent('grid', descriptor);
