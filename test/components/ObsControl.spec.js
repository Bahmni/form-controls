import React from 'react';
import { mount, shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { ObsControl } from 'components/ObsControl.jsx';
import { TextBox } from 'components/TextBox.jsx';
import { NumericBox } from 'components/NumericBox.jsx';

chai.use(chaiEnzyme());

describe('ObsControl', () => {
  before(() => {
    window.componentStore.registerComponent('obsControl', ObsControl);
    window.componentStore.registerComponent('text', TextBox);
    window.componentStore.registerComponent('numeric', NumericBox);
  });

  after(() => {
    window.componentStore.deRegisterComponent('obsControl');
    window.componentStore.deRegisterComponent('text');
    window.componentStore.deRegisterComponent('numeric');
  });

  function getConcept(datatype) {
    return {
      uuid: '70645842-be6a-4974-8d5f-45b52990e132',
      name: 'Pulse',
      datatype,
    };
  }

  const label = {
    id: 'someId',
    value: 'someLabelName',
    type: 'label',
  };

  const formUuid = 'someFormUuid';

  const formNamespace = `${formUuid}/100`;

  const properties = { location: { row: 0, column: 1 } };

  it('should render TextBox with Label', () => {
    const metadata = {
      id: '100',
      type: 'obsControl',
      concept: getConcept('Text'),
      label,
      properties,
    };

    const wrapper = mount(<ObsControl errors={[]} formUuid={formUuid} metadata={metadata} />);
    expect(wrapper).to.have.exactly(1).descendants('Label');
    expect(wrapper).to.have.exactly(1).descendants('TextBox');
    expect(wrapper.find('input').at(0).props().type).to.be.eql('text');
  });

  it('should render NumericBox', () => {
    const metadata = {
      id: '100',
      type: 'obsControl',
      concept: getConcept('Numeric'),
      label,
      properties,
    };

    const wrapper = mount(<ObsControl errors={[]} formUuid={formUuid} metadata={metadata} />);
    expect(wrapper).to.have.exactly(1).descendants('Label');
    expect(wrapper).to.have.exactly(1).descendants('NumericBox');
    expect(wrapper.find('input').at(0).props().type).to.be.eql('number');
  });

  it('should render child control with error when present', () => {
    const metadata = {
      id: '100',
      type: 'obsControl',
      concept: getConcept('Numeric'),
      label,
      properties: { mandatory: true },
    };

    const errors = [{ controlId: '100', errorType: 'mandatory' }];
    const wrapper = mount(<ObsControl errors={[]} formUuid={formUuid} metadata={metadata} />);
    wrapper.setProps({ errors });
    expect(wrapper.find('input').at(0)).to.have.className('form-builder-error');
    expect(wrapper.find('span').text()).to.eql('*');
    expect(wrapper.find('span')).to.have.className('form-builder-asterisk');
  });

  it('should not render child control with error when there are no errors for control', () => {
    const metadata = {
      id: '100',
      type: 'obsControl',
      concept: getConcept('Numeric'),
      label,
      properties: {},
    };

    const errors = [{ controlId: 'somethingElse', errorType: 'mandatory' }];
    const wrapper = mount(<ObsControl errors={errors} formUuid={formUuid} metadata={metadata} />);
    expect(wrapper.find('input').at(0)).to.not.have.className('form-builder-error');
    expect(wrapper).to.not.have.descendants('span');
  });

  it('should return null when registered component not found', () => {
    const metadata = {
      id: '100',
      type: 'obsControl',
      concept: getConcept('someRandomComponentType'),
      label,
      properties,
    };

    const wrapper = shallow(<ObsControl errors={[]} formUuid={formUuid} metadata={metadata} />);
    expect(wrapper).to.be.blank();
  });

  it('should return the obsControl value', () => {
    const metadata = {
      id: '100',
      type: 'obsControl',
      concept: getConcept('text'),
      label,
      properties,
    };

    const obs = {
      value: 'someInputValue',
      observationDateTime: '2016-09-08T10:10:38.000+0530',
    };

    const expectedObs = new Obs(formUuid,metadata,obs);

    const obsControl = mount(
      <ObsControl errors={[]} formUuid={formUuid} metadata={metadata} obs={obs} />
    );
    const instance = obsControl.instance();
    const obsControlValue = instance.getValue();

    console.log(obsControlValue);
    console.log(expectedObs);

    // expect(obsControlValue).to.deep.eql(expectedObs);
  });

  it('should return the child control errors', () => {
    const metadata = {
      id: '100',
      type: 'obsControl',
      concept: getConcept('text'),
      label,
      properties,
    };

    const obsControl = shallow(<ObsControl errors={[]} formUuid={formUuid} metadata={metadata} />);
    const instance = obsControl.instance();
    instance.childControl = { getErrors: () => [{ errorType: 'something' }] };

    const obsControlValue = instance.getErrors();
    expect(obsControlValue).to.deep.eql([{ errorType: 'something' }]);
  });
});
