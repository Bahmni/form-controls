import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Textarea from 'react-textarea-autosize';
import { Util } from 'src/helpers/Util';

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

  showCommentSection(isComplexMediaConcept) {
    if (this.state.showCommentSection || (isComplexMediaConcept && this.props.value)) {
      return (
        <div className="obs-comment-section-wrap">
          <div className="obs-control-field text-area-wrap">
          <Textarea
            id={this.props.conceptUuid}
            className="obs-comment-section fl"
            defaultValue={this.props.comment}
            maxLength="255"
            onChange={(e) => this.handleChange(e)}
            placeholder="Notes"
          />
          </div>
        </div>);
    }
    return null;
  }

  showCommentButton(isComplexMediaConcept) {
    if (isComplexMediaConcept) {
      return '';
    }
    return (<button
      className={classNames('form-builder-comment-toggle', 'form-builder-comment-button-toggle',
        { active: this.state.showCommentSection === true,
          'has-notes': this.state.hasNote === true })}
      onClick={() => this.setState({ showCommentSection: !this.state.showCommentSection })}
    >
      <i className="fa fa-file-o">
        <i className="fa fa-plus-circle" />
        <i className="fa fa-minus-circle" />
      </i>
      <i className="fa fa-file-text-o" />
    </button>);
  }

  render() {
    const { conceptHandler, datatype } = this.props;
    const isComplexMediaConcept = Util.isComplexMediaConcept({ conceptHandler, datatype });
    return (
      <div className="form-builder-comment-wrap">
        {this.showCommentButton(isComplexMediaConcept)}
        {this.showCommentSection(isComplexMediaConcept)}
      </div>
    );
  }
}

Comment.propTypes = {
  conceptUuid: PropTypes.string,
  comment: PropTypes.string,
  conceptHandler: PropTypes.string,
  datatype: PropTypes.string,
  onCommentChange: PropTypes.func.isRequired,
  value: PropTypes.string,
};

