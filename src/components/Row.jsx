import React, { PropTypes, Component } from 'react';
import { getControls, getGroupedControls } from 'src/helpers/controlsParser';
import map from 'lodash/map';

export default class Row extends Component {

  getControlsByColumn(sortedColumnControls, records, childProps) {
    return map(sortedColumnControls, (control, index) => {
      const column = control[0].properties.location.column;
      const className = `form-builder-column form-builder-column-${column}`;
      return (
        <div className={className} key={index}>
          {getControls(control, records, childProps)}
        </div>
      );
    });
  }

  render() {
    const { controls, formUuid, records, onValueChanged, validate } = this.props;
    const childProps = { formUuid, onValueChanged, validate };
    const groupedColumnControls = getGroupedControls(controls, 'column');
    return (
      <div className="form-builder-row">
        {this.getControlsByColumn(groupedColumnControls, records, childProps)}
      </div>
    );
  }
}

Row.propTypes = {
  controls: PropTypes.array.isRequired,
  formUuid: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  onValueChanged: PropTypes.func.isRequired,
  records: PropTypes.any.isRequired,
  validate: PropTypes.bool.isRequired,
};
