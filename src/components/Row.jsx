import React, {  Component } from 'react';
import { getControls, getGroupedControls } from '../helpers/controlsParser';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import classNames from 'classnames';
import find from 'lodash/find';


export default class Row extends Component {

  getControlsByColumn(sortedColumnControls, records, childProps) {
    const columnControls = [];
    map(sortedColumnControls, control => {
      const column = control[0].properties.location.column;
      const className = `form-builder-column form-builder-column-${column}`;
      const controls = getControls(control, records, childProps);
      columnControls.push({ controls, className });
    });
    if (this.shouldDisplayControls(columnControls)) {
      return map(columnControls,
          obj => this.getAddMoreControls(obj.controls, obj.className));
    }
    return null;
  }

  getAddMoreControls(controls, className) {
    return controls.map((control, index) => (
      control.map(ctrl =>
        <div className="form-builder-column-wrapper">
          <div className={classNames(`${className}-index${index}`, { hidden: ctrl.props.hidden },
            { 'same-line': find(ctrl.props.metadata.properties,
              (value, key) => (key === 'sameLine' && value)) }
            )}
            key={ ctrl.props.formFieldPath }
          >
            {ctrl}
          </div>
        </div>
      )
    ));
  }

  shouldDisplayControls(columnControls) {
    let showControls = false;
    columnControls.forEach((controls) => {
      controls.controls.forEach((control) => {
        control.forEach(ctrl => {
          if (!ctrl.props.hidden) {
            showControls = true;
          }
        });
      });
    });
    return showControls;
  }

  render() {
    const { controls, records, isInTable, ...childProps } = this.props;
    let shouldDisplayLeftEmptyCell = false;
    let shouldDisplayRightEmptyCell = false;
    const groupedColumnControls = getGroupedControls(controls, 'column');
    if (groupedColumnControls.length < 2 && isInTable) {
      const column = groupedColumnControls[0][0].properties.location.column;
      if (column === 0) {
        shouldDisplayRightEmptyCell = true;
      } else {
        shouldDisplayLeftEmptyCell = true;
      }
    }
    const rowElement = this.getControlsByColumn(groupedColumnControls, records, childProps);
    return (
      <div className="form-builder-row">
        {rowElement && shouldDisplayLeftEmptyCell &&
          <div className="form-builder-column-wrapper">
            <div className={classNames('form-builder-column', 'form-builder-column-empty-left')}>
            </div>
          </div>
        }
        {rowElement}
        {rowElement && shouldDisplayRightEmptyCell &&
         <div className="form-builder-column-wrapper">
            <div className={classNames('form-builder-column', 'form-builder-column-empty-right')}>
            </div>
          </div>
        }
      </div>
    );
  }
}

Row.propTypes = {
  collapse: PropTypes.bool,
  controls: PropTypes.array.isRequired,
  formName: PropTypes.string.isRequired,
  formVersion: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  isInTable: PropTypes.bool,
  onValueChanged: PropTypes.func.isRequired,
  records: PropTypes.any.isRequired,
  validate: PropTypes.bool.isRequired,
  validateForm: PropTypes.bool.isRequired,
};
