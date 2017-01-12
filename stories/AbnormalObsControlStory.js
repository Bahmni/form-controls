import React from 'react';
import { storiesOf } from '@kadira/storybook';
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

const metadata = {
  type: 'ObsGroupControl',
  concept: {
    name: 'Pulse Data',
    uuid: 'c36af094-3f10-11e4-adec-0800271c1b75',
    datatype: 'N/A',
  },
  label: {
    type: 'label',
    value: 'Pulse Data',
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
        value: 'Pulse',
      },
      properties: {
        mandatory: false,
        location: {
          column: 0,
          row: 0,
        },
      },
      id: '6',
      concept: {
        name: 'Pulse',
        uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
        datatype: 'Numeric',
        conceptClass: 'Misc',
        lowNormal: 60,
        hiNormal: 120,
      },
    },
    {
      type: 'obsControl',
      displayType: 'Button',
      options: [
       { name: 'Abnormal', value: true },
      ],
      label: {
        type: 'label',
        value: 'Abnormal',
      },
      properties: {
        mandatory: false,
        location: {
          column: 0,
          row: 0,
        },
        hideLabel: true,
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
};

componentStore.registerComponent('numeric', NumericBox);
componentStore.registerComponent('boolean', BooleanControl);
componentStore.registerComponent('button', Button);
componentStore.registerComponent('Coded', CodedControl);
componentStore.registerComponent('autoComplete', AutoComplete);
componentStore.registerComponent('text', TextBox);

const pulseObs = new Obs({ concept: metadata.controls[0].concept, formFieldPath: 'f.1/6-0', formNamespace: 'bahmni' });
const pulseAbnormalObs = new Obs({ concept: metadata.controls[1].concept, formFieldPath: 'f.1/7-0', formNamespace: 'bahmni' });
const pulseDataObs = new Obs({
  concept: metadata.concept,
  formNamespace: 'f/5',
  groupMembers: List.of(pulseObs, pulseAbnormalObs),
});

storiesOf('Abnormal ObsControl', module)
  .add('Basic View', () => (
  <StoryWrapper json={metadata}>
    <ObsGroupControl
      formName="f"
      formVersion="1"
      mapper={new ObsGroupMapper()}
      errors={[]}
      metadata={metadata}
      obs={ pulseDataObs }
      onValueChanged={() => {}}
      validate= { false }
    />

  </StoryWrapper>
  ));

