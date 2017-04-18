import React, { PureComponent } from 'react';
import { mount, shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import { ObsControl } from 'components/ObsControl.jsx';
import constants from 'src/constants';
import ComponentStore from 'src/helpers/componentStore';
import * as FormmatedMsg from 'react-intl';

chai.use(chaiEnzyme());

describe('ObsControl', () => {
  const DummyControl = () => <input />;

  /* eslint-disable react/no-multi-comp */
  class FormattedMessageStub extends PureComponent {
    render() {
      return <div />;
    }
  }

  before(() => {
    ComponentStore.componentList = {};
    ComponentStore.registerComponent('text', DummyControl);
    sinon.stub(FormmatedMsg, 'FormattedMessage', FormattedMessageStub);
  });

  after(() => {
    ComponentStore.deRegisterComponent('text');
    FormmatedMsg.FormattedMessage.restore();
  });

  function getConcept(datatype) {
    return {
      uuid: '70645842-be6a-4974-8d5f-45b52990e132',
      name: 'Pulse',
      datatype,
    };
  }

  const label = {
    id: 'someId',
    value: 'someLabelName',
    type: 'label',
  };

  const domainValue = {};

  const properties = { location: { row: 0, column: 1 } };
  let onChangeSpy;

  beforeEach(() => {
    onChangeSpy = sinon.spy();
  });

  it('should render dummyControl', () => {
    const metadata = {
      id: '100',
      type: 'obsControl',
      concept: getConcept('Text'),
      label,
      properties,
    };
    const wrapper = mount(
      <ObsControl
        metadata={metadata}
        onValueChanged={onChangeSpy}
        validate={false}
        value={domainValue}
      />);

    expect(wrapper).to.have.exactly(1).descendants('Label');
    expect(wrapper).to.have.exactly(1).descendants('DummyControl');
    expect(wrapper).to.have.exactly(1).descendants('input');

    expect(wrapper.find('DummyControl')).to.have.prop('validate').to.deep.eql(false);
    expect(wrapper.find('DummyControl')).not.to.have.prop('options');
  });

  it('should render child control with options when metadata has options', () => {
    const metadata = {
      id: '100',
      type: 'obsControl',
      concept: getConcept('Text'),
      label,
      properties,
      options: [],
    };

    const wrapper = mount(
      <ObsControl
        metadata={metadata}
        onValueChanged={onChangeSpy}
        validate={false}
        value={domainValue}
      />);

    expect(wrapper.find('DummyControl')).to.have.prop('options').to.deep.eql([]);
  });

  it('should render child control with options when concept has answers', () => {
    const metadata = {
      id: '100',
      type: 'obsControl',
      concept: getConcept('Text'),
      label,
      properties,
    };
    metadata.concept.answers = [];

    const wrapper = mount(
      <ObsControl
        metadata={metadata}
        onValueChanged={onChangeSpy}
        validate={false}
        value={domainValue}
      />);

    expect(wrapper.find('DummyControl')).to.have.prop('options').to.deep.eql([]);
  });

  it('should mark mandatory if mandatory property is true', () => {
    const metadata = {
      id: '100',
      type: 'obsControl',
      concept: getConcept('Text'),
      label,
      properties: { mandatory: true },
    };

    const wrapper = mount(
      <ObsControl
        metadata={metadata}
        onValueChanged={onChangeSpy}
        validate={false}
        value={domainValue}
      />);

    expect(wrapper.find('span').text()).to.eql('*');
    expect(wrapper.find('span')).to.have.className('form-builder-asterisk');
  });

  it('should return null when registered component not found', () => {
    const metadata = {
      id: '100',
      type: 'obsControl',
      concept: getConcept('someRandomComponentType'),
      label,
      properties,
    };

    const wrapper = shallow(
      <ObsControl
        metadata={metadata}
        onValueChanged={onChangeSpy}
        validate={false}
        value={domainValue}
      />);

    expect(wrapper).to.have.exactly(1).descendants('div');
    expect(wrapper.find('div').at(0).text()).to.eql('<UnSupportedComponent />');
  });

  it('should return the obsControl value', () => {
    const metadata = {
      id: '100',
      type: 'obsControl',
      concept: getConcept('text'),
      label,
      properties,
    };

    const wrapper = shallow(
      <ObsControl
        metadata={metadata}
        onValueChanged={onChangeSpy}
        validate={false}
        value={domainValue}
      />
    );
    wrapper.instance().onChange(true, []);
    sinon.assert.calledOnce(
      onChangeSpy.withArgs(
        wrapper.prop('formFieldPath'),
        { value: true, comment: wrapper.props('value').comment },
        []
      ));
  });

  it('should return the child control errors', () => {
    const metadata = {
      id: '100',
      type: 'obsControl',
      concept: getConcept('text'),
      label,
      properties,
    };
    const errors = [constants.validations.mandatory];

    const wrapper = mount(
      <ObsControl
        metadata={metadata}
        onValueChanged={onChangeSpy}
        validate={false}
        value={domainValue}
      />
    );
    const instance = wrapper.instance();
    instance.onChange(undefined, errors);
    sinon.assert.calledOnce(
      onChangeSpy.withArgs(
        wrapper.prop('formFieldPath'),
        { value: undefined, comment: wrapper.props('value').comment },
        errors
      ));
  });

  it('should render notes if notes property is enabled', () => {
    const metadata = {
      id: '100',
      type: 'obsControl',
      concept: getConcept('text'),
      label,
      properties: { notes: true },
    };

    const wrapper = mount(
      <ObsControl
        metadata={metadata}
        onValueChanged={onChangeSpy}
        validate={false}
        value={domainValue}
      />
    );

    expect(wrapper).to.have.descendants('Comment');
  });

  it('should not render notes if notes property is disabled/not present', () => {
    const metadata = {
      id: '100',
      type: 'obsControl',
      concept: getConcept('Numeric'),
      label,
      properties: {},
    };

    const wrapper = shallow(
      <ObsControl
        metadata={metadata}
        onValueChanged={onChangeSpy}
        validate={false}
        value={domainValue}
      />
    );
    expect(wrapper).to.not.have.descendants('Comment');
  });

  it('should return the obsControl with comment', () => {
    const metadata = {
      id: '100',
      type: 'obsControl',
      concept: getConcept('text'),
      label,
      properties,
    };

    const wrapper = mount(
      <ObsControl
        metadata={metadata}
        onValueChanged={onChangeSpy}
        validate={false}
        value={domainValue}
      />
    );

    wrapper.instance().onCommentChange('Test Comment');

    sinon.assert.calledOnce(
      onChangeSpy.withArgs(
        wrapper.prop('formFieldPath'),
        { value: wrapper.prop('value').value, comment: 'Test Comment' },
        undefined
      ));
  });

  it('should display the label based on property', () => {
    properties.hideLabel = true;
    const metadata = {
      id: '100',
      type: 'obsControl',
      concept: getConcept('Text'),
      label,
      properties,
    };

    const wrapper = mount(
      <ObsControl
        metadata={metadata}
        onValueChanged={onChangeSpy}
        validate={false}
        value={domainValue}
      />);
    expect(wrapper).to.have.exactly(1).not.to.have.descendants('Label');
    expect(wrapper).to.have.exactly(1).descendants('DummyControl');
    expect(wrapper).to.have.exactly(1).descendants('input');
  });

  it('should not re-render ObsControl if properties doesn`t change', () => {
    const metadata = {
      id: '100',
      type: 'obsControl',
      concept: getConcept('Text'),
      label,
      properties,
    };
    metadata.properties.hideLabel = false;

    const wrapper = mount(
      <ObsControl
        metadata={metadata}
        onValueChanged={onChangeSpy}
        validate={false}
        value={domainValue}
      />);

    expect(wrapper).to.have.exactly(1).descendants('Label');

    metadata.properties.hideLabel = true;
    wrapper.setProps({ value: domainValue });
    wrapper.setProps({ metadata });

    expect(wrapper).to.not.have.descendants('Label');
  });

  it('should render ObsControl on change of props', () => {
    const metadata = {
      id: '100',
      type: 'obsControl',
      concept: getConcept('Text'),
      label,
      properties,
    };
    metadata.properties.hideLabel = false;

    const wrapper = mount(
      <ObsControl
        metadata={metadata}
        onValueChanged={onChangeSpy}
        validate={false}
        value={domainValue}
      />);

    expect(wrapper.find('DummyControl')).to.have.prop('validate').to.deep.eql(false);
    expect(wrapper.find('DummyControl').props()).to.have.property('value', undefined);

    const updatedValue = { value: 'abc', comment: wrapper.prop('value').comment };
    wrapper.setProps({ value: updatedValue });

    expect(wrapper.find('DummyControl').props()).to.have.property('value', 'abc');
  });

  it('should pass numeric context', () => {
    const metadata = {
      id: '100',
      type: 'obsControl',
      hiNormal: 72,
      lowNormal: 72,
      hiAbsolute: null,
      lowAbsolute: null,
      concept: getConcept('text'),
      label,
      properties,
    };
    metadata.properties.hideLabel = false;

    const wrapper = mount(
      <ObsControl
        metadata={metadata}
        onValueChanged={onChangeSpy}
        validate={false}
        value={domainValue}
      />);

    expect(wrapper.find('DummyControl').props()).to.have.property('lowNormal', 72);
    expect(wrapper.find('DummyControl').props()).to.have.property('hiNormal', 72);
    expect(wrapper.find('DummyControl').props()).to.have.property('hiAbsolute', null);
    expect(wrapper.find('DummyControl').props()).to.have.property('lowAbsolute', null);
  });

  it('should return helper text when concept has description', () => {
    const conceptDetail = getConcept('Text');
    conceptDetail.description = [{ display: true }];
    const metadata = {
      id: '100',
      type: 'obsControl',
      concept: conceptDetail,
      label,
      properties,
    };
    const wrapper = mount(
      <ObsControl
        metadata={metadata}
        onValueChanged={onChangeSpy}
        validate={false}
        value={domainValue}
      />);

    const helperText = wrapper.instance().showHelperText();

    expect(helperText).to.not.equal(null);
  });

  describe('enable or disable obs control', () => {
    const metadata = {
      id: '100',
      type: 'obsControl',
      concept: getConcept('Text'),
      label,
      properties,
      options: [],
    };

    it('should trigger event when value changed', () => {
      const eventTriggerSpy = sinon.spy();
      const wrapper = shallow(
        <ObsControl
          metadata={metadata}
          onEventTrigger={eventTriggerSpy}
          onValueChanged={(uuid, _value, _errors, onValueChangeDone) => onValueChangeDone()}
          validate={false}
          value={domainValue}
        />
      );

      wrapper.instance().onChange('value', 'error');

      sinon.assert.calledOnce(eventTriggerSpy);
    });


    it('should make label disabled when given obs control with enabled is false', () => {
      const wrapper = mount(
        <ObsControl
          enabled={false}
          metadata={metadata}
          onValueChanged={onChangeSpy}
          validate={false}
          value={domainValue}
        />);

      expect(wrapper.find('Label').props().enabled).to.equal(false);
    });

    it('should make label enabled when given obs control with enabled is true', () => {
      const wrapper = mount(
        <ObsControl
          enabled
          metadata={metadata}
          onValueChanged={onChangeSpy}
          validate={false}
          value={domainValue}
        />);

      expect(wrapper.find('Label').props().enabled).to.equal(true);
    });

    it('should make label enabled when given obs control without enabled', () => {
      const wrapper = mount(
        <ObsControl
          metadata={metadata}
          onValueChanged={onChangeSpy}
          validate={false}
          value={domainValue}
        />);

      expect(wrapper.find('Label').props().enabled).to.equal(true);
    });
  });
});
