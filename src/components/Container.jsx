import React, { PropTypes, Component } from 'react';
import { getControls } from 'src/helpers/controlsParser';
import { getObsForContainer } from 'src/helpers/controlsHelper';

export class Container extends Component {
  constructor(props) {
    super(props);
    this.childControls = {};
    this.storeChildRef = this.storeChildRef.bind(this);
  }

  getValue() {
    const observations = getObsForContainer(this.childControls);
    return [].concat.apply([], observations).filter(obs => obs !== undefined);
  }

  storeChildRef(ref) {
    if (ref) this.childControls[ref.props.metadata.id] = ref;
  }

  render() {
    const { observations, metadata: { controls, uuid: formUuid } } = this.props;
    const childProps = { formUuid, ref: this.storeChildRef };
    return (
      <div>{getControls(controls, observations, childProps)}</div>
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
