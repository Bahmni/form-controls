import React from 'react';
import { List } from 'immutable';
import { shallow, mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { Container } from 'components/Container.jsx';
import { Label } from 'components/Label.jsx';
import { TextBox } from 'components/TextBox.jsx';
import { NumericBox } from 'components/NumericBox.jsx';
import { Button } from 'components/Button.jsx';
import { ObsControl } from 'components/ObsControl.jsx';
import { ObsGroupControl } from 'components/ObsGroupControl.jsx';
import { CodedControl } from 'components/CodedControl.jsx';
import {ControlRecord} from "../../src/helpers/ControlRecordTreeBuilder";

chai.use(chaiEnzyme());

describe('Container', () => {

  before(() => {
    componentStore.registerComponent('label', Label);
    componentStore.registerComponent('text', TextBox);
    componentStore.registerComponent('numeric', NumericBox);
    componentStore.registerComponent('button', Button);
    componentStore.registerComponent('Coded', CodedControl);
    componentStore.registerComponent('obsControl', ObsControl);
    componentStore.registerComponent('obsGroupControl', ObsGroupControl);
  });

  after(() => {
    componentStore.deRegisterComponent('label');
    componentStore.deRegisterComponent('text');
    componentStore.deRegisterComponent('numeric');
    componentStore.deRegisterComponent('button');
    componentStore.deRegisterComponent('Coded');
    componentStore.deRegisterComponent('obsControl');
    componentStore.deRegisterComponent('obsGroupControl');
  });


  describe('Single layer', () => {
    const metadata = {
      "controls": [
        {
          "concept": {
            "answers": [],
            "datatype": "Numeric",
            "description": [],
            "name": "Pulse",
            "properties": {
              "allowDecimal": true
            },
            "uuid": "c36bc411-3f10-11e4-adec-0800271c1b75"
          },
          "hiAbsolute": null,
          "hiNormal": 72,
          "id": "1",
          "label": {
            "type": "label",
            "value": "Pulse(/min)"
          },
          "lowAbsolute": null,
          "lowNormal": 72,
          "properties": {
            "addMore": true,
            "hideLabel": false,
            "location": {
              "column": 0,
              "row": 0
            },
            "mandatory": true,
            "notes": false
          },
          "type": "obsControl",
          "units": "/min"
        }
      ],
      "id": 209,
      "name": "SingleObs",
      "uuid": "245940b7-3d6b-4a8b-806b-3f56444129ae",
      "version": "1"
    };

    const formFieldPath = 'SingleObs.1/1-0';
    const childRecord = new ControlRecord({
      control: {
        "concept": {
          "answers": [],
          "datatype": "Numeric",
          "description": [],
          "name": "Pulse",
          "properties": {
            "allowDecimal": true
          },
          "uuid": "c36bc411-3f10-11e4-adec-0800271c1b75"
        },
        "hiAbsolute": null,
        "hiNormal": 72,
        "id": "1",
        "label": {
          "type": "label",
          "value": "Pulse(/min)"
        },
        "lowAbsolute": null,
        "lowNormal": 72,
        "properties": {
          "addMore": true,
          "hideLabel": false,
          "location": {
            "column": 0,
            "row": 0
          },
          "mandatory": true,
          "notes": false
        },
        "type": "obsControl",
        "units": "/min"
      },
      formFieldPath: formFieldPath,
      value: {value: 1, comment: undefined},
      dataSource: {
        "abnormal": null,
        "comment": null,
        "concept": {
          "conceptClass": "Misc",
          "dataType": "Numeric",
          "hiNormal": 72,
          "lowNormal": 72,
          "mappings": [],
          "name": "Pulse",
          "set": false,
          "shortName": "Pulse",
          "units": "/min",
          "uuid": "c36bc411-3f10-11e4-adec-0800271c1b75"
        },
        "conceptNameToDisplay": "Pulse",
        "conceptSortWeight": 1,
        "conceptUuid": "c36bc411-3f10-11e4-adec-0800271c1b75",
        "creatorName": "Super Man",
        "duration": null,
        "encounterDateTime": 1488523999000,
        "encounterUuid": "8b5f9862-ce75-4d31-bf41-1c47d58c7444",
        "formFieldPath": "SingleObs.1/1-0",
        "formNamespace": "Bahmni",
        "groupMembers": [],
        "hiNormal": 72,
        "isAbnormal": null,
        "lowNormal": 72,
        "obsGroupUuid": null,
        "observationDateTime": "2017-03-03T06:53:19.000+0000",
        "orderUuid": null,
        "parentConceptUuid": null,
        "providers": [
          {
            "encounterRoleUuid": "a0b03050-c99b-11e0-9572-0800200c9a66",
            "name": "Super Man",
            "uuid": "c1c26908-3f10-11e4-adec-0800271c1b75"
          }
        ],
        "targetObsRelation": null,
        "type": "Numeric",
        "unknown": false,
        "uuid": "1c2b18ec-ad88-44e5-ae34-3b0e88240a93",
        "value": undefined,
        "valueAsString": "1.0",
        "visitStartDateTime": null,
        "voidReason": null,
        "voided": false
      },
    });
    const recordTree = new ControlRecord({children: List.of(childRecord)});

    it('should render a control when given single layer tree data', () => {
      const wrapper = mount(
        <Container
          collapse
          metadata={metadata}
          observations={[]}
          validate={false}
        />
      );

      wrapper.setState({data: recordTree});

      expect(wrapper).to.have.exactly(1).descendants('ObsControl');
    });

    it('should change state when onValueChanged is triggered', () => {
      const wrapper = shallow(
        <Container
          collapse
          metadata={metadata}
          observations={[]}
          validate={false}
        />
      );
      const changedValue = {value: '1', comment:undefined};

      // const update = sinon.stub(wrapper.state().data, 'update').returns(recordTree);

      wrapper.instance().onValueChanged(formFieldPath, changedValue);

      // update.restore();

      const obsControlRecord = wrapper.state().data.children.get(0);
      expect(obsControlRecord.value).to.equal(changedValue);
    });

    it('should update dataSource value when getValue is triggered', () => {
      const wrapper = mount(
        <Container
          collapse
          metadata={metadata}
          observations={[]}
          validate={false}
        />
      );
      wrapper.setState({data: recordTree});

      const previousValue = wrapper.state().data.children.get(0).get('dataSource').value;
      expect(previousValue).to.equal(undefined);

      const result = wrapper.instance().getValue();

      const updatedValue = result.observations[0].value;
      expect(updatedValue).to.equal(1);
    });

  });

  describe('Multiple layer', () => {
    const metadata = {
      "controls": [
        {
          "concept": {
            "datatype": "N/A",
            "name": "TestGroup",
            "set": true,
            "setMembers": [
              {
                "answers": [],
                "datatype": "Numeric",
                "description": [],
                "hiAbsolute": null,
                "hiNormal": null,
                "lowAbsolute": null,
                "lowNormal": null,
                "name": "TestObs",
                "properties": {
                  "allowDecimal": false
                },
                "units": null,
                "uuid": "d0490af4-72eb-4090-9b43-ac3487ba7474"
              }
            ],
            "uuid": "eafe7d68-904b-459b-b11d-6502ec0143a4"
          },
          "controls": [
            {
              "concept": {
                "answers": [],
                "datatype": "Numeric",
                "description": [],
                "hiAbsolute": null,
                "hiNormal": null,
                "lowAbsolute": null,
                "lowNormal": null,
                "name": "TestObs",
                "properties": {
                  "allowDecimal": false
                },
                "units": null,
                "uuid": "d0490af4-72eb-4090-9b43-ac3487ba7474"
              },
              "hiAbsolute": null,
              "hiNormal": null,
              "id": "4",
              "label": {
                "type": "label",
                "value": "TestObs"
              },
              "lowAbsolute": null,
              "lowNormal": null,
              "properties": {
                "addMore": true,
                "hideLabel": false,
                "location": {
                  "column": 0,
                  "row": 0
                },
                "mandatory": false,
                "notes": false
              },
              "type": "obsControl",
              "units": null
            }
          ],
          "id": "3",
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
      "id": 210,
      "name": "SingleGroup",
      "uuid": "72801201-2154-4f1e-89cb-21a57a23d06a",
      "version": "3"
    };

    const obsCtrlRecord = new ControlRecord({
      control: {
        "concept": {
          "answers": [],
          "datatype": "Numeric",
          "description": [],
          "hiAbsolute": null,
          "hiNormal": null,
          "lowAbsolute": null,
          "lowNormal": null,
          "name": "TestObs",
          "properties": {
            "allowDecimal": false
          },
          "units": null,
          "uuid": "d0490af4-72eb-4090-9b43-ac3487ba7474"
        },
        "hiAbsolute": null,
        "hiNormal": null,
        "id": "4",
        "label": {
          "type": "label",
          "value": "TestObs"
        },
        "lowAbsolute": null,
        "lowNormal": null,
        "properties": {
          "addMore": true,
          "hideLabel": false,
          "location": {
            "column": 0,
            "row": 0
          },
          "mandatory": false,
          "notes": false
        },
        "type": "obsControl",
        "units": null
      },
      formFieldPath: 'SingleGroup.3/4-0',
      dataSource: {
        "abnormal": null,
        "comment": null,
        "concept": {
          "conceptClass": "Test",
          "dataType": "Numeric",
          "hiNormal": null,
          "lowNormal": null,
          "mappings": [],
          "name": "TestObs",
          "set": false,
          "shortName": "TestObs",
          "uuid": "d0490af4-72eb-4090-9b43-ac3487ba7474"
        },
        "conceptNameToDisplay": "TestObs",
        "conceptSortWeight": 2,
        "conceptUuid": "d0490af4-72eb-4090-9b43-ac3487ba7474",
        "creatorName": "Super Man",
        "duration": null,
        "encounterDateTime": 1488523999000,
        "encounterUuid": "8b5f9862-ce75-4d31-bf41-1c47d58c7444",
        "formFieldPath": "SingleGroup.3/4-0",
        "formNamespace": "Bahmni",
        "groupMembers": [],
        "hiNormal": null,
        "isAbnormal": null,
        "lowNormal": null,
        "obsGroupUuid": "531bd307-8c52-43eb-ac16-b184f2845cc5",
        "observationDateTime": "2017-03-03T07:26:22.000+0000",
        "orderUuid": null,
        "parentConceptUuid": null,
        "providers": [
          {
            "encounterRoleUuid": "a0b03050-c99b-11e0-9572-0800200c9a66",
            "name": "Super Man",
            "uuid": "c1c26908-3f10-11e4-adec-0800271c1b75"
          }
        ],
        "targetObsRelation": null,
        "type": "Numeric",
        "unknown": false,
        "uuid": "ff30ba63-bb45-404b-bb51-f686bbc15f49",
        "value": undefined,
        "valueAsString": "1.0",
        "visitStartDateTime": null,
        "voidReason": null,
        "voided": false
      },
      value: {value: 1, comment: undefined},
    });
    const childRecord = new ControlRecord({
      control: {
        "concept": {
          "datatype": "N/A",
          "name": "TestGroup",
          "set": true,
          "setMembers": [
            {
              "answers": [],
              "datatype": "Numeric",
              "description": [],
              "hiAbsolute": null,
              "hiNormal": null,
              "lowAbsolute": null,
              "lowNormal": null,
              "name": "TestObs",
              "properties": {
                "allowDecimal": false
              },
              "units": null,
              "uuid": "d0490af4-72eb-4090-9b43-ac3487ba7474"
            }
          ],
          "uuid": "eafe7d68-904b-459b-b11d-6502ec0143a4"
        },
        "controls": [
          {
            "concept": {
              "answers": [],
              "datatype": "Numeric",
              "description": [],
              "hiAbsolute": null,
              "hiNormal": null,
              "lowAbsolute": null,
              "lowNormal": null,
              "name": "TestObs",
              "properties": {
                "allowDecimal": false
              },
              "units": null,
              "uuid": "d0490af4-72eb-4090-9b43-ac3487ba7474"
            },
            "hiAbsolute": null,
            "hiNormal": null,
            "id": "4",
            "label": {
              "type": "label",
              "value": "TestObs"
            },
            "lowAbsolute": null,
            "lowNormal": null,
            "properties": {
              "addMore": true,
              "hideLabel": false,
              "location": {
                "column": 0,
                "row": 0
              },
              "mandatory": false,
              "notes": false
            },
            "type": "obsControl",
            "units": null
          }
        ],
        "id": "3",
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
      },
      formFieldPath: 'SingleGroup.3/3-0',
      dataSource: {
        "abnormal": null,
        "comment": null,
        "concept": {
          "conceptClass": "Concept Details",
          "dataType": "N/A",
          "hiNormal": null,
          "lowNormal": null,
          "mappings": [],
          "name": "TestGroup",
          "set": true,
          "shortName": "TestGroup",
          "uuid": "eafe7d68-904b-459b-b11d-6502ec0143a4"
        },
        "conceptNameToDisplay": "TestGroup",
        "conceptSortWeight": 1,
        "conceptUuid": "eafe7d68-904b-459b-b11d-6502ec0143a4",
        "creatorName": "Super Man",
        "duration": null,
        "encounterDateTime": 1488523999000,
        "encounterUuid": "8b5f9862-ce75-4d31-bf41-1c47d58c7444",
        "formFieldPath": "SingleGroup.3/3-0",
        "formNamespace": "Bahmni",
        "groupMembers": [
          {
            "abnormal": null,
            "comment": null,
            "concept": {
              "conceptClass": "Test",
              "dataType": "Numeric",
              "hiNormal": null,
              "lowNormal": null,
              "mappings": [],
              "name": "TestObs",
              "set": false,
              "shortName": "TestObs",
              "uuid": "d0490af4-72eb-4090-9b43-ac3487ba7474"
            },
            "conceptNameToDisplay": "TestObs",
            "conceptSortWeight": 2,
            "conceptUuid": "d0490af4-72eb-4090-9b43-ac3487ba7474",
            "creatorName": "Super Man",
            "duration": null,
            "encounterDateTime": 1488523999000,
            "encounterUuid": "8b5f9862-ce75-4d31-bf41-1c47d58c7444",
            "formFieldPath": "SingleGroup.3/4-0",
            "formNamespace": "Bahmni",
            "groupMembers": [],
            "hiNormal": null,
            "isAbnormal": null,
            "lowNormal": null,
            "obsGroupUuid": "531bd307-8c52-43eb-ac16-b184f2845cc5",
            "observationDateTime": "2017-03-03T07:26:22.000+0000",
            "orderUuid": null,
            "parentConceptUuid": null,
            "providers": [
              {
                "encounterRoleUuid": "a0b03050-c99b-11e0-9572-0800200c9a66",
                "name": "Super Man",
                "uuid": "c1c26908-3f10-11e4-adec-0800271c1b75"
              }
            ],
            "targetObsRelation": null,
            "type": "Numeric",
            "unknown": false,
            "uuid": "ff30ba63-bb45-404b-bb51-f686bbc15f49",
            "value": 1,
            "valueAsString": "1.0",
            "visitStartDateTime": null,
            "voidReason": null,
            "voided": false
          }
        ],
        "hiNormal": null,
        "isAbnormal": null,
        "lowNormal": null,
        "obsGroupUuid": null,
        "observationDateTime": "2017-03-03T07:26:22.000+0000",
        "orderUuid": null,
        "parentConceptUuid": null,
        "providers": [
          {
            "encounterRoleUuid": "a0b03050-c99b-11e0-9572-0800200c9a66",
            "name": "Super Man",
            "uuid": "c1c26908-3f10-11e4-adec-0800271c1b75"
          }
        ],
        "targetObsRelation": null,
        "type": null,
        "unknown": false,
        "uuid": "531bd307-8c52-43eb-ac16-b184f2845cc5",
        "value": "1",
        "valueAsString": "1",
        "visitStartDateTime": null,
        "voidReason": null,
        "voided": false
      },
      children: List.of(obsCtrlRecord),
    });
    const recordTree = new ControlRecord({children: List.of(childRecord)});

    it('should render multiple control when given multiple layer tree data', () => {
      const wrapper = mount(
        <Container
          collapse
          metadata={metadata}
          observations={[]}
          validate={false}
        />
      );

      wrapper.setState({data: recordTree});

      expect(wrapper).to.have.exactly(1).descendants('ObsGroupControl');
    });

    it('should change state when onValueChanged is triggered', () => {
      const wrapper = shallow(
        <Container
          collapse
          metadata={metadata}
          observations={[]}
          validate={false}
        />
      );
      const formFieldPath = 'SingleGroup.3/4-0';
      const changedValue = {value: '1', comment:undefined};

      // const update = sinon.stub(wrapper.state().data, 'update').returns(recordTree);

      wrapper.instance().onValueChanged(formFieldPath, changedValue);

      // update.restore();

      const obsGroupRecord = wrapper.state().data.children.get(0);
      const obsControlRecord = obsGroupRecord.children.get(0);
      expect(obsControlRecord.value).to.equal(changedValue);
    });

    it('should update dataSource value when getValue is triggered', () => {
      const wrapper = mount(
        <Container
          collapse
          metadata={metadata}
          observations={[]}
          validate={false}
        />
      );
      wrapper.setState({data: recordTree});

      const previousValue = wrapper.state().data.children.get(0).children.get(0).get('dataSource').value;
      expect(previousValue).to.equal(undefined);

      const result = wrapper.instance().getValue();

      const updatedValue = result.observations[0].groupMembers[0].value;
      expect(updatedValue).to.equal(1);
    });
  });
});