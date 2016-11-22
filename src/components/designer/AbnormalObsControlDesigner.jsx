import React, { Component, PropTypes } from 'react';
import 'src/helpers/componentStore';
import { AbnormalObsControl } from 'components/AbnormalObsControl.jsx';
import { Concept } from '../../helpers/Concept';

export class AbnormalObsControlDesigner extends Component {

  getJsonDefinition() {
    return {};
  }

  getObsForConceptMetadata() {}

  render() {
    const { metadata } = this.props;
    return (
          <div onClick={ (event) => this.props.onSelect(event, metadata) }>
            <AbnormalObsControl
              errors={[]}
              metadata={ this.props.metadata }
              obs = { this.getObsForConceptMetadata() }
              onValueChanged={ () => {} }
            />
          </div>
    );
  }
}

AbnormalObsControlDesigner.propTypes = {
  metadata: PropTypes.shape({
    concept: PropTypes.object,
    displayType: PropTypes.string,
    id: PropTypes.string.isRequired,
    label: PropTypes.object,
    properties: PropTypes.shape({
      location: PropTypes.shape({
        row: PropTypes.number,
        column: PropTypes.number,
      }),
    }),
    type: PropTypes.string.isRequired,
  }),
  onSelect: PropTypes.func.isRequired,
};

AbnormalObsControlDesigner.injectConceptToMetadata = (metadata, concept) => {
  const conceptSet = new Concept(concept);
  const controls = [
    {
      type: 'obsControl',
      label: {
        type: 'label',
        value: conceptSet.findFirstNumericSetMember().name,
      },
      concept: conceptSet.findFirstNumericSetMember(),
    },
    {
      type: 'obsControl',
      displayType: 'Button',
      options: [
        { name: 'Abnormal', value: true },
      ],
      label: {
        type: 'label',
        value: conceptSet.getAbnormalSetMember().name,
      },
      concept: conceptSet.findFirstNumericSetMember(),
    },
  ];
  return Object.assign({}, metadata, { concept: conceptSet.getConcept() }, controls);
};

const descriptor = {
  control: AbnormalObsControlDesigner,
  designProperties: {
    displayName: 'Abnormal Observation',
    isTopLevelComponent: true,
  },
  metadata: {
    attributes: [
      {
        name: 'type',
        dataType: 'text',
        defaultValue: 'abnormalObsControl',
      },
      {
        name: 'label',
        dataType: 'complex',
        attributes: [
          {
            name: 'type',
            dataType: 'text',
            defaultValue: 'label',
          },
          {
            name: 'value',
            dataType: 'text',
            defaultValue: 'Label',
          },
        ],
      },
      {
        name: 'properties',
        dataType: 'complex',
        attributes: [
          {
            name: 'mandatory',
            dataType: 'boolean',
            defaultValue: false,
          },
          {
            name: 'notes',
            dataType: 'boolean',
            defaultValue: false,
          },
        ],
      },
    ],
  },
};

window.componentStore.registerDesignerComponent('abnormalObsControl', descriptor);
