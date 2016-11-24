import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { AbnormalObsControl } from 'src/components/AbnormalObsControl.jsx';
import { Obs } from 'src/helpers/Obs';
import '../styles/styles.scss';
import { NumericBox } from 'src/components/NumericBox.jsx';
import { List } from 'immutable';

const metadata = {
  type: 'AbnormalObsGroupControl',
  concept: {
    name: 'Pulse Data',
    uuid: 'pulsDataUuid',
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
        uuid: 'pulseUuid',
        datatype: 'Numeric',
        conceptClass: 'Misc',
        lowNormal: '60',
        hiNormal: '120',
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
          column: 1,
          row: 0,
        },
        hideLabel: true,
      },
      id: '7',
      concept: {
        name: 'Pulse Abnormal',
        uuid: 'pulseAbnormalUuid',
        datatype: 'Boolean',
        conceptClass: 'Abnormal',
      },
    },
  ],
};

componentStore.registerComponent('numeric', NumericBox);

const pulseObs = new Obs({ concept: metadata.controls[0].concept, formNamespace: 'f/6' });
const pulseAbnormalObs = new Obs({ concept: metadata.controls[1].concept, formNamespace: 'f/7' });
const pulseDataObs = new Obs({
  concept: metadata.concept,
  formNamespace: 'f/5',
  groupMembers: List.of(pulseObs, pulseAbnormalObs),
});

storiesOf('Abnormal ObsControl', module)
  .add('Basic View', () => (
    <AbnormalObsControl
      errors={[]}
      metadata={metadata}
      obs={ pulseDataObs }
      onValueChanged={(obs, errors) => console.log(obs, errors)}
      validate= { false }
    />
  ));

