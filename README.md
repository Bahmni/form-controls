Form Controls
-------------

This library provides a range of form controls that can be used to create customized forms within the Bahmni platform.

### File naming conventions

1. All components should be in Pascal Case (camel case starting with uppercase letter)
2. Other files including styles should be in Camel Case starting with lowercase letter
3. Test files should have the same name as the file followed by .spec.js

### Setup Steps

1. Install nvm
2. Install node
3. Install yarn - https://yarnpkg.com/en/docs/install

### Build

1. Install dependencies - `yarn`
2. Build - `yarn build`
3. Test - `yarn test`

### SNOMED Integration Support

form-controls also integrates with SNOMED for terminology lookup as part of form configuration and generation. More details can be found in [this](https://bahmni.atlassian.net/wiki/spaces/BAH/pages/3132686337/SNOMED+FHIR+Terminology+Server+Integration+with+Bahmni) Wiki link
