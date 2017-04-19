import React, { Component, PropTypes } from 'react';
import ComponentStore from 'src/helpers/componentStore';
import { Validator } from 'src/helpers/Validator';

export class ComplexControl extends Component {
  render() {
    return (
        <div className="obs-comment-section-wrap">
          <input type="file"
          />
        </div>
    );
  }
}

ComponentStore.registerComponent('complex', ComplexControl);
