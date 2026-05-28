/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React from 'react';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { VideoDesigner } from 'components/designer/Video.jsx';

chai.use(chaiEnzyme());

describe('VideoDesigner', () => {
  let wrapper;
  let metadata;

  beforeEach(() => {
    metadata = {
      concept: {
        name: 'Image',
        uuid: 'someUuid',
        handler: 'VideoUrlHandler',
      },
      type: 'obsControl',
      id: 'someId',
      properties: {},
    };
    wrapper = mount(<VideoDesigner metadata={metadata} />);
  });

  it('should render the Video designer component', () => {
    expect(wrapper.find('input')).to.have.prop('type').to.eql('file');
    expect(wrapper.find('input')).to.have.prop('disabled').to.eql(true);
  });
});
