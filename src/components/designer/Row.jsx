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
                <CellDesigner
                  allowMultipleControls= { this.props.allowMultipleControls }
                  cellData={ get(this.cellData, i, []) }
                  dragAllowed={ this.props.dragAllowed }
                  idGenerator={ this.props.idGenerator }
                  key={i}
                  location={{ column: i, row: this.props.rowPosition }}
                  onChange={ this.changeHandler }
                  ref={ this.cellReference }
                  setError={this.props.setError}
                  showDeleteButton={ this.props.showDeleteButton }
                  supportedControlTypes = {this.props.supportedControlTypes}
                  wrapper={ this.props.wrapper }
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
  allowMultipleControls: PropTypes.bool,
  columns: PropTypes.number,
  dragAllowed: PropTypes.bool,
  idGenerator: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  rowData: PropTypes.array.isRequired,
  rowPosition: PropTypes.number.isRequired,
  setError: PropTypes.func,
  showDeleteButton: PropTypes.bool,
  supportedControlTypes: PropTypes.arrayOf(PropTypes.string),
  wrapper: PropTypes.func.isRequired,
};

RowDesigner.defaultProps = {
  columns: rowWidth,
  allowMultipleControls: true,
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
