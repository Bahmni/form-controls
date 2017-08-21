import React from 'react';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { ImageDesigner } from 'components/designer/Image.jsx';

chai.use(chaiEnzyme());

describe('ImageDesigner', () => {
  let wrapper;
  let metadata;

  beforeEach(() => {
    metadata = {
      concept: {
        name: 'Image',
        uuid: 'someUuid',
        handler: 'ImageUrlHandler',
      },
      type: 'obsControl',
      id: 'someId',
      properties: {},
    };
    wrapper = mount(<ImageDesigner metadata={metadata} />);
  });

  it('should render the Image designer component', () => {
    expect(wrapper.find('input')).to.have.prop('type').to.eql('file');
    expect(wrapper.find('input')).to.have.prop('disabled').to.eql(true);
  });
});
