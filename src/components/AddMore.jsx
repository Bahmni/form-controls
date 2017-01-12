import React, { Component, PropTypes } from 'react';

export class AddMore extends Component {

  showAdd() {
    if (this.props.canAdd) {
      return (
          <button onClick={ this.props.onAdd } >
            +
          </button>
      );
    }
    return null;
  }

  showDelete() {
    if (this.props.canRemove) {
      return (
          <button onClick={ this.props.onRemove } >
            -
          </button>
      );
    }
    return null;
  }

  render() {
    return (
      <div>
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

