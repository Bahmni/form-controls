import React, { Component, PropTypes } from 'react';
import ComponentStore from 'src/helpers/componentStore';

export class NumericBoxDesigner extends Component {
  getJsonDefinition() {
    return this.props.metadata;
  }

  render() {
    const { lowNormal, hiNormal } = this.props;
    return (
      <div>
        <input type="number" />
        <label>{NumericBoxDesigner.getRange(lowNormal, hiNormal)}</label>
      </div>
    );
  }
}

NumericBoxDesigner.propTypes = {
  hiAbsolute: PropTypes.number,
  hiNormal: PropTypes.number,
  lowAbsolute: PropTypes.number,
  lowNormal: PropTypes.number,
  metadata: PropTypes.shape({
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
