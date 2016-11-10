import React, { Component } from 'react';

export class CommentDesigner extends Component {

  constructor() {
    super();
    this.state = { showCommentSection: false };
  }

  showCommentSection() {
    if (this.state.showCommentSection) {
      return (
        <textarea
          className="obs-comment-section"
          placeholder="Notes"
        />);
    }
    return null;
  }

  render() {
    return (
      <div>
        <button
          className="comment-toggle fr"
          onClick={() => this.setState({ showCommentSection: !this.state.showCommentSection })}
        >
          <i className="fa fa-file-o">
            <i className="fa fa-plus-circle" />
            <i className="fa fa-minus-circle" />
          </i>
          <i className="fa fa-file-text-o" />
        </button>
        {this.showCommentSection()}
      </div>
    );
  }
}
