import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CellDesigner } from 'components/designer/Cell.jsx';
import Constants from 'src/constants';
import map from 'lodash/map';
import groupBy from 'lodash/groupBy';
import get from 'lodash/get';
import ComponentStore from 'src/helpers/componentStore';

export const rowWidth = Constants.Grid.defaultRowWidth;

export class RowDesigner extends Component {

  constructor(props) {
    super(props);
    this.changeHandler = this.changeHandler.bind(this);
    this.cellReference = this.cellReference.bind(this);
    this.cellRef = {};
    this.cellData = groupBy(props.rowData, 'properties.location.column');
  }

  componentWillReceiveProps(nextProps) {
    this.cellData = groupBy(nextProps.rowData, 'properties.location.column');
  }

  getRowDefinition() {
    const cells = map(this.cellRef, (ref) => ref.getCellDefinition()) || [];
    return [].concat(...cells);
  }

  changeHandler() {
    if (this.props.onChange) {
      this.props.onChange(this.props.rowPosition);
    }
  }

  createCells() {
    const { columns } = this.props;
    const cells = [];
    for (let i = 0; i < columns; ++i) {
      cells.push(
        <CellDesigner cellData={get(this.cellData, i, [])}
          dragAllowed={this.props.dragAllowed}
          dragSourceCell={this.props.dragSourceCell}
          idGenerator={this.props.idGenerator}
          isBeingDragged={this.props.isBeingDragged}
          key={i}
          location={{ column: i, row: this.props.rowPosition }}
          onChange={this.changeHandler}
          onControlDrop={this.props.onControlDrop}
          ref={this.cellReference}
          setError={this.props.setError}
          showDeleteButton={this.props.showDeleteButton}
          wrapper={this.props.wrapper}
        />);
    }
    return cells;
  }

  cellReference(ref) {
    if (ref) {
      this.cellRef[ref.props.location.column] = ref;
    }
  }

  render() {
    return (
            <div className={`form-builder-row row${this.props.rowPosition}`}
              onChange={ this.changeHandler }
            >
                { this.createCells() }
            </div>
    );
  }
}

RowDesigner.propTypes = {
  columns: PropTypes.number,
  dragAllowed: PropTypes.bool,
  dragSourceCell: PropTypes.instanceOf(CellDesigner),
  idGenerator: PropTypes.object.isRequired,
  isBeingDragged: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onControlDrop: PropTypes.func,
  rowData: PropTypes.array.isRequired,
  rowPosition: PropTypes.number.isRequired,
  setError: PropTypes.func,
  showDeleteButton: PropTypes.bool,
  wrapper: PropTypes.func.isRequired,
};

RowDesigner.defaultProps = {
  columns: rowWidth,
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

ComponentStore.registerDesignerComponent('row', descriptor);
