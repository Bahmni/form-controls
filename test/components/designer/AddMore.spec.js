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
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { AddMoreDesigner } from 'src/components/designer/AddMore.jsx';

chai.use(chaiEnzyme());

describe('AddMore', () => {
  it('should render AddMore designer component', () => {
    const wrapper = mount(<AddMoreDesigner />);

    expect(wrapper.find('button').at(0).find('.fa-plus')).to.have.exactly(1).descendants('i');
    expect(wrapper.find('button').at(1).find('.fa-remove')).to.have.exactly(1).descendants('i');
  });
});
