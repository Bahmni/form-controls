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
import { UnSupportedComponent } from 'components/UnSupportedComponent.jsx';

chai.use(chaiEnzyme());

describe('UnSupportedComponent', () => {
  it('should render the value of label', () => {
    const wrapper = shallow(<UnSupportedComponent message={'Component is not supported'} />);
    expect(wrapper.find('label').text()).to.eql('Component is not supported');
  });
});
