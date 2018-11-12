import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class AddMore extends Component {

  showAdd() {
    if (this.props.canAdd) {
      return (
          <button className="form-builder-add-more"
            disabled={ !this.props.enabled }
            onClick={ this.props.onAdd }
          >
            <i className="fa fa-plus"></i>
          </button>
      );
    }
    return null;
  }

  showDelete() {
    if (this.props.canRemove) {
      return (
          <button className="form-builder-remove"
            disabled={ !this.props.enabled }
            onClick={ this.props.onRemove }
          >
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
  enabled: PropTypes.bool,
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};


AddMore.defaultProps = {
  enabled: true,
};
