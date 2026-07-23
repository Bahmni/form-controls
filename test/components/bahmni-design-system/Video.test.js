import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Video } from 'components/bahmni-design-system/Video.jsx';
import { Util } from 'helpers/Util';
import constants from 'src/constants';
import { clearCache } from 'helpers/FileNameCache';

jest.mock('helpers/Util', () => ({
  Util: {
    getFileType: jest.fn(),
    uploadFile: jest.fn(),
  },
}));

const mockFileReader = {
  readAsDataURL: jest.fn(),
  onloadend: jest.fn(),
  result: '',
};

global.FileReader = jest.fn(() => mockFileReader);

describe('Carbon Video', () => {
  let mockOnChange;
  let mockOnControlAdd;
  let mockShowNotification;
  const formFieldPath = 'test1.1/1-0';

  beforeEach(() => {
    clearCache();
    mockOnChange = jest.fn();
    mockOnControlAdd = jest.fn();
    mockShowNotification = jest.fn();

    Util.getFileType.mockReturnValue('video');
    Util.uploadFile.mockResolvedValue({
      json: () => Promise.resolve({ url: 'someUrl' }),
    });

    mockFileReader.readAsDataURL.mockImplementation(function () {
      setTimeout(() => {
        this.onloadend({ target: { result: 'data:video/mp4;base64,/9j/4SumRXhpZgAATU' } });
      }, 0);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderVideo = (props = {}) => render(
    <Video
      addMore
      formFieldPath={formFieldPath}
      onChange={mockOnChange}
      onControlAdd={mockOnControlAdd}
      showNotification={mockShowNotification}
      validate={false}
      validations={[]}
      {...props}
    />
  );

  it('should render Carbon Video with file input and correct accept types', () => {
    const { container } = renderVideo();

    const fileInput = container.querySelector('input[type="file"]');
    expect(fileInput).toHaveAttribute('type', 'file');
    expect(fileInput).toHaveAttribute('accept', '.mkv,.flv,.ogg,video/*,audio/3gpp');
  });

  it('should upload video file to server', async () => {
    const { container } = renderVideo();

    const fileInput = container.querySelector('input[type="file"]');
    const file = new File(['content'], 'test.mp4', { type: 'video/mp4' });

    fireEvent.change(fileInput, { target: { files: [file] } });
    mockFileReader.onloadend({ target: { result: 'data:video/mp4;base64,/9j/4SumRXhpZgAATU' } });

    await waitFor(() => {
      expect(Util.uploadFile).toHaveBeenCalledWith(
        'data:video/mp4;base64,/9j/4SumRXhpZgAATU',
        undefined,
        'video'
      );
    });

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith({ value: 'someUrl', errors: [] });
    });
  });

  it('should not upload if file type is not supported', () => {
    Util.getFileType.mockReturnValue('not_supported');
    const { container } = renderVideo();

    const fileInput = container.querySelector('input[type="file"]');
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(mockShowNotification).toHaveBeenCalledWith(
      constants.errorMessage.fileTypeNotSupported,
      constants.messageType.error
    );
    expect(Util.uploadFile).not.toHaveBeenCalled();
  });

  it('should handle backend error response and show error message', async () => {
    const errorMessage = "The video format 'quicktime' is not supported.";
    Util.uploadFile.mockResolvedValue({
      json: () => Promise.resolve({
        error: {
          code: 'org.bahmni.module.bahmnicore:95',
          message: errorMessage,
        },
      }),
    });
    const { container } = renderVideo();

    const fileInput = container.querySelector('input[type="file"]');
    const file = new File(['content'], 'test.mov', { type: 'video/quicktime' });

    fireEvent.change(fileInput, { target: { files: [file] } });
    mockFileReader.onloadend({ target: { result: 'data:video/quicktime;base64,/9j/4SumRXhpZgAATU' } });

    await waitFor(() => {
      expect(mockShowNotification).toHaveBeenCalledWith(errorMessage, constants.messageType.error);
    });
    expect(mockOnControlAdd).not.toHaveBeenCalled();
  });

  it('should handle upload failure and show error notification', async () => {
    Util.uploadFile.mockImplementation(() => Promise.reject('Network error'));
    const { container } = renderVideo();

    const fileInput = container.querySelector('input[type="file"]');
    const file = new File(['content'], 'test.mp4', { type: 'video/mp4' });

    fireEvent.change(fileInput, { target: { files: [file] } });
    mockFileReader.onloadend({ target: { result: 'data:video/mp4;base64,/9j/4SumRXhpZgAATU' } });

    await waitFor(() => {
      expect(mockShowNotification).toHaveBeenCalledWith(
        constants.errorMessage.uploadFailed,
        constants.messageType.error
      );
    });
  });

  it('should display filename when value is set', () => {
    renderVideo({ value: 'patient/documents/test.mp4' });

    expect(screen.getByText('test.mp4')).toBeInTheDocument();
  });

  it('should show delete button when video is uploaded', () => {
    const { container } = renderVideo({ value: 'someValue' });

    expect(container.querySelector('.cds--file-close')).toBeInTheDocument();
  });

  it('should call onChange with undefined when delete is clicked', () => {
    const { container } = renderVideo({ value: 'someValue' });

    const deleteButton = container.querySelector('.cds--file-close');
    fireEvent.click(deleteButton);

    expect(mockOnChange).toHaveBeenCalledWith({ value: undefined, errors: [] });
  });

  it('should hide file row after delete clears the value', () => {
    const { container, rerender } = renderVideo({ value: 'someValue' });

    const deleteButton = container.querySelector('.cds--file-close');
    fireEvent.click(deleteButton);

    rerender(
      <Video
        addMore
        formFieldPath={formFieldPath}
        onChange={mockOnChange}
        onControlAdd={mockOnControlAdd}
        showNotification={mockShowNotification}
        validate={false}
        validations={[]}
        value={undefined}
      />
    );

    expect(container.querySelector('.file-row')).not.toBeInTheDocument();
  });

  it('should apply carbon-error class when validation fails', () => {
    const { container } = renderVideo({ validations: ['mandatory'] });

    const fileInput = container.querySelector('input[type="file"]');
    Object.defineProperty(fileInput, 'files', { value: undefined, configurable: true });
    fireEvent.change(fileInput, { target: { files: undefined } });

    expect(container.querySelector('.carbon-video-upload')).toHaveClass('carbon-error');
  });

  it('should not apply carbon-error class for add-more instance (formFieldPath suffix != 0)', () => {
    const { container } = renderVideo({
      validations: ['mandatory'],
      formFieldPath: 'test1.1/1-1',
    });

    const fileInput = container.querySelector('input[type="file"]');
    Object.defineProperty(fileInput, 'files', { value: undefined, configurable: true });
    fireEvent.change(fileInput, { target: { files: undefined } });

    expect(container.querySelector('.carbon-video-upload')).not.toHaveClass('carbon-error');
  });

  it('should disable file input when enabled is false', () => {
    const { container } = renderVideo({ enabled: false });

    const fileInput = container.querySelector('input[type="file"]');
    expect(fileInput).toBeDisabled();
  });

  it('should call onControlAdd without notification when value exists on mount', async () => {
    renderVideo({ value: 'someValue' });

    await waitFor(() => {
      expect(mockOnControlAdd).toHaveBeenCalledWith(formFieldPath, false);
    });
  });

  it('should not call onControlAdd when no value on mount', () => {
    renderVideo({ value: undefined });

    expect(mockOnControlAdd).not.toHaveBeenCalled();
  });

  it('should not call onControlAdd when addMore is false', () => {
    renderVideo({ addMore: false, value: 'someValue' });

    expect(mockOnControlAdd).not.toHaveBeenCalled();
  });

  it('should call onControlAdd with notification after successful upload', async () => {
    const { container } = renderVideo();

    const fileInput = container.querySelector('input[type="file"]');
    const file = new File(['content'], 'test.mp4', { type: 'video/mp4' });

    fireEvent.change(fileInput, { target: { files: [file] } });
    mockFileReader.onloadend({ target: { result: 'data:video/mp4;base64,/9j/4SumRXhpZgAATU' } });

    await waitFor(() => {
      expect(mockOnControlAdd).toHaveBeenCalledWith(formFieldPath, true);
    });
  });

  it('should show Loading indicator while uploading', async () => {
    const { container } = renderVideo();

    const fileInput = container.querySelector('input[type="file"]');
    const file = new File(['content'], 'test.mp4', { type: 'video/mp4' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(container.querySelector('.cds--loading')).toBeInTheDocument();
  });

  it('should display upload label and description text', () => {
    const { container } = renderVideo();

    const uploadLabel = container.querySelector('.upload-label');
    expect(uploadLabel).toHaveTextContent('Upload video');
    expect(screen.getByText(/Supported video formats/)).toBeInTheDocument();
  });
});
