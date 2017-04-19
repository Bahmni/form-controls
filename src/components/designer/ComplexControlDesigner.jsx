import React, { Component, PropTypes } from 'react';
import ComponentStore from 'src/helpers/componentStore';

export class ComplexControlDesigner extends Component {
  getJsonDefinition() {
    return this.props.metadata;
  }

  render() {
    return (
      <div className="obs-comment-section-wrap">
        <input type="file" />
      </div>
    );
  }
}

ComplexControlDesigner.propTypes = {
  metadata: PropTypes.shape({
    concept: PropTypes.object.isRequired,
    displayType: PropTypes.string,
    id: PropTypes.string.isRequired,
    properties: PropTypes.object.isRequired,
    type: PropTypes.string,
  }),
};

const descriptor = {
  control: ComplexControlDesigner,
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

ComponentStore.registerDesignerComponent('complex', descriptor);
