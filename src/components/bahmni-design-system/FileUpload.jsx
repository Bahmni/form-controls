import { Component } from 'react';
import PropTypes from 'prop-types';
import Constants from 'src/constants';
import isEmpty from 'lodash/isEmpty';
import { Util } from 'src/helpers/Util';
import { Validator } from 'src/helpers/Validator';
import { UploadHandler } from 'src/helpers/UploadHandler';
import { cacheFileName, getCachedFileName } from 'src/helpers/FileNameCache';

export class FileUpload extends Component {

  constructor(props) {
    super(props);
    this.state = { hasErrors: false, loading: false };
    this.handleChange = this.handleChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    const v = this.props.value;
    if (v && (typeof v === 'string' || (typeof v === 'object' && v !== null && v.url))) {
      this.addControlWithNotification(false);
    }
  }

  // Abstract base class — extend in Image/Video; not registered in carbonComponents directly

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.enabled !== nextProps.enabled ||
      this.props.value !== nextProps.value ||
      this.state.hasErrors !== nextState.hasErrors || this.state.loading !== nextState.loading) {
      return true;
    }
    return false;
  }

  componentDidUpdate(prevProps) {
    if (this.props.validate !== prevProps.validate ||
        this.props.value !== prevProps.value) {
      if (this.props.validate) {
        const errors = this._getErrors(this.props.value);
        const hasErrors = this._hasErrors(errors);
        if (this.state.hasErrors !== hasErrors) {
          this.setState({ hasErrors });
        }
      }

      const errors = this._getErrors(this.props.value);
      if (this._hasErrors(errors)) {
        this.props.onChange({ value: this.props.value, errors });
      }
    }
  }

  _getErrors(value) {
    if (this._isCreateByAddMore()) {
      return [];
    }
    return Validator.getErrors({ validations: this.props.validations, value });
  }

  _hasErrors(errors) {
    return !isEmpty(errors);
  }

  _isCreateByAddMore() {
    return !!this.props.formFieldPath && this.props.formFieldPath.split('-')[1] !== '0';
  }

  addControlWithNotification(isNotificationShown) {
    if (this.props.addMore && !this.hasBeenAddMore) {
      this.props.onControlAdd(this.props.formFieldPath, isNotificationShown);
      this.hasBeenAddMore = true;
    }
  }

  update(value) {
    const errors = this._getErrors(value);
    this.setState({ loading: false, hasErrors: this._hasErrors(errors) });
    this.props.onChange({ value, errors });
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({ loading: true });
    if (!e.target.files || e.target.files.length === 0) {
      this.update(undefined);
      e.target.value = '';
      return;
    }
    const file = e.target.files[0];
    const reader = new FileReader();
    const fileType = Util.getFileType(file.type);
    if (fileType === 'not_supported') {
      this.update(undefined);
      this.props.showNotification(Constants.errorMessage.fileTypeNotSupported,
        Constants.messageType.error);
      e.target.value = '';
      return;
    }

    const inputElement = e.target;
    reader.onloadend = (event) => {
      Util.uploadFile(event.target.result, this.props.patientUuid, fileType)
        .then((response) => response.json())
        .then(data => {
          const handleSuccess = (url) => {
            // Keep value as a plain string URL — CarbonContainer's Immutable.js
            // records call .indexOf() on the value and will error on an object.
            // Store the filename in the session cache so FhirObservationTransformer
            // can include it as valueAttachment.title when building the FHIR bundle.
            cacheFileName(url, file.name);
            this.update(url);
            inputElement.value = '';
            this.setState({}, () => {
              this.addControlWithNotification(true);
            });
          };
          const handleError = (errorMessage) => {
            this.setState({ loading: false });
            this.props.showNotification(errorMessage, Constants.messageType.error);
            inputElement.value = '';
          };
          UploadHandler.handleUploadResponse(data, handleSuccess, handleError);
        })
        .catch(() => {
          this.setState({ loading: false });
          this.props.showNotification(Constants.errorMessage.uploadFailed,
            Constants.messageType.error);
          inputElement.value = '';
        });
    };
    reader.readAsDataURL(file);
  }

  handleDelete() {
    this.update(undefined);
  }

  getFileName(value) {
    if (!value) return '';
    // Pre-populated from FHIR fetch: { url, fileName? }
    if (typeof value === 'object' && value !== null) {
      return value.fileName || getCachedFileName(value.url) || '';
    }
    if (typeof value !== 'string') return '';
    // Newly uploaded file in this session — filename is in the cache
    return getCachedFileName(value) || value.split('/').pop() || '';
  }

  // eslint-disable-next-line react/require-render-return
  render() {
    throw new Error('FileUpload is an abstract class. Use Image or Video instead.');
  }
}

FileUpload.propTypes = {
  addMore: PropTypes.bool,
  enabled: PropTypes.bool,
  formFieldPath: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onControlAdd: PropTypes.func.isRequired,
  patientUuid: PropTypes.string,
  showNotification: PropTypes.func.isRequired,
  validate: PropTypes.bool.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      fileName: PropTypes.string,
      contentType: PropTypes.string,
    }),
  ]),
};

FileUpload.defaultProps = {
  enabled: true,
};
