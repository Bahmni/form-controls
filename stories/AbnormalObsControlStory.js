import React from 'react';
import { storiesOf } from '@storybook/react';
import { ObsGroupControl } from 'src/components/ObsGroupControl.jsx';
import { ObsGroupMapper } from 'src/mapper/ObsGroupMapper';
import { Obs } from 'src/helpers/Obs';
import '../styles/styles.scss';
import { NumericBox } from 'src/components/NumericBox.jsx';
import { BooleanControl } from 'src/components/BooleanControl.jsx';
import { Button } from 'src/components/Button.jsx';
import { List } from 'immutable';
import StoryWrapper from './StoryWrapper';
import { CodedControl } from 'src/components/CodedControl.jsx';
import { AutoComplete } from 'src/components/AutoComplete.jsx';
import { TextBox } from 'src/components/TextBox.jsx';
import { ControlRecord } from 'src/helpers/ControlRecordTreeBuilder.js';

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

componentStore.registerComponent('numeric', NumericBox);
componentStore.registerComponent('boolean', BooleanControl);
componentStore.registerComponent('button', Button);
componentStore.registerComponent('Coded', CodedControl);
componentStore.registerComponent('autoComplete', AutoComplete);
componentStore.registerComponent('text', TextBox);

storiesOf('Abnormal ObsControl', module)
  .add('Basic View', () => (
  <StoryWrapper json={metadata}>
    <ObsGroupControl
      errors={[]}
      formName="f"
      formVersion="1"
      mapper={new ObsGroupMapper()}
      metadata={metadata}
      onValueChanged={() => {}}
      validate= { false }
      validateForm ={false}
      value={{}}
      showRemove={true}
      showNotification={()=>{}}
      showAddMore={true}
      children={children}
    /> 

  </StoryWrapper>
  ));

