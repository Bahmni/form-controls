import {
  FHIR_OBSERVATION_INTERPRETATION_SYSTEM,
  FHIR_OBSERVATION_FORM_NAMESPACE_PATH_URL,
  FHIR_OBSERVATION_VALUE_ATTACHMENT_URL,
  CONCEPT_DATATYPE_NUMERIC,
  CONCEPT_DATATYPE_COMPLEX,
  FHIR_OBSERVATION_STATUS_FINAL,
  FHIR_RESOURCE_TYPE_OBSERVATION,
  DATE_REGEX_PATTERN,
  INTERPRETATION_TO_CODE,
  CODE_TO_INTERPRETATION,
} from 'src/constants/fhir';
import { NUMBER, STRING, BOOLEAN, OBJECT } from 'src/constants';
import { cacheFileName, getCachedFileName } from 'src/helpers/FileNameCache';

// Reverse Transformation: FHIR Observation → Form2 Observation

const isObject = (value) => typeof value === 'object' && value !== null;

const normaliseInput = (input) => {
  if (!input) return [];

  if (!Array.isArray(input) && input.resourceType === 'Bundle') {
    return Array.isArray(input.entry) ? input.entry.filter(isObject) : [];
  }

  if (!Array.isArray(input)) return [];
  if (input.length === 0) return [];

  const first = input.find(isObject);
  if (first && ('fullUrl' in first || 'resource' in first)) {
    return input.filter(isObject);
  }

  return input
    .filter(isObject)
    .map((res) => ({ resource: res, fullUrl: `Observation/${res.id || ''}` }));
};

const buildResourceIndex = (entries) => {
  const index = new Map();
  for (const entry of entries) {
    const { resource, fullUrl } = entry;
    if (!resource) continue;

    if (fullUrl) {
      index.set(fullUrl, resource);
    }
    if (resource.id) {
      index.set(`urn:uuid:${resource.id}`, resource);
      index.set(`Observation/${resource.id}`, resource);
      index.set(resource.id, resource);
    }
  }
  return index;
};

const collectChildRefs = (entries) => {
  const childRefs = new Set();
  for (const entry of entries) {
    const { resource } = entry;
    if (!resource || !Array.isArray(resource.hasMember)) continue;
    for (const ref of resource.hasMember) {
      if (ref && ref.reference) {
        childRefs.add(ref.reference);
      }
    }
  }
  return childRefs;
};

const resolveReference = (reference, index) => {
  if (!reference) return undefined;
  return (
    index.get(reference) ||
    index.get(`urn:uuid:${reference}`) ||
    index.get(`Observation/${reference}`) ||
    undefined
  );
};

const findAttachmentExtension = (resource) => {
  if (!Array.isArray(resource.extension)) return undefined;
  return resource.extension.find(
    (ext) =>
      ext &&
      ext.valueAttachment &&
      ext.url === FHIR_OBSERVATION_VALUE_ATTACHMENT_URL
  );
};

const inferDatatype = (resource) => {
  if (resource.valueQuantity !== undefined) return 'Numeric';
  if (resource.valueBoolean !== undefined) return 'Boolean';
  if (resource.valueDateTime !== undefined) return 'Date';
  if (resource.valueCodeableConcept !== undefined) return 'Coded';
  if (resource.valueAttachment !== undefined) return 'Complex';
  if (findAttachmentExtension(resource)) return 'Complex';
  return 'Text';
};

