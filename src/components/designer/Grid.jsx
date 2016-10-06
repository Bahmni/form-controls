import React, { Component, PropTypes } from 'react';
import { RowDesigner } from 'components/designer/Row.jsx';
import Constants from 'src/constants';
import map from 'lodash/map';

export const totalRows = Constants.Grid.defaultRows;

export class GridDesigner extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      rowPosition : props.rowPosition
    };
    this.changeHandler = this.changeHandler.bind(this);
    this.rowReference = this.rowReference.bind(this);
    this.rowRef = {};
  }

  rowReference(ref) {
    if(ref){
      console.log("key", ref.props.rowPosition);
      this.rowRef[ref.props.rowPosition] = ref;
    }
  }
  createRows() {
    const { rowPosition: rowSize } = this.state;
    const rows = [];
    for (let i = 0; i <= rowSize; ++i) {
      rows.push(
          <RowDesigner key={i} ref={this.rowReference} rowPosition={i} onChange={this.changeHandler}>
            { this.props.children } 
          </RowDesigner >);
    }
    return rows;
  }
  
  changeHandler(value) {
    if((this.state.rowPosition == 0) || (value == this.state.rowPosition)) {
      this.setState({rowPosition : this.state.rowPosition+1})
    }
  }

  getControls(){
    var controls = map(this.rowRef, (ref) => ref.getRowDefinition()) || [];
    return [].concat(...controls);
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
