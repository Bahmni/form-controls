import React, { Component, PropTypes } from 'react';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { Section } from 'components/Section.jsx';
import sinon from 'sinon';
import { Obs } from 'src/helpers/Obs';
import { ObsList } from 'src/helpers/ObsList';
import { SectionMapper } from 'src/mapper/SectionMapper';
import ComponentStore from 'src/helpers/componentStore';
import { ObsControl } from 'components/ObsControl.jsx';
import { NumericBox } from 'components/NumericBox.jsx';
import { List } from 'immutable';
import { Label } from 'components/Label.jsx';

chai.use(chaiEnzyme());

function getLocationProperties(row, column) {
  return { location: { row, column } };
}

class DummyControl extends Component {
  getValue() {
    return { uuid: this.props.formUuid };
  }

  render() {
    return (<div>{ this.props.formUuid }</div>);
  }
}

DummyControl.propTypes = {
  formUuid: PropTypes.string,
};

describe('Section', () => {
  before(() => {
    ComponentStore.registerComponent('randomType', DummyControl);
    ComponentStore.registerComponent('obsControl', ObsControl);
    ComponentStore.registerComponent('numeric', NumericBox);
    ComponentStore.registerComponent('label', Label);
  });

  after(() => {
    ComponentStore.deRegisterComponent('randomType');
    ComponentStore.deRegisterComponent('obsControl');
    ComponentStore.deRegisterComponent('numeric');
    ComponentStore.deRegisterComponent('label');
  });

  const label = {
    id: 'someId',
    value: 'someValue',
    type: 'label',
  };

  const formName = 'formName';
  const formVersion = '1';

  const metadata = {
    id: '1',
    type: 'section',
    properties: getLocationProperties(0, 0),
    label: {
      type: 'label',
      value: 'section label',
    },
    controls: [
      {
        id: '100',
        type: 'randomType',
        properties: getLocationProperties(0, 1),
      },
      {
        id: '101',
        type: 'randomType',
        properties: getLocationProperties(0, 2),
      },
      {
        id: '102',
        type: 'randomType',
        properties: getLocationProperties(1, 0),
      },
    ],
  };
  const onChangeSpy = sinon.spy();
  const observation = new ObsList();
  const sectionMapper = new SectionMapper();

  describe('render', () => {
    it('should render section control collapse equal to true', () => {
      const wrapper = mount(
        <Section
          collapse
          formName={formName}
          formVersion={formVersion}
          mapper={sectionMapper}
          metadata={metadata}
          obs={observation}
          onValueChanged={onChangeSpy}
          validate={false}
        />);

      expect(wrapper).to.have.exactly(3).descendants('DummyControl');
      expect(wrapper.find('DummyControl').at(0).props().collapse).to.eql(true);
      expect(wrapper.find('DummyControl').at(1).props().collapse).to.eql(true);
    });

    it('should render section control', () => {
      const wrapper = mount(
        <Section
          formName={formName}
          formVersion={formVersion}
          mapper={sectionMapper}
          metadata={metadata}
          obs={observation}
          onValueChanged={onChangeSpy}
          validate={false}
        />);


      expect(wrapper.find('legend').text()).to.eql(metadata.label.value);
      expect(wrapper).to.have.exactly(3).descendants('DummyControl');
    });

    it('should render section control with observations', () => {
      const observations = (new ObsList()).setObsList((new List()).push(
        new Obs({ formFieldPath: 'formName.1/100-0', value: '72' })
      ));

      const wrapper = mount(
          <Section
            formName={formName}
            formVersion={formVersion}
            mapper={sectionMapper}
            metadata={metadata}
            obs={observations}
            onValueChanged={onChangeSpy}
            validate={false}
          />);

      expect(wrapper.find('legend').text()).to.eql(metadata.label.value);
      expect(wrapper).to.have.exactly(3).descendants('DummyControl');
      expect(wrapper.find('DummyControl').at(0).props().obs.value).to.eql('72');
      expect(wrapper.find('DummyControl').at(1).props().obs.value).to.eql(undefined);
      expect(wrapper.find('DummyControl').at(2).props().obs.value).to.eql(undefined);
    });

    it('should render section control with only the registered controls', () => {
      ComponentStore.deRegisterComponent('randomType');
      const wrapper = mount(
          <Section
            formName={formName}
            formVersion={formVersion}
            mapper={sectionMapper}
            metadata={metadata}
            obs={observation}
            onValueChanged={onChangeSpy}
            validate={false}
          />);

      expect(wrapper).to.not.have.descendants('DummyControl');
      ComponentStore.registerComponent('randomType', DummyControl);
    });

    it('should render one more control after click \'+\' button', () => {
      const pulseNumericConcept = {
        name: 'Pulse',
        uuid: 'pulseUuid',
        datatype: 'Numeric',
        conceptClass: 'Misc',
      };

      const metadata2 = {
        id: '1',
        type: 'section',
        properties: getLocationProperties(0, 0),
        label: {
          type: 'label',
          value: 'label',
        },
        controls: [
          {
            id: '100',
            type: 'obsControl',
            label,
            concept: pulseNumericConcept,
            properties: {
              ...getLocationProperties(0, 0),
              addMore: true,
            },
          },
        ],
      };

      const pulseNumericObs0 = new Obs({
        concept: pulseNumericConcept,
        value: '10', formFieldPath: 'formName.1/100-0', uuid: 'childObs1Uuid',
      });

      const obsList = (new ObsList).setObsList(new List().push(pulseNumericObs0));

      const wrapper = mount(
        <Section
          formName={formName}
          formVersion={formVersion}
          mapper={sectionMapper}
          metadata={metadata2}
          obs={obsList}
          onValueChanged={onChangeSpy}
          validate={false}
        />);

      expect(wrapper).to.have.exactly(1).descendants('ObsControl');
      expect(wrapper.find('ObsControl')).to.have.exactly(1).descendants('AddMore');
      expect(wrapper.find('AddMore')).to.have.exactly(1).descendants('button');
      expect(wrapper.find('input').node.value).to.eql('10');

      wrapper.find('.fa').at(2).simulate('click');

      expect(wrapper).to.have.exactly(2).descendants('ObsControl');
      expect(wrapper.find('ObsControl').at(0).find('AddMore')).to.not.have.descendants('button');
      expect(wrapper.find('ObsControl').at(1)).to.have.exactly(1).descendants('AddMore');
      expect(wrapper.find('ObsControl').at(1).find('AddMore'))
        .to.have.exactly(2).descendants('button');
      expect(wrapper).to.have.exactly(2).descendants('input');
      expect(wrapper.find('input').at(1).node.value).to.eql('undefined');
    });

    it('should render delete control after click \'x\' button', () => {
      const pulseNumericConcept = {
        name: 'Pulse',
        uuid: 'pulseUuid',
        datatype: 'Numeric',
        conceptClass: 'Misc',
      };

      const metadata2 = {
        id: '1',
        type: 'section',
        properties: getLocationProperties(0, 0),
        label: {
          type: 'label',
          value: 'label',
        },
        controls: [
          {
            id: '100',
            type: 'obsControl',
            label,
            concept: pulseNumericConcept,
            properties: {
              ...getLocationProperties(0, 0),
              addMore: true,
            },
          },
        ],
      };

      const pulseNumericObs0 = new Obs({
        concept: pulseNumericConcept,
        value: '10', formFieldPath: 'formName.1/100-0', uuid: 'childObs1Uuid',
      });
      const pulseNumericObs1 = new Obs({
        concept: pulseNumericConcept,
        value: '10', formFieldPath: 'formName.1/100-1', uuid: 'childObs1Uuid',
      });

      const obsList = (new ObsList).setObsList(new List()
        .push(pulseNumericObs0)
        .push(pulseNumericObs1));

      const wrapper = mount(
        <Section
          formName={formName}
          formVersion={formVersion}
          mapper={sectionMapper}
          metadata={metadata2}
          obs={obsList}
          onValueChanged={onChangeSpy}
          validate={false}
        />);

      expect(wrapper).to.have.exactly(2).descendants('ObsControl');
      expect(wrapper.find('ObsControl').at(0).find('AddMore')).to.not.have.descendants('button');
      expect(wrapper.find('ObsControl').at(1)).to.have.exactly(1).descendants('AddMore');
      expect(wrapper.find('ObsControl').at(1).find('AddMore'))
        .to.have.exactly(2).descendants('button');
      expect(wrapper.find('input').at(0).node.value).to.eql('10');
      expect(wrapper.find('input').at(1).node.value).to.eql('10');

      wrapper.find('button').at(1).simulate('click');

      expect(wrapper).to.have.exactly(1).descendants('ObsControl');
      expect(wrapper.find('ObsControl')).to.have.exactly(1).descendants('AddMore');
      expect(wrapper.find('AddMore')).to.have.exactly(1).descendants('button');
      expect(wrapper.find('input').node.value).to.eql('10');
    });

    it('should collapse all child controls on click of collapse icon', () => {
      const wrapper = mount(
        <Section
          collapse={false}
          formName={formName}
          formVersion={formVersion}
          mapper={sectionMapper}
          metadata={metadata}
          obs={observation}
          onValueChanged={onChangeSpy}
          validate={false}
        />);

      expect(wrapper.find('legend').props().className).to.eql('form-builder-toggle active');
      expect(wrapper.find('div').at(0).props().className)
        .to.eql('obsGroup-controls active-group-controls');

      wrapper.find('legend').simulate('click');

      expect(wrapper.find('legend').props().className).to.eql('form-builder-toggle ');
      expect(wrapper.find('div').at(0).props().className)
        .to.eql('obsGroup-controls closing-group-controls');
    });


    it('should collapse all child controls on change of collapse props', () => {
      const wrapper = mount(
        <Section
          collapse={false}
          formName={formName}
          formVersion={formVersion}
          mapper={sectionMapper}
          metadata={metadata}
          obs={observation}
          onValueChanged={onChangeSpy}
          validate={false}
        />);

      expect(wrapper.find('legend').props().className).to.eql('form-builder-toggle active');
      expect(wrapper.find('div').at(0).props().className)
        .to.eql('obsGroup-controls active-group-controls');

      wrapper.setProps({ collapse: true });

      expect(wrapper.find('legend').props().className).to.eql('form-builder-toggle ');
      expect(wrapper.find('div').at(0).props().className)
        .to.eql('obsGroup-controls closing-group-controls');
    });

    it('should collapse all child controls on change of collapse state', () => {
      const wrapper = mount(
        <Section
          collapse={false}
          formName={formName}
          formVersion={formVersion}
          mapper={sectionMapper}
          metadata={metadata}
          obs={observation}
          onValueChanged={onChangeSpy}
          validate={false}
        />);

      expect(wrapper.find('legend').props().className).to.eql('form-builder-toggle active');
      expect(wrapper.find('div').at(0).props().className)
        .to.eql('obsGroup-controls active-group-controls');

      wrapper.setState({ collapse: false });
      wrapper.setProps({ collapse: true });

      expect(wrapper.find('legend').props().className).to.eql('form-builder-toggle ');
      expect(wrapper.find('div').at(0).props().className)
        .to.eql('obsGroup-controls closing-group-controls');
    });

    it('should trigger onChange in section if its child obs has changed', () => {
      const pulseNumericConcept = {
        name: 'Pulse',
        uuid: 'pulseUuid',
        datatype: 'Numeric',
        conceptClass: 'Misc',
      };

      const metadataUpdated = {
        id: '1',
        type: 'section',

        properties: getLocationProperties(0, 0),
        label: {
          type: 'label',
          value: 'label',
        },
        controls: [
          {
            id: '100',
            type: 'randomType',
            concept: pulseNumericConcept,
            properties: getLocationProperties(0, 1),
          },
        ],
      };

      const pulseNumericObs = new Obs({
        concept: pulseNumericConcept,
        value: 10, formFieldPath: 'formName.1/100-0', uuid: 'childObs1Uuid',
      });

      const obsList = (new ObsList).setObsList(new List().push(pulseNumericObs));

      const wrapper = mount(
        <Section
          formName={formName}
          formVersion={formVersion}
          mapper={sectionMapper}
          metadata={metadataUpdated}
          obs={obsList}
          onValueChanged={onChangeSpy}
          validate={false}
        />);
      const pulseNumericUpdated = pulseNumericObs.setValue(20);
      const instance = wrapper.instance();
      instance.onChange(pulseNumericUpdated, []);
      const updatedObs = wrapper.props()
        .mapper.setValue(instance.state.obs, pulseNumericUpdated);
      sinon.assert.calledOnce(
        onChangeSpy.withArgs(updatedObs, []));
    });
  });
});
