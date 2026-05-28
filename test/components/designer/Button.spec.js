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
import { ButtonDesigner } from 'components/designer/Button.jsx';

chai.use(chaiEnzyme());

describe('Button Designer', () => {
  let wrapper;

  const options = [
    { name: 'Yes', value: true },
    { name: 'No', value: false },
  ];

  beforeEach(() => {
    wrapper = shallow(<ButtonDesigner options={options} />);
  });

  it('should render designer button', () => {
    expect(wrapper).to.have.exactly(2).descendants('button');

    expect(wrapper.find('button').at(0).text()).to.eql('Yes');
    expect(wrapper.find('button').at(1).text()).to.eql('No');
  });

  it('should return json definition', () => {
    const instance = wrapper.instance();
    expect(instance.getJsonDefinition()).to.deep.eql(options);
  });
});