const extractValue = (resource) => {
  if (resource.valueQuantity !== undefined) {
    return resource.valueQuantity.value;
  }

  if (resource.valueBoolean !== undefined) {
    return resource.valueBoolean;
  }

  if (resource.valueDateTime !== undefined) {
    return resource.valueDateTime;
  }

  if (resource.valueCodeableConcept !== undefined) {
    const coding =
      resource.valueCodeableConcept.coding &&
      resource.valueCodeableConcept.coding[0];
    if (coding) {
      // Emit `name` alongside `display` so CodedControl has a readable label
      // to fall back on when the saved answer is no longer among the concept's
      // current answers (CodedControl.jsx:127 → :96 would otherwise deref
      // `name.display` on undefined).
      return { uuid: coding.code, display: coding.display, name: coding.display };
    }
    return undefined;
  }

  const attachment =
    resource.valueAttachment !== undefined
      ? resource.valueAttachment
      : findAttachmentExtension(resource)?.valueAttachment;
  if (attachment) {
    // Only map fields the source actually carries, so a bare attachment
    // does not surface `fileName: undefined` / `contentType: undefined`
    // (keeps parity with AC13 "only available data is mapped").
    const value = { url: attachment.url };
    if (attachment.title !== undefined) {
      value.fileName = attachment.title;
      // Populate the session cache so getFileName() can display the filename
      // even after observationsWithValues converts { url, fileName } → string URL
      // before passing to CarbonContainer.
      cacheFileName(attachment.url, attachment.title);
    }
    if (attachment.contentType !== undefined) {
      value.contentType = attachment.contentType;
    }
    return value;
  }

  if (resource.valueString !== undefined) {
    return resource.valueString;
  }

  return undefined;
};

const mapObservation = (resource, resourceIndex) => {
  const coding = resource.code && resource.code.coding && resource.code.coding[0];
  const conceptUuid = coding ? coding.code : undefined;

  const conceptDisplay =
    (resource.code && resource.code.text) ||
    (coding && coding.display) ||
    undefined;

  const datatype = inferDatatype(resource);

  const concept = { uuid: conceptUuid, datatype };
  if (conceptDisplay) {
    concept.display = conceptDisplay;
  }

  const obs = { concept };

  // Preserve the FHIR resource id so callers can detect existing observations
  // and emit PUT/DELETE bundle entries instead of POST.
  // Assumes the FHIR server's logical id for this resource IS the OpenMRS
  // observation UUID (true for OpenMRS's FHIR2 module) — if a server ever
  // returns a different id format, downstream PUT/DELETE would target the
  // wrong resource.
  if (resource.id) obs.uuid = resource.id;

  if (resource.effectiveDateTime) {
    obs.obsDatetime = resource.effectiveDateTime;
  }

  if (Array.isArray(resource.hasMember) && resource.hasMember.length > 0) {
    obs.value = null;
    const groupMembers = [];
    for (const ref of resource.hasMember) {
      const childResource = resolveReference(ref.reference, resourceIndex);
      if (!childResource) {
        console.warn(
          'FhirObservationTransformer: Could not resolve hasMember reference',
          ref.reference
        );
        continue;
      }
      try {
        const childObs = mapObservation(childResource, resourceIndex);
        if (childObs) {
          groupMembers.push(childObs);
        }
      } catch (err) {
        console.warn(
          'FhirObservationTransformer: Error mapping hasMember child',
          ref.reference,
          err
        );
      }
    }
    if (groupMembers.length > 0) {
      obs.groupMembers = groupMembers;
    }
  } else {
    obs.value = extractValue(resource);
    if (obs.value === undefined) {
      obs.value = null;
    }
  }

  if (Array.isArray(resource.extension)) {
    const formPathExt = resource.extension.find(
      (ext) => ext.url === FHIR_OBSERVATION_FORM_NAMESPACE_PATH_URL
    );
    if (formPathExt && formPathExt.valueString) {
      const caretIdx = formPathExt.valueString.indexOf('^');
      if (caretIdx !== -1) {
        obs.formNamespace = formPathExt.valueString.slice(0, caretIdx);
        obs.formFieldPath = formPathExt.valueString.slice(caretIdx + 1);
      }
    }
  }

  if (Array.isArray(resource.note)) {
    const noteText = resource.note
      .map((note) => note && note.text)
      .filter(Boolean)
      .join('\n');
    if (noteText) {
      obs.comment = noteText;
    }
  }

  if (Array.isArray(resource.interpretation) && resource.interpretation.length > 0) {
    const interpCoding =
      resource.interpretation[0].coding && resource.interpretation[0].coding[0];
    if (interpCoding && interpCoding.code) {
      const mapped = CODE_TO_INTERPRETATION[interpCoding.code];
      if (mapped !== undefined) {
        obs.interpretation = mapped;
      }
      // Unknown codes are silently omitted — the outbound transformer only
      // writes known codes, so an unrecognised code on the way back is noise.
    }
  }

  return obs;
};

