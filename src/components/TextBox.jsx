import React, {Component, PropTypes} from "react";
import "src/helpers/componentStore";
import {createFormNamespace} from "src/helpers/formNamespace";
import {Validator} from "src/helpers/Validator";
import {hasError} from "src/helpers/controlsHelper";
import classNames from "classnames";
import isEmpty from "lodash/isEmpty";
import {ObsMapper} from "../helpers/ObsMapper";
import {Obs} from "../helpers/Obs";


export class TextBox extends Component {
  constructor(props) {
    super(props);
    //TODO: This will be moved to the place where obs is created originally
    this.obs = new Obs(props.formUuid,props.metadata,props.obs);
    this.mapper = new ObsMapper();
    this.initialValue = this.mapper.getValue(this.obs);
    this.state = { value: this.initialValue, hasErrors: false };
    this.getValue = this.getValue.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { errors, metadata: { id } } = nextProps;
    this.setState({ hasErrors: hasError(errors, id) });
  }

  getValue() {
    if(this.isDirty()){
      return this.mapper.setValue(this.obs,this.state.value);
    }
    return this.obs;
  }

  isDirty(){
    return this.initialValue !== this.state.value;
  }

  getErrors() {
    const { id, properties } = this.props.metadata;
    const controlDetails = { id, properties, value: this.state.value };
    return Validator.getErrors(controlDetails);
  }

  getClassName() {
    const { errors, metadata: { id } } = this.props;
    return classNames({ 'form-builder-error': hasError(errors, id) });
  }

  handleChange(e) {
    console.log("The state before : "+ this.state.value);
    this.setState({ value: e.target.value, hasErrors: !isEmpty(this.getErrors()) });
    console.log("The state after : "+ e.target.value);
  }

  render() {
    const defaultValue = this.state.value;
    return (
      <input
        className={classNames({ 'form-builder-error': this.state.hasErrors })}
        defaultValue={defaultValue}
        onChange={(e) => this.handleChange(e)}
        type="text"
      />
    );
  }
}

TextBox.propTypes = {
  errors: PropTypes.array.isRequired,
  formUuid: PropTypes.string.isRequired,
  metadata: PropTypes.shape({
    concept: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    properties: PropTypes.object.isRequired,
    type: PropTypes.string,
  }),
  obs: PropTypes.object,
  //Change the obs props to value
};

window.componentStore.registerComponent('text', TextBox);
