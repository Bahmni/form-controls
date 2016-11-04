import React, { Component, PropTypes } from 'react';
import 'src/helpers/componentStore';
import { Validator } from 'src/helpers/Validator';
import { hasError } from 'src/helpers/controlsHelper';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import { ObsMapper } from 'src/helpers/ObsMapper';
import { Obs } from 'src/helpers/Obs';

export class TextBox extends Component {
  constructor(props) {
    super(props);
    // TODO: This will be moved to the place where obs is created originally
    const obs = new Obs(props.formUuid, props.metadata, props.obs);
    this.mapper = new ObsMapper(obs);
    this.state = { hasErrors: false };
    this.getValue = this.getValue.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { errors, metadata: { id } } = nextProps;
    this.setState({ hasErrors: hasError(errors, id) });
  }

  getValue() {
    return this.mapper.getObs();
  }

  getErrors() {
    const { id, properties } = this.props.metadata;
    const controlDetails = { id, properties, value: this.mapper.getValue() };
    return Validator.getErrors(controlDetails);
  }

  handleChange(e) {
    const value = e.target.value.trim() !== '' ? e.target.value.trim() : undefined;
    this.mapper.setValue(value);
    const hasErrors = !isEmpty(this.getErrors());
    if (this.state.hasErrors !== hasErrors) {
      this.setState({ hasErrors });
    }
  }

  render() {
    const defaultValue = this.mapper.getValue();
    return (
      <textarea
        className={classNames({ 'form-builder-error': this.state.hasErrors })}
        defaultValue={defaultValue}
        onChange={(e) => this.handleChange(e)}
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
