/**
 * Session-level cache mapping uploaded file URL → original filename.
 *
 * CarbonContainer's Immutable.js records require the Complex observation value
 * to remain a plain string (URL). This module lets FileUpload store the
 * filename at upload time and FhirObservationTransformer look it up when
 * building the FHIR bundle, so the filename round-trips via
 * valueAttachment.title without changing the CarbonContainer value type.
 */
const _cache = new Map();

export const cacheFileName = (url, fileName) => {
  if (url && fileName) _cache.set(url, fileName);
};

export const getCachedFileName = (url) => (url ? _cache.get(url) : undefined);

export const clearCache = () => _cache.clear();
