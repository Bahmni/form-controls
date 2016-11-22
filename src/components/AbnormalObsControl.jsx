import React, { Component, PropTypes } from 'react';
import { ObsControl } from 'components/ObsControl.jsx';
import 'src/helpers/componentStore';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import { AbnormalObsGroupMapper } from 'src/mapper/AbnormalObsGroupMapper';

export class AbnormalObsControl extends Component {

  constructor(props) {
    super(props);
    this.state = { obs: this.props.obs, hasErrors: this._hasErrors(props.errors) };
    this.onChange = this.onChange.bind(this);
    this.abnormalObsGroupMapper = new AbnormalObsGroupMapper();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.obs !== nextProps.obs ||
      !isEqual(this.props.errors, nextProps.errors) ||
      this.state.hasErrors !== nextState.hasErrors) {
      return true;
    }
    return false;
  }

  onChange(value, errors) {
    const updatedObs = this.abnormalObsGroupMapper.setValue(this.state.obs, value, errors);
    this.setState({ obs: updatedObs });
    this.props.onValueChanged(updatedObs, errors);
  }

  _getObsControls() {
    const rows = [];
    this.state.obs.groupMembers.forEach((childObs, index) => {
      const metadata = this._getMetadataForObs(childObs);
      if (metadata) {
        rows.push(
            <ObsControl errors={[]} id={ index } key={ index } metadata={ metadata }
              obs={ childObs } onValueChanged={ this.onChange }
            />);
      }
    });
    return rows;
  }
  _getMetadataForObs(childObs) {
    const controls = this.props.metadata.controls;
    const metadata = controls.find(control => control.concept.uuid === childObs.concept.uuid);
    return metadata;
  }

  _hasErrors(errors) {
    return !isEmpty(errors);
  }

  render() {
    return (
        <div>
          { this._getObsControls() }
        </div>
    );
  }
}

AbnormalObsControl.propTypes = {
  errors: PropTypes.array.isRequired,
  metadata: PropTypes.shape({
    concept: PropTypes.object.isRequired,
    displayType: PropTypes.string,
    id: PropTypes.string.isRequired,
    label: PropTypes.shape({
      type: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }).isRequired,
    properties: PropTypes.object,
    type: PropTypes.string.isRequired,
    controls: PropTypes.array,
  }),
  obs: PropTypes.any.isRequired,
  onValueChanged: PropTypes.func.isRequired,
};

window.componentStore.registerComponent('abnormalObsControl', AbnormalObsControl);
