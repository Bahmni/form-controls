import {
  createObservationResource,
  generateUUID,
} from 'src/helpers/FhirObservationTransformer';
import {
  FHIR_RESOURCE_TYPE_OBSERVATION,
  FHIR_OBSERVATION_STATUS_FINAL,
} from 'src/constants/fhir';
import { mapObservationsByUuid, isUnchangedLeaf } from 'src/helpers/ObservationComparator';

const observationUrl = (uuid) => `${FHIR_RESOURCE_TYPE_OBSERVATION}/${uuid}`;

const withBasedOn = (resource, options) => {
  if (!options.basedOnReference) return resource;
  return { ...resource, basedOn: [options.basedOnReference] };
};

const buildCreateEntry = (obs, options, hasMemberRefs) => {
  const id = generateUUID();
  const fullUrl = `urn:uuid:${id}`;
  const resource = withBasedOn(
    { ...createObservationResource(obs, options), id },
    options
  );
  if (hasMemberRefs) {
    resource.hasMember = hasMemberRefs.map((reference) => ({ reference }));
  }
  return {
    fullUrl,
    resource,
    request: { method: 'POST', url: FHIR_RESOURCE_TYPE_OBSERVATION },
  };
};

const buildUpdateEntry = (obs, previousObs, options, hasMemberRefs) => {
  const url = observationUrl(obs.uuid);
  const resource = withBasedOn(
    {
      ...createObservationResource(obs, options),
      id: obs.uuid,
      status: (previousObs && previousObs.status) || FHIR_OBSERVATION_STATUS_FINAL,
    },
    options
  );
  if (hasMemberRefs) {
    resource.hasMember = hasMemberRefs.map((reference) => ({ reference }));
  }
  return { fullUrl: url, resource, request: { method: 'PUT', url } };
};

const buildDeleteEntry = (uuid) => {
  const url = observationUrl(uuid);
  return {
    fullUrl: url,
    resource: { resourceType: FHIR_RESOURCE_TYPE_OBSERVATION, id: uuid },
    request: { method: 'DELETE', url },
  };
};

const resolveLeafObservation = (obs, previousByUuid, options) => {
  const previousObs = obs.uuid ? previousByUuid.get(obs.uuid) : undefined;

  if (!previousObs) {
    if (obs.voided || obs.value === null || obs.value === undefined) {
      return { entries: [], hasMemberRef: null, stillExists: false };
    }
    const entry = buildCreateEntry(obs, options);
    return { entries: [entry], hasMemberRef: entry.fullUrl, stillExists: true };
  }

  if (obs.voided) {
    return { entries: [buildDeleteEntry(obs.uuid)], hasMemberRef: null, stillExists: false };
  }

  if (isUnchangedLeaf(obs, previousObs)) {
    return { entries: [], hasMemberRef: null, stillExists: true };
  }

  const entry = buildUpdateEntry(obs, previousObs, options);
  return { entries: [entry], hasMemberRef: observationUrl(obs.uuid), stillExists: true };
};

const resolveGroupObservation = (obs, previousByUuid, options) => {
  const childResults = obs.groupMembers.map((child) =>
    resolveObservation(child, previousByUuid, options)
  );
  const childEntries = childResults.flatMap((result) => result.entries);
  const newOrChangedRefs = childResults
    .map((result) => result.hasMemberRef)
    .filter(Boolean);
  const anyChildStillExists = childResults.some((result) => result.stillExists);

  const previousObs = obs.uuid ? previousByUuid.get(obs.uuid) : undefined;

  if (!previousObs) {
    if (newOrChangedRefs.length === 0) {
      return { entries: childEntries, hasMemberRef: null, stillExists: false };
    }
    const entry = buildCreateEntry(obs, options, newOrChangedRefs);
    return { entries: [...childEntries, entry], hasMemberRef: entry.fullUrl, stillExists: true };
  }

  if (obs.voided || !anyChildStillExists) {
    return {
      entries: [...childEntries, buildDeleteEntry(obs.uuid)],
      hasMemberRef: null,
      stillExists: false,
    };
  }

  if (newOrChangedRefs.length === 0) {
    return { entries: childEntries, hasMemberRef: null, stillExists: true };
  }

  const entry = buildUpdateEntry(obs, previousObs, options, newOrChangedRefs);
  return { entries: [...childEntries, entry], hasMemberRef: observationUrl(obs.uuid), stillExists: true };
};

function resolveObservation(obs, previousByUuid, options) {
  if (Array.isArray(obs.groupMembers) && obs.groupMembers.length > 0) {
    return resolveGroupObservation(obs, previousByUuid, options);
  }
  return resolveLeafObservation(obs, previousByUuid, options);
}

const assertOptions = (options) => {
  if (!options || !options.patientReference || !options.encounterReference || !options.performerReference) {
    throw new Error(
      'Missing required params patientReference, encounterReference, and performerReference in options'
    );
  }
};

export function buildFhirObservationTransactionBundle(current, previous, options) {
  assertOptions(options);
  const previousObservationsByUuid = mapObservationsByUuid(previous);
  const entries = (current || []).flatMap(
    (obs) => resolveObservation(obs, previousObservationsByUuid, options).entries
  );
  return { resourceType: 'Bundle', type: 'transaction', entry: entries };
}

const collectLeafObservation = (obs, options) => {
  if (obs.voided || obs.value === null || obs.value === undefined) {
    return { entries: [], ref: null };
  }
  const id = obs.uuid || generateUUID();
  const fullUrl = obs.uuid ? observationUrl(obs.uuid) : `urn:uuid:${id}`;
  const resource = withBasedOn({ ...createObservationResource(obs, options), id }, options);
  return { entries: [{ fullUrl, resource }], ref: fullUrl };
};

const collectGroupObservation = (obs, options) => {
  const childResults = obs.groupMembers.map((child) => collectObservation(child, options));
  const childEntries = childResults.flatMap((r) => r.entries);
  const memberRefs = childResults.map((r) => r.ref).filter(Boolean);
  if (memberRefs.length === 0) return { entries: childEntries, ref: null };
  const id = obs.uuid || generateUUID();
  const fullUrl = obs.uuid ? observationUrl(obs.uuid) : `urn:uuid:${id}`;
  const resource = withBasedOn({ ...createObservationResource(obs, options), id }, options);
  resource.hasMember = memberRefs.map((reference) => ({ reference }));
  return { entries: [...childEntries, { fullUrl, resource }], ref: fullUrl };
};

function collectObservation(obs, options) {
  if (Array.isArray(obs.groupMembers) && obs.groupMembers.length > 0) {
    return collectGroupObservation(obs, options);
  }
  return collectLeafObservation(obs, options);
}

export function buildFhirObservationCollection(current, options) {
  assertOptions(options);
  const entries = (current || []).flatMap((obs) => collectObservation(obs, options).entries);
  return { resourceType: 'Bundle', type: 'collection', entry: entries };
}

