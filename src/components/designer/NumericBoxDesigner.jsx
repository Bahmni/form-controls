import React, { Component, PropTypes } from 'react';
import 'src/helpers/componentStore';

export class NumericBoxDesigner extends Component {
  getJsonDefinition() {
    return this.props.metadata;
  }

  render() {
    return (<input type="number" />);
  }
}

NumericBoxDesigner.propTypes = {
  metadata: PropTypes.shape({
    type: PropTypes.string,
    concept: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
  }),
};

const descriptor = {
  control: NumericBoxDesigner,
  designProperties: {
    isTopLevelComponent: false,
  },
  metadata: {
    attributes: [],
  },
};

window.componentStore.registerDesignerComponent('numeric', descriptor);
