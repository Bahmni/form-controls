import React, { Component, PropTypes } from 'react';

export class AddMore extends Component {

  showAdd() {
    if (this.props.canAdd) {
      return (
          <button className="form-builder-add-more" onClick={ this.props.onAdd } >
            <i className="fa fa-plus"></i>
          </button>
      );
    }
    return null;
  }

  showDelete() {
    if (this.props.canRemove) {
      return (
          <button className="form-builder-remove" onClick={ this.props.onRemove } >
            <i className="fa fa-remove"></i>
          </button>
      );
    }
    return null;
  }

  render() {
    return (
      <div className="form-builder-clone">
          { this.showAdd() }
          { this.showDelete() }
      </div>
    );
  }
}

AddMore.propTypes = {
  canAdd: PropTypes.bool.isRequired,
  canRemove: PropTypes.bool.isRequired,
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

