import { expect } from 'chai';
import TranslationKeyGenerator from 'src/services/TranslationKeyService';

describe('TranlationKeyService', () => {
  it('should generator a translation key', () => {
    const transKeyGenerator = new TranslationKeyGenerator("label", "1");
    const transKey = transKeyGenerator.build();
    expect(transKey).to.eql("LABEL_1");
  });
});