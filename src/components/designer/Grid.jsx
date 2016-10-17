import React, { Component, PropTypes } from 'react';
import { RowDesigner } from 'components/designer/Row.jsx';
import map from 'lodash/map';
import maxBy from 'lodash/maxBy';
import groupBy from 'lodash/groupBy';
import get from 'lodash/get';

export class GridDesigner extends Component {
  constructor(props) {
    super(props);
    this.rowData = groupBy(props.controls, 'properties.location.row');
    this.state = { rowCount: this._getRowCount() };
    this.changeHandler = this.changeHandler.bind(this);
    this.rowReference = this.rowReference.bind(this);
    this.rowRef = {};
  }

  getControls() {
    const controls = map(this.rowRef, (ref) => ref.getRowDefinition()) || [];
    return [].concat(...controls);
  }

  _getRowCount() {
    const maxRow = maxBy(this.props.controls, (control) => control.properties.location.row);
    if (maxRow) return maxRow.properties.location.row;
    return 0;
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
          rowData={ get(this.rowData, i, []) }
          rowPosition={i}
          wrapper={ this.props.wrapper }
        />);
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
  controls: PropTypes.array.isRequired,
  wrapper: PropTypes.func.isRequired,
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
      },
    ],
  },
};

window.componentStore.registerDesignerComponent('grid', descriptor);
