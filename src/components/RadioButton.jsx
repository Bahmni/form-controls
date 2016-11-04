import React, { Component, PropTypes } from 'react';
import 'src/helpers/componentStore';
import map from 'lodash/map';
import classNames from 'classnames';
import { Validator } from 'src/helpers/Validator';
import { hasError } from 'src/helpers/controlsHelper';
import isEmpty from 'lodash/isEmpty';

export class RadioButton extends Component {
  constructor(props) {
    super(props);
    const value = props.obs && props.obs.value;
    this.state = { value, hasErrors: false };
    this.changeValue = this.changeValue.bind(this);
    this.getErrors = this.getErrors.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { errors, metadata: { id } } = nextProps;
    this.setState({ hasErrors: hasError(errors, id) });
  }

  getValue() {
    return this.state.value;
  }

  getErrorForValue(value) {
    const { id, properties } = this.props.metadata;
    const controlDetails = { id, properties, value };
    return Validator.getErrors(controlDetails);
  }

  getErrors() {
    const value = this.getValue();
    return this.getErrorForValue(value);
  }

  changeValue(value) {
    this.setState({ value, hasErrors: !isEmpty(this.getErrorForValue(value)) });
    this.props.onChange();
  }

  displayRadioButtons() {
    const name = `${this.props.formUuid}-${this.props.metadata.id}`;
    return map(this.props.metadata.options, (option, index) =>
      <div className="options-list" key={index} onClick={() => this.changeValue(option.value)}>
        <input
          checked={this.state.value === option.value}
          key={index}
          name={name}
          type="radio"
          value={option.value}
        />
        {option.name}
      </div>
    );
  }

  render() {
    const className =
      classNames('form-builder-radio', { 'form-builder-error': this.state.hasErrors });
    return <div className={className}>{this.displayRadioButtons()}</div>;
  }
}

RadioButton.propTypes = {
  errors: PropTypes.array.isRequired,
  formUuid: PropTypes.string.isRequired,
  metadata: PropTypes.shape({
    concept: PropTypes.object.isRequired,
    displayType: PropTypes.string,
    id: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    properties: PropTypes.object,
    type: PropTypes.string.isRequired,
  }),
  obs: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};

window.componentStore.registerComponent('radio', RadioButton);
