import React, { Component, PropTypes } from 'react';
import { AbnormalObsGroupMapper } from 'src/mapper/AbnormalObsGroupMapper';
import { ObsGroupControl } from 'components/ObsGroupControl.jsx';

export class AbnormalObsControl extends Component {

  constructor(props) {
    super(props);
    this.abnormalObsGroupMapper = new AbnormalObsGroupMapper();
  }

  render() {
    return (
        <ObsGroupControl mapper={ this.abnormalObsGroupMapper } metadata={ this.props.metadata }
          obs = { this.props.obs }
          onValueChanged={ this.props.onValueChanged } validate={ this.props.validate}
        />
    );
  }
}

AbnormalObsControl.propTypes = {
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
  validate: PropTypes.bool.isRequired,
};

window.componentStore.registerComponent('abnormalObsControl', AbnormalObsControl);
