import React, { Component, PropTypes } from 'react';
import { Label } from './Label.jsx';
import { TextBox } from './TextBox.jsx';
import _ from 'lodash';
import 'src/helpers/componentStore';

export class ObsControl extends Component {

  constructor(props) {
    super(props);
    this.childControls = {};
    this.getValue = this.getValue.bind(this);
    this.storeChildrenRefs = this.storeChildrenRefs.bind(this);
  }

  getValue() {
    return this.getChildValues();
  }

  getChildValues() {
    return _.map(this.childControls, (control) => control.getValue());
  }

  getFormControl(control) {
    switch (control.type) {
      case 'label':
        return <Label id={control.id} key={control.id} value={control.value} />;
      case 'numeric':
      case 'text':
        return (
          <TextBox
            id={control.id}
            key={control.id}
            ref={this.storeChildrenRefs}
            type={control.type}
            value={control.value}
          />);
      default:
        return null;
    }
  }

  storeChildrenRefs(ref) {
    this.childControls[ref.props.id] = ref;
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

window.componentStore.registerComponent('obsControl', ObsControl);
