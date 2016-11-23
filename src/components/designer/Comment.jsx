import React, { Component } from 'react';
export class CommentDesigner extends Component {

  constructor() {
    super();
  }

  render() {
    return (
      <div className="fr">
        <button className="comment-toggle fr">
            <i className="fa fa-file-o">
              <i className="fa fa-plus-circle" />
            </i>
        </button>
      </div>
    );
  }
}
