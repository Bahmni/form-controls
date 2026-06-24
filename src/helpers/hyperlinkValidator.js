

/**
 * Hyperlink validator for Bahmni form controls.
 *
 * Validates and classifies hyperlink URLs configured as control properties.
 * Auto-classifies by URL shape:
 *   - starts with 'https://' → external
 *   - starts with '/'         → internal
 *   - anything else           → invalid
 *
 * For external URLs:
 *   - Must use https:// protocol only
 *   - Rejects javascript:, data:, file:, vbscript: schemes
 *   - Checked against allowedDomains allowlist (supports simple wildcard *.domain.tld)
 *   - Rejects ALL {token} patterns — dynamic URLs not supported for external links
 *
 * For internal URLs:
 *   - Must be relative (starts with /)
 *   - May contain {patientUuid} token (substituted at runtime via Util.resolveUrlTokens)
 *   - Rejects any other {token} patterns
 */

const BLOCKED_SCHEMES = /^(javascript|data|file|vbscript):/i;
const SINGLE_CURLY_RE = /\{([^}]+)\}/g;
const ANY_TOKEN_RE = /\{[^}]+\}/;
const PATIENT_UUID_TOKEN = '{patientUuid}';

/**
 * Checks whether a raw URL string contains any {{...}} tokens
 * other than the allowed {{patientUuid}} literal.
 *
 * @param {string} url
 * @returns {boolean} true if unknown tokens are present
 */
function hasUnknownTokens(url) {
  SINGLE_CURLY_RE.lastIndex = 0;
  let match = SINGLE_CURLY_RE.exec(url);
  while (match !== null) {
    if (match[0] !== PATIENT_UUID_TOKEN) {
      return true;
    }
    match = SINGLE_CURLY_RE.exec(url);
  }
  return false;
}

/**
 * Tests whether a hostname matches a simple wildcard pattern.
 * Supported forms:
 *   - exact: 'who.int'         → matches 'who.int' only
 *   - wildcard: '*.who.int'    → matches 'www.who.int', 'cdn.who.int', etc.
 *
 * @param {string} hostname   e.g. 'www.who.int'
 * @param {string} pattern    e.g. '*.who.int'
 * @returns {boolean}
 */
function matchesDomainPattern(hostname, pattern) {
  if (pattern.startsWith('*.')) {
    const suffix = pattern.slice(1); // '.who.int'
    return hostname === pattern.slice(2) || hostname.endsWith(suffix);
  }
  return hostname === pattern;
}

/**
 * Checks whether a hostname is permitted by the allowedDomains list.
 * Returns true if allowedDomains is empty/undefined (open — caller must decide).
 *
 * @param {string}   hostname
 * @param {string[]} allowedDomains
 * @returns {boolean}
 */
function isAllowedDomain(hostname, allowedDomains) {
  if (!allowedDomains || allowedDomains.length === 0) {
    return true;
  }
  return allowedDomains.some((pattern) => matchesDomainPattern(hostname, pattern));
}

/**
 * Validates a hyperlink URL string.
 *
 * @param {string}   url             The URL as entered by the form designer.
 * @param {string[]} [allowedDomains=[]] Allowlist of domain patterns for external URLs.
 *
 * @returns {{ valid: boolean, type: 'internal'|'external'|'invalid', sanitizedUrl: string, error?: string }}
 */
function validateHyperlink(url, allowedDomains) {
  const domains = allowedDomains || [];

  if (!url || typeof url !== 'string' || url.trim() === '') {
    return { valid: false, type: 'invalid', sanitizedUrl: '', error: 'URL is empty' };
  }

  const trimmed = url.trim();

  // Reject blocked schemes early (before any classification)
  if (BLOCKED_SCHEMES.test(trimmed)) {
    return {
      valid: false, type: 'invalid', sanitizedUrl: '', error: 'URL scheme is not permitted',
    };
  }

  // Internal path: starts with /
  if (trimmed.charAt(0) === '/') {
    if (hasUnknownTokens(trimmed)) {
      return {
        valid: false,
        type: 'invalid',
        sanitizedUrl: '',
        error: 'Only {{patientUuid}} token is allowed in URLs',
      };
    }
    return { valid: true, type: 'internal', sanitizedUrl: trimmed };
  }

  // External URL: must start with https://
  if (trimmed.toLowerCase().startsWith('https://')) {
    // Dynamic tokens are not supported for external URLs
    if (ANY_TOKEN_RE.test(trimmed)) {
      return {
        valid: false,
        type: 'invalid',
        sanitizedUrl: '',
        error: 'Dynamic tokens are not supported in external URLs',
      };
    }

    // Parse hostname for allowlist check
    let hostname;
    try {
      const parsed = new URL(trimmed);
      hostname = parsed.hostname;
    } catch (e) {
      return { valid: false, type: 'invalid', sanitizedUrl: '', error: 'URL is malformed' };
    }

    if (!isAllowedDomain(hostname, domains)) {
      return {
        valid: false,
        type: 'invalid',
        sanitizedUrl: '',
        error: `Domain "${hostname}" is not in the allowed domains list`,
      };
    }

    return { valid: true, type: 'external', sanitizedUrl: trimmed };
  }

  // Anything else is invalid
  return {
    valid: false,
    type: 'invalid',
    sanitizedUrl: '',
    error: 'URL must start with https:// (external) or / (internal)',
  };
}

module.exports = {
  validateHyperlink,
};
