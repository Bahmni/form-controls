
export class Metadata {
  getMetadataForConcept(concept, type, childType) {
    let controls = undefined;
    if (concept.set) {
      controls = concept.setMembers.map(c => {
        if (c.set) {
          return this.getMetadataForConcept(c, type);
        }
        return this.getMetadataForConcept(c, childType);
      });
    }

    return Object.assign({
      type,
      label: {
        type: 'label',
        value: concept.name,
      },
      concept,
    }, { controls });
  }
}