/**
 * Transform a FHIR Observation Bundle (or array) back into plain form2 observation objects.
 * This is the reverse of `getFhirObservations`. It reconstructs the form2 shape rather than
 * being a strict inverse — e.g. coded values also carry a `name` label for CodedControl, and
 * only fields present on the source are emitted.
 *
 * Accepts:
 *   - A FHIR Bundle { resourceType: 'Bundle', entry: [{resource, fullUrl}] }
 *   - An array of bundle entries [{resource, fullUrl}]
 *   - An array of raw Observation resources
 *
 * @param {Object|Array|null|undefined} input - FHIR data to transform
 * @returns {Array} Array of plain form2 observation objects
 */
export function getObservationsFromFhir(input) {
  if (input === null || input === undefined) return [];

  let entries;
  try {
    entries = normaliseInput(input);
  } catch (err) {
    console.warn('FhirObservationTransformer: Failed to normalise input', err);
    return [];
  }

  if (!entries || entries.length === 0) return [];

  const resourceIndex = buildResourceIndex(entries);
  const childRefs = collectChildRefs(entries);

  const isTopLevel = (entry) => {
    const { fullUrl, resource } = entry;
    if (fullUrl && childRefs.has(fullUrl)) return false;
    if (resource && resource.id) {
      if (childRefs.has(`urn:uuid:${resource.id}`)) return false;
      if (childRefs.has(`Observation/${resource.id}`)) return false;
      if (childRefs.has(resource.id)) return false;
    }
    return true;
  };

  const topLevelEntries = entries.filter(isTopLevel);

  const results = [];
  for (const entry of topLevelEntries) {
    const { resource } = entry;
    if (!resource) continue;
    if (resource.resourceType !== 'Observation') continue;
    try {
      const obs = mapObservation(resource, resourceIndex);
      if (obs) {
        results.push(obs);
      }
    } catch (err) {
      console.warn(
        'FhirObservationTransformer: Error mapping observation, skipping',
        resource && resource.id,
        err
      );
    }
  }

  return results;
}

// Forward Transformation: Form2 Observation → FHIR Observation

const createCoding = (code, systemURL, display) => {
  const coding = { code };
  if (systemURL) {
    coding.system = systemURL;
  }
  if (display) {
    coding.display = display;
  }
  return coding;
};

/**
 * Creates a FHIR CodeableConcept object
 * @param {Array} coding - Array of Coding objects
 * @param {string} [displayText] - Display text for the concept
 * @returns {Object} FHIR CodeableConcept object
 */
const createCodeableConcept = (coding, displayText) => {
  const concept = { coding };
  if (displayText) {
    concept.text = displayText;
  }
  return concept;
};

/**
 * Generates a UUID v4
 * @returns {string} UUID string
 */
const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  console.warn(
    'FhirObservationTransformer: Using Math.random() for UUID generation. ' +
    'This is not cryptographically secure and should not be used for healthcare data in production. ' +
    'Please ensure crypto.randomUUID() is available.'
  );
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Handles string value conversion for FHIR observation
 * @param {string} value - The string value
 * @param {Object} observation - The FHIR observation being built
 * @param {string} [conceptDatatype] - The concept datatype
 */
