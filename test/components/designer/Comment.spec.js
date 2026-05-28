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
import { CommentDesigner } from 'components/designer/Comment.jsx';

chai.use(chaiEnzyme());

describe('CommentDesigner', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<CommentDesigner />);
  });

  it('should render add comment button', () => {
    expect(wrapper).to.have.descendants('button');
    expect(wrapper).to.not.have.descendants('textarea');
  });

  it('should render the comment section on click of button', () => {
    wrapper.find('button').simulate('click');
    expect(wrapper).to.have.descendants('button');
    expect(wrapper).to.have.descendants('textarea');
  });

  it('should hide the comment section on click of button if it is shown', () => {
    wrapper.find('button').simulate('click');
    expect(wrapper).to.have.descendants('textarea');

    wrapper.find('button').simulate('click');
    expect(wrapper).to.not.have.descendants('textarea');
  });
});

