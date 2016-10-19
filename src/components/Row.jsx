import React, { PropTypes, Component } from 'react';
import * as controlsParser from 'src/helpers/controlsParser';
import map from 'lodash/map';
import { getObsFromChildControls } from 'src/helpers/controlsHelper';

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

  getControlsByColumn(sortedColumnControls, observations, childProps) {
    return map(sortedColumnControls, (control, index) => {
      const columnName = `column-${control[0].properties.location.column}`;
      return (<div className={columnName} key={index}>
        {controlsParser.getControls(control, observations, childProps)}
      </div>);
    });
  }

  storeChildRef(ref) {
    if (ref) this.childControls[ref.props.metadata.id] = ref;
  }

  render() {
    const { controls, formUuid, observations } = this.props;
    const childProps = { formUuid, ref: this.storeChildRef };
    const groupedColumnControls = controlsParser.groupControlsByLocation(controls, 'column');
    const sortedColumnControls = controlsParser.sortGroupedControls(groupedColumnControls);
    return (
      <div className="row">
        {this.getControlsByColumn(sortedColumnControls, observations, childProps)}
      </div>
    );
  }
}

Row.propTypes = {
  controls: PropTypes.array.isRequired,
  formUuid: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  observations: PropTypes.array.isRequired,
};
