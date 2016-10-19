import React, { PropTypes, Component } from 'react';
import Row from 'src/components/Row.jsx';
import { groupControlsByLocation, sortGroupedControls } from 'src/helpers/controlsParser';
import { getObsFromChildControls } from 'src/helpers/controlsHelper';
import map from 'lodash/map';

export class Container extends Component {
  constructor(props) {
    super(props);
    this.childControls = {};
    this.storeChildRef = this.storeChildRef.bind(this);
  }

  getValue() {
    const observations = getObsFromChildControls(this.childControls);
    return [].concat.apply([], observations).filter(obs => obs !== undefined);
  }

  getControlsByRow() {
    const { observations, metadata: { controls, uuid: formUuid } } = this.props;
    const groupedRowControls = groupControlsByLocation(controls, 'row');
    const sortedRowControls = sortGroupedControls(groupedRowControls);
    return map(sortedRowControls, (rowControls, index) =>
      <Row
        controls={rowControls}
        formUuid={formUuid}
        id={index}
        key={index}
        observations={observations}
        ref={this.storeChildRef}
      />
    );
  }

  storeChildRef(ref) {
    if (ref) this.childControls[ref.props.id] = ref;
  }

  render() {
    return (
      <div>{this.getControlsByRow()}</div>
    );
  }
}

Container.propTypes = {
  metadata: PropTypes.shape({
    controls: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        type: PropTypes.string.isRequired,
      })).isRequired,
    id: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
  }),
  observations: PropTypes.array.isRequired,
};
