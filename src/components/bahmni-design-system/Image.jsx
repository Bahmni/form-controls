import { FileUploaderButton, FileUploaderItem } from '@carbon/react';
import { Loading } from '@bahmni/design-system';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { FileUpload } from './FileUpload';

export class Image extends FileUpload {

  displayImage() {
    const loading = this.state.loading === true;
    const fileName = this.getFileName(this.props.value);

    return (
      <div className={classNames('carbon-image-upload', { 'carbon-error': this.state.hasErrors })}>
        {loading && <Loading active small />}
        <p className="upload-label">Upload files</p>
        <p className="upload-description">Max file size is 500kb. Supported file types are .jpg, .png, and .pdf.</p>
        <FileUploaderButton
          accept={['application/pdf', 'image/*']}
          labelText="Upload file"
          onChange={this.handleChange}
          disabled={!this.props.enabled}
          disableLabelChanges
        />
        {this.props.value && (
          <div className="file-row">
            <FileUploaderItem
              uuid={typeof this.props.value === 'object' ? this.props.value.url : this.props.value}
              name={fileName}
              status="edit"
              onDelete={this.handleDelete}
              iconDescription="Delete file"
            />
          </div>
        )}
      </div>
    );
  }

  render() {
    return this.displayImage();
  }
}

Image.propTypes = FileUpload.propTypes;
Image.defaultProps = FileUpload.defaultProps;
