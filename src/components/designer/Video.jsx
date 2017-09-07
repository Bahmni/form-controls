import React, { PureComponent, PropTypes } from 'react';
import ComponentStore from 'src/helpers/componentStore';

export class VideoDesigner extends PureComponent {

  render() {
    return (
      <div className="fl complex-component-designer">
        <input disabled type="file" />
      </div>
    );
  }
}

VideoDesigner.propTypes = {
  metadata: PropTypes.shape({
    concept: PropTypes.object.isRequired,
    displayType: PropTypes.string,
    id: PropTypes.string.isRequired,
    properties: PropTypes.object.isRequired,
    type: PropTypes.string,
  }),
};

const descriptor = {
  control: VideoDesigner,
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
            name: 'sameLine',
            dataType: 'boolean',
            defaultValue: false,
          },
        ],
      },
    ],
  },
};

ComponentStore.registerDesignerComponent('VideoUrlHandler', descriptor);
