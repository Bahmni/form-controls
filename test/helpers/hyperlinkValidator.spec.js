import { expect } from 'chai';
import { validateHyperlink } from 'src/helpers/hyperlinkValidator';
import { Util } from 'src/helpers/Util';

describe('hyperlinkValidator', () => {
  describe('validateHyperlink', () => {
    it('should return invalid for empty url', () => {
      const result = validateHyperlink('');
      expect(result.valid).to.equal(false);
      expect(result.type).to.equal('invalid');
      expect(result.sanitizedUrl).to.equal('');
      expect(result.error).to.equal('URL is required');
    });

    it('should return invalid for null url', () => {
      const result = validateHyperlink(null);
      expect(result.valid).to.equal(false);
      expect(result.type).to.equal('invalid');
      expect(result.error).to.equal('URL is required');
    });

    it('should return invalid for undefined url', () => {
      const result = validateHyperlink(undefined);
      expect(result.valid).to.equal(false);
      expect(result.type).to.equal('invalid');
      expect(result.error).to.equal('URL is required');
    });

    it('should return invalid for javascript: scheme', () => {
      const result = validateHyperlink('javascript:alert(1)'); // eslint-disable-line no-script-url
      expect(result.valid).to.equal(false);
      expect(result.type).to.equal('invalid');
      expect(result.error).to.equal('Invalid URL scheme');
    });

    it('should return invalid for data: scheme', () => {
      const result = validateHyperlink('data:text/html,<script>alert(1)</script>');
      expect(result.valid).to.equal(false);
      expect(result.type).to.equal('invalid');
      expect(result.error).to.equal('Invalid URL scheme');
    });

    it('should return invalid for file: scheme', () => {
      const result = validateHyperlink('file:///etc/passwd');
      expect(result.valid).to.equal(false);
      expect(result.type).to.equal('invalid');
      expect(result.error).to.equal('Invalid URL scheme');
    });

    it('should return invalid for vbscript: scheme', () => {
      const result = validateHyperlink('vbscript:msgbox(1)');
      expect(result.valid).to.equal(false);
      expect(result.type).to.equal('invalid');
      expect(result.error).to.equal('Invalid URL scheme');
    });

    it('should return internal + valid for path starting with /', () => {
      const result = validateHyperlink('/bahmni/app/uuid');
      expect(result.valid).to.equal(true);
      expect(result.type).to.equal('internal');
      expect(result.sanitizedUrl).to.equal('/bahmni/app/uuid');
    });

    it('should return external + invalid for https url with no allowedDomains (default-deny)',
      () => {
        const result = validateHyperlink('https://abc.com/xyz');
        expect(result.valid).to.equal(false);
        expect(result.type).to.equal('invalid');
        expect(result.error).to.equal('"abc.com" is not an allowed domain');
      });

    it('should return valid for https url matching wildcard allowedDomains', () => {
      const result = validateHyperlink('https://abc.com/xyz', ['*.abc.com']);
      expect(result.valid).to.equal(true);
      expect(result.type).to.equal('external');
    });

    it('should return invalid for https url not matching allowedDomains', () => {
      const result = validateHyperlink('https://abc.com/xyz', ['*.who.int']);
      expect(result.valid).to.equal(false);
      expect(result.type).to.equal('invalid');
      expect(result.error).to.equal('"abc.com" is not an allowed domain');
    });

    it('should treat exact domain match as valid when in allowedDomains', () => {
      const result = validateHyperlink('https://abc.com/xyz', ['abc.com']);
      expect(result.valid).to.equal(true);
      expect(result.type).to.equal('external');
    });

    it('should allow {patientUuid} token in url', () => {
      const result = validateHyperlink('/patient/{patientUuid}/summary');
      expect(result.valid).to.equal(true);
      expect(result.type).to.equal('internal');
    });

    it('should block {patientUuid} in external url — dynamic tokens not supported externally',
      () => {
        const result = validateHyperlink('https://example.com/patient/{patientUuid}');
        expect(result.valid).to.equal(false);
        expect(result.type).to.equal('invalid');
        expect(result.error).to.equal('Tokens not allowed in external URLs');
      });

    it('should block {visitUuid} and other unknown tokens', () => {
      const result = validateHyperlink('/patient/{visitUuid}/summary');
      expect(result.valid).to.equal(false);
      expect(result.type).to.equal('invalid');
      expect(result.error).to.equal('Only {patientUuid} token is supported');
    });

    it('should block unknown token in external url', () => {
      const result = validateHyperlink('https://example.com/visit/{visitUuid}');
      expect(result.valid).to.equal(false);
      expect(result.type).to.equal('invalid');
      expect(result.error).to.equal('Tokens not allowed in external URLs');
    });

    it('should return invalid for bare http url (not https)', () => {
      const result = validateHyperlink('http://abc.com/xyz');
      expect(result.valid).to.equal(false);
      expect(result.type).to.equal('invalid');
      expect(result.error).to.equal('Must start with https:// or /');
    });

    it('should return invalid for bare word (no protocol, no leading slash)', () => {
      const result = validateHyperlink('abc.com/xyz');
      expect(result.valid).to.equal(false);
      expect(result.type).to.equal('invalid');
      expect(result.error).to.equal('Must start with https:// or /');
    });

    it('should return empty error string in sanitizedUrl on invalid', () => {
      const result = validateHyperlink('javascript:void(0)'); // eslint-disable-line no-script-url
      expect(result.sanitizedUrl).to.equal('');
    });
  });

  describe('Util.resolveUrlTokens with patientUuid', () => {
    it('should replace {patientUuid} token with actual uuid', () => {
      const result = Util.resolveUrlTokens('/patient/{patientUuid}/summary',
        { patientUuid: 'abc-123' });
      expect(result).to.equal('/patient/abc-123/summary');
    });

    it('should replace multiple {patientUuid} tokens', () => {
      const result = Util.resolveUrlTokens('/a/{patientUuid}/b/{patientUuid}',
        { patientUuid: 'abc-123' });
      expect(result).to.equal('/a/abc-123/b/abc-123');
    });

    it('should leave token unchanged when patientUuid not in params', () => {
      const result = Util.resolveUrlTokens('/patient/{patientUuid}/summary', {});
      expect(result).to.equal('/patient/{patientUuid}/summary');
    });

    it('should return url unchanged when url has no token', () => {
      const result = Util.resolveUrlTokens('/patient/summary', { patientUuid: 'abc-123' });
      expect(result).to.equal('/patient/summary');
    });
  });
});
