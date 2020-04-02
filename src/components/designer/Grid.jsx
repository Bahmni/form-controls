import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { RowDesigner } from 'components/designer/Row.jsx';
import map from 'lodash/map';
import maxBy from 'lodash/maxBy';
import groupBy from 'lodash/groupBy';
import get from 'lodash/get';
import constants from 'src/constants';
import ComponentStore from 'src/helpers/componentStore';
import { CellDesigner } from 'components/designer/Cell.jsx';

export class GridDesigner extends Component {
  constructor(props) {
    super(props);
    this.rowData = groupBy(props.controls, 'properties.location.row');
    this.state = { rowCount: this._getRowCount() };
    this.changeHandler = this.changeHandler.bind(this);
    this.rowReference = this.rowReference.bind(this);
    this.rowRef = {};
  }

  componentWillReceiveProps(nextProps) {
    this.rowData = groupBy(nextProps.controls, 'properties.location.row');
  }

  getControls() {
    const controls = map(this.rowRef, (ref) => ref.getRowDefinition()) || [];
    return [].concat(...controls);
  }

  _getRowCount() {
    const maxRow = maxBy(this.props.controls, (control) => control.properties.location.row);
    if (maxRow) return Math.max(maxRow.properties.location.row + 2, this.props.minRows);
    return this.props.minRows;
  }

  changeHandler(value) {
    if (value === this.state.rowCount - 1) {
      this.setState({ rowCount: this.state.rowCount + 1 });
    }
  }

  createRows() {
    const { rowCount } = this.state;
    const rows = [];
    for (let i = 0; i < rowCount; ++i) {
      rows.push(
        <RowDesigner
          columns={this.props.minColumns}
          dragAllowed={this.props.dragAllowed}
          dragSourceCell={this.props.dragSourceCell}
          idGenerator={this.props.idGenerator}
          index={i}
          isBeingDragged ={this.props.isBeingDragged}
          key={i}
          onChange={this.changeHandler}
          onControlDrop={this.props.onControlDrop}
          ref={this.rowReference}
          rowData={get(this.rowData, i, [])}
          rowPosition={i}
          setError={this.props.setError}
          showDeleteButton={this.props.showDeleteButton}
          wrapper={this.props.wrapper}
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
      <div className="grid">
        {this.createRows()}
      </div>
    );
  }
}

GridDesigner.propTypes = {
  controls: PropTypes.array.isRequired,
  dragAllowed: PropTypes.bool,
  dragSourceCell: PropTypes.instanceOf(CellDesigner),
  idGenerator: PropTypes.object.isRequired,
  isBeingDragged: PropTypes.bool,
  minColumns: PropTypes.number,
  minRows: PropTypes.number,
  onControlDrop: PropTypes.func,
  setError: PropTypes.func,
  showDeleteButton: PropTypes.bool,
  wrapper: PropTypes.object.isRequired,
};

GridDesigner.defaultProps = {
  minColumns: constants.Grid.minColumns,
  minRows: constants.Grid.minRows,
  unsupportedProperties: [],
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

ComponentStore.registerDesignerComponent('grid', descriptor);
