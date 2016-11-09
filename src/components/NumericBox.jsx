import React, { Component, PropTypes } from 'react';
import 'src/helpers/componentStore';
import { Validator } from 'src/helpers/Validator';
import { hasError } from 'src/helpers/controlsHelper';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';

export class NumericBox extends Component {
  constructor(props) {
    super(props);
    this.state = { hasErrors: false };
    this.getValue = this.getValue.bind(this);
  }

  componentDidMount() {
    this.input.value = this.props.mapper.getValue();
  }

  componentWillReceiveProps(nextProps) {
    const { errors, metadata: { id } } = nextProps;
    this.setState({ hasErrors: hasError(errors, id) });
  }

  getValue() {
    return this.props.mapper.getObs();
  }

  getErrors() {
    const {
      concept: { properties: conceptProperties },
      id,
      properties: metadataProperties,
    } = this.props.metadata;

    const properties = Object.assign({}, conceptProperties, metadataProperties);
    const controlDetails = { id, properties, value: this.props.mapper.getValue() };
    return Validator.getErrors(controlDetails);
  }

  handleChange(e) {
    this.props.mapper.setValue(e.target.value);
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
  mapper: PropTypes.object.isRequired,
  metadata: PropTypes.shape({
    concept: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    properties: PropTypes.object.isRequired,
  }),
};

window.componentStore.registerComponent('numeric', NumericBox);
