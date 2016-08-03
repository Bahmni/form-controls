import React, { Component, PropTypes } from 'react';
import { ObsControl } from './ObsControl';
import _ from 'lodash';

export class Form extends Component {

  renderControl(control) {
    switch (control.type) {
      case 'obsControl':
        return <ObsControl key={control.id} obs={control.controls} />;
      default:
        return null;
    }
  }

  render() {
    const { name, controls } = this.props.formDetail;
    return (
      <div>
        <div className="form-name">{name}</div>
        {
          _.map(controls, (control) => this.renderControl(control))
        }
      </div>
    );
  }
}

Form.propTypes = {
  formDetail: PropTypes.object.isRequired,
};

