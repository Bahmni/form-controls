import React, { Component, PropTypes } from 'react';
import { RowDesigner } from 'components/designer/Row.jsx';
import Constants from 'src/constants';
import map from 'lodash/map';

export const totalRows = Constants.Grid.defaultRowCount;

export class GridDesigner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rowCount: props.rowCount,
    };
    this.changeHandler = this.changeHandler.bind(this);
    this.rowReference = this.rowReference.bind(this);
    this.rowRef = {};
  }

  getControls() {
    const controls = map(this.rowRef, (ref) => ref.getRowDefinition()) || [];
    return [].concat(...controls);
  }

  changeHandler(value) {
    if ((this.state.rowCount === 0) || (value === this.state.rowCount)) {
      this.setState({ rowCount: this.state.rowCount + 1 });
    }
  }

  createRows() {
    const { rowCount } = this.state;
    const rows = [];
    for (let i = 0; i <= rowCount; ++i) {
      rows.push(
        <RowDesigner
          key={i}
          onChange={this.changeHandler}
          ref={this.rowReference}
          rowPosition={i}
        >
          { this.props.children }
        </RowDesigner >);
    }
    return rows;
  }

  rowReference(ref) {
    if (ref) {
      this.rowRef[ref.props.rowPosition] = ref;
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
  rowCount: PropTypes.number,
};

GridDesigner.defaultProps = {
  rowCount: totalRows,
};


const descriptor = {
  control: GridDesigner,
  designProperties: {
    isTopLevelComponent: false,
  },
  metadata: {
    attributes: [
      {
        name: 'rowCount',
        dataType: 'number',
        defaultValue: totalRows.toString(),
      },
    ],
  },
};

window.componentStore.registerDesignerComponent('grid', descriptor);
