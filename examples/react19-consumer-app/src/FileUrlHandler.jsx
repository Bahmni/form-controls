import React from 'react';

/**
 * Minimal Complex-media handler for the BAH-4812 demo (Deskcheck #1 — file upload).
 *
 * A Complex obsControl delegates rendering to the component registered under its
 * `concept.conceptHandler`. The built-in ImageUrlHandler/VideoUrlHandler expect a
 * plain string URL, but the reverse FHIR transformer returns the richer object
 * `{ url, fileName, contentType }` (AC6 — "Complex control receives file URL,
 * name, and content type"). This handler renders that object read-only so the
 * pre-populated attachment is visible.
 *
 * Registered in App.jsx via ComponentStore.registerComponent('FileUrlHandler', ...).
 */
export function FileUrlHandler(props) {
  const { value } = props;

  if (!value || typeof value !== 'object' || !value.url) {
    return <span className="file-attachment-empty">No file attached</span>;
  }

  const { url, fileName, contentType } = value;
  const isImage = typeof contentType === 'string' && contentType.startsWith('image/');
  const isVideo = typeof contentType === 'string' && contentType.startsWith('video/');

  return (
    <div className="file-attachment">
      {isImage && (
        <a href={url} target="_blank" rel="noreferrer">
          <img
            src={url}
            alt={fileName || 'attachment'}
            style={{ maxWidth: '160px', maxHeight: '160px', display: 'block', marginBottom: '0.5rem' }}
          />
        </a>
      )}
      {isVideo && (
        <video
          src={url}
          controls
          style={{ maxWidth: '320px', maxHeight: '240px', display: 'block', marginBottom: '0.5rem' }}
        >
          {/* Fallback for browsers that cannot play the source */}
          <a href={url} target="_blank" rel="noreferrer">{fileName || url}</a>
        </video>
      )}
      <a href={url} target="_blank" rel="noreferrer">
        {fileName || url}
      </a>
      {contentType && (
        <span style={{ marginLeft: '0.5rem', color: '#666', fontSize: '0.85rem' }}>
          ({contentType})
        </span>
      )}
    </div>
  );
}

export default FileUrlHandler;
