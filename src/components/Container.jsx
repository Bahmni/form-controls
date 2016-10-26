import React, { PropTypes, Component } from 'react';
import { displayRowControls, getGroupedControls } from 'src/helpers/controlsParser';
import { getErrorsFromChildControls, getObsFromChildControls } from 'src/helpers/controlsHelper';
import isEmpty from 'lodash/isEmpty';

export class Container extends Component {
  constructor(props) {
    super(props);
    this.childControls = {};
    this.state = { errors: [] };
    this.storeChildRef = this.storeChildRef.bind(this);
  }

  getValue() {
    const errors = getErrorsFromChildControls(this.childControls);
    const childObservations = getObsFromChildControls(this.childControls);
    const observations = [].concat.apply([], childObservations).filter(obs => obs !== undefined);
    const nonVoidedObs = observations.filter(obs => obs.voided !== true);

    if (isEmpty(nonVoidedObs) || isEmpty(errors)) {
      return { observations };
    }

    this.setState({ errors });
    return { errors };
  }

  storeChildRef(ref) {
    if (ref) this.childControls[ref.props.id] = ref;
  }

  render() {
    const { observations, metadata: { controls, uuid: formUuid } } = this.props;
    const childProps = { errors: this.state.errors, formUuid, ref: this.storeChildRef };
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
