import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { Button } from 'components/Button.jsx';
import sinon from 'sinon';
import { Validator } from 'src/helpers/Validator';

chai.use(chaiEnzyme());

describe('Button Component', () => {
  let metadata;
  let value;

  beforeEach(() => {
    metadata = {
      id: '100',
      type: 'obsControl',
      concept: {
        uuid: '70645842-be6a-4974-8d5f-45b52990e132',
        name: 'Pulse',
        datatype: 'Boolean',
      },
      properties: {
        location: {
          row: 0,
          column: 0,
        },
      },
      displayType: 'button',
      options: [
        { name: 'Yes', value: true },
        { name: 'No', value: false },
      ],
    };

    value = true;
  });

  it('should render button component', () => {
    const wrapper = shallow(
      <Button errors={[]} formUuid="someFormUuid" metadata={metadata} onChange={() => {}} />
    );
    expect(wrapper).to.have.exactly(2).descendants('button');

    expect(wrapper.find('button').at(0).text()).to.eql('Yes');
    expect(wrapper.find('button').at(1).text()).to.eql('No');

    expect(wrapper.find('button').at(0)).to.have.className('fl');
    expect(wrapper.find('button').at(1)).to.have.className('fl');

    expect(wrapper).to.have.className('form-control-buttons');
  });

  it('should render button with selected value', () => {
    const wrapper = shallow(
      <Button
        errors={[]}
        formUuid="someFormUuid"
        metadata={metadata}
        onChange={() => {}}
        value={value}
      />
    );
    expect(wrapper.find('button').at(0)).to.have.className('fl active');
    expect(wrapper.find('button').at(1)).to.have.className('fl');
  });

  it('should render error class when control has error', () => {
    const wrapper = shallow(
      <Button
        errors={[]}
        formUuid="someFormUuid"
        metadata={metadata}
        onChange={() => {}}
        value={value}
      />
    );
    wrapper.setProps({ errors: [{ controlId: '100' }] });
    expect(wrapper.find('button').at(0)).to.have.className('fl active');
    expect(wrapper.find('button').at(1)).to.have.className('fl');
    expect(wrapper).to.have.className('form-control-buttons form-builder-error');
  });

  it('should change the value on click', () => {
    const wrapper = shallow(
      <Button
        errors={[]}
        formUuid="someFormUuid"
        metadata={metadata}
        onChange={() => {}}
        value={value}
      />
    );
    wrapper.find('button').at(1).simulate('click');
    const instance = wrapper.instance();
    expect(instance.getValue()).to.eql(false);

    expect(wrapper.find('button').at(0)).to.have.className('fl');
    expect(wrapper.find('button').at(1)).to.have.className('fl active');
  });

  it('should return the value as undefined if not selected', () => {
    const wrapper = shallow(
      <Button errors={[]} formUuid="someFormUuid" metadata={metadata} onChange={() => {}} />
    );
    const instance = wrapper.instance();
    expect(instance.getValue()).to.eql(undefined);
  });

  it('should change the value to undefined if double clicked', () => {
    const wrapper = shallow(
      <Button errors={[]} formUuid="someFormUuid" metadata={metadata} onChange={() => {}} />
    );
    wrapper.find('button').at(1).simulate('click');
    const instance = wrapper.instance();
    expect(instance.getValue()).to.eql(false);

    wrapper.find('button').at(1).simulate('click');
    expect(instance.getValue()).to.eql(undefined);
  });

  it('should throw error on change if present', () => {
    metadata.properties = { mandatory: true };
    const wrapper = shallow(
      <Button errors={[]} formUuid="someFormUuid" metadata={metadata} onChange={() => {}} />
    );
    wrapper.find('button').at(1).simulate('click');
    expect(wrapper).to.have.className('form-control-buttons');
    expect(wrapper).to.not.have.className('form-builder-error');

    wrapper.find('button').at(1).simulate('click');
    expect(wrapper).to.have.className('form-control-buttons form-builder-error');
  });

  it('should getError when present', () => {
    const args = { id: '100', properties: { mandatory: true }, value: 'someValue' };
    const stub = sinon.stub(Validator, 'getErrors');
    stub.withArgs(args).returns([{ errorType: 'someErrorType' }]);

    metadata.properties = { mandatory: true };
    value = 'someValue';
    const wrapper = shallow(
      <Button
        errors={[]}
        formUuid="someFormUuid"
        metadata={metadata}
        onChange={() => {}}
        value={value}
      />
    );
    const instance = wrapper.instance();
    expect(instance.getErrors()).to.deep.eql([{ errorType: 'someErrorType' }]);
    stub.restore();
  });
});
