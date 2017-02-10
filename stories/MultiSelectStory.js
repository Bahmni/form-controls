import React from 'react';
import { storiesOf } from '@kadira/storybook';
import StoryWrapper from './StoryWrapper';
import { Container } from 'src/components/Container.jsx';
import '../styles/main.scss';
import '../node_modules/react-select/dist/react-select.css';

const form = {
  id: 1,
  name: 'abcd',
  version: '1',
  uuid: '8f36439c-8e3a-45ac-bb31-98b43a91ecb5',
  controls: [
    {
      type: 'obsControl',
      label: {
        type: 'label',
        value: 'Tuberculosis, Comorbidity',
      },
      properties: {
        mandatory: false,
        notes: false,
        hideLabel: false,
        location: {
          column: 0,
          row: 0,
        },
        multiSelect: true,
        autoComplete: true,
      },
      id: '1',
      concept: {
        name: 'Tuberculosis, Comorbidity',
        uuid: 'c0cd3760-e7da-418e-bf01-bdca095179f2',
        datatype: 'Coded',
        units: null,
        hiNormal: null,
        lowNormal: null,
        hiAbsolute: null,
        lowAbsolute: null,
        answers: [
          {
            uuid: '1e3f1870-b252-4808-8edb-f86fad050ebd',
            name: {
              display: 'Diabetes',
              uuid: 'fdabcf86-7ac9-4122-96f7-9f84858228fd',
              name: 'Diabetes',
              locale: 'en',
              localePreferred: true,
              conceptNameType: 'FULLY_SPECIFIED',
              resourceVersion: '1.9',
            },
            names: [
              {
                display: 'Diabetes',
                uuid: 'fdabcf86-7ac9-4122-96f7-9f84858228fd',
                name: 'Diabetes',
                locale: 'en',
                localePreferred: true,
                conceptNameType: 'FULLY_SPECIFIED',
                resourceVersion: '1.9',
              },
            ],
            displayString: 'Diabetes',
            resourceVersion: '1.9',
          },
          {
            uuid: 'f48a534d-b1dd-4d37-8794-065243c546a4',
            name: {
              display: 'Liver Disease',
              uuid: '47937ec0-b7a2-405b-8a2a-a137738bda9b',
              name: 'Liver Disease',
              locale: 'en',
              localePreferred: true,
              conceptNameType: 'FULLY_SPECIFIED',
              resourceVersion: '1.9',
            },
            names: [
              {
                display: 'Liver Disease',
                uuid: '47937ec0-b7a2-405b-8a2a-a137738bda9b',
                name: 'Liver Disease',
                locale: 'en',
                localePreferred: true,
                conceptNameType: 'FULLY_SPECIFIED',
                resourceVersion: '1.9',
              },
            ],
            displayString: 'Liver Disease',
            resourceVersion: '1.9',
          },
          {
            uuid: 'ec41264d-e82e-4356-a7d2-7c1ff6c90abe',
            name: {
              display: 'HIV',
              uuid: 'db48fd54-0199-4a96-93a5-e3ba073f5900',
              name: 'HIV',
              locale: 'en',
              localePreferred: true,
              conceptNameType: 'FULLY_SPECIFIED',
              resourceVersion: '1.9',
            },
            names: [
              {
                display: 'HIV',
                uuid: 'db48fd54-0199-4a96-93a5-e3ba073f5900',
                name: 'HIV',
                locale: 'en',
                localePreferred: true,
                conceptNameType: 'FULLY_SPECIFIED',
                resourceVersion: '1.9',
              },
            ],
            displayString: 'HIV',
            resourceVersion: '1.9',
          },
          {
            uuid: 'b1329dcb-412f-4e8b-ae16-bec3c4790a83',
            name: {
              display: 'Renal Disease',
              uuid: '224d4bb2-b6f4-4d01-bb4a-9f5a2fc138d0',
              name: 'Renal Disease',
              locale: 'en',
              localePreferred: true,
              conceptNameType: 'FULLY_SPECIFIED',
              resourceVersion: '1.9',
            },
            names: [
              {
                display: 'Renal Disease',
                uuid: '224d4bb2-b6f4-4d01-bb4a-9f5a2fc138d0',
                name: 'Renal Disease',
                locale: 'en',
                localePreferred: true,
                conceptNameType: 'FULLY_SPECIFIED',
                resourceVersion: '1.9',
              },
            ],
            displayString: 'Renal Disease',
            resourceVersion: '1.9',
          },
          {
            uuid: '193233dc-70a9-477f-99b6-cc1d48be4e74',
            name: {
              display: 'RHD',
              uuid: 'b31203c8-0fa0-4de3-9f25-c1d12a567d9d',
              name: 'RHD',
              locale: 'en',
              localePreferred: true,
              conceptNameType: 'FULLY_SPECIFIED',
              resourceVersion: '1.9',
            },
            names: [
              {
                display: 'RHD',
                uuid: 'b31203c8-0fa0-4de3-9f25-c1d12a567d9d',
                name: 'RHD',
                locale: 'en',
                localePreferred: true,
                conceptNameType: 'FULLY_SPECIFIED',
                resourceVersion: '1.9',
              },
            ],
            displayString: 'RHD',
            resourceVersion: '1.9',
          },
          {
            uuid: '11ca83c4-a2d4-47cb-ae4a-0d33f0ba5703',
            name: {
              display: 'Asthma',
              uuid: 'e6e28ccd-17ae-4ce1-bba9-f1f87f7dadef',
              name: 'Asthma',
              locale: 'en',
              localePreferred: true,
              conceptNameType: 'FULLY_SPECIFIED',
              resourceVersion: '1.9',
            },
            names: [
              {
                display: 'Asthma',
                uuid: 'e6e28ccd-17ae-4ce1-bba9-f1f87f7dadef',
                name: 'Asthma',
                locale: 'en',
                localePreferred: true,
                conceptNameType: 'FULLY_SPECIFIED',
                resourceVersion: '1.9',
              },
            ],
            displayString: 'Asthma',
            resourceVersion: '1.9',
          },
          {
            uuid: 'c41e4829-19e8-463a-955e-977fb57b4b49',
            name: {
              display: 'Severe Undernutrition',
              uuid: '2687f5f1-58a9-485b-8eca-c1b33261d37e',
              name: 'Severe Undernutrition',
              locale: 'en',
              localePreferred: true,
              conceptNameType: 'FULLY_SPECIFIED',
              resourceVersion: '1.9',
            },
            names: [
              {
                display: 'Severe Undernutrition',
                uuid: '2687f5f1-58a9-485b-8eca-c1b33261d37e',
                name: 'Severe Undernutrition',
                locale: 'en',
                localePreferred: true,
                conceptNameType: 'FULLY_SPECIFIED',
                resourceVersion: '1.9',
              },
            ],
            displayString: 'Severe Undernutrition',
            resourceVersion: '1.9',
          },
          {
            uuid: '4fdc5b5b-ff7a-4bdf-920f-92276ef6c07f',
            name: {
              display: 'Other Answer',
              uuid: 'fcfed58d-6361-4fce-839c-09548ce87492',
              name: 'Other Answer',
              locale: 'en',
              localePreferred: true,
              conceptNameType: 'FULLY_SPECIFIED',
              resourceVersion: '1.9',
            },
            names: [
              {
                display: 'Other Answer',
                uuid: 'fcfed58d-6361-4fce-839c-09548ce87492',
                name: 'Other Answer',
                locale: 'en',
                localePreferred: true,
                conceptNameType: 'FULLY_SPECIFIED',
                resourceVersion: '1.9',
              },
              {
                display: 'Other (Specify)',
                uuid: '4c57b8e9-8590-40f8-8480-6d7c1165b3a2',
                name: 'Other (Specify)',
                locale: 'en',
                localePreferred: false,
                conceptNameType: 'SHORT',
                resourceVersion: '1.9',
              },
            ],
            displayString: 'Other Answer',
            resourceVersion: '1.9',
          },
        ],
        properties: {
          allowDecimal: null,
        },
      },
    },
  ],
};

