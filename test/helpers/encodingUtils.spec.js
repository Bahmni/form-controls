import { expect } from 'chai';
import {
  unescapeHtml,
  deepUnescapeStrings,
  utf8ToBase64,
  base64ToUtf8,
} from 'src/helpers/encodingUtils';

describe('encodingUtils', () => {
  describe('unescapeHtml', () => {
    it('should unescape &lt; to <', () => {
      expect(unescapeHtml('a &lt; b')).to.equal('a < b');
    });

    it('should unescape &gt; to >', () => {
      expect(unescapeHtml('a &gt; b')).to.equal('a > b');
    });

    it('should unescape &amp; to &', () => {
      expect(unescapeHtml('a &amp; b')).to.equal('a & b');
    });

    it('should unescape multiple entities in a single string', () => {
      expect(unescapeHtml('if (a &lt; b &amp;&amp; c &gt; d)'))
        .to.equal('if (a < b && c > d)');
    });

    it('should unescape &quot; to "', () => {
      expect(unescapeHtml('a &quot;quoted&quot; b')).to.equal('a "quoted" b');
    });

    it('should unescape &#39; to \'', () => {
      expect(unescapeHtml('it&#39;s')).to.equal("it's");
    });

    it('should return the same string when no entities are present', () => {
      expect(unescapeHtml('hello world')).to.equal('hello world');
    });

    it('should return non-string values as-is', () => {
      expect(unescapeHtml(42)).to.equal(42);
      expect(unescapeHtml(null)).to.equal(null);
      expect(unescapeHtml(undefined)).to.equal(undefined);
    });
  });

  describe('deepUnescapeStrings', () => {
    it('should unescape a plain string', () => {
      expect(deepUnescapeStrings('a &lt; b')).to.equal('a < b');
    });

    it('should unescape all string values in an object', () => {
      const input = { name: 'test', script: 'if (a &lt; b &amp;&amp; c &gt; d) {}' };
      const result = deepUnescapeStrings(input);
      expect(result.name).to.equal('test');
      expect(result.script).to.equal('if (a < b && c > d) {}');
    });

    it('should unescape strings in nested objects', () => {
      const input = {
        events: {
          onFormInit: 'x &gt; 0',
          onChange: 'y &lt; 10',
        },
      };
      const result = deepUnescapeStrings(input);
      expect(result.events.onFormInit).to.equal('x > 0');
      expect(result.events.onChange).to.equal('y < 10');
    });

    it('should unescape strings inside arrays', () => {
      const input = ['a &lt; b', 'c &gt; d'];
      const result = deepUnescapeStrings(input);
      expect(result).to.deep.equal(['a < b', 'c > d']);
    });

    it('should handle arrays of objects', () => {
      const input = [{ label: '&lt;bold&gt;' }, { label: 'plain' }];
      const result = deepUnescapeStrings(input);
      expect(result[0].label).to.equal('<bold>');
      expect(result[1].label).to.equal('plain');
    });

    it('should return numbers as-is', () => {
      expect(deepUnescapeStrings(42)).to.equal(42);
    });

    it('should return null as-is', () => {
      expect(deepUnescapeStrings(null)).to.equal(null);
    });

    it('should return boolean as-is', () => {
      expect(deepUnescapeStrings(true)).to.equal(true);
    });

    it('should handle a metadata-like structure with escaped events', () => {
      const metadata = {
        name: 'Vitals',
        controls: [{ id: '1', type: 'label', value: 'Pulse' }],
        events: {
          onFormInit: 'function(ctx) { if (a &lt; b &amp;&amp; c &gt; d) { return; } }',
        },
      };
      const result = deepUnescapeStrings(metadata);
      expect(result.events.onFormInit)
        .to.equal('function(ctx) { if (a < b && c > d) { return; } }');
      expect(result.name).to.equal('Vitals');
      expect(result.controls[0].value).to.equal('Pulse');
    });
  });

  describe('base64ToUtf8', () => {
    it('should return empty string for undefined', () => {
      expect(base64ToUtf8(undefined)).to.equal('');
    });

    it('should return empty string for null', () => {
      expect(base64ToUtf8(null)).to.equal('');
    });

    it('should return empty string for empty string', () => {
      expect(base64ToUtf8('')).to.equal('');
    });

    it('should throw for invalid base64', () => {
      expect(() => base64ToUtf8('not-valid-base64!!!')).to.throw();
    });

    it('should decode a valid base64 string', () => {
      const original = 'function(ctx) { return ctx; }';
      const encoded = utf8ToBase64(original);
      expect(base64ToUtf8(encoded)).to.equal(original);
    });
  });
});