const handleStringValue = (value, observation, conceptDatatype) => {
  const trimmedValue = value.trim();

  if (trimmedValue === '') {
    return;
  }

  if (DATE_REGEX_PATTERN.test(trimmedValue)) {
    const dateValue = new Date(trimmedValue);
    if (!isNaN(dateValue.getTime())) {
      observation.valueDateTime = dateValue.toISOString();
      return;
    }
  }

  if (conceptDatatype === CONCEPT_DATATYPE_NUMERIC) {
    const numericValue = parseFloat(trimmedValue);
    if (!isNaN(numericValue)) {
      observation.valueQuantity = { value: numericValue };
      return;
    }
  }

  observation.valueString = value;
};

/**
 * Builds a valueAttachment extension for a Complex (file) observation and
 * sets valueString to the attachment url, so both the pre-population and
 * fresh-upload paths stay in sync.
 * @param {Object} observation - The FHIR Observation resource being built
 * @param {string} url - The attachment url
 * @param {string} [title] - The original filename, if known
 * @param {string} [contentType] - The attachment content type, if known
 */
const applyAttachmentValue = (observation, url, title, contentType) => {
  const attachment = { url };
  if (title) attachment.title = title;
  if (contentType) attachment.contentType = contentType;
  observation.extension = observation.extension || [];
  observation.extension.push({
    url: FHIR_OBSERVATION_VALUE_ATTACHMENT_URL,
    valueAttachment: attachment,
  });
  observation.valueString = url;
};

/**
 * Creates a single FHIR Observation resource from a form2 observation
 * @param {Object} observationPayload - The form2 observation data
 * @param {Object} options - Configuration options
 * @param {Object} options.patientReference - FHIR Reference to patient
 * @param {Object} options.encounterReference - FHIR Reference to encounter
 * @param {Object} options.performerReference - FHIR Reference to performer
 * @returns {Object} FHIR Observation resource
 */
const createObservationResource = (observationPayload, options) => {
  const { patientReference, encounterReference, performerReference } = options;

  const conceptUuid =
    typeof observationPayload.concept === 'object'
      ? observationPayload.concept.uuid
      : observationPayload.concept;

  const observation = {
    resourceType: FHIR_RESOURCE_TYPE_OBSERVATION,
    status: FHIR_OBSERVATION_STATUS_FINAL,
    code: createCodeableConcept([createCoding(conceptUuid)]),
    subject: patientReference,
    encounter: encounterReference,
    performer: [performerReference],
    effectiveDateTime:
      observationPayload.obsDatetime ||
      observationPayload.observationDateTime ||
      new Date().toISOString(),
  };

  const value = observationPayload.value;
  const conceptDatatype =
    typeof observationPayload.concept === 'object'
      ? observationPayload.concept.datatype
      : undefined;

  if (value !== null && value !== undefined) {
    switch (typeof value) {
      case NUMBER:
        observation.valueQuantity = { value };
        break;
      case STRING: {
        if (conceptDatatype === CONCEPT_DATATYPE_COMPLEX && value.trim() !== '') {
          // Look up the original filename from the session cache (set by FileUpload
          // at upload time) so it round-trips via valueAttachment.title.
          applyAttachmentValue(observation, value, getCachedFileName(value));
        } else {
          handleStringValue(value, observation, conceptDatatype);
        }
        break;
      }
      case BOOLEAN:
        observation.valueBoolean = value;
        break;
      case OBJECT:
        if (value instanceof Date && !isNaN(value.getTime())) {
          observation.valueDateTime = value.toISOString();
        } else if (value && 'uuid' in value) {
          const codingCode = value.system && value.code ? value.code : value.uuid;
          observation.valueCodeableConcept = createCodeableConcept([
            createCoding(codingCode, value.system, value.display || value.displayString),
          ]);
        } else if (value && 'url' in value) {
          // Complex/file attachment pre-populated from a previous save:
          // { url, fileName?, contentType? }. Preserve all available fields so
          // the observation is not silently dropped when the user submits without
          // changing the file, and so the filename round-trips correctly.
          applyAttachmentValue(observation, value.url, value.fileName, value.contentType);
        }
        break;
    }
  }

  if (observationPayload.interpretation) {
    const interpretationString = String(observationPayload.interpretation);
    const interpretationValue = interpretationString.toUpperCase();
    const mapping =
      INTERPRETATION_TO_CODE[interpretationValue] || INTERPRETATION_TO_CODE.NORMAL;

    observation.interpretation = [
      {
        coding: [
          {
            system: FHIR_OBSERVATION_INTERPRETATION_SYSTEM,
            code: mapping.code,
            display: mapping.display,
          },
        ],
      },
    ];
  }

  if (observationPayload.formNamespace && observationPayload.formFieldPath) {
    observation.extension = observation.extension || [];
    observation.extension.push({
      url: FHIR_OBSERVATION_FORM_NAMESPACE_PATH_URL,
      valueString: `${observationPayload.formNamespace}^${observationPayload.formFieldPath}`,
    });
  }

  if (observationPayload.comment) {
    observation.note = [
      {
        text: observationPayload.comment,
      },
    ];
  }

  return observation;
};

