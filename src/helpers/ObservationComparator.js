const isNumericString = (value) =>
  typeof value === 'string' && value.trim() !== '' && !isNaN(Number(value));

const isNumberLike = (value) => typeof value === 'number' || isNumericString(value);

const valuesAreEqual = (a, b) => {
  if (a === b) return true;
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    if ('uuid' in a || 'uuid' in b) return a.uuid === b.uuid;
    if ('url' in a || 'url' in b) return a.url === b.url;
  }
  if (isNumberLike(a) && isNumberLike(b)) return Number(a) === Number(b);
  return false;
};

const nullToUndefined = (value) => (value === null ? undefined : value);

export const isUnchangedLeaf = (current, previousObs) =>
  previousObs !== undefined &&
  valuesAreEqual(current.value, previousObs.value) &&
  nullToUndefined(current.comment) === nullToUndefined(previousObs.comment) &&
  nullToUndefined(current.interpretation) === nullToUndefined(previousObs.interpretation);

export const mapObservationsByUuid = (observations) => {
  const index = new Map();
  const visit = (obs) => {
    if (!obs) return;
    if (obs.uuid) index.set(obs.uuid, obs);
    if (Array.isArray(obs.groupMembers)) obs.groupMembers.forEach(visit);
  };
  (observations || []).forEach(visit);
  return index;
};

const leafHasChanged = (obs, previousObsMapByUuid) => {
  const previousObs = obs.uuid ? previousObsMapByUuid.get(obs.uuid) : undefined;
  if (!previousObs) return !(obs.voided || obs.value === null || obs.value === undefined);
  if (obs.voided) return true;
  return !isUnchangedLeaf(obs, previousObs);
};

const groupHasChanged = (obs, previousObsMapByUuid) => {
  if (obs.groupMembers.some((child) => observationHasChanged(child, previousObsMapByUuid))) return true;
  const previousObs = obs.uuid ? previousObsMapByUuid.get(obs.uuid) : undefined;
  if (!previousObs) return false;
  return Boolean(obs.voided);
};

function observationHasChanged(obs, previousObsMapByUuid) {
  if (Array.isArray(obs.groupMembers) && obs.groupMembers.length > 0) {
    return groupHasChanged(obs, previousObsMapByUuid);
  }
  return leafHasChanged(obs, previousObsMapByUuid);
}

export function hasObservationChanges(currentObservations, previousObservations) {
  const previousByUuid = mapObservationsByUuid(previousObservations);
  if ((currentObservations || []).some((obs) => observationHasChanged(obs, previousByUuid))) {
    return true;
  }
  // A saved obs (e.g. an add-more group) can be removed from the record tree entirely
  // rather than voided in place — check for uuids that vanished from current altogether.
  const currentByUuid = mapObservationsByUuid(currentObservations);
  return [...previousByUuid.keys()].some((uuid) => !currentByUuid.has(uuid));
}
