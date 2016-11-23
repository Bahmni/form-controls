import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
export class Comment extends Component {

  constructor(props) {
    super(props);
    this.state = { showCommentSection: false };
  }

  handleChange(e) {
    const value = e.target.value.trim() !== '' ? e.target.value.trim() : undefined;
    this.props.mapper.setComment(value);
  }

  showCommentSection() {
    if (this.state.showCommentSection) {
      const comment = this.props.mapper.getComment();
      return (
        <div className="obs-comment-section-wrap">
          <div className="label-wrap"></div>
          <textarea
            className="obs-comment-section fr"
            defaultValue={comment}
            maxLength="255"
            onChange={(e) => this.handleChange(e)}
            placeholder="Notes"
          />
        </div>);
    }
    return null;
  }

  render() {
    return (
      <div>
        <button
          className={classNames('comment-toggle', { active: this.state.showCommentSection === true })}
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

Comment.propTypes = {
  mapper: PropTypes.object.isRequired,
};

