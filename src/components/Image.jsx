import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentStore from 'src/helpers/componentStore';
import classNames from 'classnames';
import Spinner from 'src/helpers/Spinner';
import Constants from 'src/constants';
import isEmpty from 'lodash/isEmpty';
import { Util } from 'src/helpers/Util';
import { Validator } from 'src/helpers/Validator';

export class Image extends Component {

  constructor(props) {
    super(props);
    const hasErrors = false;
    this.state = { hasErrors, loading: false };
    this.handleChange = this.handleChange.bind(this);
    this.displayRestoreButton = this.displayRestoreButton.bind(this);
    this.displayDeleteButton = this.displayDeleteButton.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    this.isValueChanged = this.props.value !== nextProps.value;
    if (this.props.enabled !== nextProps.enabled ||
      this.isValueChanged ||
      this.state.hasErrors !== nextState.hasErrors || this.state.loading !== nextState.loading) {
      return true;
    }
    return false;
  }

  componentDidUpdate() {
    const errors = this._getErrors(this.props.value);
    if (this._hasErrors(errors)) {
      this.props.onChange({ value: this.props.value, errors });
    }
  }

  _getErrors(value) {
    if (this._isCreateByAddMore()) {
      return [];
    }
    const validations = this.props.validations;
    let controlDetails;
    if (value && value.indexOf('voided') > 0) {
      controlDetails = { validations, undefined };
    } else {
      controlDetails = { validations, value };
    }
    return Validator.getErrors(controlDetails);
  }

  _hasErrors(errors) {
    return !isEmpty(errors);
  }

  _isCreateByAddMore() {
    return (this.props.formFieldPath.split('-')[1] !== '0');
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
    if (e.target.files === undefined) {
      this.update(undefined);
      return;
    }
    const file = e.target.files[0];
    const reader = new FileReader();
    const fileType = Util.getFileType(file.type);
    if (fileType === 'not_supported') {
      this.update(undefined);
      this.props.showNotification(Constants.errorMessage.fileTypeNotSupported,
        Constants.messageType.error);
      return;
    }
    reader.onloadend = (event) => {
      Util.uploadFile(event.target.result, this.props.patientUuid, fileType)
        .then((response) => response.json())
        .then(data => {
          this.update(data.url);
        });
    };
    reader.readAsDataURL(file);
    this.addControlWithNotification(true);
  }

  handleDelete() {
    this.update(`${this.props.value}voided`);
  }

  handleRestore() {
    this.update(this.props.value.replace(/voided/g, ''));
  }

  displayDeleteButton() {
    return (<button className="delete-button"
      onClick={(e) => this.handleDelete(e)}
    >
      <span className="fa fa-remove"></span>
    </button>);
  }

  displayRestoreButton() {
    return (<button className="restore-button"
      onClick={(e) => this.handleRestore(e)}
    >
      <span className="fa fa-undo"></span>
    </button>);
  }


  displayImage() {
    let preview = null;
    let isPreviewHidden = true;
    let deleteButton = null;
    let restoreButton = null;
    if (this.props.value) {
      isPreviewHidden = false;
      let imageUrl;
      if (this.props.value.indexOf('.pdf') > 0) {
        imageUrl = '../../../../bahmni/images/pdfIcon.png';
      } else {
        imageUrl = `/document_images/${this.props.value.replace(/voided/g, '')}`;
      }
      preview = (<img src={imageUrl} />);
      deleteButton = this.displayDeleteButton();
      if (this.props.value.indexOf('voided') > 0) {
        restoreButton = this.displayRestoreButton();
      }
      this.addControlWithNotification(false);
    }
    const id = `file-browse-observation_${this.props.formFieldPath.split('/')[1]}`;
    const loading = (this.state.loading === true);
    return (
      <div className="image-upload">
        <Spinner show={loading} />
        <input accept="application/pdf, image/*"
          className={classNames({ 'form-builder-error': this.state.hasErrors })}
          disabled={ !this.props.enabled }
          id={id}
          onChange={(e) => this.handleChange(e)}
          type="file"
        />
        <div className={classNames({ hidden: isPreviewHidden }, 'file')}>
          {preview}
          {deleteButton}
          {restoreButton}
        </div>
        <label className={classNames({ hidden: !isPreviewHidden }, 'placeholder')} htmlFor={id}>
          <i className="fa fa-cloud-upload"></i>
        </label>
      </div>
    );
  }
  render() {
    return this.displayImage();
  }
}

Image.propTypes = {
  addMore: PropTypes.bool,
  enabled: PropTypes.bool,
  formFieldPath: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onControlAdd: PropTypes.func.isRequired,
  patientUuid: PropTypes.string,
  showNotification: PropTypes.func.isRequired,
  validate: PropTypes.bool.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.string,
};

Image.defaultProps = {
  enabled: true,
};

ComponentStore.registerComponent('ImageUrlHandler', Image);
