/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

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
