import React from 'react';
import { storiesOf } from '@kadira/storybook';
import StoryWrapper from './StoryWrapper';
import { Container } from 'src/components/Container.jsx';
import { ObsControl } from 'src/components/ObsControl.jsx';
import { ObsMapper } from 'src/mapper/ObsMapper';
import { Obs } from 'src/helpers/Obs';
import '../styles/styles.scss';
import '../node_modules/react-select/dist/react-select.css';
import { AutoComplete } from 'src/components/AutoComplete.jsx';
import { DropDown } from 'src/components/DropDown.jsx';

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
      type: 'obsControl',
      label: {
        type: 'label',
        value: 'Coded concept',
      },
      properties: {
        mandatory: true,
        notes: false,
        autoComplete: false,
        dropDown: true,
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
            name: 'Answer1',
            uuid: 'answer1uuid',
          },
          {
            display: 'Answer2',
            name: 'Answer2',
            uuid: 'answer2uuid',
          },
        ],
      },
    },
  ],
};

storiesOf('Forms', module)
    .add('Form1', () =>
        <StoryWrapper json={form}>
          <Container metadata={form} observations={obsList }
            validate={ false }
          />
        </StoryWrapper>
  );


storiesOf('ObsControl', module)
  .add('Numeric Obs Control', () => (
      <StoryWrapper json={ form.controls[0] }>
        <ObsControl
          formUuid={'fbc5d897-64e4-4cc1-90a3-47fde7a98026'}
          mapper = { new ObsMapper() }
          metadata={form.controls[0]}
          obs={new Obs({ concept: form.controls[0].concept })}
          onValueChanged={() => {}}
          validate={ false }
        />
      </StoryWrapper>
  ));

storiesOf('ObsControl', module)
  .add('TextBox Obs Control', () => (
      <StoryWrapper json={form.controls[1]}>
        <ObsControl
          formUuid={'fbc5d897-64e4-4cc1-90a3-47fde7a98026'}
          mapper = { new ObsMapper() }
          metadata={form.controls[1]}
          obs={new Obs({ concept: form.controls[1].concept })}
          onValueChanged={() => {}}
          validate={ false }
        />
      </StoryWrapper>
  ));

storiesOf('ObsControl', module)
  .add('Boolean Obs Control', () => (
      <StoryWrapper json={form.controls[2]}>
    <ObsControl
      formUuid={'fbc5d897-64e4-4cc1-90a3-47fde7a98026'}
      mapper = { new ObsMapper() }
      metadata={form.controls[2]}
      obs={ new Obs({ concept: form.controls[2].concept })}
      onValueChanged={() => {}}
      validate={ false }
    />
      </StoryWrapper>
  ));

storiesOf('ObsControl', module)
  .add('Coded Obs Control', () => (
      <StoryWrapper json={form.controls[3]}>
          <ObsControl
            mapper = { new ObsMapper() }
            metadata={form.controls[3]}
            obs={new Obs({ concept: form.controls[3].concept })}
            onValueChanged={() => {}}
            validate={ false }
          />
      </StoryWrapper>
  ));
