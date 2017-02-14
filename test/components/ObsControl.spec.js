import React from 'react';
import { mount, shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import { ObsControl } from 'components/ObsControl.jsx';
import { Obs } from 'src/helpers/Obs';
import constants from 'src/constants';
import ComponentStore from 'src/helpers/componentStore';
import { ObsMapper } from 'src/mapper/ObsMapper';

chai.use(chaiEnzyme());

describe('ObsControl', () => {
  const DummyControl = () => <input />;

  before(() => {
    ComponentStore.componentList = {};
    ComponentStore.registerComponent('text', DummyControl);
  });

  after(() => {
    ComponentStore.deRegisterComponent('text');
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

  const properties = { location: { row: 0, column: 1 } };
  let onChangeSpy;

  beforeEach(() => {
    onChangeSpy = sinon.spy();
  });

  const mapper = new ObsMapper();

  it('should render dummyControl', () => {
    const metadata = {
      id: '100',
      type: 'obsControl',
      concept: getConcept('Text'),
      label,
      properties,
    };

    const observation = new Obs(metadata);
    const wrapper = mount(
      <ObsControl
        mapper={mapper}
        metadata={metadata}
        obs={observation}
        onValueChanged={onChangeSpy}
        validate={false}
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

    const observation = new Obs(metadata);
    const wrapper = mount(
      <ObsControl
        mapper={mapper}
        metadata={metadata}
        obs={observation}
        onValueChanged={onChangeSpy}
        validate={false}
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

    const observation = new Obs(metadata);
    const wrapper = mount(
      <ObsControl
        mapper={mapper}
        metadata={metadata}
        obs={observation}
        onValueChanged={onChangeSpy}
        validate={false}
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
    const observation = new Obs(metadata);
    const wrapper = mount(
      <ObsControl
        mapper={mapper}
        metadata={metadata}
        obs={observation}
        onValueChanged={onChangeSpy}
        validate={false}
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

    const observation = new Obs(metadata);

    const wrapper = shallow(
      <ObsControl
        mapper={mapper}
        metadata={metadata}
        obs={observation}
        onValueChanged={onChangeSpy}
        validate={false}
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

    const observation = new Obs(metadata);
    const wrapper = shallow(
      <ObsControl
        mapper={mapper}
        metadata={metadata}
        obs={observation}
        onValueChanged={onChangeSpy}
        validate={false}
      />
    );
    const instance = wrapper.instance();
    instance.onChange(true, []);
    sinon.assert.calledOnce(onChangeSpy.withArgs(observation.setValue(true), []));
  });

  it('should return the child control errors', () => {
    const metadata = {
      id: '100',
      type: 'obsControl',
      concept: getConcept('text'),
      label,
      properties,
    };
    const observation = new Obs(metadata);
    const errors = [constants.validations.mandatory];

    const wrapper = mount(
      <ObsControl
        mapper={mapper}
        metadata={metadata}
        obs={observation}
        onValueChanged={onChangeSpy}
        validate={false}
      />
    );
    const instance = wrapper.instance();
    instance.onChange(undefined, errors);
    sinon.assert.calledOnce(onChangeSpy.withArgs(observation.void(), errors));
  });

  it('should render notes if notes property is enabled', () => {
    const metadata = {
      id: '100',
      type: 'obsControl',
      concept: getConcept('text'),
      label,
      properties: { notes: true },
    };

    const observation = new Obs(metadata);

    const wrapper = mount(
      <ObsControl
        mapper={mapper}
        metadata={metadata}
        obs={observation}
        onValueChanged={onChangeSpy}
        validate={false}
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

    const observation = new Obs(metadata);

    const wrapper = shallow(
      <ObsControl
        mapper={mapper}
        metadata={metadata}
        obs={observation}
        onValueChanged={onChangeSpy}
        validate={false}
      />
    );
    expect(wrapper).to.not.have.descendants('Comment');
  });

  it('should return the obsControl value with comment', () => {
    const metadata = {
      id: '100',
      type: 'obsControl',
      concept: getConcept('text'),
      label,
      properties,
    };

    const observation = new Obs(metadata);
    const wrapper = mount(
      <ObsControl
        mapper={mapper}
        metadata={metadata}
        obs={observation}
        onValueChanged={onChangeSpy}
        validate={false}
      />
    );
    const instance = wrapper.instance();
    instance.onChange(true, []);
    instance.onCommentChange('');
    sinon.assert.calledOnce(onChangeSpy.withArgs(observation.setValue(true), []));
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

    const observation = new Obs(metadata);
    const wrapper = mount(
      <ObsControl
        mapper={mapper}
        metadata={metadata}
        obs={observation}
        onValueChanged={onChangeSpy}
        validate={false}
      />);
    expect(wrapper).to.have.exactly(1).not.to.have.descendants('Label');
    expect(wrapper).to.have.exactly(1).descendants('DummyControl');
    expect(wrapper).to.have.exactly(1).descendants('input');
  });

  it('should not rerender ObsControl if properties doesn`t change', () => {
    const metadata = {
      id: '100',
      type: 'obsControl',
      concept: getConcept('Text'),
      label,
      properties,
    };
    metadata.properties.hideLabel = false;

    const observation = new Obs(metadata);
    const wrapper = mount(
      <ObsControl
        mapper={mapper}
        metadata={metadata}
        obs={observation}
        onValueChanged={onChangeSpy}
        validate={false}
      />);

    expect(wrapper).to.have.exactly(1).descendants('Label');

    metadata.properties.hideLabel = true;
    wrapper.setProps({ obs: observation });
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

    const observation = new Obs(metadata);
    const wrapper = mount(
      <ObsControl
        mapper={mapper}
        metadata={metadata}
        obs={observation}
        onValueChanged={onChangeSpy}
        validate={false}
      />);

    expect(wrapper.find('DummyControl')).to.have.prop('validate').to.deep.eql(false);
    expect(wrapper.find('DummyControl').props()).to.have.property('value', undefined);

    const updatedObs = observation.setValue('abc');
    wrapper.setProps({ obs: updatedObs });

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

    const observation = new Obs(metadata);
    const wrapper = mount(
      <ObsControl
        mapper={mapper}
        metadata={metadata}
        obs={observation}
        onValueChanged={onChangeSpy}
        validate={false}
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
    const observation = new Obs(metadata);
    const wrapper = mount(
      <ObsControl
        mapper={mapper}
        metadata={metadata}
        obs={observation}
        onValueChanged={onChangeSpy}
        validate={false}
      />);
    const instance = wrapper.instance();
    const helperText = instance.showHelperText();
    expect(helperText).to.not.equal(null);
  });
});
