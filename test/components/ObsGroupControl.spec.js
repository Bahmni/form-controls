import React, { Component, PropTypes } from 'react';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { ObsGroupControl } from 'components/ObsGroupControl.jsx';
import sinon from 'sinon';
import { Obs } from 'src/helpers/Obs';
import { ObsGroupMapper } from 'src/mapper/ObsGroupMapper';
import ComponentStore from 'src/helpers/componentStore';
import { Concept } from 'src/helpers/Concept';

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

describe('ObsGroupControl', () => {
  before(() => {
    ComponentStore.registerComponent('randomType', DummyControl);
  });

  after(() => {
    ComponentStore.deRegisterComponent('randomType');
  });

  const formName = 'formName';
  const formVersion = '1';
  const obsGroupConcept = {
    uuid: '70645842-be6a-4974-8d5f-45b52990e132',
    name: 'Pulse Data',
    datatype: 'N/A',
  };

  const metadata = {
    id: '1',
    type: 'obsGroupControl',
    concept: obsGroupConcept,
    properties: getLocationProperties(0, 0),
    label: {
      type: 'label',
      value: 'label',
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
  const observation = new Obs({
    concept: obsGroupConcept,
    groupMembers: [],
  });

  const obsGroupMapper = new ObsGroupMapper();

  describe('render', () => {
    it('should render obsGroup control collapse equals to true', () => {
      const wrapper = mount(
        <ObsGroupControl
          collapse
          formName={formName}
          formVersion={formVersion}
          mapper={obsGroupMapper}
          metadata={metadata}
          obs={observation}
          onValueChanged={onChangeSpy}
          validate={false}
        />);

      expect(wrapper).to.have.exactly(3).descendants('DummyControl');
      expect(wrapper.find('DummyControl').at(0).props().collapse).to.eql(true);
      expect(wrapper.find('DummyControl').at(1).props().collapse).to.eql(true);
    });

    it('should render obsGroup control with observations', () => {
      const wrapper = mount(
        <ObsGroupControl
          formName={formName}
          formVersion={formVersion}
          mapper={obsGroupMapper}
          metadata={metadata}
          obs={observation}
          onValueChanged={onChangeSpy}
          validate={false}
        />);

      expect(wrapper.find('legend').text()).to.eql(metadata.label.value);
      expect(wrapper).to.have.exactly(3).descendants('DummyControl');
    });


    it('should render obsGroup control with only the registered controls', () => {
      ComponentStore.deRegisterComponent('randomType');
      const wrapper = mount(
        <ObsGroupControl
          formName={formName}
          formVersion={formVersion}
          mapper={obsGroupMapper}
          metadata={metadata}
          obs={observation}
          onValueChanged={onChangeSpy}
          validate={false}
        />);

      expect(wrapper).to.not.have.descendants('DummyControl');
      ComponentStore.registerComponent('randomType', DummyControl);
    });


    it('should collapse all child controls on click of collapse icon', () => {
      const wrapper = mount(
        <ObsGroupControl
          collapse={false}
          formName={formName}
          formVersion={formVersion}
          mapper={obsGroupMapper}
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
        <ObsGroupControl
          collapse={false}
          formName={formName}
          formVersion={formVersion}
          mapper={obsGroupMapper}
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

    it('should render obsGroup with addMore icon when has addMore properties', () => {
      const newProperties = Object.assign({}, metadata.properties, { addMore: true });
      const newMetadata = Object.assign({}, metadata, { properties: newProperties });

      const wrapper = mount(
        <ObsGroupControl
          collapse
          formName={formName}
          formVersion={formVersion}
          mapper={obsGroupMapper}
          metadata={newMetadata}
          obs={observation}
          onValueChanged={onChangeSpy}
          validate={false}
        />);

      expect(wrapper).to.have.descendants('AddMore');
    });

    it('should trigger onChange in obsGroup if its child obs has changed', () => {
      const pulseNumericConcept = {
        name: 'Pulse',
        uuid: 'pulseUuid',
        datatype: 'Numeric',
        conceptClass: 'Misc',
      };

      const metadataUpdated = {
        id: '1',
        type: 'obsGroupControl',
        concept: obsGroupConcept,
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

      const pulseDataObs = new Obs({
        concept: {
          name: 'Pulse Data',
          uuid: 'pulseDataUuid',
          datatype: 'Misc',
        },
        groupMembers: [
          new Obs({
            concept: pulseNumericConcept,
            value: 10, formFieldPath: 'formName.1/100-0', uuid: 'childObs1Uuid',
          })],
        formFieldPath: 'formName.1/1-0', uuid: 'pulseDataObsUuid',
      });

      const wrapper = mount(
        <ObsGroupControl
          formName={formName}
          formVersion={formVersion}
          mapper={obsGroupMapper}
          metadata={metadataUpdated}
          obs={pulseDataObs}
          onValueChanged={onChangeSpy}
          validate={false}
        />);
      const pulseNumericUpdated = pulseNumericObs.setValue(20);
      const instance = wrapper.instance();
      instance.onChange(pulseNumericUpdated, []);
      const updatedObs = wrapper.props()
        .mapper.setValue(instance.state.obs, pulseNumericUpdated, []);
      sinon.assert.calledOnce(
        onChangeSpy.withArgs(updatedObs, []));
    });

    it('should add more obs group when click obs group add more in obs group', () => {
      const newFormName = '3042_1';
      const newFormVersion = '2';
      const pulseDataMetadata = {
        "concept": {
          "datatype": "N/A",
          "name": "Pulse Data",
          "setMembers": [
            {
              "datatype": "Numeric",
              "name": "Pulse(/min)",
              "properties": {
                "allowDecimal": true
              },
              "uuid": "c36bc411-3f10-11e4-adec-0800271c1b75"
            },
            {
              "datatype": "N/A",
              "name": "TestGroup",
              "setMembers": [
                {
                  "datatype": "Numeric",
                  "name": "TestObs",
                  "properties": {
                    "allowDecimal": false
                  },
                  "uuid": "d0490af4-72eb-4090-9b43-ac3487ba7474"
                }
              ],
              "uuid": "eafe7d68-904b-459b-b11d-6502ec0143a4"
            }
          ],
          "uuid": "c36af094-3f10-11e4-adec-0800271c1b75"
        },
        "controls": [
          {
            "concept": {
              "datatype": "Numeric",
              "name": "Pulse(/min)",
              "properties": {
                "allowDecimal": true
              },
              "uuid": "c36bc411-3f10-11e4-adec-0800271c1b75"
            },
            "id": "7",
            "label": {
              "type": "label",
              "value": "Pulse(/min)"
            },
            "properties": {
              "addMore": false,
              "hideLabel": false,
              "location": {
                "column": 0,
                "row": 0
              },
              "mandatory": false,
              "notes": false
            },
            "type": "obsControl",
          },
          {
            "concept": {
              "datatype": "N/A",
              "name": "TestGroup",
              "setMembers": [
                {
                  "datatype": "Numeric",
                  "name": "TestObs",
                  "properties": {
                    "allowDecimal": false
                  },
                  "uuid": "d0490af4-72eb-4090-9b43-ac3487ba7474"
                }
              ],
              "uuid": "eafe7d68-904b-459b-b11d-6502ec0143a4"
            },
            "controls": [
              {
                "concept": {
                  "datatype": "Numeric",
                  "name": "TestObs",
                  "properties": {
                    "allowDecimal": false
                  },
                  "uuid": "d0490af4-72eb-4090-9b43-ac3487ba7474"
                },
                "id": "8",
                "label": {
                  "type": "label",
                  "value": "TestObs"
                },
                "properties": {
                  "addMore": false,
                  "hideLabel": false,
                  "location": {
                    "column": 0,
                    "row": 0
                  },
                  "mandatory": false,
                  "notes": false
                },
                "type": "obsControl",
              }
            ],
            "id": "9",
            "label": {
              "type": "label",
              "value": "TestGroup"
            },
            "properties": {
              "abnormal": false,
              "addMore": true,
              "location": {
                "column": 0,
                "row": 0
              }
            },
            "type": "obsGroupControl"
          }
        ],
        "id": "6",
        "label": {
          "type": "label",
          "value": "Pulse Data"
        },
        "properties": {
          "abnormal": false,
          "addMore": false,
          "location": {
            "column": 0,
            "row": 0
          }
        },
        "type": "obsGroupControl"
      };
      const pulseDataConcept = {
        "datatype": "N/A",
        "name": "Pulse Data",
        "setMembers": [
          {
            "datatype": "Numeric",
            "name": "Pulse(/min)",
            "properties": {
              "allowDecimal": true
            },
            "uuid": "c36bc411-3f10-11e4-adec-0800271c1b75"
          },
          {
            "datatype": "N/A",
            "name": "TestGroup",
            "setMembers": [
              {
                "datatype": "Numeric",
                "name": "TestObs",
                "properties": {
                  "allowDecimal": false
                },
                "uuid": "d0490af4-72eb-4090-9b43-ac3487ba7474"
              }
            ],
            "uuid": "eafe7d68-904b-459b-b11d-6502ec0143a4"
          }
        ],
        "uuid": "c36af094-3f10-11e4-adec-0800271c1b75"
      };
      const pulseDataObs = new Obs({
        concept: new Concept(pulseDataConcept),
        formFieldPath: '3042_1.2/6-0',
        groupMembers: undefined,
      });

      const wrapper = mount(
        <ObsGroupControl
          collapse
          formName={newFormName}
          formVersion={newFormVersion}
          mapper={obsGroupMapper}
          metadata={pulseDataMetadata}
          obs={pulseDataObs}
          onValueChanged={onChangeSpy}
          validate={false}
        />);

      const exceptGroupMembersLength = wrapper.state().obs.groupMembers.size + 1;
      wrapper.find('.form-builder-add-more').simulate('click');

      expect(wrapper.state().obs.groupMembers.size).to.equal(exceptGroupMembersLength);
    });
  });
});
