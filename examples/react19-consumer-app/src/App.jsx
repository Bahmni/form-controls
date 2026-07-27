import React, { useRef, useState, useCallback, useEffect } from 'react';
import { CarbonContainer, getObservationsFromFhir, ComponentStore } from '@bahmni/form2-controls';
import '@bahmni/form2-controls/dist/bundle.css';
import '@bahmni/design-system/styles';
import {
  clinicalFormMetadata,
  patientData,
  translationData
} from './formData';
import { FileUrlHandler } from './FileUrlHandler';
import './App.css';
import sampleFhirBundle from './sampleFhirBundle.json';

// BAH-4812 (Deskcheck #1): register a Complex-media handler so the pre-populated
// file attachment actually renders. Must run before CarbonContainer mounts.
ComponentStore.registerComponent('FileUrlHandler', FileUrlHandler);

// BAH-4812 demo: reverse a real FHIR searchset Bundle (the shape the backend
// $fetch-all returns) into Form2 observations, then render them in the form.
const existingObservations = getObservationsFromFhir(sampleFhirBundle);

/**
 * React 19 Demo Application - Clinical Assessment Form
 *
 * This version demonstrates React 19 best practices:
 * 1. Explicit dependencies in all hooks
 * 2. Proper error boundaries (class-based, still required in React 19)
 * 3. Strict mode enabled
 * 4. Modern hooks patterns
 * 5. Enhanced performance optimizations
 */
