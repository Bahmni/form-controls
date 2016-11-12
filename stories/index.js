import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import Button from './Button';
import Welcome from './Welcome';
import {ObsMapper} from "src/helpers/ObsMapper";
import { TextBox } from 'src/components/TextBox.jsx';
import { Label } from 'src/components/Label.jsx';
import { NumericBox } from 'src/components/NumericBox.jsx';
import { Container } from 'src/components/Container.jsx';
import { ObsControl } from 'src/components/ObsControl.jsx';
import { Section } from 'src/components/Section.jsx';
import {Obs} from "src/helpers/Obs";
import '../styles/styles.scss';

const concept = {
    uuid: '70645842-be6a-4974-8d5f-45b52990e132',
    name: 'Pulse',
    dataType: 'Text',
};

const properties = {
    location: {
        row: 0,
        column: 0,
    },
    mandatory: true,
};

const metadata = {
    id: '100',
    type: 'text',
    concept,
    properties,
};

const formUuid = 'someFormUuid';

function getMapper(obsData) {
    const observation = new Obs(formUuid, metadata, obsData);
    return new ObsMapper(observation);
}

const obs = {
    observationDateTime: '2016-09-08T10:10:38.000+0530',
    uuid: 'someUuid',
    value: 'someValue',
};

const form = {
    "id": "fbc5d897-64e4-4cc1-90a3-47fde7a98026",
    "uuid": "fbc5d897-64e4-4cc1-90a3-47fde7a98026",
    "controls": [
        {
            "type": "obsControl",
            "label": {
                "id": "systolic",
                "type": "label",
                "value": "Systolic"
            },
            "properties": {
                "mandatory": false,
                "location": {
                    "column": 0,
                    "row": 0
                }
            },
            "id": "1",
            "concept":  {
                "name": "Systolic",
                "uuid": "c36e9c8b-3f10-11e4-adec-0800271c1b75",
                "datatype": "Numeric"
            }
        },
        {
            "type": "obsControl",
            "label": {
                "id": "diastolic",
                "type": "label",
                "value": "Diastolic"
            },
            "properties": {
                "mandatory": true,
                "location": {
                    "column": 0,
                    "row": 0
                }
            },
            "id": "2",
            "concept": {
                "name": "Diastolic",
                "uuid": "c379aa1d-3f10-11e4-adec-0800271c1b75",
                "datatype": "Numeric"
            }
        }
    ]
};

componentStore.registerComponent('label', Label);
componentStore.registerComponent('text', TextBox);
componentStore.registerComponent('numeric', NumericBox);
componentStore.registerComponent('obsControl', ObsControl);
componentStore.registerComponent('section', Section);

storiesOf('Welcome', module)
  .add('to Storybook', () => (
    <Welcome showApp={linkTo('Button')}/>
  ));

storiesOf('Button', module)
  .add('with text', () => (
    <Button onClick={action('clicked')}>Hello Button</Button>
  ))
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>
  ));

storiesOf('TextBox',module)
  .add('basic', () => (
    <TextBox errors={[]} formUuid={formUuid} mapper={getMapper({
        observationDateTime: '2016-09-08T10:10:38.000+0530',
        uuid: 'someUuid',
        value: 'someValue',
    })} metadata={metadata} />
  ));

storiesOf('Container',module)
    .add('Sample Form', () => (
        <Container metadata={form} observations={[]} />
    ));
