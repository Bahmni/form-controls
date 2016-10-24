import React, { PropTypes, Component } from 'react';
import { displayRowControls, getGroupedControls } from 'src/helpers/controlsParser';
import { getErrorsFromChildControls, getObsFromChildControls } from 'src/helpers/controlsHelper';

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

  getErrors() {
    return getErrorsFromChildControls(this.childControls);
  }

  storeChildRef(ref) {
    if (ref) this.childControls[ref.props.id] = ref;
  }

  render() {
    const { observations, metadata: { controls, uuid: formUuid } } = this.props;
    const childProps = { formUuid, ref: this.storeChildRef };
    const groupedRowControls = getGroupedControls(controls, 'row');
    return (
      <div>{displayRowControls(groupedRowControls, observations, childProps)}</div>
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