/**
 * Transforms Container observations to FHIR Observation resources
 *
 * @example
 * const fhirObservations = transformToFhir(observations, {
 *   patientReference: { reference: 'Patient/uuid' },
 *   encounterReference: { reference: 'Encounter/uuid' },
 *   performerReference: { reference: 'Practitioner/uuid' }
 * });
 *
 * @param {Array} observations - Raw observations from Container.getValue() or transformed Form2Observation[]
 * @param {Object} options - Configuration options
 * @param {Object} options.patientReference - FHIR Reference to patient (e.g., { reference: 'Patient/uuid' })
 * @param {Object} options.encounterReference - FHIR Reference to encounter (e.g., { reference: 'Encounter/uuid' })
 * @param {Object} options.performerReference - FHIR Reference to performer (e.g., { reference: 'Practitioner/uuid' })
 * @param {Object} [options.basedOnReference] - Optional FHIR Reference for basedOn (e.g., { reference: 'ServiceRequest/uuid' })
 * @returns {Array<{resource: Object, fullUrl: string}>} Array of FHIR Observation bundle entries
 */
export function getFhirObservations(observations, options) {
  
  if (!options || !options.patientReference || !options.encounterReference || !options.performerReference) {
  throw new Error('transformToFhir requires patientReference, encounterReference, and performerReference in options');
  }

  if (!observations || !Array.isArray(observations)) {
    return [];
  }

  const basedOn = options.basedOnReference ? [options.basedOnReference] : undefined;

  const results = [];

  for (const obs of observations) {
    // Handle voided observations
    if (obs.voided) {
      continue;
    }

    if (obs.groupMembers && obs.groupMembers.length > 0) {
      const hasMemberRefs = [];

      for (const member of obs.groupMembers) {
        // Process one member at a time to avoid flattening the hierarchy
        const memberResults = getFhirObservations([member], options);
        results.push(...memberResults);
        // Last item is always the member's own observation (group parents are pushed last)
        const memberObservation = memberResults[memberResults.length - 1];
        if (memberObservation) {
          hasMemberRefs.push({
            reference: memberObservation.fullUrl,
            type: 'Observation',
          });
        }
      }

      // Create parent observation with hasMember references to direct children only
      const parentObservation = createObservationResource(obs, options);
      parentObservation.hasMember = hasMemberRefs;

      const parentUuid = generateUUID();
      const parentFullUrl = `urn:uuid:${parentUuid}`;

      results.push({
        resource: {
          ...parentObservation,
          id: parentUuid,
          basedOn,
        },
        fullUrl: parentFullUrl,
      });
    } else {
      const observation = createObservationResource(obs, options);
      const uuid = generateUUID();
      const fullUrl = `urn:uuid:${uuid}`;

      results.push({
        resource: {
          ...observation,
          id: uuid,
          basedOn,
        },
        fullUrl,
      });
    }
  }

  return results;
}

export default getFhirObservations;
