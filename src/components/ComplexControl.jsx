import React, { Component, PropTypes } from 'react';
import ComponentStore from 'src/helpers/componentStore';
import { Validator } from 'src/helpers/Validator';
import Spinner from 'src/helpers/Spinner';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';

export class ComplexControl extends Component {
  constructor(props) {
    super(props);
    const hasErrors = false;
    this.state = { hasErrors };
    this.hasBeenAddMore = this.props.value;
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
      this.props.onChange(this.props.value, errors);
    }
  }

  _hasErrors(errors) {
    return !isEmpty(errors);
  }

  _getErrors(value) {
    if (this._isCreateByAddMore()) {
      return [];
    }
    const validations = this.props.validations;
    const controlDetails = { validations, value };
    return Validator.getErrors(controlDetails);
  }

  _isCreateByAddMore() {
    return (this.props.formFieldPath.split('-')[1] !== '0');
  }

  update(value) {
    const errors = this._getErrors(value);
    this.setState({ loading: false, hasErrors: this._hasErrors(errors) });
    this.props.onChange(value, errors);
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({loading: true});
    if (e.target.files === undefined) {
      this.update(undefined);
      return;
    }
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = (event) => {
      this.uploadFile(event.target.result, '623bd342-8056-4eb9-8a3e-9bb99e8a62fc')
        .then((response) => response.json())
        .then(data => {
          this.previewUrl = data.url;
          this.update(data.url);
        });
    };
    reader.readAsDataURL(file);
  }



  uploadFile(file, patientUuid) {
    const searchStr = ';base64';
    const format = file.split(searchStr)[0].split('/')[1];

    const url = 'https://local.mybahmni.org' +
      '/openmrs/ws/rest/v1/bahmnicore/visitDocument/uploadDocument';
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
    }
    return (<button className="restore-button"
      onClick={(e) => this.handleRestore(e)}
    >Restore Image</button>);
  }

  addControl() {
    if (!this.hasBeenAddMore) {
      this.props.onControlAdd(this.props.formFieldPath);
      this.hasBeenAddMore = true;
    }
  }

  render() {
    let preview = null;
    const imageUrl = `/document_images/${this.props.value}`;
    if (this.props.value) {
      preview = (<a href={imageUrl} target="_blank"><img src={imageUrl} /></a>);
      this.addControl();
    }
    return (
        <div className="obs-comment-section-wrap">
          <Spinner show={this.state.loading} />
          <input className={classNames({ 'form-builder-error': this.state.hasErrors })}
            disabled={ !this.props.enabled }
            onChange={(e) => this.handleChange(e)}
            type="file"

          />
          <label>
            {preview}
          </label>
          {this.displayActionButton()}
        </div>
    );
  }
}


ComplexControl.propTypes = {
  enabled: PropTypes.bool,
  formFieldPath: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onControlAdd: PropTypes.func.isRequired,
  validate: PropTypes.bool.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.string,
};

ComplexControl.defaultProps = {
  enabled: true,
};

ComponentStore.registerComponent('complex', ComplexControl);
