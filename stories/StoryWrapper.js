import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { JSONTree } from 'react-json-tree';

const styles = {
  wrap: {
    width: '100%',
    fontFamily: 'IBM Plex Sans, sans-serif',
  },
  canvas: {
    width: '100%',
    marginBottom: '24px',
  },
  jsonHeading: {
    margin: '0 0 4px',
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.32px',
    textTransform: 'uppercase',
    color: '#525252',
  },
  jsonPanel: {
    width: '100%',
    maxHeight: '320px',
    overflow: 'auto',
    background: '#f4f4f4',
    border: '1px solid #e0e0e0',
    borderRadius: '2px',
    padding: '4px 12px',
    fontSize: '0.75rem',
  },
};

const theme = {
  scheme: 'monokai',
  author: 'wimer hazenberg (http://www.monokai.nl)',
  base00: '#272822',
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#f8f8f2',
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672',
  base09: '#fd971f',
  base0A: '#f4bf75',
  base0B: '#a6e22e',
  base0C: '#a1efe4',
  base0D: '#66d9ef',
  base0E: '#ae81ff',
  base0F: '#cc6633',
};

const headerStyle = {
  padding: '8px 0 12px',
  marginBottom: '12px',
  borderBottom: '1px solid #e0e0e0',
  fontFamily: 'IBM Plex Sans, sans-serif',
  fontSize: '1rem',
  fontWeight: 600,
  color: '#161616',
};

export default class StoryWrapper extends PureComponent {

  render() {
    const { title, children, json } = this.props;
    return (<div style={styles.wrap}>
                <div style={styles.canvas}>
                    {title && <div style={headerStyle}>{title}</div>}
                    { children }
                </div>
                <div>
                    <p style={styles.jsonHeading}>Metadata</p>
                    <div style={styles.jsonPanel}>
                        <JSONTree
                          data={json}
                          theme={theme}
                          invertTheme
                          shouldExpandNodeInitially={(keyPath, data, level) => level < 3}
                        />
                    </div>
                </div>
            </div>);
  }

}

StoryWrapper.propTypes = {
  json: PropTypes.object.isRequired,
  title: PropTypes.string,
};
