import React, {PropTypes, Component} from 'react';

export class Container extends Component {
  constructor(props) {
    super(props);
    this.childControls = {};
    this.storeChildRef = this.storeChildRef.bind(this);
  }

  storeChildRef(ref) {
    if(ref) this.childControls[ref.props.metadata.id] = ref;
  }

  getValue() {
    const observations = [];
    for(const key in this.childControls) {
      if(this.childControls.hasOwnProperty(key)) {
        observations.push(this.childControls[key].getValue());
      }
    }
    return observations.filter(obs => obs !== undefined);
  }

  getObsForControl(control) {
    return this.props.observations.find((obs) => obs.formNameSpace.controlId === control.id);
  }

  getControls() {
    return this.props.metadata.controls.map((control) => {
      const component = componentStore.getRegisteredComponent(control.type);
      if (component) {
        const obs = this.getObsForControl(control);
        return React.createElement(component, {
          formUuid: this.props.metadata.uuid,
          key: control.id,
          metadata: control,
          obs,
          ref: this.storeChildRef
        });
      }
    }).filter(element => element !== undefined);
  }

  render() {
    return (
      <div>{this.getControls()}</div>
    );
  }
}

Container.propTypes = {
  metadata: PropTypes.shape({
    controls: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        type: PropTypes.string.isRequired,
      })).isRequired,
    id: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
  }),
  observations: PropTypes.array.isRequired,
};
