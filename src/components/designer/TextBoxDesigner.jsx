import React, { Component, PropTypes } from 'react';
import 'src/helpers/componentStore';

export class TextBoxDesigner extends Component {
  getJsonDefinition() {
    return this.props.metadata;
  }

  render() {
    return (<input type="text" />);
  }
}

TextBoxDesigner.propTypes = {
  metadata: PropTypes.shape({
    concept: PropTypes.object.isRequired,
    displayType: PropTypes.string,
    id: PropTypes.string.isRequired,
    properties: PropTypes.object.isRequired,
    type: PropTypes.string,
  }),
};

const descriptor = {
  control: TextBoxDesigner,
  designProperties: {
    isTopLevelComponent: false,
  },
  metadata: {
    attributes: [
      {
        name: 'properties',
        dataType: 'complex',
        attributes: [],
      },
    ],
  },
};

window.componentStore.registerDesignerComponent('text', descriptor);
