import React, { Component, PropTypes } from 'react';
import ComponentStore from 'src/helpers/componentStore';
import { getGroupedControls, displayRowControls } from '../helpers/controlsParser';
import { ObsGroupMapper } from 'src/mapper/ObsGroupMapper';
import { AbnormalObsGroupMapper } from 'src/mapper/AbnormalObsGroupMapper';

export class ObsGroupControl extends Component {

  constructor(props) {
    super(props);
    this.state = { obs: props.obs };
    this.onChange = this.onChange.bind(this);
    const isAbnormal = props.metadata.properties.isAbnormal;
    this.mapper = isAbnormal ? new AbnormalObsGroupMapper() : new ObsGroupMapper();
  }

  onChange(value, errors) {
    const updatedObs = this.mapper.setValue(this.state.obs, value, errors);
    this.setState({ obs: updatedObs });
    this.props.onValueChanged(updatedObs, errors);
  }

  render() {
    const { metadata: { concept }, validate } = this.props;
    const childProps = { validate, onValueChanged: this.onChange };
    const groupedRowControls = getGroupedControls(this.props.metadata.controls, 'row');
    return (
        <fieldset className="form-builder-fieldset">
          <legend>{concept.name}</legend>
          <div className="obsGroup-controls">
            {displayRowControls(groupedRowControls, this.state.obs.groupMembers, childProps)}
          </div>
        </fieldset>
    );
  }
}

ObsGroupControl.propTypes = {
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

ComponentStore.registerComponent('obsGroupControl', ObsGroupControl);
