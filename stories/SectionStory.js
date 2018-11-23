import React from 'react';
import { storiesOf } from '@storybook/react';
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
import { Container } from 'src/components/Container.jsx';
import { Section } from 'src/components/Section.jsx';

const metadata = {
  id: 1,
  name: 'Form Name',
  version: '1',
  uuid: 'c36bc411-3f10-11e4-adec-0800271c1asd',
  controls: [{
    type: 'section',
    label: {
      type: 'label',
      value: 'Section Data',
    },
    properties: {
      mandatory: false,
      location: {
        column: 0,
        row: 0,
      },
    },
    id: '5',
    controls: [
      {
        type: 'obsControl',
        label: {
          type: 'label',
          value: 'Notes',
        },
        properties: {
          mandatory: true,
          location: {
            column: 0,
            row: 0,
          },
        },
        id: '6',
        concept: {
          name: 'Notes',
          uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
          datatype: 'Text',
          conceptClass: 'Misc',
          lowNormal: '60',
          hiNormal: '120',
        },
      },
      {
        type: 'obsControl',
        displayType: 'Button',
        options: [
          { name: 'Yes', value: true },
          { name: 'No', value: false },
        ],
        label: {
          type: 'label',
          value: 'Abnormal',
        },
        properties: {
          mandatory: false,
          location: {
            column: 1,
            row: 0,
          },
          hideLabel: false,
        },
        id: '7',
        concept: {
          name: 'Pulse Abnormal',
          uuid: 'c36c7c98-3f10-11e4-adec-0800271c1b75',
          datatype: 'Boolean',
          conceptClass: 'Abnormal',
        },
      },
    ],
  }],
};

componentStore.registerComponent('numeric', NumericBox);
componentStore.registerComponent('boolean', BooleanControl);
componentStore.registerComponent('button', Button);
componentStore.registerComponent('Coded', CodedControl);
componentStore.registerComponent('autoComplete', AutoComplete);
componentStore.registerComponent('text', TextBox);
componentStore.registerComponent('section', Section);


storiesOf('Section control', module)
    .add('Basic View', () => (
  <StoryWrapper json={metadata}>
    <Container
      collapse = { false }
      metadata={metadata}
      observations={ [] }
      patient={{}}
      translations= { { labels: {
        LABEL_1: 'some Label',
      } } }
      validate = { false } validateForm={ false }
    />

  </StoryWrapper>
  ));

