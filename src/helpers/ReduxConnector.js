import React, { Component } from 'react';
import Provider, { connect } from 'react-redux';
import Container from 'src/components/Container.jsx';

export class ReduxConnector extends Component {
  constructor(props) {
    super(props);
    this.onValueChange = this.onValueChange.bind(this);
    this.containerRef = undefined;
  }

  onValueChange(obs, errors) {
    if (this.containerRef) {
      const observations = this.containerRef.getValue();
      //call dispatch
      this.props.
    }
  }

  render() {
    <Provider store={this.props.store}>
      <Container
        ref={e => this.containerRef = e}
        collapse={this.props.collapse}
        metadata={this.props.metadata}
        observations={this.props.observations}
        validate={this.props.validate}
      />
    </Provider>
  }
}

export default connect(state => state)(ReduxConnector);