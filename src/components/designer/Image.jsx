import React, { PureComponent, PropTypes } from 'react';
import ComponentStore from 'src/helpers/componentStore';

export class ImageDesigner extends PureComponent {

  render() {
    return (
      <div className="fl complex-component-designer">
        <input disabled type="file" />
      </div>
    );
  }
}

ImageDesigner.propTypes = {
  metadata: PropTypes.shape({
    concept: PropTypes.object.isRequired,
    displayType: PropTypes.string,
    id: PropTypes.string.isRequired,
    properties: PropTypes.object.isRequired,
    type: PropTypes.string,
  }),
};

const descriptor = {
  control: ImageDesigner,
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

ComponentStore.registerDesignerComponent('ImageUrlHandler', descriptor);
