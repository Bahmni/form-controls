import React from 'react';
import PropTypes from 'prop-types';
import ComponentStore from 'src/helpers/componentStore';

export const VideoDesigner = () => (
  <div className="fl complex-component-designer">
    <input disabled type="file" />
  </div>
);

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
        attributes: [],
      },
    ],
  },
};

ComponentStore.registerDesignerComponent('VideoUrlHandler', descriptor);
