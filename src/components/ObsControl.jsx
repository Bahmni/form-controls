import React, { Component, PropTypes } from 'react';
import { Label } from 'components/Label.jsx';
import 'src/helpers/componentStore';
import find from 'lodash/find';
import isEqual from 'lodash/isEqual';
import { ObsMapper } from 'src/helpers/ObsMapper';
import { Comment } from 'components/Comment.jsx';
import { getValidations } from 'src/helpers/controlsHelper';
import isEmpty from 'lodash/isEmpty';
import { UnSupportedComponent } from 'components/UnSupportedComponent.jsx';

export class ObsControl extends Component {

  constructor(props) {
    super(props);
    this.mapper = new ObsMapper(props.obs);
    this.state = { obs: props.obs, hasErrors: this._hasErrors(props.errors) };
    this.onChange = this.onChange.bind(this);
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
    const updatedObs = this.mapper.setValue(value);
    this.props.onValueChanged(updatedObs, errors);
  }

  _hasErrors(errors) {
    return !isEmpty(errors);
  }

  displayObsControl(registeredComponent) {
    const { errors, metadata } = this.props;
    const validations = getValidations(metadata.properties);
    return React.createElement(registeredComponent, {
      displayType: metadata.displayType,
      errors,
      options: metadata.options,
      onChange: this.onChange,
      value: this.mapper.getValue(),
      validations,
      minNormal: metadata.concept.lowNormal,
      maxNormal: metadata.concept.hiNormal,
    });
  }

  displayLabel() {
    const { properties, label } = this.props.metadata;
    const hideLabel = find(properties, (value, key) => (key === 'hideLabel' && value));
    if (!hideLabel) {
      return (
          <div>
            <Label metadata={label} />
            { this.markMandatory() }
          </div>
      );
    }
    return null;
  }

  markMandatory() {
    const { properties } = this.props.metadata;
    const isMandatory = find(properties, (value, key) => (key === 'mandatory' && value));
    if (isMandatory) {
      return <span className="form-builder-asterisk">*</span>;
    }
    return null;
  }

  showComment() {
    const { properties } = this.props.metadata;
    const isAddCommentsEnabled = find(properties, (value, key) => (key === 'notes' && value));
    if (isAddCommentsEnabled) {
      return (
        <Comment mapper={this.mapper} />
      );
    }
    return null;
  }

  render() {
    const { concept } = this.props.metadata;
    const registeredComponent = window.componentStore.getRegisteredComponent(concept.datatype);
    if (registeredComponent) {
      return (
        <div>
          {this.displayLabel()}
          {this.displayObsControl(registeredComponent)}
          {this.showComment()}
        </div>
      );
    }
    return (
        <div>
          <UnSupportedComponent
            message={ `The component with concept datatype ${concept.datatype} is not supported` }
          />
        </div>
    );
  }
}

ObsControl.propTypes = {
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
  }),
  obs: PropTypes.any.isRequired,
  onValueChanged: PropTypes.func.isRequired,
};

window.componentStore.registerComponent('obsControl', ObsControl);
