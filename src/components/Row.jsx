import React, { PropTypes, Component } from 'react';
import { getControls, getGroupedControls } from 'src/helpers/controlsParser';
import map from 'lodash/map';

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
        <div className={`${className}-index${index}`} key={ ctrl.props.obs.formFieldPath }>
          {ctrl}
        </div>
      )
    ));
  }

  render() {
    const { controls, records, ...childProps } = this.props;
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
  formName: PropTypes.string.isRequired,
  formVersion: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  onValueChanged: PropTypes.func.isRequired,
  records: PropTypes.any.isRequired,
  validate: PropTypes.bool.isRequired,
};
