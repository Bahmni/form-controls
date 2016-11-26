import React, { Component, PropTypes } from 'react';
import { ObsControlDesigner } from 'components/designer/ObsControlDesigner.jsx';
import 'src/helpers/componentStore';
import { ObsGroupMapper } from '../../mapper/ObsGroupMapper';
import { Concept } from '../../helpers/Concept';
import { Metadata } from '../../helpers/Metadata';
import map from 'lodash/map';
import { GridDesigner as Grid } from 'components/designer/Grid.jsx';

export class ObsGroupControlDesigner extends Component {

  constructor(props) {
    super(props);
    this.metadata = props.metadata;
    this.mapper = new ObsGroupMapper();
  }

  getJsonDefinition() {
    return this.props.metadata;
  }

  getControls(controls) {
    return map(controls, (control, index) => {
      if (control.type === 'obsControl') {
        return (<ObsControlDesigner key={ index } metadata={control}
          onSelect={this.props.onSelect}
        />);
      }
      return this.getControls(control);
    });
  }

  getGrid() {
    return;
    (<Grid
      className="bahmni-grid"
      controls={ formResourceControls || [] }
      ref={ this.gridReference }
      wrapper={ ControlWrapper }
    />);
  }

  render() {
    const { metadata, metadata: { concept } } = this.props;
    if (concept) {
      return (<fieldset className="form-builder-fieldset">
          <legend>{concept.name}</legend>
        <div className="obsGroup-controls">
          {this.getControls(metadata.controls)}
        </div>
      </fieldset>
      );
    }
    return <div onClick={ (event) => this.props.onSelect(event, metadata) }>Select Obs Source</div>;
  }
}

ObsGroupControlDesigner.propTypes = {
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

ObsGroupControlDesigner.injectConceptToMetadata = (metadata, concept) => {
  const conceptSet = new Concept(concept);
  const updatedMetadata = new Metadata().getMetadataForConcept(conceptSet.getConcept(),
      'obsGroupControl', metadata.id, 'obsControl');
  return updatedMetadata;
};

const descriptor = {
  control: ObsGroupControlDesigner,
  designProperties: {
    displayName: 'ObsGroup',
    isTopLevelComponent: true,
  },
  metadata: {
    attributes: [
      {
        name: 'type',
        dataType: 'text',
        defaultValue: 'obsGroupControl',
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

window.componentStore.registerDesignerComponent('obsGroupControl', descriptor);
