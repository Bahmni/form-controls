import React, { Component, PropTypes } from 'react';
import { Label } from './Label';
import { TextBox } from './TextBox';
import _ from 'lodash';

export class ObsControl extends Component {

  getFormControl(control) {
    switch (control.type) {
      case 'label':
        return <Label key={control.id} value={control.value} />;
      case 'numeric':
      case 'text':
        return <TextBox key={control.id} type={control.type} value={control.value} />;
      default:
        return null;
    }
  }

  render() {
    return (
    <div>
        {
          _.map(this.props.controls, (control) => this.getFormControl(control))
        }
      </div>
    );
  }
}

ObsControl.propTypes = {
  controls: PropTypes.array.isRequired,
};
