import React from 'react';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import { List } from 'immutable';
import { ControlRecord } from '../../src/helpers/ControlRecordTreeBuilder';
import ComponentStore from 'src/helpers/componentStore';
import { ObsControlWithIntl as ObsControl } from 'components/ObsControl.jsx';
import { NumericBox } from 'components/NumericBox.jsx';
import { Label } from 'components/Label.jsx';
import { Table } from 'components/Table.jsx';
import * as FormmatedMsg from 'react-intl';
import { shallowWithIntl } from '../intlEnzymeTest';
chai.use(chaiEnzyme());

describe('Table', () => {
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
    columnHeaders: [
      {
        translationKey: 'COLUMN1_2',
        type: 'label',
        value: 'Column1',
        id: '2',
      },
      {
        translationKey: 'COLUMN2_2',
        type: 'label',
        value: 'Column2',
        id: '2',
      },
    ],
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
            column: 1,
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
      value: 'Table',
    },
    properties: {
      location: {
        column: 0,
        row: 0,
      },
    },
    type: 'table',
  };
  const formName = 'Table_Test';
  const formVersion = '1';
  const tableFormFieldPath = 'Table_Test.1/1-0';
  const obsFormFieldPath = 'Table_Test.1/2-0';
  const children = List.of(new ControlRecord({
    id: '2',
    control: metadata.controls[2],
    formFieldPath: obsFormFieldPath,
    dataSource: {
      concept: obsConcept,
      formFieldPath: obsFormFieldPath,
      formNamespace: 'Bahmni',
      voided: true,
    },
  }));
  const FormattedMessageStub = () => <span />;
  const onEventTrigger = () => {};
  const onChange = () => {};
  const showNotification = () => {};

  before(() => {
    ComponentStore.registerComponent('table', Table);
    ComponentStore.registerComponent('obsControl', ObsControl);
    ComponentStore.registerComponent('numeric', NumericBox);
    ComponentStore.registerComponent('label', Label);
  });
  after(() => {
    ComponentStore.deRegisterComponent('table');
    ComponentStore.deRegisterComponent('obsControl');
    ComponentStore.deRegisterComponent('numeric');
    ComponentStore.deRegisterComponent('label');
  });
  describe('without i18n', () => {
    before(() => {
      sinon.stub(FormmatedMsg, 'FormattedMessage', FormattedMessageStub);
    });

    after(() => {
      FormmatedMsg.FormattedMessage.restore();
    });

    it('should render table with header and rows', () => {
      const wrapper = shallowWithIntl(
                <Table
                  children={children}
                  formFieldPath={tableFormFieldPath}
                  formName={formName}
                  formVersion={formVersion}
                  metadata={metadata}
                  onValueChanged={onChange}
                  showNotification={showNotification}
                  validate={false}
                  validateForm={false}
                />);
      const allFormattedMessage = wrapper.find('.test-table-label');
      expect(allFormattedMessage.get(0).props.children).to.eql(metadata.label.value);
      expect(allFormattedMessage.get(1).props.children).to.eql(metadata.columnHeaders[0].value);
      expect(allFormattedMessage.get(2).props.children).to.eql(metadata.columnHeaders[1].value);
      expect(wrapper.find('IntlProvider').find('ForwardRef')
          .prop('records')[0]).to.eql(children.get(0));
      expect(wrapper.find('IntlProvider').find('ForwardRef')
          .prop('controls')[0]).to.eql(metadata.controls[0]);
    });

    it('should pass enabled, formName,formVersion,validate,validateForm,onValueChanged,'
        + 'onEventTrigger,patientUuid, showNotification,props to row', () => {
      const wrapper = shallowWithIntl(
                <Table
                  children={children}
                  enabled
                  formFieldPath={tableFormFieldPath}
                  formName={formName}
                  formVersion={formVersion}
                  metadata={metadata}
                  onEventTrigger={onEventTrigger}
                  onValueChanged={onChange}
                  patientUuid="patientUuid"
                  showNotification={showNotification}
                  validate={false}
                  validateForm={false}

                />);

      expect(wrapper.find('IntlProvider').find('ForwardRef')
          .prop('onEventTrigger')).to.eql(onEventTrigger);
      expect(wrapper.find('IntlProvider').find('ForwardRef')
          .prop('patientUuid')).to.eql('patientUuid');
      expect(wrapper.find('IntlProvider').find('ForwardRef')
          .prop('showNotification')).to.eql(showNotification);
      expect(wrapper.find('IntlProvider').find('ForwardRef').prop('validateForm')).to.eql(false);
      expect(wrapper.find('IntlProvider').find('ForwardRef').prop('validate')).to.eql(false);
      expect(wrapper.find('IntlProvider').find('ForwardRef')
          .prop('onValueChanged')).to.eql(wrapper.instance().onChange);
      expect(wrapper.find('IntlProvider').find('ForwardRef').prop('enabled')).to.eql(true);
      expect(wrapper.find('IntlProvider').find('ForwardRef')
          .prop('formVersion')).to.eql(formVersion);
      expect(wrapper.find('IntlProvider').find('ForwardRef').prop('formName')).to.eql(formName);
      expect(wrapper.find('IntlProvider').find('ForwardRef').prop('isInTable')).to.eql(true);
    });

    it('should call onValueChanged prop when onChange is called', () => {
      const onValueChangedSpy = sinon.spy();
      const wrapper = shallowWithIntl(
            <Table
              children={children}
              formFieldPath={tableFormFieldPath}
              formName={formName}
              formVersion={formVersion}
              metadata={metadata}
              onValueChanged={onValueChangedSpy}
              showNotification={showNotification}
              validate={false}
              validateForm={false}
            />);
      const formFieldPath = 'FFP';
      const value = {};
      const errors = [];
      const onActionDone = () => {};
      wrapper.instance().onChange(formFieldPath, value, errors, onActionDone);
      expect(onValueChangedSpy.calledWith(formFieldPath, value, errors, onActionDone)).to.eql(true);
    });
  });
});
