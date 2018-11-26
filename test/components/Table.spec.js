import React from 'react';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { List } from 'immutable';
import { ControlRecord } from '../../src/helpers/ControlRecordTreeBuilder';
import ComponentStore from 'src/helpers/componentStore';
import { ObsControl } from 'components/ObsControl.jsx';
import { NumericBox } from 'components/NumericBox.jsx';
import { Label } from 'components/Label.jsx';
import { Table } from 'components/Table.jsx';
import * as FormmatedMsg from 'react-intl';
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
    controls: [
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
      const wrapper = shallow(
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
      let index = 0;
      wrapper.find('FormattedMessage').forEach((node) => {
        const columnName = metadata.controls[index].value;
        expect(node.prop('defaultMessage')).to.eql(columnName);
        index++;
      });
      expect(wrapper.find('Row').length).to.eql(1);
      expect(wrapper.find('Row').prop('records')[0]).to.eql(children.get(0));
      expect(wrapper.find('Row').prop('controls')[0]).to.eql(metadata.controls[2]);
    });

    it('should pass enabled, formName,formVersion,validate,validateForm,onValueChanged,'
        + 'onEventTrigger,patientUuid, showNotification,props to row', () => {
      const wrapper = shallow(
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

      expect(wrapper.find('Row').prop('onEventTrigger')).to.eql(onEventTrigger);
      expect(wrapper.find('Row').prop('patientUuid')).to.eql('patientUuid');
      expect(wrapper.find('Row').prop('showNotification')).to.eql(showNotification);
      expect(wrapper.find('Row').prop('validateForm')).to.eql(false);
      expect(wrapper.find('Row').prop('validate')).to.eql(false);
      expect(wrapper.find('Row').prop('onValueChanged')).to.eql(wrapper.instance().onChange);
      expect(wrapper.find('Row').prop('enabled')).to.eql(true);
      expect(wrapper.find('Row').prop('formVersion')).to.eql(formVersion);
      expect(wrapper.find('Row').prop('formName')).to.eql(formName);
      expect(wrapper.find('Row').prop('isInTable')).to.eql(true);
    });
  });
});
