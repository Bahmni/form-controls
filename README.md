## Form Controls

This library (`@bahmni/form2-controls`) provides a range of form controls that can be used to create customized forms within the Bahmni platform.

> **Note:** This is version 2 of the form controls library, starting at version `0.0.1`. For the previous version that supports React 16, see the [Legacy Version](#legacy-version-react-16-support) section below.

### Requirements

- React 19.0.0 or higher
- React DOM 19.0.0 or higher

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

### TypeScript Support

This library now includes comprehensive TypeScript type definitions for TypeScript consumers.

**Features:**

TypeScript definitions in [`index.d.ts`](./index.d.ts) inlcudes type definations for all exported components (Container, TextBox, NumericBox, AutoComplete, etc.), Type definitions for designer components, Type definitions for helpers, mappers, and services

**Note for Contributors:**
> ⚠️ If you add any new control, make sure to add the type definition for it in [`index.d.ts`](./index.d.ts) to avoid errors/warnings for TypeScript consumers.

The current manual `.d.ts` file provides immediate TypeScript support without requiring any code changes!

## Legacy Version (React 16 Support)

If you need to use the previous version of this library that supports React 16, please use:

```bash
npm install bahmni-form-controls
```

**Legacy Package Details:**
- **Package Name**: `bahmni-form-controls`
- **Latest Version**: `0.93.20`
- **React Support**: React 16.x
- **Status**: Maintained for backward compatibility

This legacy version is still in use in some parts of Bahmni and will continue to be supported for existing implementations.

## Changelog

### Version 0.0.1 (Initial Release - React 19)

**Package Information:**
- **New Package Name**: `@bahmni/form2-controls` (previously `bahmni-form-controls`)
- **Version**: `0.0.1` (starting fresh version numbering)
- **Purpose**: Provide React 19 support while maintaining the legacy `bahmni-form-controls@0.93.20` for React 16 compatibility

**Installation:**
```bash
npm install @bahmni/form2-controls@0.0.1
```

Or with yarn:
```bash
yarn add @bahmni/form2-controls@0.0.1
```
---

### React 19 Upgrade Features

**Breaking Changes:**

- **React 19 Upgrade**: Upgraded from React 18.3.1 to React 19.0.0
  - Peer dependencies: `react` and `react-dom` now require `^19.0.0`.
  - Container component API unchanged - no code changes needed for basic usage

- **react-select Upgrade**: Upgraded from v1.3.0 to v5.10.2
  - Modern API with separate imports (`AsyncSelect`, `CreatableSelect`)
  - No changes needed if using Container component only

- **react-textarea-autosize**: Upgraded from v4.0.5 to v8.5.9

- **Build Output**: Library now uses UMD format (Universal Module Definition)
  - Prevents React version mismatch errors by using consumer's React instance
  - React and ReactDOM are externalized and not bundled

**Migration:**

See [REACT_19_MIGRATION.md](./docs/REACT_19_MIGRATION.md) for detailed steps.

**Resources:**
- [Migration Guide](./docs/REACT_19_MIGRATION.md)
- [FHIR Bundle Integration](./docs/USAGE_GUIDE_WITH_FHIR.md)
- [Example App](./examples/react19-consumer-app/)

---


### Version 1.0.0 (Major Release)

This major release includes significant infrastructure upgrades and modernization of the codebase to ensure better performance, maintainability, and long-term support.

**Breaking Changes:**

- **React Upgrade**: Upgraded React to version 17.0.2 and associated dependencies

  - Updated react-dom to 17.0.2
  - Migrated from legacy React patterns to modern React 17 features
  - Removed deprecated React addon dependencies from webpack configuration

- **Testing Framework Migration**: Complete migration from Enzyme to Jest + React Testing Library (RTL)

  - Replaced all Enzyme-based tests with RTL tests for better React 17 compatibility
  - Removed obsolete Enzyme test dependencies and setup files
  - Implemented comprehensive RTL tests for all components, helpers, mappers, and designers
  - Added Jest test validation to GitHub Actions workflow
  - Improved test reliability and maintainability with modern testing practices

- **Build Tools Upgrade**: Upgraded Babel, Webpack, and ESLint configurations
  - Upgraded Webpack to version 5.x with modern configuration
  - Upgraded Babel to version 7.x with latest presets and plugins
  - Updated ESLint configuration for better code quality enforcement
  - Configured webpack to output library as ES modules for better tree-shaking support
  - Removed unused Enzyme scripts and dependencies
  - Fixed linting issues across the codebase

**Migration Notes:**

This major version bump reflects significant infrastructure upgrades that may require updates to consuming applications. Please review your dependencies and ensure compatibility with:

- React 17.x
- Webpack 5.x
- Babel 7.x
- Modern ES module output format

**Benefits:**

- Better performance with Webpack 5 optimizations
- Improved developer experience with modern tooling
- More reliable tests with React Testing Library
- Better long-term maintainability and support
- Enhanced tree-shaking capabilities with ES module output
