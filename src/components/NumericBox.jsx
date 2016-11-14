import React, {Component, PropTypes} from "react";
import "src/helpers/componentStore";
import {Validator} from "src/helpers/Validator";
import {hasError} from "src/helpers/controlsHelper";
import classNames from "classnames";

export class NumericBox extends Component {
  constructor(props) {
    super(props);
    this._hasErrors = this._hasErrors.bind(this);
    this._getErrors = this._getErrors.bind(this);
    this.state = { hasErrors: this._hasErrors(this.props.errors) };
  }

  shouldComponentUpdate(nextProps,nextState){
    if(this.props.value === nextProps.value && this.props.errors === nextProps.errors){
      return false;
    }
    return true;
  }

  componentDidUpdate(prevProps, prevState){
    console.log("The component with value ["+ prevProps.value +"] is updated!!");
  }

  handleChange(e) {
    this.setState({ hasErrors: this._hasErrors(this._getErrors())});
    this.props.onChange(e.target.value, this._getErrors());
  }

  _hasErrors(errors){
    return errors.length > 0 ? true : false;
  }

  _getErrors(){
    //This is temporary and need to be integrated to Validator and made more generic!!!
    const errors = [];
    return errors;
  }

  render() {
    return (
      <input
        className={classNames({ 'form-builder-error': this.state.hasErrors })}
        onChange={(e) => this.handleChange(e)}
        defaultValue = { this.props.value }
        type="number"
      />
    );
  }
}

NumericBox.propTypes = {
  errors: PropTypes.array.isRequired,
  value: PropTypes.string,
  validations: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
};

window.componentStore.registerComponent('numeric', NumericBox);
