import React, { Component, PropTypes } from 'react';
import { RowDesigner } from 'components/designer/Row.jsx';
import Constants from 'src/constants';

export const totalRows = Constants.Grid.defaultRows;

export class GridDesigner extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      rowPosition : props.rowPosition
    };
    this.changeHandler = this.changeHandler.bind(this);
  }

  createRows() {
    const { rowPosition: rowSize } = this.state;
    const rows = [];
    for (let i = 0; i <= rowSize; ++i) {
      rows.push(
          <RowDesigner key={i} rowPosition={i} onChange={this.changeHandler}>  
            { this.props.children } 
          </RowDesigner >);
    }
    console.log("all",rows);
    return rows;
  }
  
  changeHandler(value) {
    if((this.state.rowPosition == 0) || (value == this.state.rowPosition)) {
      console.log("updated")
      this.setState({rowPosition : this.state.rowPosition+1})
    }
  }

  render() {
    return (
      <div className="grid" >
        { this.createRows() }
      </div>
    );
  }
}

GridDesigner.propTypes = {
  rowPosition: PropTypes.number,
};

GridDesigner.defaultProps = {
  rowPosition: totalRows,
};


const descriptor = {
  control: GridDesigner,
  designProperties: {
    isTopLevelComponent: false,
  },
  metadata: {
    attributes: [
      {
        name: 'rowPosition',
        dataType: 'number',
        defaultValue: totalRows.toString(),
      },
    ],
  },
};

window.componentStore.registerDesignerComponent('grid', descriptor);
