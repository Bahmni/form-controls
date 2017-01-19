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
            <div className="label-wrap"></div>
            <Textarea
              className="obs-comment-section fl"
              placeholder="Notes"
            />
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
