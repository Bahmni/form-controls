import { expect } from 'chai';
import TranslationKeyGenerator from 'src/services/TranslationKeyService';

describe('TranlationKeyService', () => {
  it('should generator a translation key', () => {
    const transKeyGenerator = new TranslationKeyGenerator('label', '1');
    const transKey = transKeyGenerator.build();
    expect(transKey).to.eql('LABEL_1');
  });

  it('should generator a translation key by replacing all the spaces', () => {
    const transKeyGenerator = new TranslationKeyGenerator('some dummy label', '1');
    const transKey = transKeyGenerator.build();
    expect(transKey).to.eql('SOME_DUMMY_LABEL_1');
  });
});
