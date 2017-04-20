import React, { Component, PropTypes } from 'react';
import ComponentStore from 'src/helpers/componentStore';
import { Validator } from 'src/helpers/Validator';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';

export class ComplexControl extends Component {
  constructor(props) {
    super(props);
    const hasErrors = false;
    this.state = { hasErrors };
  }

  shouldComponentUpdate(nextProps, nextState) {
    this.isValueChanged = this.props.value !== nextProps.value;
    if (this.props.enabled !== nextProps.enabled ||
      this.isValueChanged ||
      this.state.hasErrors !== nextState.hasErrors) {
      return true;
    }
    return false;
  }

  componentDidUpdate() {
    const errors = this._getErrors(this.props.value);
    if (this._hasErrors(errors)) {
      this.props.onChange(this.props.value, errors);
    }
  }

  _hasErrors(errors) {
    return !isEmpty(errors);
  }

  _getErrors(value) {
    const validations = this.props.validations;
    const controlDetails = { validations, value };
    return Validator.getErrors(controlDetails);
  }

  update(value) {
    const errors = this._getErrors(value);
    this.setState({ hasErrors: this._hasErrors(errors) });
    this.props.onChange(value, errors);
  }

  handleChange(e) {
    e.preventDefault();
    if (e.target.files === undefined) {
      this.update(undefined);
      return;
    }
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = (event) => {
      this.uploadFile(event.target.result, '623bd342-8056-4eb9-8a3e-9bb99e8a62fc').then((response) => response.json())
        .then(data => {
          this.previewUrl = data.url;
          this.update(data.url);
        });
    };
    reader.readAsDataURL(file);
  }


  uploadFile(file, patientUuid) {
    const searchStr = ';base64';
    let format;
    format = file.split(searchStr)[0].split('/')[1];

    const url = 'https://local.mybahmni.org' + '/openmrs/ws/rest/v1/bahmnicore/visitDocument/uploadDocument';
    return fetch(url, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: file.substring(file.indexOf(searchStr) + searchStr.length, file.length),
        format,
        patientUuid,
        fileType: 'file',
      }),
      credentials: 'include',
    });
  }

  handleDelete() {
    this.update(undefined);
  }

  handleRestore() {
    this.update(this.previewUrl);
  }

  displayActionButton() {
    if (this.props.value) {
      return (<button className="delete-button"
        onClick={(e) => this.handleDelete(e)}
      >Delete Image</button>);
    } else {
      return (<button className="restore-button"
        onClick={(e) => this.handleRestore(e)}
      >Restore Image</button>);
    }
  }

  addControl() {
    if (!this.hasBeenAddMore) {
      this.props.onControlAdd(this.props.formFieldPath);
      this.hasBeenAddMore = true;
    }
  }

  render() {
    let preview = null;
    const value = this.props.value;
    if (this.props.value) {
      preview = (<img src={`/document_images/${value}`} />);
      this.addControl();
    }
    return (
        <div className="obs-comment-section-wrap">
          <input className={classNames({ 'form-builder-error': this.state.hasErrors })}
            type="file"
            onChange={(e) => this.handleChange(e)}
          />
          <label>
            {preview}
          </label>
          {this.displayActionButton()}
        </div>
    );
  }
}

ComponentStore.registerComponent('complex', ComplexControl);
