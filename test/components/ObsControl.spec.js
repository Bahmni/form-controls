import React from 'react';
import { mount, shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import { ObsControl } from 'components/ObsControl.jsx';
import { Obs } from 'src/helpers/Obs';
import constants from 'src/constants';

chai.use(chaiEnzyme());

describe('ObsControl', () => {
  const DummyControl = () => <input />;

  before(() => {
    window.componentStore.componentList = {};
    window.componentStore.registerComponent('text', DummyControl);
  });

  after(() => {
    window.componentStore.deRegisterComponent('text');
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
        metadata={metadata}
        obs={observation}
        onValueChanged={onChangeSpy}
        validate={false}
      />);
    expect(wrapper).to.have.exactly(1).descendants('Label');
    expect(wrapper).to.have.exactly(1).descendants('DummyControl');
    expect(wrapper).to.have.exactly(1).descendants('input');

    expect(wrapper.find('DummyControl')).to.have.prop('validations').to.deep.eql([]);
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
        errors={[]}
        metadata={metadata}
        obs={observation}
        validate={false}
        onValueChanged={onChangeSpy}
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
        errors={[]}
        metadata={metadata}
        obs={observation}
        validate={false}
        onValueChanged={onChangeSpy}
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
        metadata={metadata}
        obs={observation}
        onValueChanged={onChangeSpy}
        validate={false}
      />);
    expect(wrapper).to.be.blank();
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
});
