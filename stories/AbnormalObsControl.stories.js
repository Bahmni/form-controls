import React from 'react';
import { ObsGroupControlWithIntl as ObsGroupControl } from 'src/components/ObsGroupControl.jsx';
import { ObsGroupMapper } from 'src/mapper/ObsGroupMapper';
import { Obs } from 'src/helpers/Obs';
import { List } from 'immutable';
import StoryWrapper from './StoryWrapper';
import { registerCoreComponents } from './componentRegistry';
import { pulseDataMetadata } from './mockData';

registerCoreComponents();

export default {
  title: 'Complex Controls/Legacy Components/AbnormalObsControl',
  parameters: {
    docs: {
      description: {
        component:
          'AbnormalObsControl demonstrates an ObsGroup that pairs a numeric observation with a ' +
          'Boolean "Abnormal" toggle button. The toggle is rendered inline using the Button display ' +
          'type and lets clinicians flag an out-of-range reading without leaving the field.',
      },
    },
  },
};

export const BasicView = {
  render: () => {
    const pulseObs = new Obs({ concept: pulseDataMetadata.controls[0].concept, formFieldPath: 'f.1/6-0', formNamespace: 'bahmni' });
    const pulseAbnormalObs = new Obs({ concept: pulseDataMetadata.controls[1].concept, formFieldPath: 'f.1/7-0', formNamespace: 'bahmni' });
    const pulseDataObs = new Obs({
      concept: pulseDataMetadata.concept,
      formNamespace: 'f/5',
      groupMembers: List.of(pulseObs, pulseAbnormalObs),
    });
    return (
      <StoryWrapper json={pulseDataMetadata}>
        <ObsGroupControl
          errors={[]}
          formName="f"
          formVersion="1"
          mapper={new ObsGroupMapper()}
          metadata={pulseDataMetadata}
          obs={pulseDataObs}
          onValueChanged={() => {}}
          validate={false}
          children={List()}
        />
      </StoryWrapper>
    );
  },
};