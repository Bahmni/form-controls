/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { DateDesigner } from 'components/designer/Date.jsx';

chai.use(chaiEnzyme());

describe('DateDesigner', () => {
  let wrapper;
  let metadata;

  beforeEach(() => {
    metadata = {
      concept: {
        name: 'Follow up Date',
        uuid: 'someUuid',
        dataType: 'Date',
      },
      type: 'obsControl',
      id: 'someId',
      properties: {},
    };
    wrapper = shallow(<DateDesigner metadata={metadata} />);
  });

  it('should render the Date designer component', () => {
    expect(wrapper).to.have.descendants('input');
    expect(wrapper.find('input')).to.have.prop('type').to.eql('date');
  });

  it('should return json definition', () => {
    const instance = wrapper.instance();
    expect(instance.getJsonDefinition()).to.deep.eql(metadata);
  });
});
