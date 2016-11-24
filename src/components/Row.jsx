import React, { PropTypes, Component } from 'react';
import { getControls, getGroupedControls } from 'src/helpers/controlsParser';
import map from 'lodash/map';

export default class Row extends Component {

  getControlsByColumn(sortedColumnControls, observations, childProps) {
    return map(sortedColumnControls, (control, index) => {
      const column = control[0].properties.location.column;
      const className = `form-builder-column form-builder-column-${column}`;
      return (
        <div className={className} key={index}>
          {getControls(control, observations, childProps)}
        </div>
      );
    });
  }

  render() {
    const { controls, formUuid, observations, onValueChanged } = this.props;
    const childProps = {
      formUuid,
      ref: this.storeChildRef,
      onValueChanged,
    };
    const groupedColumnControls = getGroupedControls(controls, 'column');
    return (
      <div className="form-builder-row">
        {this.getControlsByColumn(groupedColumnControls, observations, childProps)}
      </div>
    );
  }
}

Row.propTypes = {
  controls: PropTypes.array.isRequired,
  formUuid: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  observations: PropTypes.array.isRequired,
  onValueChanged: PropTypes.func.isRequired,
  validate: PropTypes.bool.isRequired,
};
