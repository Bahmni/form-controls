import { Util } from 'src/helpers/Util';
export class Metadata {
  getMetadataForConcept(concept, type, previousId, childType) {
    let controls = undefined;
    if (concept.set) {
      controls = concept.setMembers.map((c, index) => {
        if (c.set) {
          return this.getMetadataForConcept(c, type, this._getNextId(previousId, index));
        }
        return this.getMetadataForConcept(c, childType, this._getNextId(previousId, index));
      });
    }

    return Object.assign({
      type,
      id: this._getNextId(previousId),
      label: {
        type: 'label',
        value: concept.name,
      },
      concept,
    }, { controls });
  }

  _getNextId(previousId, epsilon) {
    if (epsilon) {
      return Util.toInt(previousId) + 100 + Util.toInt(epsilon);
    }
    return Util.toInt(previousId) + 100;
  }
}
