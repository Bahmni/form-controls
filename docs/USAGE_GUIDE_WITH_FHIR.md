# Usage Guide with FHIR resources

`CarbonContainer` supports FHIR R4 Observation resources as input and exposes ref methods to produce FHIR bundles as output, removing the need for consuming apps to implement bundle-building logic themselves.

## Mounting with FHIR observations

Pass an array of FHIR Observation resources via `fhirObservations` instead of the legacy `observations` prop.

```jsx
import { CarbonContainer } from '@bahmni/form2-controls';

const containerRef = useRef(null);

<CarbonContainer
  ref={containerRef}
  metadata={formMetadata}
  fhirObservations={observations}
  patient={patient}
  translations={translations}
  locale="en"
  validate
/>
```

## Bundle methods

Both methods require an `options` object with FHIR context references:

```js
const options = {
  patientReference:    { reference: 'Patient/<uuid>' },
  encounterReference:  { reference: 'Encounter/<uuid>' },
  performerReference:  { reference: 'Practitioner/<uuid>' },
  basedOnReference:    { reference: 'ServiceRequest/<uuid>' }, // optional
};
```

### `getCurrentObservationBundle(options)`

Returns a `collection` bundle containing all current non-empty observations in the form. Does not run validation or form-save scripts. Never throws.

```js
const bundle = containerRef.current.getCurrentObservationBundle(options);
// { resourceType: 'Bundle', type: 'collection', entry: [...] }
```

Use this for read-only views, autosave drafts, or passing current form state to another system.

### `getObservationBundleForSave(options)`

Returns a `transaction` bundle with only the observations that changed relative to the initial state (POST/PUT/DELETE). Runs the form's `onFormSave` script and validates mandatory fields before building. Throws `FormValidationError` if either step fails.

```js
import { FormValidationError } from '@bahmni/form2-controls';

try {
  const bundle = containerRef.current.getObservationBundleForSave(options);
  await submitBundle(bundle);
} catch (error) {
  if (error instanceof FormValidationError) {
    // error.errors is a flat array of { type, message, source }
    const fieldErrors = error.errors.filter(e => e.source === 'field');
    const scriptErrors = error.errors.filter(e => e.source === 'script');
  }
}
```

Each error item has the shape:
```ts
{ type: 'error' | 'warning', message: string, source: 'field' | 'script' }
```

## Transaction bundle entry structure

Each entry in a transaction bundle follows standard FHIR semantics:

| Scenario | `request.method` | Notes |
|---|---|---|
| New observation | `POST` | `fullUrl` is a `urn:uuid:` reference |
| Changed observation | `PUT` | Preserves the server's original `status` |
| Removed observation | `DELETE` | Leaf and cascade group deletes |
| Unchanged observation | — | Omitted from the bundle entirely |

Group observations (`hasMember`) are only included when at least one child changed.

## Detecting unsaved changes

Pass a React state setter as `setIsFormUpdated`. It is called automatically after each field edit with `true` when the form differs from its initial state and `false` when all edits have been reverted.

```jsx
const [isDirty, setIsDirty] = useState(false);

<CarbonContainer
  ref={containerRef}
  metadata={formMetadata}
  fhirObservations={observations}
  setIsFormUpdated={setIsDirty}
  ...
/>

<button disabled={!isDirty} onClick={handleSave}>
  Save
</button>
```

## TypeScript

All props and ref methods are fully typed in [`index.d.ts`](../index.d.ts). Key types: `ContainerProps`, `ContainerMethods`, `FhirTransformOptions`, `FhirBundle`, `FormValidationError`.

`FhirBundle` is a discriminated union — narrow on `type` to get precise entry types:

```ts
const bundle: FhirBundle = containerRef.current.getCurrentObservationBundle(options);

if (bundle.type === 'collection') {
  // bundle.entry is FhirObservationEntry[]
} else {
  // bundle.entry is FhirBundleEntry[] (has request.method)
}
```
