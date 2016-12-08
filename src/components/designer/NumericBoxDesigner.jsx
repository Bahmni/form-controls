import React, { Component, PropTypes } from 'react';
import ComponentStore from 'src/helpers/componentStore';

export class NumericBoxDesigner extends Component {
  getJsonDefinition() {
    return this.props.metadata;
  }

  render() {
    const concept = this.props.metadata.concept;
    return (
      <div>
        <input type="number" />
        <label>{NumericBoxDesigner.getRange(concept.lowNormal, concept.hiNormal)}</label>
      </div>
    );
  }
}

NumericBoxDesigner.propTypes = {
  metadata: PropTypes.shape({
    concept: PropTypes.shape({
      hiNormal: PropTypes.string,
      lowNormal: PropTypes.string,
    }),
    displayType: PropTypes.string,
    id: PropTypes.string.isRequired,
    properties: PropTypes.object.isRequired,
    type: PropTypes.string,
  }),
};

NumericBoxDesigner.getRange = (lowNormal, hiNormal) => {
  if (lowNormal && hiNormal) {
    return `(${lowNormal}-${hiNormal})`;
  } else if (lowNormal) {
    return `(>${lowNormal})`;
  } else if (hiNormal) {
    return `(<${hiNormal})`;
  }
  return '';
};

const descriptor = {
  control: NumericBoxDesigner,
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

ComponentStore.registerDesignerComponent('numeric', descriptor);
