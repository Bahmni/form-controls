import React, { Component, PropTypes } from 'react';
import ComponentStore from 'src/helpers/componentStore';
import { ObsGroupMapper } from '../../mapper/ObsGroupMapper';
import { GridDesigner as Grid } from 'components/designer/Grid.jsx';
import { Concept } from '../../helpers/Concept';
import { Metadata } from '../../helpers/Metadata';

export class ObsGroupControlDesigner extends Component {

  constructor(props) {
    super(props);
    this.metadata = props.metadata;
    this.mapper = new ObsGroupMapper();
    this.storeGridRef = this.storeGridRef.bind(this);
  }

  getJsonDefinition() {
    if (!this.gridRef) return undefined;
    const controls = this.gridRef.getControls();
    return Object.assign({}, this.props.metadata, { controls });
  }

  getGrid() {
    return;
    // (<Grid className="bahmni-grid" />);
  }

  storeGridRef(ref) {
    if (ref) {
      this.gridRef = ref;
    }
  }

  render() {
    const { metadata, metadata: { concept } } = this.props;
    if (concept) {
      return (
        <fieldset
          className="form-builder-fieldset"
          onClick={(event) => this.props.onSelect(event, metadata)}
        >
          <legend>{concept.name}</legend>
          <div className="obsGroup-controls">
            <Grid
              controls={ metadata.controls }
              idGenerator={this.props.idGenerator}
              minRows={0}
              ref={ this.storeGridRef }
              wrapper={this.props.wrapper}
            />
          </div>
        </fieldset>
      );
    }
    return <div onClick={ (event) => this.props.onSelect(event, metadata) }>Select Obs Source</div>;
  }
}

ObsGroupControlDesigner.propTypes = {
  idGenerator: PropTypes.object.isRequired,
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
  wrapper: PropTypes.func.isRequired,
};

ObsGroupControlDesigner.injectConceptToMetadata = (metadata, concept, idGenerator) => {
  const conceptSet = new Concept(concept);
  const location = metadata.properties && metadata.properties.location;
  return new Metadata().getMetadataForConcept(conceptSet.getConcept(), idGenerator,
    'obsGroupControl', 'obsControl', location);
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
        attributes: [],
      },
    ],
  },
};

ComponentStore.registerDesignerComponent('obsGroupControl', descriptor);
