import React, { Component, PropTypes } from 'react';
import 'src/helpers/componentStore';

class Mapper {
  constructor(concept, obs){
    this.concept = concept;
    this.obs = obs;
  }

  mapTo(value) {
    return Object.assign({}, { concept: this.concept }, this.obs, {value})
  }
}

export class NumericBox extends Component {

  constructor(props) {
    super(props);
    this.value = _.get(props.obs, 'value');
    this.getValue = this.getValue.bind(this);
    this.mapper = new Mapper(props.metadata.concept, props.obs);
  }

  getValue() {
    if (this.value) {
      return this.mapper.mapTo(this.value);
    }
    return undefined;
  }

  handleChange(e) {
    this.value = e.target.value;
  }

  render() {
    const defaultValue = _.get(this.props.obs, 'value');
    return (
      <input
        defaultValue={defaultValue}
        onChange={(e) => this.handleChange(e)}
        type="number"
      />
    );
  }
}

NumericBox.propTypes = {
  metadata: PropTypes.object.isRequired,
  obs: PropTypes.object,
};

window.componentStore.registerComponent('numeric', NumericBox);
