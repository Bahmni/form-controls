import React, { Component, PropTypes } from 'react';
import { Label } from 'components/Label.jsx';
import 'src/helpers/componentStore';
import find from 'lodash/find';
import { ObsMapper } from 'src/helpers/ObsMapper';
import { Obs } from 'src/helpers/Obs';
import { Comment } from 'components/Comment.jsx';
import constants from 'src/constants';

export class ObsControl extends Component {

  constructor(props) {
    super(props);
    this.childControl = undefined;
    this.mapper = new ObsMapper(this.props.obs);
    this.state = { obs: this.props.obs};
    this.getValue = this.getValue.bind(this);
    this.storeChildRef = this.storeChildRef.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  shouldComponentUpdate(nextProps,nextState){
    return true;
  }

  componentDidUpdate(prevProps, prevState){
    console.log("ObsControl - The component with value ["+ prevProps.obs +"] is updated!!");
  }

  getValue() {
    return this.childControl.getValue();
  }

  getErrors() {
    return this.childControl.getErrors();
  }

  storeChildRef(ref) {
    this.childControl = ref;
  }

  onChange(value,errors){
    const updatedObs = this.mapper.setValue(value);
    // this.setState({ obs: this.mapper.getObs()});
    this.props.onValueChanged(updatedObs, errors);
  }



  displayObsControl(registeredComponent) {
    const { errors, formUuid, metadata } = this.props;
    return React.createElement(registeredComponent, {
      errors,
      formUuid,
      metadata,
      mapper: this.mapper,
      ref: this.storeChildRef,
      onChange: this.onChange,
      value: this.mapper.getValue(),
      validations: [ constants.validations.mandatory, constants.validations.allowDecimal ]
    });
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
    const isAddCommentsEnabled = find(properties, (value, key) => (key === 'addComment' && value));
    if (isAddCommentsEnabled) {
      return (
        <Comment mapper={this.mapper} />
      );
    }
    return null;
  }

  render() {
    const { concept, label } = this.props.metadata;
    const registeredComponent = window.componentStore.getRegisteredComponent(concept.datatype);
    if (registeredComponent) {
      return (
        <div>
          <Label metadata={label} />
          {this.markMandatory()}
          {this.displayObsControl(registeredComponent)}
          {this.showComment()}
        </div>
      );
    }
    return null;
  }
}

ObsControl.propTypes = {
  errors: PropTypes.array.isRequired,
  formUuid: PropTypes.string.isRequired,
  metadata: PropTypes.shape({
    concept: PropTypes.object.isRequired,
    displayType: PropTypes.string,
    id: PropTypes.string.isRequired,
    label: PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }).isRequired,
    properties: PropTypes.object,
    type: PropTypes.string.isRequired,
  }),
  obs: PropTypes.object,
  onValueChanged: PropTypes.func.isRequired
};

window.componentStore.registerComponent('obsControl', ObsControl);
