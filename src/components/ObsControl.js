import React, { Component, PropTypes } from 'react';
import { Label } from './Label';
import { TextBox } from './TextBox';
import _ from 'lodash';

export class ObsControl extends Component {

  getFormControl(obs) {
    switch (obs.type) {
      case 'label':
        return <Label key={obs.id} obs={obs} />;
      case 'numeric':
      case 'text':
        return <TextBox key={obs.id} obs={obs} />;
      default:
        return null;
    }
  }

  render() {
    return (
    <div>
        {
          _.map(this.props.obs, (obs) => this.getFormControl(obs))
        }
      </div>
    );
  }
}

ObsControl.propTypes = {
  obs: PropTypes.array.isRequired,
};
