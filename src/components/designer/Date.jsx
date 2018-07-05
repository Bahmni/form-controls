import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ComponentStore from 'src/helpers/componentStore';

export class DateDesigner extends Component {
  getJsonDefinition() {
    return this.props.metadata;
  }

  render() {
    return (<input type="date" />);
  }
}

DateDesigner.propTypes = {
  metadata: PropTypes.shape({
    concept: PropTypes.object.isRequired,
    displayType: PropTypes.string,
    id: PropTypes.string.isRequired,
    properties: PropTypes.object.isRequired,
    type: PropTypes.string,
  }),
};

const descriptor = {
  control: DateDesigner,
  designProperties: {
    isTopLevelComponent: false,
  },
  metadata: {
    attributes: [
      {
        name: 'properties',
        dataType: 'complex',
        attributes: [
          {
            name: 'allowFutureDates',
            dataType: 'boolean',
            defaultValue: false,
          },
        ],
      },
    ],
  },
};

ComponentStore.registerDesignerComponent('date', descriptor);
