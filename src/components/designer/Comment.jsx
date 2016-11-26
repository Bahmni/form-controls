import React, { PureComponent } from 'react';

export class CommentDesigner extends PureComponent { // PureComponent has been added because of eslint post test prefer-stateless-function error.

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
