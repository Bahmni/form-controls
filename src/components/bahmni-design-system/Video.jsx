import { FileUploaderButton, FileUploaderItem } from '@carbon/react';
import { Loading } from '@bahmni/design-system';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { FileUpload } from './FileUpload';

export class Video extends FileUpload {

  displayVideo() {
    const loading = this.state.loading === true;
    const fileName = this.getFileName(this.props.value);

    return (
      <div className={classNames('carbon-video-upload', { 'carbon-error': this.state.hasErrors })}>
        {loading && <Loading active small />}
        <p className="upload-label">Upload video</p>
        <p className="upload-description">Supported video formats: .mp4, .avi and more.</p>
        <FileUploaderButton
          accept={['.mkv', '.flv', '.ogg', 'video/*', 'audio/3gpp']}
          labelText="Upload video"
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
              iconDescription="Delete video"
            />
          </div>
        )}
      </div>
    );
  }

  render() {
    return this.displayVideo();
  }
}

Video.propTypes = FileUpload.propTypes;
Video.defaultProps = FileUpload.defaultProps;
