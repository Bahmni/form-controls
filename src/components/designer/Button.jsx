import React, { Component, PropTypes } from 'react';
import 'src/helpers/componentStore';
import map from 'lodash/map';

export class ButtonDesigner extends Component {
  getJsonDefinition() {
    return this.props.metadata;
  }

  displayButtons() {
    return map(this.props.metadata.options, (option, index) =>
      <button key={index}>{option.name}</button>
    );
  }

  render() {
    return <div className="form-control-buttons">{this.displayButtons()}</div>;
  }
}

ButtonDesigner.propTypes = {
  metadata: PropTypes.shape({
    concept: PropTypes.object.isRequired,
    displayType: PropTypes.string,
    id: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    properties: PropTypes.object.isRequired,
    type: PropTypes.string,
  }),
};

const descriptor = {
  control: ButtonDesigner,
  designProperties: {
    isTopLevelComponent: false,
  },
  metadata: {
    attributes: [],
  },
};

window.componentStore.registerDesignerComponent('button', descriptor);
