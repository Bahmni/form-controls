import React, { Component, PropTypes } from 'react';
import ComponentStore from 'src/helpers/componentStore';
import { Validator } from 'src/helpers/Validator';

export class ComplexControl extends Component {
  constructor(props) {
    super(props);
  }

  handleChange(e) {
    e.preventDefault();
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = (event) => {
      this._uploadFile(event.target.result, '623bd342-8056-4eb9-8a3e-9bb99e8a62fc').then((response) => response.json())
        .then(data => {
          this.props.onChange(data.url);
        });
    };
    reader.readAsDataURL(file);
  }

  _uploadFile(file, patientUuid) {
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

  render() {
    return (
        <div className="obs-comment-section-wrap">
          <input type="file"
            onChange={(e) => this.handleChange(e)}
          />
        </div>
    );
  }
}

ComponentStore.registerComponent('complex', ComplexControl);
