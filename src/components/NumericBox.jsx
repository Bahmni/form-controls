import React, { Component, PropTypes } from 'react';
import 'src/helpers/componentStore';
import { Validator } from 'src/helpers/Validator';
import { hasError } from 'src/helpers/controlsHelper';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import { ObsMapper } from 'src/helpers/ObsMapper';
import { Obs } from 'src/helpers/Obs';

export class NumericBox extends Component {
  constructor(props) {
    super(props);
    const obs = new Obs(props.formUuid, props.metadata, props.obs);
    this.mapper = new ObsMapper(obs);
    this.state = { hasErrors: false };
    this.getValue = this.getValue.bind(this);
  }

  componentDidMount() {
    this.input.value = this.mapper.getValue();
  }

  componentWillReceiveProps(nextProps) {
    const { errors, metadata: { id } } = nextProps;
    this.setState({ hasErrors: hasError(errors, id) });
  }

  getValue() {
    return this.mapper.getObs();
  }

  getErrors() {
    const {
      concept: { properties: conceptProperties },
      id,
      properties: metadataProperties,
    } = this.props.metadata;

    const properties = Object.assign({}, conceptProperties, metadataProperties);
    const controlDetails = { id, properties, value: this.mapper.getValue() };
    return Validator.getErrors(controlDetails);
  }

  handleChange(e) {
    this.mapper.setValue(e.target.value);
    const hasErrors = !isEmpty(this.getErrors());
    if (this.state.hasErrors !== hasErrors) {
      this.setState({ hasErrors });
    }
  }

  render() {
    return (
      <input
        className={classNames({ 'form-builder-error': this.state.hasErrors })}
        onChange={(e) => this.handleChange(e)}
        ref={(elem) => { this.input = elem; }}
        type="number"
      />
    );
  }
}

NumericBox.propTypes = {
  errors: PropTypes.array.isRequired,
  formUuid: PropTypes.string.isRequired,
  metadata: PropTypes.shape({
    concept: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    properties: PropTypes.object.isRequired,
  }),
  obs: PropTypes.object,
};

window.componentStore.registerComponent('numeric', NumericBox);
