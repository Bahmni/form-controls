import React from 'react';
import { List } from 'immutable';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import { ControlRecord } from '../../src/helpers/ControlRecordTreeBuilder';
import ComponentStore from 'src/helpers/componentStore';
import { ObsGroupControl } from 'components/ObsGroupControl.jsx';
import { ObsControl } from 'components/ObsControl.jsx';
import { NumericBox } from 'components/NumericBox.jsx';
import { Label } from 'components/Label.jsx';

chai.use(chaiEnzyme());

describe('ObsGroupControl', () => {
  const obsConcept = {
    answers: [],
    datatype: 'Numeric',
    description: [],
    hiAbsolute: null,
    hiNormal: null,
    lowAbsolute: null,
    lowNormal: null,
    name: 'TestObs',
    properties: {
      allowDecimal: false,
    },
    units: null,
    uuid: 'd0490af4-72eb-4090-9b43-ac3487ba7474',
  };
  const obsControl = {
    concept: obsConcept,
    hiAbsolute: null,
    hiNormal: null,
    id: '4',
    label: {
      type: 'label',
      value: 'TestObs',
    },
    lowAbsolute: null,
    lowNormal: null,
    properties: {
      addMore: true,
      hideLabel: false,
      location: {
        column: 0,
        row: 0,
      },
      mandatory: false,
      notes: false,
    },
    type: 'obsControl',
    units: null,
  };
  const obsFormFieldPath = 'SingleGroup.3/4-0';
  const obsDataSource = {
    concept: obsConcept,
    formFieldPath: obsFormFieldPath,
    formNamespace: 'Bahmni',
    voided: true,
  };
  const children = List.of(new ControlRecord({
    control: obsControl,
    formFieldPath: obsFormFieldPath,
    dataSource: obsDataSource,
  }));
  const obsGroupConcept = {
    datatype: 'N/A',
    name: 'TestGroup',
    set: true,
    setMembers: [
      {
        answers: [],
        datatype: 'Numeric',
        description: [],
        hiAbsolute: null,
        hiNormal: null,
        lowAbsolute: null,
        lowNormal: null,
        name: 'TestObs',
        properties: {
          allowDecimal: false,
        },
        units: null,
        uuid: 'd0490af4-72eb-4090-9b43-ac3487ba7474',
      },
    ],
    uuid: 'eafe7d68-904b-459b-b11d-6502ec0143a4',
  };
  const formName = 'SingleGroup';
  const formVersion = '3';
  const metadata = {
    concept: obsGroupConcept,
    controls: [
      {
        concept: obsConcept,
        hiAbsolute: null,
        hiNormal: null,
        id: '4',
        label: {
          type: 'label',
          value: 'TestObs',
        },
        lowAbsolute: null,
        lowNormal: null,
        properties: {
          addMore: true,
          hideLabel: false,
          location: {
            column: 0,
            row: 0,
          },
          mandatory: false,
          notes: false,
        },
        type: 'obsControl',
        units: null,
      },
    ],
    id: '3',
    label: {
      type: 'label',
      value: 'TestGroup',
    },
    properties: {
      abnormal: false,
      addMore: false,
      location: {
        column: 0,
        row: 0,
      },
    },
    type: 'obsGroupControl',
  };

  const onChangeSpy = sinon.spy();
  const emptyValue = {};

  before(() => {
    ComponentStore.registerComponent('obsControl', ObsControl);
    ComponentStore.registerComponent('obsGroupControl', ObsGroupControl);
    ComponentStore.registerComponent('numeric', NumericBox);
    ComponentStore.registerComponent('label', Label);
  });

  after(() => {
    ComponentStore.deRegisterComponent('obsControl');
    ComponentStore.deRegisterComponent('obsGroupControl');
    ComponentStore.deRegisterComponent('numeric');
    ComponentStore.deRegisterComponent('label');
  });
  it('should render obsGroupControl contain obsControl', () => {
    const wrapper = mount(
      <ObsGroupControl
        children={children}
        collapse
        formName={formName}
        formVersion={formVersion}
        metadata={metadata}
        onValueChanged={onChangeSpy}
        validate={false}
        value={emptyValue}
      />
    );

    expect(wrapper).to.have.exactly(1).descendants('ObsControl');
  });

  it('should render obsGroup control with only the registered controls', () => {
    ComponentStore.deRegisterComponent('obsControl');

    const wrapper = mount(
      <ObsGroupControl
        children={children}
        collapse
        formName={formName}
        formVersion={formVersion}
        metadata={metadata}
        onValueChanged={onChangeSpy}
        validate={false}
        value={emptyValue}
      />
    );

    expect(wrapper).to.not.have.descendants('obsControl');
    ComponentStore.registerComponent('obsControl', ObsControl);
  });

  it('should collapse all child controls on click of collapse icon', () => {
    const wrapper = mount(
      <ObsGroupControl
        children={children}
        collapse={false}
        formName={formName}
        formVersion={formVersion}
        metadata={metadata}
        onValueChanged={onChangeSpy}
        validate={false}
        value={emptyValue}
      />
    );

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
      <ObsGroupControl
        children={children}
        collapse={false}
        formName={formName}
        formVersion={formVersion}
        metadata={metadata}
        onValueChanged={onChangeSpy}
        validate={false}
        value={emptyValue}
      />
    );

    expect(wrapper.find('legend').props().className).to.eql('form-builder-toggle active');
    expect(wrapper.find('div').at(0).props().className)
      .to.eql('obsGroup-controls active-group-controls');

    wrapper.setProps({ collapse: true });

    expect(wrapper.find('legend').props().className).to.eql('form-builder-toggle ');
    expect(wrapper.find('div').at(0).props().className)
      .to.eql('obsGroup-controls closing-group-controls');
  });

  it('should render obsGroup with addMore icon when has addMore properties', () => {
    const updatedProperties = Object.assign({}, metadata.properties, { addMore: true });
    const updatedMetadata = Object.assign({}, metadata, { properties: updatedProperties });

    const wrapper = mount(
      <ObsGroupControl
        children={children}
        collapse={false}
        formName={formName}
        formVersion={formVersion}
        metadata={updatedMetadata}
        onValueChanged={onChangeSpy}
        validate={false}
        value={emptyValue}
      />
    );

    expect(wrapper).to.have.descendants('AddMore');
  });

  it('should call onValueChanged in obsGroup when onChange be triggered', () => {
    const wrapper = mount(
      <ObsGroupControl
        children={children}
        collapse={false}
        formName={formName}
        formVersion={formVersion}
        metadata={metadata}
        onValueChanged={onChangeSpy}
        validate={false}
        value={emptyValue}
      />
    );

    const updatedValue = { value: 1, comment: undefined };
    wrapper.instance().onChange(obsFormFieldPath, updatedValue, undefined);

    sinon.assert.calledOnce(onChangeSpy.withArgs(obsFormFieldPath, updatedValue, undefined));
  });

  it('should disable children in obsGroup when obsGroup is set disable', () => {
    const wrapper = mount(
      <ObsGroupControl
        children={children}
        collapse={false}
        enabled
        formName={formName}
        formVersion={formVersion}
        metadata={metadata}
        onValueChanged={onChangeSpy}
        validate={false}
        value={emptyValue}
      />
    );
    wrapper.setProps({ enabled: false });
    expect(wrapper.find('Row').at(0).props().enabled).to.eql(false);
  });
});
