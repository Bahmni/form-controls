import React from 'react';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { Section } from 'components/Section.jsx';
import sinon from 'sinon';
import ComponentStore from 'src/helpers/componentStore';
import { ObsControl } from 'components/ObsControl.jsx';
import { NumericBox } from 'components/NumericBox.jsx';
import { List } from 'immutable';
import { Label } from 'components/Label.jsx';
import { ControlRecord } from '../../src/helpers/ControlRecordTreeBuilder';

chai.use(chaiEnzyme());

describe('Section', () => {
  before(() => {
    ComponentStore.registerComponent('section', Section);
    ComponentStore.registerComponent('obsControl', ObsControl);
    ComponentStore.registerComponent('numeric', NumericBox);
    ComponentStore.registerComponent('label', Label);
  });

  after(() => {
    ComponentStore.deRegisterComponent('section');
    ComponentStore.deRegisterComponent('obsControl');
    ComponentStore.deRegisterComponent('numeric');
    ComponentStore.deRegisterComponent('label');
  });

  const obsConcept = {
    answers: [],
    datatype: 'Numeric',
    description: [],
    name: 'Pulse',
    properties: {
      allowDecimal: true,
    },
    uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
  };
  const metadata = {
    controls: [
      {
        concept: obsConcept,
        hiAbsolute: null,
        hiNormal: 72,
        id: '2',
        label: {
          type: 'label',
          value: 'Pulse(/min)',
        },
        lowAbsolute: null,
        lowNormal: 72,
        properties: {
          addMore: true,
          hideLabel: false,
          location: {
            column: 0,
            row: 0,
          },
          mandatory: true,
          notes: false,
        },
        type: 'obsControl',
        units: '/min',
      },
    ],
    id: '1',
    label: {
      type: 'label',
      value: 'Section',
    },
    properties: {
      location: {
        column: 0,
        row: 0,
      },
    },
    type: 'section',
  };
  const formName = 'Section_Test';
  const formVersion = '1';
  const sectionFormFieldPath = 'Section_Test.1/1-0';
  const obsFormFieldPath = 'Section_Test.1/2-0';
  const children = List.of(new ControlRecord({
    control: {
      concept: obsConcept,
      hiAbsolute: null,
      hiNormal: 72,
      id: '2',
      label: {
        type: 'label',
        value: 'Pulse(/min)',
      },
      lowAbsolute: null,
      lowNormal: 72,
      properties: {
        addMore: true,
        hideLabel: false,
        location: {
          column: 0,
          row: 0,
        },
        mandatory: true,
        notes: false,
      },
      type: 'obsControl',
      units: '/min',
    },
    formFieldPath: obsFormFieldPath,
    dataSource: {
      concept: obsConcept,
      formFieldPath: obsFormFieldPath,
      formNamespace: 'Bahmni',
      voided: true,
    },
  }));

  const onChangeSpy = sinon.spy();

  it('should render section control collapse equal to true', () => {
    const wrapper = mount(
      <Section
        children={children}
        collapse
        formFieldPath={sectionFormFieldPath}
        formName={formName}
        formVersion={formVersion}
        metadata={metadata}
        onValueChanged={onChangeSpy}
        validate={false}
      />);

    expect(wrapper).to.have.exactly(1).descendants('ObsControl');
  });

  it('should pass enabled property to its child component', () => {
    const wrapper = mount(
      <Section
        children={children}
        collapse
        enabled={false}
        formFieldPath={sectionFormFieldPath}
        formName={formName}
        formVersion={formVersion}
        metadata={metadata}
        onValueChanged={onChangeSpy}
        validate={false}
      />);

    expect(wrapper.find('ObsControl')).to.have.prop('enabled').to.deep.eql(false);
  });

  it('should render section control with only the registered controls', () => {
    ComponentStore.deRegisterComponent('obsControl');
    const wrapper = mount(
      <Section
        children={children}
        collapse
        formFieldPath={sectionFormFieldPath}
        formName={formName}
        formVersion={formVersion}
        metadata={metadata}
        onValueChanged={onChangeSpy}
        validate={false}
      />);

    expect(wrapper).to.not.have.descendants('obsControl');
    ComponentStore.registerComponent('obsControl', ObsControl);
  });

  it('should collapse all child controls on click of collapse icon', () => {
    const wrapper = mount(
      <Section
        enabled
        children={children}
        collapse={false}
        formFieldPath={sectionFormFieldPath}
        formName={formName}
        formVersion={formVersion}
        metadata={metadata}
        onValueChanged={onChangeSpy}
        validate={false}
      />);

    expect(wrapper.find('legend').props().className).to.eql('form-builder-toggle active');
    expect(wrapper.find('div').at(0).props().className)
      .to.eql('obsGroup-controls active-group-controls');

    wrapper.find('legend').simulate('click');

    expect(wrapper.find('legend').props().className).to.eql('form-builder-toggle ');
    expect(wrapper.find('div').at(0).props().className)
      .to.eql('obsGroup-controls closing-group-controls');
  });

  it('should collapse all child controls on change of collapse props', () => {
    const wrapper = mount(
      <Section
        enabled
        children={children}
        collapse={false}
        formFieldPath={sectionFormFieldPath}
        formName={formName}
        formVersion={formVersion}
        metadata={metadata}
        onValueChanged={onChangeSpy}
        validate={false}
      />);

    expect(wrapper.find('legend').props().className).to.eql('form-builder-toggle active');
    expect(wrapper.find('div').at(0).props().className)
      .to.eql('obsGroup-controls active-group-controls');

    wrapper.setProps({ collapse: true });

    expect(wrapper.find('legend').props().className).to.eql('form-builder-toggle ');
    expect(wrapper.find('div').at(0).props().className)
      .to.eql('obsGroup-controls closing-group-controls');
  });

  it('should collapse all child controls on change of collapse state', () => {
    const wrapper = mount(
      <Section
        enabled
        children={children}
        collapse={false}
        formFieldPath={sectionFormFieldPath}
        formName={formName}
        formVersion={formVersion}
        metadata={metadata}
        onValueChanged={onChangeSpy}
        validate={false}
      />);

    expect(wrapper.find('legend').props().className).to.eql('form-builder-toggle active');
    expect(wrapper.find('div').at(0).props().className)
      .to.eql('obsGroup-controls active-group-controls');

    wrapper.setState({ collapse: false });
    wrapper.setProps({ collapse: true });

    expect(wrapper.find('legend').props().className).to.eql('form-builder-toggle ');
    expect(wrapper.find('div').at(0).props().className)
      .to.eql('obsGroup-controls closing-group-controls');
  });

  it('should show as disabled when Section is set to be disabled', () => {
    const wrapper = mount(
      <Section
        enabled={false}
        children={children}
        collapse={false}
        formFieldPath={sectionFormFieldPath}
        formName={formName}
        formVersion={formVersion}
        metadata={metadata}
        onValueChanged={onChangeSpy}
        validate={false}
      />);

    expect(wrapper.find('legend').props().className).to.eql('form-builder-toggle active disabled');
    expect(wrapper.find('div').at(0).props().className)
      .to.eql('obsGroup-controls active-group-controls disabled');
  });

  it('should disable collapse/expand when Section is set to be disabled', () => {
    const wrapper = mount(
      <Section
        enabled={false}
        children={children}
        collapse={false}
        formFieldPath={sectionFormFieldPath}
        formName={formName}
        formVersion={formVersion}
        metadata={metadata}
        onValueChanged={onChangeSpy}
        validate={false}
      />);

    expect(wrapper.find('legend').props().className).to.eql('form-builder-toggle active disabled');
    expect(wrapper.find('div').at(0).props().className)
      .to.eql('obsGroup-controls active-group-controls disabled');

    wrapper.setProps({collapse: true});
    expect(wrapper.find('legend').props().className).to.eql('form-builder-toggle active disabled');

    wrapper.find('legend').simulate('click');
    expect(wrapper.find('legend').props().className).to.eql('form-builder-toggle active disabled');
  });

  it('should call onValueChanged when onChange be triggered', () => {
    const wrapper = mount(
      <Section
        children={children}
        collapse
        formFieldPath={sectionFormFieldPath}
        formName={formName}
        formVersion={formVersion}
        metadata={metadata}
        onValueChanged={onChangeSpy}
        validate={false}
      />);

    const updatedValue = { value: 1, comment: undefined };
    wrapper.instance().onChange(obsFormFieldPath, updatedValue, undefined);

    sinon.assert.calledOnce(
      onChangeSpy.withArgs(obsFormFieldPath, updatedValue, undefined));
  });
});
