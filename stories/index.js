import React, { Component } from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import Welcome from './Welcome';
import { ObsMapper } from 'src/helpers/ObsMapper';
import { TextBox } from 'src/components/TextBox.jsx';
import { Label } from 'src/components/Label.jsx';
import { Container } from 'src/components/Container.jsx';
import { ObsControl } from 'src/components/ObsControl.jsx';
import { BooleanControl } from 'src/components/BooleanControlDesigner.jsx';
import { Button } from 'src/components/Button.jsx';
import { RadioButton } from 'src/components/RadioButton.jsx';
import { NumericBox } from 'src/components/Button.jsx';
import { CodedControl } from 'src/components/CodedControl.jsx';
import { AutoComplete } from 'src/components/AutoComplete.jsx';
import { DropDown } from 'src/components/DropDown.jsx';
import { Obs } from 'src/helpers/Obs';
import '../styles/styles.scss';
import { ControlState, ControlRecord } from '../src/ControlState';
import '../node_modules/react-select/dist/react-select.css';


const obsList = [
  {
    observationDateTime: '2016-09-08T10:10:38.000+0530',
    uuid: 'systolicUuid',
    value: '120',
    formNamespace: 'formUuid/1',
  },
  {
    observationDateTime: '2016-09-08T10:10:38.000+0530',
    uuid: 'diastolicUuid',
    value: '80',
    formNamespace: 'formUuid/2',
  },
];

const form = {
  id: 'fbc5d897-64e4-4cc1-90a3-47fde7a98026',
  uuid: 'fbc5d897-64e4-4cc1-90a3-47fde7a98026',
  controls: [
    {
      type: 'obsControl',
      label: {
        id: 'systolic',
        type: 'label',
        value: 'Systolic',
      },
      properties: {
        mandatory: true,
        allowDecimal: false,
        location: {
          column: 0,
          row: 0,
        },
      },
      id: '1',
      concept: {
        name: 'Systolic',
        uuid: 'c36e9c8b-3f10-11e4-adec-0800271c1b75',
        datatype: 'Numeric',
      },
    },
    {
      type: 'obsControl',
      label: {
        id: 'diastolic',
        type: 'label',
        value: 'Diastolic',
      },
      properties: {
        mandatory: true,
        location: {
          column: 0,
          row: 0,
        },
      },
      id: '2',
      concept: {
        name: 'Diastolic',
        uuid: 'c379aa1d-3f10-11e4-adec-0800271c1b75',
        datatype: 'Text',
      },
    },
    {
      options: [
        {
          name: 'Yes',
          value: true,
        },
        {
          name: 'No',
          value: false,
        },
      ],
      displayType: 'button',
      type: 'obsControl',
      label: {
        type: 'label',
        value: 'Smoking History',
      },
      properties: {
        mandatory: true,
        notes: false,
        location: {
          column: 0,
          row: 0,
        },
      },
      id: '3',
      concept: {
        name: 'Smoking History',
        uuid: 'c2a43174-c9db-4e54-8516-17372c83537f',
        datatype: 'Boolean',
        properties: {
          allowDecimal: null,
        },
      },
    },
    {
      displayType: 'autoComplete',
      type: 'obsControl',
      label: {
        type: 'label',
        value: 'Coded concept',
      },
      properties: {
        mandatory: true,
        notes: false,
        autoComplete: true,
        location: {
          column: 0,
          row: 0,
        },
      },
      id: '5',
      concept: {
        name: 'Coded concept',
        uuid: 'c2a43174-c990-4e54-8516-17372c83537f',
        datatype: 'Coded',
        answers: [
          {
            display: 'Answer1',
            name: { name: 'Answer1' },
            uuid: 'answer1uuid',
          },
          {
            display: 'Answer2',
            name: { name: 'Answer2' },
            uuid: 'answer2uuid',
          },
        ],
      },
    },
  ],
};

storiesOf('Welcome', module)
  .add('to Storybook', () => (
    <Welcome showApp={linkTo('Button')} />
  ));


storiesOf('Container', module)
  .add('Sample Form', () => (
    <Container metadata={form} observations={obsList} />
  ));


storiesOf('ObsControl', module)
  .add('Numeric Obs Control', () => (
    <ObsControl
      errors={[]}
      formUuid={'fbc5d897-64e4-4cc1-90a3-47fde7a98026'}
      metadata={form.controls[0]}
      obs={new Obs({ concept: form.controls[0].concept })}
      onValueChanged={(obs, errors) => console.log(obs, errors)}
    />
  ));

storiesOf('ObsControl', module)
  .add('TextBox Obs Control', () => (
    <ObsControl
      errors={[]}
      formUuid={'fbc5d897-64e4-4cc1-90a3-47fde7a98026'}
      metadata={form.controls[1]}
      obs={new Obs({ concept: form.controls[1].concept })}
      onValueChanged={(obs, errors) => console.log(obs, errors)}
    />
  ));

storiesOf('ObsControl', module)
  .add('Boolean Obs Control', () => (
    <ObsControl
      errors={[]}
      formUuid={'fbc5d897-64e4-4cc1-90a3-47fde7a98026'}
      metadata={form.controls[2]}
      obs={ new Obs({ concept: form.controls[2].concept })}
      onValueChanged={(obs, errors) => console.log(obs, errors)}
    />
  ));

storiesOf('Container',module)
    .add('Sample Form', () => (
        <Container metadata={form} observations={obsList} />
    ));



class DummyClass extends Component {
    constructor() {
        super();
        console.log('control state', new ControlRecord({ formNamespace: 'abc' }));
    }

    render() {
        return <div>blah</div>;
    }
}

storiesOf('ControlState', module)
.add('demo state', () =>
    <DummyClass />
);

storiesOf('ObsControl', module)
  .add('Coded Obs Control', () => (
    <ObsControl
      errors={[]}
      formUuid={'fbc5d897-6404-4cc1-90a3-47fde7a98026'}
      metadata={form.controls[3]}
      obs={new Obs({ concept: form.controls[3].concept, value:{
         display: 'Answer1',
         name: { name: 'Answer1' },
         uuid: 'answer1uuid',
      } })}
      onValueChanged={(obs, errors) => console.log(obs, errors)}
    />
  ));