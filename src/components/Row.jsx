import React, { PropTypes, Component } from 'react';
import { getControls, getGroupedControls } from 'src/helpers/controlsParser';
import map from 'lodash/map';
import { getErrorsFromChildControls, getObsFromChildControls } from 'src/helpers/controlsHelper';

export default class Row extends Component {
  constructor(props) {
    super(props);
    this.childControls = {};
    this.storeChildRef = this.storeChildRef.bind(this);
  }

  getValue() {
    const observations = getObsFromChildControls(this.childControls);
    return [].concat.apply([], observations).filter(obs => obs !== undefined);
  }

  getErrors() {
    return getErrorsFromChildControls(this.childControls);
  }

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

  storeChildRef(ref) {
    if (ref) this.childControls[ref.props.metadata.id] = ref;
  }

  render() {
    const { controls, errors, formUuid, observations } = this.props;
    const childProps = { errors, formUuid, ref: this.storeChildRef, controlTree: this.props.controlTree };
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
  errors: PropTypes.array.isRequired,
  formUuid: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  observations: PropTypes.array.isRequired,
};
