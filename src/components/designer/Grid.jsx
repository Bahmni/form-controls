import React, { Component, PropTypes } from 'react';
import { RowDesigner } from 'components/designer/Row.jsx';
import map from 'lodash/map';
import maxBy from 'lodash/maxBy';
import groupBy from 'lodash/groupBy';
import get from 'lodash/get';
import constants from 'src/constants';
import ComponentStore from 'src/helpers/componentStore';

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
                  dragAllowed={this.props.dragAllowed}
                  idGenerator={ this.props.idGenerator }
                  key={i}
                  onChange={this.changeHandler}
                  ref={this.rowReference}
                  rowData={ get(this.rowData, i, []) }
                  rowPosition={i}
                  setError={this.props.setError}
                  showDeleteButton={ this.props.showDeleteButton }
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
            <div className="grid">
                { this.createRows() }
            </div>
    );
  }
}

GridDesigner.propTypes = {
  controls: PropTypes.array.isRequired,
  dragAllowed: PropTypes.bool,
  idGenerator: PropTypes.object.isRequired,
  minRows: PropTypes.number,
  setError: PropTypes.func,
  showDeleteButton: PropTypes.bool,
  wrapper: PropTypes.func.isRequired,
};

GridDesigner.defaultProps = {
  minRows: constants.Grid.minRows,
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
