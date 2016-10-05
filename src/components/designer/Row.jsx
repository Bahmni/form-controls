import React, { Component, PropTypes } from 'react';
import { CellDesigner } from 'components/designer/Cell.jsx';
import Constants from 'src/constants';

export const rowWidth = Constants.Grid.defaultRowWidth;

export class RowDesigner extends Component {

  constructor(props) {
    super(props);
    this.changeHandler = this.changeHandler.bind(this);
  }

  createCells() {
    const { columns: cols } = this.props;
    const cells = [];
    for (let i = 0; i < cols; ++i) {
      cells.push(<CellDesigner key={i} location={ { row: this.props.rowPosition, column: i } } onChange={this.changeHandler}>
        { this.props.children }
        </CellDesigner>);
    }
    return cells;
  }

  changeHandler(cellPosition) {
    if((cellPosition == ((this.props.rowPosition * this.props.columns) + (this.props.columns-1)))){
      this.props.onChange(this.props.rowPosition);
    }
  }

  render() {
    return (
        <div className={`row${this.props.rowPosition}`} onChange={this.changeHandler}>
          { this.createCells() }
        </div>
    );
  }
}

RowDesigner.propTypes = {
  columns: PropTypes.number,
  rowPosition: PropTypes.number,
};

RowDesigner.defaultProps = {
  columns: rowWidth,
  rowPosition: 0
};


const descriptor = {
  control: RowDesigner,
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
      {
        name: 'rowPosition',
        dataType: 'number',
        defaultValue: 0,
      },
    ],
  },
};

window.componentStore.registerDesignerComponent('row', descriptor);
