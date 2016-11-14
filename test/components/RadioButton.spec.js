import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { RadioButton } from 'components/RadioButton.jsx';
import sinon from 'sinon';
import { Validator } from 'src/helpers/Validator';

chai.use(chaiEnzyme());

describe('RadioButton Component', () => {
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

  it('should render the radio component', () => {
    const wrapper = shallow(
      <RadioButton errors={[]} formUuid="someFormUuid" metadata={metadata} onChange={() => {}} />
    );
    expect(wrapper).to.have.exactly(2).descendants('input');

    expect(wrapper.find('.options-list').at(0).text()).to.eql('Yes');
    expect(wrapper.find('input').at(0).props().checked).to.eql(false);
    expect(wrapper.find('input').at(0).props().value).to.eql(true);
    expect(wrapper.find('input').at(0).props().name).to.eql('someFormUuid-100');

    expect(wrapper.find('.options-list').at(1).text()).to.eql('No');
    expect(wrapper.find('input').at(1).props().checked).to.eql(false);
    expect(wrapper.find('input').at(1).props().value).to.eql(false);
    expect(wrapper.find('input').at(1).props().name).to.eql('someFormUuid-100');

    expect(wrapper).to.not.have.className('form-builder-error');
  });

  it('should render the radio button with selected value', () => {
    const wrapper = shallow(
      <RadioButton
        errors={[]}
        formUuid="someFormUuid"
        metadata={metadata}
        onChange={() => {}}
        value={value}
      />
    );
    expect(wrapper.find('input').at(0).props().checked).to.eql(true);
    expect(wrapper.find('input').at(1).props().checked).to.eql(false);
  });

  it('should render the radio button with error if hasErrors is true', () => {
    const wrapper = shallow(
      <RadioButton
        errors={[]}
        formUuid="someFormUuid"
        metadata={metadata}
        onChange={() => {}}
        value={value}
      />
    );
    wrapper.setProps({ errors: [{ controlId: '100' }] });
    expect(wrapper).to.have.className('form-builder-error');
  });

  it('should change the value on select', () => {
    const wrapper = shallow(
      <RadioButton errors={[]} formUuid="someFormUuid" metadata={metadata} onChange={() => {}} />
    );
    wrapper.find('div').at(2).simulate('click');
    const instance = wrapper.instance();
    expect(instance.getValue()).to.eql(false);
  });

  it('should return the value as undefined if not selected', () => {
    const wrapper = shallow(
      <RadioButton errors={[]} formUuid="someFormUuid" metadata={metadata} onChange={() => {}} />
    );
    const instance = wrapper.instance();
    expect(instance.getValue()).to.eql(undefined);
  });

  it('should getError when present', () => {
    const args = { id: '100', properties: { mandatory: true }, value: 'someValue' };
    const stub = sinon.stub(Validator, 'getErrors');
    stub.withArgs(args).returns([{ errorType: 'someErrorType' }]);

    metadata.properties = { mandatory: true };
    value = 'someValue';
    const wrapper = shallow(
      <RadioButton
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
