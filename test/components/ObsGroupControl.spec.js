import React from 'react';
import { List } from 'immutable';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import { ControlRecord } from '../../src/helpers/ControlRecordTreeBuilder';
import ComponentStore from 'src/helpers/componentStore';
import { ObsGroupControlWithIntl, ObsGroupControl } from 'components/ObsGroupControl.jsx';
import { ObsControlWithIntl as ObsControl } from 'components/ObsControl.jsx';
import { NumericBox } from 'components/NumericBox.jsx';
import { Label } from 'components/Label.jsx';
import * as FormmatedMsg from 'react-intl';
import { mountWithIntl } from '../intlEnzymeTest.js';

chai.use(chaiEnzyme());

describe('ObsGroupControl', () => {
  const obsConcept = {
    answers: [],
    datatype: 'Numeric',
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
      translationKey: 'TEST_KEY',
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
  const obsGroupConceptTwo = {
    datatype: 'N/A',
    name: 'TestGroup',
    set: true,
    description: { value: '<h1>concept set description</h1>' },
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
  const metadataTwo = {
    concept: obsGroupConceptTwo,
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
      translationKey: 'TEST_KEY',
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
  const showNotificationSpy = sinon.spy();
  const FormattedMessageStub = () => <span />;

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

  context('without i18n', () => {
    before(() => {
      sinon.stub(FormmatedMsg, 'FormattedMessage', FormattedMessageStub);
    });

    after(() => {
      FormmatedMsg.FormattedMessage.restore();
    });

    it('should render obsGroupControl contain obsControl', () => {
      const wrapper = mountWithIntl(
        <ObsGroupControlWithIntl
          children={children}
          collapse
          formName={formName}
          formVersion={formVersion}
          metadata={metadata}
          onValueChanged={onChangeSpy}
          showNotification={showNotificationSpy}
          validate={false}
          validateForm={false}
          value={emptyValue}
        />
      );

      expect(wrapper).to.have.exactly(1).descendants('ObsControl');
    });

    it('should render obsGroup control with only the registered controls', () => {
      ComponentStore.deRegisterComponent('obsControl');

      const wrapper = mountWithIntl(
        <ObsGroupControlWithIntl
          children={children}
          collapse
          formName={formName}
          formVersion={formVersion}
          metadata={metadata}
          onValueChanged={onChangeSpy}
          showNotification={showNotificationSpy}
          validate={false}
          validateForm={false}
          value={emptyValue}
        />
      );

      expect(wrapper).to.not.have.descendants('obsControl');
      ComponentStore.registerComponent('obsControl', ObsControl);
    });

    it('should collapse all child controls on click of collapse icon', () => {
      const wrapper = mountWithIntl(
        <ObsGroupControlWithIntl
          children={children}
          collapse={false}
          formName={formName}
          formVersion={formVersion}
          metadata={metadata}
          onValueChanged={onChangeSpy}
          showNotification={showNotificationSpy}
          validate={false}
          validateForm={false}
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
      const wrapper = mountWithIntl(
        <ObsGroupControlWithIntl
          children={children}
          collapse={false}
          formName={formName}
          formVersion={formVersion}
          metadata={metadata}
          onValueChanged={onChangeSpy}
          showNotification={showNotificationSpy}
          validate={false}
          validateForm={false}
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

      const wrapper = mountWithIntl(
        <ObsGroupControlWithIntl
          children={children}
          collapse={false}
          formName={formName}
          formVersion={formVersion}
          metadata={updatedMetadata}
          onValueChanged={onChangeSpy}
          showNotification={showNotificationSpy}
          validate={false}
          validateForm={false}
          value={emptyValue}
        />
      );

      expect(wrapper).to.have.descendants('AddMore');
    });

    it('should call onValueChanged in obsGroup when onChange be triggered', () => {
      const wrapper = mountWithIntl(
        <ObsGroupControl
          children={children}
          collapse={false}
          formName={formName}
          formVersion={formVersion}
          metadata={metadata}
          onValueChanged={onChangeSpy}
          showNotification={showNotificationSpy}
          validate={false}
          validateForm={false}
          value={emptyValue}
        />
      );

      const updatedValue = { value: 1, comment: undefined };
      wrapper.instance().onChange(obsFormFieldPath, updatedValue, undefined, undefined);

      sinon.assert.calledOnce(
        onChangeSpy.withArgs(obsFormFieldPath, updatedValue, undefined, undefined));
    });

    it('should disable children in obsGroup when obsGroup is set disable', () => {
      const wrapper = mountWithIntl(
        <ObsGroupControlWithIntl
          children={children}
          collapse={false}
          enabled
          formName={formName}
          formVersion={formVersion}
          metadata={metadata}
          onValueChanged={onChangeSpy}
          showNotification={showNotificationSpy}
          validate={false}
          validateForm={false}
          value={emptyValue}
        />
      );
      wrapper.setProps({ enabled: false });
      expect(wrapper.find('Row').at(0).props().enabled).to.eql(false);
    });

    it('should show as disabled when obsGroup is set to be disabled', () => {
      const wrapper = mountWithIntl(
        <ObsGroupControlWithIntl
          children={children}
          collapse={false}
          enabled
          formName={formName}
          formVersion={formVersion}
          metadata={metadata}
          onValueChanged={onChangeSpy}
          showNotification={showNotificationSpy}
          validate={false}
          validateForm={false}
          value={emptyValue}
        />
      );
      wrapper.setProps({ enabled: false });
      expect(wrapper.find('legend')).to.have.className('disabled');
    });

    it('should show as enabled when obsGroup is set to be enabled', () => {
      const wrapper = mountWithIntl(
        <ObsGroupControlWithIntl
          children={children}
          collapse={false}
          enabled
          formName={formName}
          formVersion={formVersion}
          metadata={metadata}
          onValueChanged={onChangeSpy}
          showNotification={showNotificationSpy}
          validate={false}
          validateForm={false}
          value={emptyValue}
        />
      );
      wrapper.setProps({ enabled: true });
      expect(wrapper.find('legend')).to.not.have.className('disabled');
    });

    it('should show as hidden when obsGroup is set to be hidden', () => {
      const wrapper = mountWithIntl(
        <ObsGroupControlWithIntl
          children={children}
          collapse={false}
          formName={formName}
          formVersion={formVersion}
          hidden
          metadata={metadata}
          onValueChanged={onChangeSpy}
          showNotification={showNotificationSpy}
          validate={false}
          validateForm={false}
          value={emptyValue}
        />
      );
      wrapper.setProps({ hidden: true });
      expect(wrapper.find('fieldset')).to.have.className('hidden');
    });

    it('should show as display when obsGroup is set not to be hidden', () => {
      const wrapper = mountWithIntl(
        <ObsGroupControlWithIntl
          children={children}
          collapse={false}
          formName={formName}
          formVersion={formVersion}
          hidden
          metadata={metadata}
          onValueChanged={onChangeSpy}
          showNotification={showNotificationSpy}
          validate={false}
          validateForm={false}
          value={emptyValue}
        />
      );
      wrapper.setProps({ hidden: false });
      expect(wrapper.find('fieldset')).to.not.have.className('hidden');
    });

    it('should pass onEventTrigger property to children', () => {
      const wrapper = mountWithIntl(
        <ObsGroupControlWithIntl
          children={children}
          collapse={false}
          formName={formName}
          formVersion={formVersion}
          hidden
          metadata={metadata}
          onEventTrigger={() => {}}
          onValueChanged={onChangeSpy}
          showNotification={showNotificationSpy}
          validate={false}
          validateForm={false}
          value={emptyValue}
        />
      );

      expect(wrapper.find('ObsControl')).to.have.prop('onEventTrigger');
    });
  });

  context('with i18n', () => {
    it('should render obsGroupControl contain obsControl with translations', () => {
      const wrapper = mountWithIntl(
        <ObsGroupControlWithIntl
          children={children}
          collapse
          formName={formName}
          formVersion={formVersion}
          metadata={metadata}
          onValueChanged={onChangeSpy}
          showNotification={showNotificationSpy}
          validate={false}
          validateForm={false}
          value={emptyValue}
        />
      );
      expect(wrapper).to.have.exactly(1).descendants('ObsControl');
      expect(wrapper.find('.test-obsgrp-header').text()).to.eql('test value');
    });

    it('should show description with html tags when obsGroup has description', () => {
      const wrapper = mountWithIntl(
                    <ObsGroupControlWithIntl
                      children={children}
                      collapse={false}
                      formName={formName}
                      formVersion={formVersion}
                      metadata={metadataTwo}
                      onValueChanged={onChangeSpy}
                      showNotification={showNotificationSpy}
                      validate={false}
                      validateForm={false}
                      value={emptyValue}
                    />
                );
      wrapper.setProps({ metadataTwo });
      expect(wrapper.find('.description').length).to.equal(1);
      expect(wrapper.find('.description')).text().to.eql('concept set description');
    });

    it('should not show description class when obsGroup does not have description', () => {
      const wrapper = mountWithIntl(
                    <ObsGroupControlWithIntl
                      children={children}
                      collapse={false}
                      formName={formName}
                      formVersion={formVersion}
                      metadata={metadata}
                      onValueChanged={onChangeSpy}
                      showNotification={showNotificationSpy}
                      validate={false}
                      validateForm={false}
                      value={emptyValue}
                    />
                );
      wrapper.setProps({ metadata });
      expect(wrapper.find('.description').length).to.equal(0);
    });
  });
});
