export class Metadata {
  getMetadataForConcept(
    concept
    , idGenerator
    , type = 'obsGroupControl'
    , childType = 'obsControl'
    , loc = {row: 0, column: 0}

  ) {
    let controls = undefined;
    if (concept.set) {
      let row = 0;
      controls = concept.setMembers.map(c => {
        if (c.set) {
          return this.getMetadataForConcept(c, idGenerator, type);
        }
        return this.getMetadataForConcept(c, idGenerator, childType, undefined, {row: row++, column: loc.column});
      });
    }

    const properties = {
      location: loc,
    };

    return {
      id: String(idGenerator.getId()),
      type,
      label: {
        type: 'label',
        value: concept.name,
      },
      concept,
      controls,
      properties,
    };
  }
}