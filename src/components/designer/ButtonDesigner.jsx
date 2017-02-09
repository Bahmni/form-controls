import React, { Component, PropTypes } from 'react';
import ComponentStore from 'src/helpers/componentStore';
import map from 'lodash/map';

export class ButtonDesigner extends Component {
  getJsonDefinition() {
    return this.props.options;
  }

  displayButtons() {
    return map(this.props.options, (option, index) =>
      <button key={index}>{option.name}</button>
    );
  }

  render() {
    return <div className="form-control-buttons">{this.displayButtons()}</div>;
  }
}

ButtonDesigner.propTypes = {
  options: PropTypes.array.isRequired,
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

ComponentStore.registerDesignerComponent('button', descriptor);
