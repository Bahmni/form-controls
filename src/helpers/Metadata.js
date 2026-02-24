/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import { DescriptorParser as Descriptor } from './descriptorParser';
import ComponentStore from 'src/helpers/componentStore';
import { Concept } from 'src/helpers/Concept';

export class Metadata {
  getMetadataForConcept(concept, idGenerator, type = 'obsGroupControl',
                        childType = 'obsControl', loc = { row: 0, column: 0 }, id) {
    let controls = undefined;
    if (concept.set) {
      let row = 0;
      controls = concept.setMembers.map(c => {
        if (c.set) {
          return this.getMetadataForConcept(c, idGenerator,
            type, undefined, { row: row++, column: loc.column });
        }
        return this.getMetadataForConcept(c, idGenerator,
          childType, undefined, { row: row++, column: loc.column });
      });
    }

    const properties = {
      location: loc,
    };
    const descriptor = new Descriptor(ComponentStore.getDesignerComponent(type));
    const metadata = descriptor.data().metadata;
    metadata.properties = Object.assign({}, metadata.properties, properties);

    const updatedMetadata = Object.assign({}, metadata,
      { id: id || String(idGenerator.getId()) },
      { concept },
      { controls },
      { label: Object.assign({}, metadata.label, { value: concept.name }) },
      { properties: Object.assign({}, metadata.properties, properties) });
    if (type === childType) {
      return Object.assign({}, updatedMetadata, new Concept(concept).getNumericContext());
    }
    return updatedMetadata;
  }

}
