import React, { PureComponent } from 'react';
import './style/AddMore.scss';

export class AddMoreDesigner extends PureComponent {

  render() {
    return (
      <div className="form-builder-clone">
        <button className="form-builder-add-more"><i className="fa fa-plus"></i></button>
        <button className="form-builder-remove"><i className="fa fa-remove"></i></button>
      </div>
    );
  }

}
