import { expect } from 'chai';
import sinon from 'sinon';
import ScriptRunner from 'src/helpers/scriptRunner';
import { utf8ToBase64 } from 'src/helpers/encodingUtils';
import { List } from 'immutable';
import { ControlRecord } from 'src/helpers/ControlRecordTreeBuilder';

describe('ScriptRunner', () => {
  const emptyRecord = new ControlRecord({ children: List([]) });

  describe('execute', () => {
    it('should execute a plain text script', () => {
      const runner = new ScriptRunner(emptyRecord, {});
      const script = `function(formContext) { formContext._testResult = 42; }`;
      runner.execute(script);
      expect(runner.formContext._testResult).to.equal(42);
    });

    it('should unescape and execute an HTML-escaped plain text script', () => {
      const runner = new ScriptRunner(emptyRecord, {});
      // Script with HTML-escaped entities, as returned from API
      const escapedScript =
        `function(formContext) { var x = 1; if (x &lt; 2 &amp;&amp; x &gt; 0) { formContext._testResult = true; } }`;
      runner.execute(escapedScript);
      expect(runner.formContext._testResult).to.equal(true);
    });

    it('should execute a base64-encoded script', () => {
      const runner = new ScriptRunner(emptyRecord, {});
      const rawScript = `function(formContext) { formContext._testResult = 'base64'; }`;
      const encoded = utf8ToBase64(rawScript);
      runner.execute(encoded);
      expect(runner.formContext._testResult).to.equal('base64');
    });

    it('should not alter a script with no HTML entities', () => {
      const runner = new ScriptRunner(emptyRecord, {});
      const script = `function(formContext) { formContext._testResult = 'clean'; }`;
      runner.execute(script);
      expect(runner.formContext._testResult).to.equal('clean');
    });

    it('should return formContext records after execution', () => {
      const runner = new ScriptRunner(emptyRecord, {});
      const result = runner.execute(`function(formContext) {}`);
      expect(result).to.not.be.undefined;
    });
  });
});
