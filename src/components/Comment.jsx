import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
export class Comment extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showCommentSection: false,
      hasNote: props.comment && props.comment.length > 0,
    };
  }

  handleChange(e) {
    const value = e.target.value.trim() !== '' ? e.target.value.trim() : undefined;
    this.setState({
      hasNote: value && value.length > 0,
    });
    this.props.onCommentChange(value);
  }

  showCommentSection() {
    if (this.state.showCommentSection) {
      return (
        <div className="obs-comment-section-wrap">
          <div className="label-wrap"></div>
          <textarea
            className="obs-comment-section fl"
            defaultValue={this.props.comment}
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
          className={classNames('form-builder-comment-toggle',
            { active: this.state.showCommentSection === true,
              'has-notes': this.state.hasNote === true })}
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
  comment: PropTypes.string,
  onCommentChange: PropTypes.func.isRequired,
};