const obsList = [
  {
    observationDateTime: '2016-09-08T10:10:38.000+0530',
    uuid: 'systolicUuid',
    value: {
      uuid: '1e3f1870-b252-4808-8edb-f86fad050ebd',
      name: {
        display: 'Diabetes',
        uuid: 'fdabcf86-7ac9-4122-96f7-9f84858228fd',
        name: 'Diabetes',
        locale: 'en',
        localePreferred: true,
        conceptNameType: 'FULLY_SPECIFIED',
        resourceVersion: '1.9',
      },
      names: [
        {
          display: 'Diabetes',
          uuid: 'fdabcf86-7ac9-4122-96f7-9f84858228fd',
          name: 'Diabetes',
          locale: 'en',
          localePreferred: true,
          conceptNameType: 'FULLY_SPECIFIED',
          resourceVersion: '1.9',
        },
      ],
      displayString: 'Diabetes',
      resourceVersion: '1.9',
    },
    formNamespace: 'Bahmni',
    formFieldPath: '8f36439c-8e3a-45ac-bb31-98b43a91ecb5/1',
  },
  {
    observationDateTime: '2016-09-08T10:10:38.000+0530',
    uuid: 'diastolicUuid',
    value: {
      uuid: 'f48a534d-b1dd-4d37-8794-065243c546a4',
      name: {
        display: 'Liver Disease',
        uuid: '47937ec0-b7a2-405b-8a2a-a137738bda9b',
        name: 'Liver Disease',
        locale: 'en',
        localePreferred: true,
        conceptNameType: 'FULLY_SPECIFIED',
        resourceVersion: '1.9',
      },
      names: [
        {
          display: 'Liver Disease',
          uuid: '47937ec0-b7a2-405b-8a2a-a137738bda9b',
          name: 'Liver Disease',
          locale: 'en',
          localePreferred: true,
          conceptNameType: 'FULLY_SPECIFIED',
          resourceVersion: '1.9',
        },
      ],
      displayString: 'Liver Disease',
      resourceVersion: '1.9',
    },
    formNamespace: 'Bahmni',
    formFieldPath: '8f36439c-8e3a-45ac-bb31-98b43a91ecb5/1',
  },
];

storiesOf('Forms', module)
  .add('Multi Select', () =>
    <StoryWrapper json={form}>
      <Container metadata={form} observations={obsList}
        validate={ false }
      />
    </StoryWrapper>
  );