function App() {
  // Reference to Container component
  const formRef = useRef(null);

  // State management
  const [observations, setObservations] = useState(existingObservations);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [errors, setErrors] = useState([]);
  const [lastSavedData, setLastSavedData] = useState(null);
  const [containerMounted, setContainerMounted] = useState(false);

  // Form configuration state
  const [config, setConfig] = useState({
    validate: true,
    validateForm: false,
    collapse: false,
    readonly: false
  });

  // Track when Container is actually mounted
  // React 19: Explicitly list dependencies
  useEffect(() => {
    if (formRef.current) {
      setContainerMounted(true);
      console.log('Container component mounted successfully (React 19)');
    }
  }, [formRef.current]);

  /**
   * Display notification message
   * React 19: No dependencies needed as function doesn't use external state
   */
  const showNotification = useCallback((message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 4000);
  }, []); // No external dependencies

  /**
   * Handle form value updates (called on every change)
   * React 19: No dependencies needed as it's a pure logging function
   */
  const handleFormValueUpdated = useCallback((controlRecordTree) => {
    console.log('Form updated (React 19):', controlRecordTree);
  }, []); // No external dependencies

  /**
   * Save form data with error handling
   * React 19: All dependencies explicitly listed
   */
  const handleSave = useCallback(async () => {
    if (!formRef.current) {
      showNotification('Form not ready. Please wait...', 'warning');
      return;
    }

    if (!containerMounted) {
      showNotification('Form is still initializing...', 'warning');
      return;
    }

    setIsLoading(true);
    setErrors([]);

    try {
      // Get current form data
      const formData = formRef.current.getValue();

      if (!formData) {
        throw new Error('Unable to retrieve form data');
      }

      // Check for validation errors
      if (formData.errors && formData.errors.length > 0) {
        setErrors(formData.errors);
        showNotification(
          `Validation failed: ${formData.errors.length} error(s) found`,
          'error'
        );
        setIsLoading(false);
        return;
      }

      // Log observations
      console.log('Saving observations (React 19):', formData.observations);

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      setLastSavedData(formData.observations);
      showNotification('Form saved successfully! (React 19)', 'success');
    } catch (error) {
      console.error('Error saving form:', error);
      showNotification(`Failed to save form: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showNotification, containerMounted]); // React 19: Explicit dependencies

  /**
   * Reset form to initial data
   * React 19: All dependencies explicitly listed
   */
  const handleReset = useCallback(() => {
    setObservations([...existingObservations]);
    setErrors([]);
    setLastSavedData(null);
    showNotification('Form reset to initial data (React 19)', 'info');
  }, [showNotification]); // React 19: Explicit dependencies

  /**
   * Clear all form data
   * React 19: All dependencies explicitly listed
   */
  const handleClear = useCallback(() => {
    setObservations([]);
    setErrors([]);
    setLastSavedData(null);
    showNotification('Form cleared (React 19)', 'info');
  }, [showNotification]); // React 19: Explicit dependencies

  /**
   * Toggle configuration options
   * React 19: No dependencies needed
   */
  const handleConfigChange = useCallback((key) => {
    setConfig(prev => ({ ...prev, [key]: !prev[key] }));
  }, []); // No external dependencies

  return (
    <div className="app-wrapper">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1>Clinical Assessment Form</h1>
          <p className="subtitle">React 19 + Bahmni Form Controls Demo</p>
          <span className="react-version">⚛️ React 19.0.0</span>
        </div>
      </header>

      <div className="main-content">
        <div className="container">
          {/* Patient Information Panel */}
          <section className="panel patient-panel">
            <h2>Patient Details</h2>
            <div className="patient-grid">
              <div className="patient-field">
                <label>Name:</label>
                <span>{patientData.name}</span>
              </div>
              <div className="patient-field">
                <label>MRN:</label>
                <span>{patientData.identifier}</span>
              </div>
              <div className="patient-field">
                <label>Age:</label>
                <span>{patientData.age} years</span>
              </div>
              <div className="patient-field">
                <label>Gender:</label>
                <span>{patientData.gender === 'F' ? 'Female' : 'Male'}</span>
              </div>
              <div className="patient-field">
                <label>DOB:</label>
                <span>{patientData.birthdate}</span>
              </div>
              <div className="patient-field">
                <label>UUID:</label>
                <span className="uuid">{patientData.uuid}</span>
              </div>
            </div>
          </section>

          {/* Configuration Panel */}
          <section className="panel config-panel">
            <h3>Form Configuration</h3>
            <div className="config-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={config.readonly}
                  onChange={() => handleConfigChange('readonly')}
                />
                <span>🔒 Readonly Mode</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={config.validate}
                  onChange={() => handleConfigChange('validate')}
                  disabled={config.readonly}
                />
                <span>Enable Validation</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={config.validateForm}
                  onChange={() => handleConfigChange('validateForm')}
                  disabled={config.readonly}
                />
                <span>Validate on Load</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={config.collapse}
                  onChange={() => handleConfigChange('collapse')}
                />
                <span>Collapse Sections</span>
              </label>
            </div>
            {!containerMounted && (
              <p style={{ marginTop: '1rem', color: '#f39c12' }}>
                ⏳ Form is initializing...
              </p>
            )}
            {containerMounted && (
              <p style={{ marginTop: '1rem', color: '#27ae60' }}>
                ✓ Form ready (React 19)
              </p>
            )}
          </section>

          {/* Notification */}
          {notification.message && (
            <div className={`notification notification-${notification.type}`}>
              <span className="notification-icon">
                {notification.type === 'success' && '✓'}
                {notification.type === 'error' && '✗'}
                {notification.type === 'warning' && '⚠'}
                {notification.type === 'info' && 'ℹ'}
              </span>
              <span>{notification.message}</span>
            </div>
          )}

          {/* Validation Errors */}
          {errors.length > 0 && (
            <section className="panel error-panel">
              <h3>Validation Errors ({errors.length})</h3>
              <ul className="error-list">
                {errors.map((error, index) => (
                  <li key={index}>
                    {error.message || JSON.stringify(error)}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Form Container with Error Boundary */}
          <section className="panel form-panel">
            <div className="form-header">
              <h2>Clinical Assessment</h2>
              <span className="form-version">v{clinicalFormMetadata.version}</span>
            </div>

            <div className="form-wrapper">
              <ErrorBoundary>
                <CarbonContainer
                  ref={formRef}
                  metadata={clinicalFormMetadata}
                  observations={observations}
                  patient={patientData}
                  translations={translationData}
                  validate={config.validate}
                  validateForm={config.validateForm}
                  collapse={config.collapse}
                  locale="en"
                  onValueUpdated={handleFormValueUpdated}
                  readonly={config.readonly}
                />
              </ErrorBoundary>
            </div>
          </section>

          {/* Action Buttons */}
          <section className="actions">
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={isLoading || !containerMounted}
            >
              {isLoading ? 'Saving...' : '💾 Save Form'}
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleReset}
              disabled={isLoading || !containerMounted}
            >
              🔄 Reset
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleClear}
              disabled={isLoading || !containerMounted}
            >
              🗑️ Clear
            </button>
          </section>

          {/* Saved Data Display */}
          {lastSavedData && (
            <section className="panel data-panel">
              <h3>Last Saved Data</h3>
              <div className="data-summary">
                <p>
                  <strong>Total Observations:</strong> {lastSavedData.length}
                </p>
                <details>
                  <summary>View JSON</summary>
                  <pre className="json-output">
                    {JSON.stringify(lastSavedData, null, 2)}
                  </pre>
                </details>
              </div>
            </section>
          )}

          {/* Info Panel */}
          <section className="panel info-panel">
            <h3>About This Demo (React 19)</h3>
            <ul className="info-list">
              <li>
                <strong>Framework:</strong> React 19.0.0
              </li>
              <li>
                <strong>Library:</strong> @bahmni/form2-controls
              </li>
              <li>
                <strong>Features:</strong> Enhanced hooks, strict dependencies, improved performance
              </li>
              <li>
                <strong>Patterns:</strong> Explicit dependencies, error boundaries, StrictMode
              </li>
              <li>
                <strong>Form:</strong> Obs Groups, Validation, Pre-filled Data
              </li>
              <li>
                <strong>Console:</strong> Check browser console for React 19 logs
              </li>
            </ul>
          </section>

          {/* React 19 Improvements Panel */}
          <section className="panel improvement-panel">
            <h3>React 19 Improvements ⚡</h3>
            <ul className="info-list">
              <li>
                <strong>✅ Explicit Dependencies:</strong> All useCallback hooks have complete dependency arrays
              </li>
              <li>
                <strong>✅ Stricter Hooks Rules:</strong> ESLint exhaustive-deps enforced
              </li>
              <li>
                <strong>✅ Better Performance:</strong> Enhanced batching and rendering optimizations
              </li>
              <li>
                <strong>✅ Modern Patterns:</strong> Following React 19 best practices
              </li>
              <li>
                <strong>✅ StrictMode:</strong> Enabled for development safety
              </li>
            </ul>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>
          Bahmni Form Controls React 19 Demo |
          Source: <code>examples/react19-consumer-app/</code> |
          Port: 3002
        </p>
      </footer>
    </div>
  );
}

/**
 * Error Boundary Component for Container
 * 
 * React 19 Note: Error boundaries still require class components.
 * There is no hooks-based alternative yet in React 19.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Container Error (React 19):', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '2rem',
          background: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '8px',
          color: '#721c24'
        }}>
          <h3>⚠️ Form Error</h3>
          <p><strong>Error:</strong> {this.state.error?.toString()}</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#856404' }}>
            React 19 error boundary caught this error
          </p>
          <details style={{ marginTop: '1rem' }}>
            <summary>Error Details</summary>
            <pre style={{
              background: '#fff',
              padding: '1rem',
              borderRadius: '4px',
              overflow: 'auto',
              fontSize: '0.875rem'
            }}>
              {this.state.errorInfo?.componentStack}
            </pre>
          </details>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              background: '#721c24',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default App;
