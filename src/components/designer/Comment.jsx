/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React, { PureComponent } from 'react';
import classNames from 'classnames';
import Textarea from 'react-textarea-autosize';
export class CommentDesigner extends PureComponent { // PureComponent has been added because of eslint post test prefer-stateless-function error.

  constructor() {
    super();
    this.state = { showCommentSection: false };
  }
  showCommentSection() {
    if (this.state.showCommentSection) {
      return (
        <div className="obs-comment-section-wrap">
            <div className="obs-control-field">
              <Textarea
                className="obs-comment-section fl"
                placeholder="Notes"
              />
        </div>
        </div>);
    }
    return null;
  }

  render() {
    return (
        <div className="form-builder-comment-wrap">
            <button
              className={classNames('form-builder-comment-toggle',
                { active: this.state.showCommentSection === true })}
              onClick={() => this.setState({
                showCommentSection: !this.state.showCommentSection,
              })}
            >
                <i className="fa fa-file-o">
                    <i className="fa fa-plus-circle" />
                    <i className="fa fa-minus-circle" />
                </i>
            </button>
            {this.showCommentSection()}
        </div>
    );
  }
}
