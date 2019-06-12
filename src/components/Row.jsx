import React, { PropTypes, Component } from 'react';
import { getControls, getGroupedControls } from '../helpers/controlsParser';
import map from 'lodash/map';
import classNames from 'classnames';
import find from 'lodash/find';


export default class Row extends Component {

  getControlsByColumn(sortedColumnControls, records, childProps) {
    return map(sortedColumnControls, control => {
      const column = control[0].properties.location.column;
      const className = `form-builder-column form-builder-column-${column}`;
      const controls = getControls(control, records, childProps);
      return this.getAddMoreControls(controls, className);
    });
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
    return (
      <div className="form-builder-row">
        {shouldDisplayLeftEmptyCell &&
          <div className="form-builder-column-wrapper">
            <div className={classNames('form-builder-column', 'form-builder-column-empty-left')}>
            </div>
          </div>
        }
        {this.getControlsByColumn(groupedColumnControls, records, childProps)}
        {shouldDisplayRightEmptyCell &&
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
