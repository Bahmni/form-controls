import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ComponentStore from 'src/helpers/componentStore';
import map from 'lodash/map';

export class RadioButtonDesigner extends Component {
  getJsonDefinition() {
    return this.props.metadata;
  }

  displayRadioButtons() {
    return map(this.props.metadata.options, (option, index) =>
      <div className="option-list" key={index}>
        <input
          key={index}
          name={this.props.metadata.id}
          type="radio"
          value={option.value}
        />
        {option.name}
      </div>
    );
  }

  render() {
    return <div>{this.displayRadioButtons()}</div>;
  }
}

RadioButtonDesigner.propTypes = {
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
  control: RadioButtonDesigner,
  designProperties: {
    isTopLevelComponent: false,
  },
  metadata: {
    attributes: [],
  },
};

ComponentStore.registerDesignerComponent('radio', descriptor);
