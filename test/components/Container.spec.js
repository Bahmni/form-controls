import React from 'react';
import {Record, List} from 'immutable';
import {shallow, mount} from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, {expect} from 'chai';
import {Container} from 'components/Container.jsx';
import {Label} from 'components/Label.jsx';
import {TextBox} from 'components/TextBox.jsx';
import {NumericBox} from 'components/NumericBox.jsx';
import {Button} from 'components/Button.jsx';
import {ObsControl} from 'components/ObsControl.jsx';
import {ObsGroupControl} from 'components/ObsGroupControl.jsx';
import {CodedControl} from 'components/CodedControl.jsx';
import {ControlRecord} from '../../src/helpers/ControlRecordTreeBuilder';
import ComponentStore from 'src/helpers/componentStore';


chai.use(chaiEnzyme());

describe('Container', () => {
    before(() => {
        ComponentStore.registerComponent('label', Label);
        ComponentStore.registerComponent('text', TextBox);
        ComponentStore.registerComponent('numeric', NumericBox);
        ComponentStore.registerComponent('button', Button);
        ComponentStore.registerComponent('Coded', CodedControl);
        ComponentStore.registerComponent('obsControl', ObsControl);
        ComponentStore.registerComponent('obsGroupControl', ObsGroupControl);
    });

    after(() => {
        ComponentStore.deRegisterComponent('label');
        ComponentStore.deRegisterComponent('text');
        ComponentStore.deRegisterComponent('numeric');
        ComponentStore.deRegisterComponent('button');
        ComponentStore.deRegisterComponent('Coded');
        ComponentStore.deRegisterComponent('obsControl');
        ComponentStore.deRegisterComponent('obsGroupControl');
    });


    describe('Single layer', () => {
        const metadata = {
            controls: [
                {
                    concept: {
                        answers: [],
                        datatype: 'Numeric',
                        description: [],
                        name: 'Pulse',
                        properties: {
                            allowDecimal: true,
                        },
                        uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
                    },
                    hiAbsolute: null,
                    hiNormal: 72,
                    id: '1',
                    label: {
                        type: 'label',
                        value: 'Pulse(/min)',
                    },
                    lowAbsolute: null,
                    lowNormal: 72,
                    properties: {
                        addMore: true,
                        hideLabel: false,
                        location: {
                            column: 0,
                            row: 0,
                        },
                        mandatory: true,
                        notes: false,
                    },
                    type: 'obsControl',
                    units: '/min',
                },
            ],
            id: 209,
            name: 'SingleObs',
            uuid: '245940b7-3d6b-4a8b-806b-3f56444129ae',
            version: '1',
        };

        const formFieldPath = 'SingleObs.1/1-0';
        const childRecord = new ControlRecord({
            control: {
                concept: {
                    answers: [],
                    datatype: 'Numeric',
                    description: [],
                    name: 'Pulse',
                    properties: {
                        allowDecimal: true,
                    },
                    uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
                },
                hiAbsolute: null,
                hiNormal: 72,
                id: '1',
                label: {
                    type: 'label',
                    value: 'Pulse(/min)',
                },
                lowAbsolute: null,
                lowNormal: 72,
                properties: {
                    addMore: true,
                    hideLabel: false,
                    location: {
                        column: 0,
                        row: 0,
                    },
                    mandatory: true,
                    notes: false,
                },
                type: 'obsControl',
                units: '/min',
            },
            formFieldPath,
            value: {value: '1', comment: undefined},
            dataSource: {
                abnormal: null,
                comment: null,
                concept: {
                    conceptClass: 'Misc',
                    dataType: 'Numeric',
                    hiNormal: 72,
                    lowNormal: 72,
                    mappings: [],
                    name: 'Pulse',
                    set: false,
                    shortName: 'Pulse',
                    units: '/min',
                    uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
                },
                conceptNameToDisplay: 'Pulse',
                conceptSortWeight: 1,
                conceptUuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
                creatorName: 'Super Man',
                duration: null,
                encounterDateTime: 1488523999000,
                encounterUuid: '8b5f9862-ce75-4d31-bf41-1c47d58c7444',
                formFieldPath: 'SingleObs.1/1-0',
                formNamespace: 'Bahmni',
                groupMembers: [],
                hiNormal: 72,
                isAbnormal: null,
                lowNormal: 72,
                obsGroupUuid: null,
                observationDateTime: '2017-03-03T06:53:19.000+0000',
                orderUuid: null,
                parentConceptUuid: null,
                providers: [
                    {
                        encounterRoleUuid: 'a0b03050-c99b-11e0-9572-0800200c9a66',
                        name: 'Super Man',
                        uuid: 'c1c26908-3f10-11e4-adec-0800271c1b75',
                    },
                ],
                targetObsRelation: null,
                type: 'Numeric',
                unknown: false,
                uuid: '1c2b18ec-ad88-44e5-ae34-3b0e88240a93',
                value: undefined,
                valueAsString: '1.0',
                visitStartDateTime: null,
                voidReason: null,
                voided: false,
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
            const changedValue = {value: '1', comment: undefined};

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
            expect(updatedValue).to.equal('1');
        });

        it('should add one obs when onControlAdd is triggered with obs in container', () => {
            const concept = {
                answers: [],
                datatype: 'Numeric',
                description: [],
                name: 'HEIGHT',
                properties: {
                    allowDecimal: false,
                },
                uuid: '5090AAAAAAAAAAAAAAAAAAAAAAAAAAAA',
            };
            const addedFormFieldPath = 'singleObs.1/1-0';
            const childRecordTree = new ControlRecord({
                control: {
                    concept,
                    hiAbsolute: null,
                    hiNormal: null,
                    id: '1',
                    label: {
                        type: 'label',
                        value: 'HEIGHT',
                    },
                    lowAbsolute: null,
                    lowNormal: null,
                    properties: {
                        addMore: true,
                        hideLabel: false,
                        location: {
                            column: 0,
                            row: 0,
                        },
                        mandatory: false,
                        notes: false,
                    },
                    type: 'obsControl',
                    units: null,
                },
                formFieldPath: addedFormFieldPath,
                value: {},
                dataSource: {
                    concept,
                    formFieldPath: addedFormFieldPath,
                    formNamespace: 'Bahmni',
                    voided: true,
                },
            });
            const obsTree = new ControlRecord({children: List.of(childRecordTree)});
            const wrapper = mount(
                <Container
                    collapse
                    metadata={metadata}
                    observations={[]}
                    validate={false}
                />
            );
            wrapper.setState({data: obsTree});

            wrapper.instance().onControlAdd(addedFormFieldPath);

            const expectedFormFieldPath = 'singleObs.1/1-1';
            const updatedRootTree = wrapper.state().data;
            expect(updatedRootTree.children.size).to.equal(2);
            expect(updatedRootTree.children.get(0).formFieldPath).to.equal(addedFormFieldPath);
            expect(updatedRootTree.children.get(1).formFieldPath).to.equal(expectedFormFieldPath);
        });

        it('should remove one obs when onControlRemove is triggered with obs in container', () => {
            const concept = {
                answers: [],
                datatype: 'Numeric',
                description: [],
                name: 'Pulse',
                properties: {
                    allowDecimal: true,
                },
                uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
            };
            const obsRecord = new ControlRecord({
                control: {
                    concept,
                    hiAbsolute: null,
                    hiNormal: 72,
                    id: '1',
                    label: {
                        type: 'label',
                        value: 'Pulse(/min)',
                    },
                    lowAbsolute: null,
                    lowNormal: 72,
                    properties: {
                        addMore: true,
                        hideLabel: false,
                        location: {
                            column: 0,
                            row: 0,
                        },
                        mandatory: true,
                        notes: false,
                    },
                    type: 'obsControl',
                    units: '/min',
                },
                value: {},
                dataSource: {
                    concept,
                    formFieldPath: 'SingleObs.1/1-0',
                    formNamespace: 'Bahmni',
                    voided: true,
                },
                formFieldPath: 'SingleObs.1/1-0',
            });
            const removableFormFieldPath = 'SingleObs.1/1-1';
            const removableChildRecord = new ControlRecord({
                control: {
                    concept,
                    hiAbsolute: null,
                    hiNormal: 72,
                    id: '1',
                    label: {
                        type: 'label',
                        value: 'Pulse(/min)',
                    },
                    lowAbsolute: null,
                    lowNormal: 72,
                    properties: {
                        addMore: true,
                        hideLabel: false,
                        location: {
                            column: 0,
                            row: 0,
                        },
                        mandatory: true,
                        notes: false,
                    },
                    type: 'obsControl',
                    units: '/min',
                },
                value: {},
                dataSource: {
                    concept,
                    formFieldPath: 'SingleObs.1/1-0',
                    formNamespace: 'Bahmni',
                    voided: true,
                },
                formFieldPath: removableFormFieldPath,
            });
            const obsTree = new ControlRecord({children: List.of(obsRecord, removableChildRecord)});
            const wrapper = mount(
                <Container
                    collapse
                    metadata={metadata}
                    observations={[]}
                    validate={false}
                />
            );
            wrapper.setState({data: obsTree});

            wrapper.instance().onControlRemove(removableFormFieldPath);

            expect(wrapper.state().data.children.get(0).active).to.equal(true);
            expect(wrapper.state().data.children.get(1).active).to.equal(false);
        });

        it('should add one obsGroup when onControlAdd is triggered with obsGroup in container', () => {
            let concept = {
                "datatype": "N/A",
                "name": "Pulse Data",
                "set": true,
                "setMembers": [
                    {
                        "answers": [],
                        "datatype": "Numeric",
                        "description": [],
                        "hiAbsolute": null,
                        "hiNormal": 72,
                        "lowAbsolute": null,
                        "lowNormal": 72,
                        "name": "Pulse(/min)",
                        "properties": {
                            "allowDecimal": true
                        },
                        "units": "/min",
                        "uuid": "c36bc411-3f10-11e4-adec-0800271c1b75"
                    },
                    {
                        "answers": [],
                        "datatype": "Boolean",
                        "description": [],
                        "hiAbsolute": null,
                        "hiNormal": null,
                        "lowAbsolute": null,
                        "lowNormal": null,
                        "name": "Pulse Abnormal",
                        "properties": {
                            "allowDecimal": null
                        },
                        "units": null,
                        "uuid": "c36c7c98-3f10-11e4-adec-0800271c1b75"
                    }
                ],
                "uuid": "c36af094-3f10-11e4-adec-0800271c1b75"
            };
            let addFormFieldPath = 'obsGroup.1/2-0';
            const childRecordTree = new ControlRecord({
                control: {
                    "concept": concept,
                    "controls": [
                        {
                            "concept": {
                                "answers": [],
                                "datatype": "Numeric",
                                "description": [],
                                "hiAbsolute": null,
                                "hiNormal": 72,
                                "lowAbsolute": null,
                                "lowNormal": 72,
                                "name": "Pulse(/min)",
                                "properties": {
                                    "allowDecimal": true
                                },
                                "units": "/min",
                                "uuid": "c36bc411-3f10-11e4-adec-0800271c1b75"
                            },
                            "hiAbsolute": null,
                            "hiNormal": 72,
                            "id": "3",
                            "label": {
                                "type": "label",
                                "value": "Pulse(/min)"
                            },
                            "lowAbsolute": null,
                            "lowNormal": 72,
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
                            "units": "/min"
                        },
                        {
                            "concept": {
                                "answers": [],
                                "datatype": "Boolean",
                                "description": [],
                                "hiAbsolute": null,
                                "hiNormal": null,
                                "lowAbsolute": null,
                                "lowNormal": null,
                                "name": "Pulse Abnormal",
                                "properties": {
                                    "allowDecimal": null
                                },
                                "units": null,
                                "uuid": "c36c7c98-3f10-11e4-adec-0800271c1b75"
                            },
                            "hiAbsolute": null,
                            "hiNormal": null,
                            "id": "4",
                            "label": {
                                "type": "label",
                                "value": "Pulse Abnormal"
                            },
                            "lowAbsolute": null,
                            "lowNormal": null,
                            "options": [
                                {
                                    "name": "Yes",
                                    "value": true
                                },
                                {
                                    "name": "No",
                                    "value": false
                                }
                            ],
                            "properties": {
                                "addMore": false,
                                "hideLabel": false,
                                "location": {
                                    "column": 0,
                                    "row": 1
                                },
                                "mandatory": false,
                                "notes": false
                            },
                            "type": "obsControl",
                            "units": null
                        }
                    ],
                    "id": "2",
                    "label": {
                        "type": "label",
                        "value": "Pulse Data"
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
                formFieldPath: addFormFieldPath,
                value: {},
                dataSource: {
                    "concept": concept,
                    "formFieldPath": addFormFieldPath,
                    "formNamespace": "Bahmni",
                    "voided": true
                },
            });
            const obsGroupTree = new ControlRecord({children: List.of(childRecordTree)});
            const wrapper = mount(
                <Container
                    collapse
                    metadata={metadata}
                    observations={[]}
                    validate={false}
                />
            );
            wrapper.setState({data: obsGroupTree});

            wrapper.instance().onControlAdd(addFormFieldPath);

            const expectedFormFieldPath = 'obsGroup.1/2-1';
            const updatedRootTree = wrapper.state().data;
            expect(updatedRootTree.children.size).to.equal(2);
            expect(updatedRootTree.children.get(0).formFieldPath).to.equal(addFormFieldPath);
            expect(updatedRootTree.children.get(1).formFieldPath).to.equal(expectedFormFieldPath);
        });

        it('should remove one obsGroup when onControlRemove is triggered with obsGroup in container', () => {
            let obsGroupConcept = {
                "datatype": "N/A",
                "name": "Pulse Data",
                "set": true,
                "setMembers": [
                    {
                        "answers": [],
                        "datatype": "Numeric",
                        "description": [],
                        "hiAbsolute": null,
                        "hiNormal": 72,
                        "lowAbsolute": null,
                        "lowNormal": 72,
                        "name": "Pulse(/min)",
                        "properties": {
                            "allowDecimal": true
                        },
                        "units": "/min",
                        "uuid": "c36bc411-3f10-11e4-adec-0800271c1b75"
                    },
                    {
                        "answers": [],
                        "datatype": "Boolean",
                        "description": [],
                        "hiAbsolute": null,
                        "hiNormal": null,
                        "lowAbsolute": null,
                        "lowNormal": null,
                        "name": "Pulse Abnormal",
                        "properties": {
                            "allowDecimal": null
                        },
                        "units": null,
                        "uuid": "c36c7c98-3f10-11e4-adec-0800271c1b75"
                    }
                ],
                "uuid": "c36af094-3f10-11e4-adec-0800271c1b75"
            };
            let obsConcept = {
                "conceptClass": "Concept Details",
                "dataType": "N/A",
                "hiNormal": null,
                "lowNormal": null,
                "mappings": [],
                "name": "Pulse Data",
                "set": true,
                "shortName": "Pulse",
                "uuid": "c36af094-3f10-11e4-adec-0800271c1b75"
            };
            const obsGroupRecord = new ControlRecord({
                control: {
                    "concept": obsGroupConcept,
                    "controls": [
                        {
                            "concept": {
                                "answers": [],
                                "datatype": "Numeric",
                                "description": [],
                                "hiAbsolute": null,
                                "hiNormal": 72,
                                "lowAbsolute": null,
                                "lowNormal": 72,
                                "name": "Pulse(/min)",
                                "properties": {
                                    "allowDecimal": true
                                },
                                "units": "/min",
                                "uuid": "c36bc411-3f10-11e4-adec-0800271c1b75"
                            },
                            "hiAbsolute": null,
                            "hiNormal": 72,
                            "id": "2",
                            "label": {
                                "type": "label",
                                "value": "Pulse(/min)"
                            },
                            "lowAbsolute": null,
                            "lowNormal": 72,
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
                            "units": "/min"
                        },
                        {
                            "concept": {
                                "answers": [],
                                "datatype": "Boolean",
                                "description": [],
                                "hiAbsolute": null,
                                "hiNormal": null,
                                "lowAbsolute": null,
                                "lowNormal": null,
                                "name": "Pulse Abnormal",
                                "properties": {
                                    "allowDecimal": null
                                },
                                "units": null,
                                "uuid": "c36c7c98-3f10-11e4-adec-0800271c1b75"
                            },
                            "hiAbsolute": null,
                            "hiNormal": null,
                            "id": "3",
                            "label": {
                                "type": "label",
                                "value": "Pulse Abnormal"
                            },
                            "lowAbsolute": null,
                            "lowNormal": null,
                            "options": [
                                {
                                    "name": "Yes",
                                    "value": true
                                },
                                {
                                    "name": "No",
                                    "value": false
                                }
                            ],
                            "properties": {
                                "addMore": false,
                                "hideLabel": false,
                                "location": {
                                    "column": 0,
                                    "row": 1
                                },
                                "mandatory": false,
                                "notes": false
                            },
                            "type": "obsControl",
                            "units": null
                        }
                    ],
                    "id": "1",
                    "label": {
                        "type": "label",
                        "value": "Pulse Data"
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
                formFieldPath: 'obsgroup1.1/1-1',
                value: {},
                dataSource: {
                    "abnormal": null,
                    "comment": null,
                    "concept": obsConcept,
                    "conceptNameToDisplay": "Pulse",
                    "conceptSortWeight": 1,
                    "conceptUuid": "c36af094-3f10-11e4-adec-0800271c1b75",
                    "creatorName": "Super Man",
                    "duration": null,
                    "encounterDateTime": 1489643974000,
                    "encounterUuid": "69722943-a46f-4886-9fa1-8f089e0c1bd3",
                    "formFieldPath": "obsgroup1.1/1-1",
                    "formNamespace": "Bahmni",
                    "groupMembers": [
                        {
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
                            "conceptSortWeight": 2,
                            "conceptUuid": "c36bc411-3f10-11e4-adec-0800271c1b75",
                            "creatorName": "Super Man",
                            "duration": null,
                            "encounterDateTime": 1489643974000,
                            "encounterUuid": "69722943-a46f-4886-9fa1-8f089e0c1bd3",
                            "formFieldPath": "obsgroup1.1/2-1",
                            "formNamespace": "Bahmni",
                            "groupMembers": [],
                            "hiNormal": 72,
                            "isAbnormal": null,
                            "lowNormal": 72,
                            "obsGroupUuid": "05c44520-6f6e-4ce4-b1c9-f3477f06a44f",
                            "observationDateTime": "2017-03-16T11:29:34.000+0530",
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
                            "uuid": "e643514e-6c2d-4f55-8363-38c09c919c8d",
                            "value": 77,
                            "valueAsString": "77.0",
                            "visitStartDateTime": null,
                            "voidReason": null,
                            "voided": false
                        },
                        {
                            "abnormal": null,
                            "comment": null,
                            "concept": {
                                "conceptClass": "Abnormal",
                                "dataType": "Boolean",
                                "hiNormal": null,
                                "lowNormal": null,
                                "mappings": [],
                                "name": "Pulse Abnormal",
                                "set": false,
                                "shortName": "Pulse Abnormal",
                                "uuid": "c36c7c98-3f10-11e4-adec-0800271c1b75"
                            },
                            "conceptNameToDisplay": "Pulse Abnormal",
                            "conceptSortWeight": 3,
                            "conceptUuid": "c36c7c98-3f10-11e4-adec-0800271c1b75",
                            "creatorName": "Super Man",
                            "duration": null,
                            "encounterDateTime": 1489643974000,
                            "encounterUuid": "69722943-a46f-4886-9fa1-8f089e0c1bd3",
                            "formFieldPath": "obsgroup1.1/3-1",
                            "formNamespace": "Bahmni",
                            "groupMembers": [],
                            "hiNormal": null,
                            "isAbnormal": null,
                            "lowNormal": null,
                            "obsGroupUuid": "05c44520-6f6e-4ce4-b1c9-f3477f06a44f",
                            "observationDateTime": "2017-03-16T11:29:34.000+0530",
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
                            "type": "Boolean",
                            "unknown": false,
                            "uuid": "52d09e35-ad7d-4111-bbc1-cd0115e0c9ed",
                            "value": true,
                            "valueAsString": "Yes",
                            "visitStartDateTime": null,
                            "voidReason": null,
                            "voided": false
                        }
                    ],
                    "hiNormal": null,
                    "isAbnormal": null,
                    "lowNormal": null,
                    "obsGroupUuid": null,
                    "observationDateTime": "2017-03-16T11:29:34.000+0530",
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
                    "uuid": "05c44520-6f6e-4ce4-b1c9-f3477f06a44f",
                    "value": "77.0, true",
                    "valueAsString": "77.0, true",
                    "visitStartDateTime": null,
                    "voidReason": null,
                    "voided": false
                },
            });
            let removedFormFieldPath = 'obsgroup1.1/1-0';
            const removedChildRecord = new ControlRecord({
                control:{
                    "concept": obsGroupConcept,
                    "controls": [
                        {
                            "concept": obsConcept,
                            "hiAbsolute": null,
                            "hiNormal": 72,
                            "id": "2",
                            "label": {
                                "type": "label",
                                "value": "Pulse(/min)"
                            },
                            "lowAbsolute": null,
                            "lowNormal": 72,
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
                            "units": "/min"
                        },
                        {
                            "concept": {
                                "answers": [],
                                "datatype": "Boolean",
                                "description": [],
                                "hiAbsolute": null,
                                "hiNormal": null,
                                "lowAbsolute": null,
                                "lowNormal": null,
                                "name": "Pulse Abnormal",
                                "properties": {
                                    "allowDecimal": null
                                },
                                "units": null,
                                "uuid": "c36c7c98-3f10-11e4-adec-0800271c1b75"
                            },
                            "hiAbsolute": null,
                            "hiNormal": null,
                            "id": "3",
                            "label": {
                                "type": "label",
                                "value": "Pulse Abnormal"
                            },
                            "lowAbsolute": null,
                            "lowNormal": null,
                            "options": [
                                {
                                    "name": "Yes",
                                    "value": true
                                },
                                {
                                    "name": "No",
                                    "value": false
                                }
                            ],
                            "properties": {
                                "addMore": false,
                                "hideLabel": false,
                                "location": {
                                    "column": 0,
                                    "row": 1
                                },
                                "mandatory": false,
                                "notes": false
                            },
                            "type": "obsControl",
                            "units": null
                        }
                    ],
                    "id": "1",
                    "label": {
                        "type": "label",
                        "value": "Pulse Data"
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
                value:{},
                dataSource:{
                    "abnormal": null,
                    "comment": null,
                    "concept": {
                        "conceptClass": "Concept Details",
                        "dataType": "N/A",
                        "hiNormal": null,
                        "lowNormal": null,
                        "mappings": [],
                        "name": "Pulse Data",
                        "set": true,
                        "shortName": "Pulse",
                        "uuid": "c36af094-3f10-11e4-adec-0800271c1b75"
                    },
                    "conceptNameToDisplay": "Pulse",
                    "conceptSortWeight": 1,
                    "conceptUuid": "c36af094-3f10-11e4-adec-0800271c1b75",
                    "creatorName": "Super Man",
                    "duration": null,
                    "encounterDateTime": 1489643974000,
                    "encounterUuid": "69722943-a46f-4886-9fa1-8f089e0c1bd3",
                    "formFieldPath": "obsgroup1.1/1-0",
                    "formNamespace": "Bahmni",
                    "groupMembers": [
                        {
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
                            "conceptSortWeight": 2,
                            "conceptUuid": "c36bc411-3f10-11e4-adec-0800271c1b75",
                            "creatorName": "Super Man",
                            "duration": null,
                            "encounterDateTime": 1489643974000,
                            "encounterUuid": "69722943-a46f-4886-9fa1-8f089e0c1bd3",
                            "formFieldPath": "obsgroup1.1/2-0",
                            "formNamespace": "Bahmni",
                            "groupMembers": [],
                            "hiNormal": 72,
                            "isAbnormal": null,
                            "lowNormal": 72,
                            "obsGroupUuid": "5e51edf2-ad99-448d-9920-fee9d0d067c9",
                            "observationDateTime": "2017-03-16T11:29:34.000+0530",
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
                            "uuid": "b74488d1-de7c-432f-8fcd-7e7f7c1f5f66",
                            "value": 72,
                            "valueAsString": "72.0",
                            "visitStartDateTime": null,
                            "voidReason": null,
                            "voided": false
                        },
                        {
                            "abnormal": null,
                            "comment": null,
                            "concept": {
                                "conceptClass": "Abnormal",
                                "dataType": "Boolean",
                                "hiNormal": null,
                                "lowNormal": null,
                                "mappings": [],
                                "name": "Pulse Abnormal",
                                "set": false,
                                "shortName": "Pulse Abnormal",
                                "uuid": "c36c7c98-3f10-11e4-adec-0800271c1b75"
                            },
                            "conceptNameToDisplay": "Pulse Abnormal",
                            "conceptSortWeight": 3,
                            "conceptUuid": "c36c7c98-3f10-11e4-adec-0800271c1b75",
                            "creatorName": "Super Man",
                            "duration": null,
                            "encounterDateTime": 1489643974000,
                            "encounterUuid": "69722943-a46f-4886-9fa1-8f089e0c1bd3",
                            "formFieldPath": "obsgroup1.1/3-0",
                            "formNamespace": "Bahmni",
                            "groupMembers": [],
                            "hiNormal": null,
                            "isAbnormal": null,
                            "lowNormal": null,
                            "obsGroupUuid": "5e51edf2-ad99-448d-9920-fee9d0d067c9",
                            "observationDateTime": "2017-03-16T11:29:34.000+0530",
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
                            "type": "Boolean",
                            "unknown": false,
                            "uuid": "4ce2c142-88b6-45d3-960a-7d540a3e4015",
                            "value": true,
                            "valueAsString": "Yes",
                            "visitStartDateTime": null,
                            "voidReason": null,
                            "voided": false
                        }
                    ],
                    "hiNormal": null,
                    "isAbnormal": null,
                    "lowNormal": null,
                    "obsGroupUuid": null,
                    "observationDateTime": "2017-03-16T11:29:34.000+0530",
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
                    "uuid": "5e51edf2-ad99-448d-9920-fee9d0d067c9",
                    "value": "true, 72.0",
                    "valueAsString": "true, 72.0",
                    "visitStartDateTime": null,
                    "voidReason": null,
                    "voided": false
                },
                formFieldPath: removedFormFieldPath
            });
            const obsGroupTree = new ControlRecord({children: List.of(obsGroupRecord, removedChildRecord)});
            const wrapper = mount(
                <Container
                    collapse
                    metadata={metadata}
                    observations={[]}
                    validate={false}
                />
            );
            wrapper.setState({data: obsGroupTree});

            wrapper.instance().onControlRemove(removedFormFieldPath);

            const updatedRootTree = wrapper.state().data;
            expect(updatedRootTree.children.get(0).active).to.equal(true);
            expect(updatedRootTree.children.get(1).active).to.equal(false);
        });
    });

    describe('Multiple layer', () => {
        const metadata = {
            controls: [
                {
                    concept: {
                        datatype: 'N/A',
                        name: 'TestGroup',
                        set: true,
                        setMembers: [
                            {
                                answers: [],
                                datatype: 'Numeric',
                                description: [],
                                hiAbsolute: null,
                                hiNormal: null,
                                lowAbsolute: null,
                                lowNormal: null,
                                name: 'TestObs',
                                properties: {
                                    allowDecimal: false,
                                },
                                units: null,
                                uuid: 'd0490af4-72eb-4090-9b43-ac3487ba7474',
                            },
                        ],
                        uuid: 'eafe7d68-904b-459b-b11d-6502ec0143a4',
                    },
                    controls: [
                        {
                            concept: {
                                answers: [],
                                datatype: 'Numeric',
                                description: [],
                                hiAbsolute: null,
                                hiNormal: null,
                                lowAbsolute: null,
                                lowNormal: null,
                                name: 'TestObs',
                                properties: {
                                    allowDecimal: false,
                                },
                                units: null,
                                uuid: 'd0490af4-72eb-4090-9b43-ac3487ba7474',
                            },
                            hiAbsolute: null,
                            hiNormal: null,
                            id: '4',
                            label: {
                                type: 'label',
                                value: 'TestObs',
                            },
                            lowAbsolute: null,
                            lowNormal: null,
                            properties: {
                                addMore: true,
                                hideLabel: false,
                                location: {
                                    column: 0,
                                    row: 0,
                                },
                                mandatory: false,
                                notes: false,
                            },
                            type: 'obsControl',
                            units: null,
                        },
                    ],
                    id: '3',
                    label: {
                        type: 'label',
                        value: 'TestGroup',
                    },
                    properties: {
                        abnormal: false,
                        addMore: true,
                        location: {
                            column: 0,
                            row: 0,
                        },
                    },
                    type: 'obsGroupControl',
                },
            ],
            id: 210,
            name: 'SingleGroup',
            uuid: '72801201-2154-4f1e-89cb-21a57a23d06a',
            version: '3',
        };

        const obsCtrlRecord = new ControlRecord({
            control: {
                concept: {
                    answers: [],
                    datatype: 'Numeric',
                    description: [],
                    hiAbsolute: null,
                    hiNormal: null,
                    lowAbsolute: null,
                    lowNormal: null,
                    name: 'TestObs',
                    properties: {
                        allowDecimal: false,
                    },
                    units: null,
                    uuid: 'd0490af4-72eb-4090-9b43-ac3487ba7474',
                },
                hiAbsolute: null,
                hiNormal: null,
                id: '4',
                label: {
                    type: 'label',
                    value: 'TestObs',
                },
                lowAbsolute: null,
                lowNormal: null,
                properties: {
                    addMore: true,
                    hideLabel: false,
                    location: {
                        column: 0,
                        row: 0,
                    },
                    mandatory: false,
                    notes: false,
                },
                type: 'obsControl',
                units: null,
            },
            formFieldPath: 'SingleGroup.3/4-0',
            dataSource: {
                abnormal: null,
                comment: null,
                concept: {
                    conceptClass: 'Test',
                    dataType: 'Numeric',
                    hiNormal: null,
                    lowNormal: null,
                    mappings: [],
                    name: 'TestObs',
                    set: false,
                    shortName: 'TestObs',
                    uuid: 'd0490af4-72eb-4090-9b43-ac3487ba7474',
                },
                conceptNameToDisplay: 'TestObs',
                conceptSortWeight: 2,
                conceptUuid: 'd0490af4-72eb-4090-9b43-ac3487ba7474',
                creatorName: 'Super Man',
                duration: null,
                encounterDateTime: 1488523999000,
                encounterUuid: '8b5f9862-ce75-4d31-bf41-1c47d58c7444',
                formFieldPath: 'SingleGroup.3/4-0',
                formNamespace: 'Bahmni',
                groupMembers: [],
                hiNormal: null,
                isAbnormal: null,
                lowNormal: null,
                obsGroupUuid: '531bd307-8c52-43eb-ac16-b184f2845cc5',
                observationDateTime: '2017-03-03T07:26:22.000+0000',
                orderUuid: null,
                parentConceptUuid: null,
                providers: [
                    {
                        encounterRoleUuid: 'a0b03050-c99b-11e0-9572-0800200c9a66',
                        name: 'Super Man',
                        uuid: 'c1c26908-3f10-11e4-adec-0800271c1b75',
                    },
                ],
                targetObsRelation: null,
                type: 'Numeric',
                unknown: false,
                uuid: 'ff30ba63-bb45-404b-bb51-f686bbc15f49',
                value: undefined,
                valueAsString: '1.0',
                visitStartDateTime: null,
                voidReason: null,
                voided: false,
            },
            value: {value: '1', comment: undefined},
        });
        const childRecord = new ControlRecord({
            control: {
                concept: {
                    datatype: 'N/A',
                    name: 'TestGroup',
                    set: true,
                    setMembers: [
                        {
                            answers: [],
                            datatype: 'Numeric',
                            description: [],
                            hiAbsolute: null,
                            hiNormal: null,
                            lowAbsolute: null,
                            lowNormal: null,
                            name: 'TestObs',
                            properties: {
                                allowDecimal: false,
                            },
                            units: null,
                            uuid: 'd0490af4-72eb-4090-9b43-ac3487ba7474',
                        },
                    ],
                    uuid: 'eafe7d68-904b-459b-b11d-6502ec0143a4',
                },
                controls: [
                    {
                        concept: {
                            answers: [],
                            datatype: 'Numeric',
                            description: [],
                            hiAbsolute: null,
                            hiNormal: null,
                            lowAbsolute: null,
                            lowNormal: null,
                            name: 'TestObs',
                            properties: {
                                allowDecimal: false,
                            },
                            units: null,
                            uuid: 'd0490af4-72eb-4090-9b43-ac3487ba7474',
                        },
                        hiAbsolute: null,
                        hiNormal: null,
                        id: '4',
                        label: {
                            type: 'label',
                            value: 'TestObs',
                        },
                        lowAbsolute: null,
                        lowNormal: null,
                        properties: {
                            addMore: true,
                            hideLabel: false,
                            location: {
                                column: 0,
                                row: 0,
                            },
                            mandatory: false,
                            notes: false,
                        },
                        type: 'obsControl',
                        units: null,
                    },
                ],
                id: '3',
                label: {
                    type: 'label',
                    value: 'TestGroup',
                },
                properties: {
                    abnormal: false,
                    addMore: true,
                    location: {
                        column: 0,
                        row: 0,
                    },
                },
                type: 'obsGroupControl',
            },
            formFieldPath: 'SingleGroup.3/3-0',
            dataSource: {
                abnormal: null,
                comment: null,
                concept: {
                    conceptClass: 'Concept Details',
                    dataType: 'N/A',
                    hiNormal: null,
                    lowNormal: null,
                    mappings: [],
                    name: 'TestGroup',
                    set: true,
                    shortName: 'TestGroup',
                    uuid: 'eafe7d68-904b-459b-b11d-6502ec0143a4',
                },
                conceptNameToDisplay: 'TestGroup',
                conceptSortWeight: 1,
                conceptUuid: 'eafe7d68-904b-459b-b11d-6502ec0143a4',
                creatorName: 'Super Man',
                duration: null,
                encounterDateTime: 1488523999000,
                encounterUuid: '8b5f9862-ce75-4d31-bf41-1c47d58c7444',
                formFieldPath: 'SingleGroup.3/3-0',
                formNamespace: 'Bahmni',
                groupMembers: [
                    {
                        abnormal: null,
                        comment: null,
                        concept: {
                            conceptClass: 'Test',
                            dataType: 'Numeric',
                            hiNormal: null,
                            lowNormal: null,
                            mappings: [],
                            name: 'TestObs',
                            set: false,
                            shortName: 'TestObs',
                            uuid: 'd0490af4-72eb-4090-9b43-ac3487ba7474',
                        },
                        conceptNameToDisplay: 'TestObs',
                        conceptSortWeight: 2,
                        conceptUuid: 'd0490af4-72eb-4090-9b43-ac3487ba7474',
                        creatorName: 'Super Man',
                        duration: null,
                        encounterDateTime: 1488523999000,
                        encounterUuid: '8b5f9862-ce75-4d31-bf41-1c47d58c7444',
                        formFieldPath: 'SingleGroup.3/4-0',
                        formNamespace: 'Bahmni',
                        groupMembers: [],
                        hiNormal: null,
                        isAbnormal: null,
                        lowNormal: null,
                        obsGroupUuid: '531bd307-8c52-43eb-ac16-b184f2845cc5',
                        observationDateTime: '2017-03-03T07:26:22.000+0000',
                        orderUuid: null,
                        parentConceptUuid: null,
                        providers: [
                            {
                                encounterRoleUuid: 'a0b03050-c99b-11e0-9572-0800200c9a66',
                                name: 'Super Man',
                                uuid: 'c1c26908-3f10-11e4-adec-0800271c1b75',
                            },
                        ],
                        targetObsRelation: null,
                        type: 'Numeric',
                        unknown: false,
                        uuid: 'ff30ba63-bb45-404b-bb51-f686bbc15f49',
                        value: 1,
                        valueAsString: '1.0',
                        visitStartDateTime: null,
                        voidReason: null,
                        voided: false,
                    },
                ],
                hiNormal: null,
                isAbnormal: null,
                lowNormal: null,
                obsGroupUuid: null,
                observationDateTime: '2017-03-03T07:26:22.000+0000',
                orderUuid: null,
                parentConceptUuid: null,
                providers: [
                    {
                        encounterRoleUuid: 'a0b03050-c99b-11e0-9572-0800200c9a66',
                        name: 'Super Man',
                        uuid: 'c1c26908-3f10-11e4-adec-0800271c1b75',
                    },
                ],
                targetObsRelation: null,
                type: null,
                unknown: false,
                uuid: '531bd307-8c52-43eb-ac16-b184f2845cc5',
                value: '1',
                valueAsString: '1',
                visitStartDateTime: null,
                voidReason: null,
                voided: false,
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
            const changedValue = {value: '1', comment: undefined};

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

            const previousValue = wrapper.state().data.children.get(0)
                .children.get(0).get('dataSource').value;
            expect(previousValue).to.equal(undefined);

            const result = wrapper.instance().getValue();

            const updatedValue = result.observations[0].groupMembers[0].value;
            expect(updatedValue).to.equal('1');
        });

        it('should both change when onValueChanged be triggered twice', () => {
            const smokingHistoryConcept = {
                answers: [],
                datatype: 'Boolean',
                name: 'Smoking History',
                properties: {
                    allowDecimal: null,
                },
                uuid: 'c2a43174-c9db-4e54-8516-17372c83537f',
            };
            const pulseConcept = {
                answers: [],
                datatype: 'Numeric',
                description: [],
                name: 'Pulse',
                properties: {
                    allowDecimal: true,
                },
                uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
            };
            const updatedMetadata = {
                controls: [
                    {
                        concept: smokingHistoryConcept,
                        hiAbsolute: null,
                        hiNormal: null,
                        id: '1',
                        label: {
                            type: 'label',
                            value: 'Smoking History',
                        },
                        lowAbsolute: null,
                        lowNormal: null,
                        options: [
                            {
                                name: 'Yes',
                                value: true,
                            },
                            {
                                name: 'No',
                                value: false,
                            },
                        ],
                        properties: {
                            addMore: false,
                            hideLabel: false,
                            location: {
                                column: 0,
                                row: 0,
                            },
                            mandatory: true,
                            notes: false,
                        },
                        type: 'obsControl',
                        units: null,
                    },
                    {
                        concept: pulseConcept,
                        hiAbsolute: null,
                        hiNormal: 72,
                        id: '2',
                        label: {
                            type: 'label',
                            value: 'Pulse(/min)',
                        },
                        lowAbsolute: null,
                        lowNormal: 72,
                        properties: {
                            addMore: false,
                            hideLabel: false,
                            location: {
                                column: 0,
                                row: 1,
                            },
                            mandatory: true,
                            notes: false,
                        },
                        type: 'obsControl',
                        units: '/min',
                    },
                ],
                id: 228,
                name: 'Error2',
                uuid: 'a4eb5bac-8c7a-43e6-9c75-cef0710991e5',
                version: '1',
            };

            const wrapper = mount(
                <Container
                    collapse
                    metadata={updatedMetadata}
                    observations={[]}
                    validate={false}
                />
            );

            const Errors = new Record({
                type: 'error',
                message: 'mandatory',
            });

            // Wrapper will update state immediately, so save the function here
            const originalStateFunc = wrapper.instance().setState.bind(wrapper.instance());
            wrapper.instance().setState = (partialState) => {
                // Simulate real react setState, when partialState is function, react will call it with latest state.
                if (typeof partialState === 'function') {
                    originalStateFunc(partialState(wrapper.state()));
                }
            };

            wrapper.instance().onValueChanged('Error2.1/1-0', {}, new Errors());
            wrapper.instance().onValueChanged('Error2.1/2-0', {}, new Errors());

            expect(wrapper.state().data.children.get(0).errors.length).not.to.equal(0);
            expect(wrapper.state().data.children.get(1).errors.length).not.to.equal(0);
        });

        describe('obsInObsGroup', () => {
            const obsGroupConcept = {
                datatype: 'N/A',
                name: 'TestGroup',
                set: true,
                setMembers: [
                    {
                        answers: [],
                        datatype: 'Numeric',
                        description: [],
                        hiAbsolute: null,
                        hiNormal: null,
                        lowAbsolute: null,
                        lowNormal: null,
                        name: 'TestObs',
                        properties: {
                            allowDecimal: false,
                        },
                        units: null,
                        uuid: 'd0490af4-72eb-4090-9b43-ac3487ba7474',
                    },
                ],
                uuid: 'eafe7d68-904b-459b-b11d-6502ec0143a4',
            };
            const obsConcept = {
                answers: [],
                datatype: 'Numeric',
                description: [],
                hiAbsolute: null,
                hiNormal: null,
                lowAbsolute: null,
                lowNormal: null,
                name: 'TestObs',
                properties: {
                    allowDecimal: false,
                },
                units: null,
                uuid: 'd0490af4-72eb-4090-9b43-ac3487ba7474',
            };
            const activeFormFieldPath = 'SingleGroup.3/4-0';
            const obsRecord = new ControlRecord({
                control: {
                    concept: obsConcept,
                    hiAbsolute: null,
                    hiNormal: null,
                    id: '4',
                    label: {
                        type: 'label',
                        value: 'TestObs',
                    },
                    lowAbsolute: null,
                    lowNormal: null,
                    properties: {
                        addMore: true,
                        hideLabel: false,
                        location: {
                            column: 0,
                            row: 0,
                        },
                        mandatory: false,
                        notes: false,
                    },
                    type: 'obsControl',
                    units: null,
                },
                formFieldPath: activeFormFieldPath,
                value: {},
                active: true,
                dataSource: {
                    concept: obsConcept,
                    formFieldPath: 'SingleGroup.3/4-0',
                    formNamespace: 'Bahmni',
                    voided: true,
                },
            });

            it('should add one obs when onControlAdd is triggered with obs in obs group', () => {
                const obsGroupRecord = new ControlRecord({
                    control: {
                        concept: obsGroupConcept,
                        controls: [
                            {
                                concept: obsConcept,
                                hiAbsolute: null,
                                hiNormal: null,
                                id: '4',
                                label: {
                                    type: 'label',
                                    value: 'TestObs',
                                },
                                lowAbsolute: null,
                                lowNormal: null,
                                properties: {
                                    addMore: true,
                                    hideLabel: false,
                                    location: {
                                        column: 0,
                                        row: 0,
                                    },
                                    mandatory: false,
                                    notes: false,
                                },
                                type: 'obsControl',
                                units: null,
                            },
                        ],
                        id: '3',
                        label: {
                            type: 'label',
                            value: 'TestGroup',
                        },
                        properties: {
                            abnormal: false,
                            addMore: true,
                            location: {
                                column: 0,
                                row: 0,
                            },
                        },
                        type: 'obsGroupControl',
                    },
                    formFieldPath: 'SingleGroup.3/3-0',
                    children: List.of(obsRecord),
                    value: {},
                    active: true,
                    dataSource: {
                        concept: obsGroupConcept,
                        formFieldPath: 'SingleGroup.3/3-0',
                        formNamespace: 'Bahmni',
                        voided: true,
                    },
                });
                const obsTree = new ControlRecord({children: List.of(obsGroupRecord)});
                const wrapper = mount(
                    <Container
                        collapse
                        metadata={metadata}
                        observations={[]}
                        validate={false}
                    />
                );
                wrapper.setState({data: obsTree});
                wrapper.instance().onControlAdd(activeFormFieldPath);

                const updatedRootTree = wrapper.state().data;

                const obsGroupTree = updatedRootTree.children.get(0);
                expect(obsGroupTree.children.size).to.equal(2);
            });

            it('should remove one obs when onControlRemove is triggered with obs in obs group', () => {
                const removableFormFieldPath = 'SingleGroup.3/4-1';
                const removableObsRecord = new ControlRecord({
                    control: {
                        concept: obsConcept,
                        hiAbsolute: null,
                        hiNormal: null,
                        id: '4',
                        label: {
                            type: 'label',
                            value: 'TestObs',
                        },
                        lowAbsolute: null,
                        lowNormal: null,
                        properties: {
                            addMore: true,
                            hideLabel: false,
                            location: {
                                column: 0,
                                row: 0,
                            },
                            mandatory: false,
                            notes: false,
                        },
                        type: 'obsControl',
                        units: null,
                    },
                    formFieldPath: removableFormFieldPath,
                    value: {},
                    active: true,
                    dataSource: {
                        concept: obsConcept,
                        formFieldPath: 'SingleGroup.3/4-0',
                        formNamespace: 'Bahmni',
                        voided: true,
                    },
                });

                const obsGroupRecord = new ControlRecord({
                    control: {
                        concept: obsGroupConcept,
                        controls: [
                            {
                                concept: obsConcept,
                                hiAbsolute: null,
                                hiNormal: null,
                                id: '4',
                                label: {
                                    type: 'label',
                                    value: 'TestObs',
                                },
                                lowAbsolute: null,
                                lowNormal: null,
                                properties: {
                                    addMore: true,
                                    hideLabel: false,
                                    location: {
                                        column: 0,
                                        row: 0,
                                    },
                                    mandatory: false,
                                    notes: false,
                                },
                                type: 'obsControl',
                                units: null,
                            },
                        ],
                        id: '3',
                        label: {
                            type: 'label',
                            value: 'TestGroup',
                        },
                        properties: {
                            abnormal: false,
                            addMore: true,
                            location: {
                                column: 0,
                                row: 0,
                            },
                        },
                        type: 'obsGroupControl',
                    },
                    formFieldPath: 'SingleGroup.3/3-0',
                    children: List.of(obsRecord, removableObsRecord),
                    value: {},
                    active: true,
                    dataSource: {
                        concept: obsGroupConcept,
                        formFieldPath: 'SingleGroup.3/3-0',
                        formNamespace: 'Bahmni',
                        voided: true,
                    },
                });
                const obsTree = new ControlRecord({children: List.of(obsGroupRecord)});
                const wrapper = mount(
                    <Container
                        collapse
                        metadata={metadata}
                        observations={[]}
                        validate={false}
                    />
                );
                wrapper.setState({data: obsTree});
                wrapper.instance().onControlRemove(removableFormFieldPath);

                const updatedRootTree = wrapper.state().data;

                const obsGroupTree = updatedRootTree.children.get(0);
                expect(obsGroupTree.children.get(0).active).to.equal(true);
                expect(obsGroupTree.children.get(1).active).to.equal(false);
                expect(obsGroupTree.children.get(1).formFieldPath).to.equal(removableFormFieldPath);
            });
        });

        describe('obsInSection', () => {
            const obsGroupConcept = {
                datatype: 'N/A',
                name: 'TestGroup',
                set: true,
                setMembers: [
                    {
                        answers: [],
                        datatype: 'Numeric',
                        description: [],
                        hiAbsolute: null,
                        hiNormal: null,
                        lowAbsolute: null,
                        lowNormal: null,
                        name: 'TestObs',
                        properties: {
                            allowDecimal: false,
                        },
                        units: null,
                        uuid: 'd0490af4-72eb-4090-9b43-ac3487ba7474',
                    },
                ],
                uuid: 'eafe7d68-904b-459b-b11d-6502ec0143a4',
            };
            const obsConcept = {
                answers: [],
                datatype: 'Numeric',
                description: [],
                hiAbsolute: null,
                hiNormal: null,
                lowAbsolute: null,
                lowNormal: null,
                name: 'TestObs',
                properties: {
                    allowDecimal: false,
                },
                units: null,
                uuid: 'd0490af4-72eb-4090-9b43-ac3487ba7474',
            };
            const obsFormFieldPath = 'SectionWithObsGroup.1/3-0';
            const obsRecord = new ControlRecord({
                control: {
                    concept: obsConcept,
                    hiAbsolute: null,
                    hiNormal: null,
                    id: '3',
                    label: {
                        type: 'label',
                        value: 'TestObs',
                    },
                    lowAbsolute: null,
                    lowNormal: null,
                    properties: {
                        addMore: true,
                        hideLabel: false,
                        location: {
                            column: 0,
                            row: 0,
                        },
                        mandatory: false,
                        notes: false,
                    },
                    type: 'obsControl',
                    units: null,
                },
                value: {},
                dataSource: {
                    concept: obsConcept,
                    formFieldPath: obsFormFieldPath,
                    formNamespace: 'Bahmni',
                    voided: true,
                },
                formFieldPath: obsFormFieldPath,
            });

            it('should add one obs when onControlAdd is triggered ' +
                'with obs of obs group in section', () => {
                const obsGroupRecord = new ControlRecord({
                    control: {
                        concept: obsGroupConcept,
                        controls: [
                            {
                                concept: obsConcept,
                                hiAbsolute: null,
                                hiNormal: null,
                                id: '3',
                                label: {
                                    type: 'label',
                                    value: 'TestObs',
                                },
                                lowAbsolute: null,
                                lowNormal: null,
                                properties: {
                                    addMore: true,
                                    hideLabel: false,
                                    location: {
                                        column: 0,
                                        row: 0,
                                    },
                                    mandatory: false,
                                    notes: false,
                                },
                                type: 'obsControl',
                                units: null,
                            },
                        ],
                        id: '2',
                        label: {
                            type: 'label',
                            value: 'TestGroup',
                        },
                        properties: {
                            abnormal: false,
                            addMore: false,
                            location: {
                                column: 0,
                                row: 0,
                            },
                        },
                        type: 'obsGroupControl',
                    },
                    formFieldPath: 'SectionWithObsGroup.1/2-0',
                    value: {},
                    children: List.of(obsRecord),
                    dataSource: {
                        concept: obsGroupConcept,
                        formFieldPath: 'SectionWithObsGroup.1/2-0',
                        formNamespace: 'Bahmni',
                        voided: true,
                    },
                });
                const sectionRecord = new ControlRecord({
                    control: {
                        controls: [
                            {
                                concept: obsGroupConcept,
                                controls: [
                                    {
                                        concept: {
                                            answers: [],
                                            datatype: 'Numeric',
                                            description: [],
                                            hiAbsolute: null,
                                            hiNormal: null,
                                            lowAbsolute: null,
                                            lowNormal: null,
                                            name: 'TestObs',
                                            properties: {
                                                allowDecimal: false,
                                            },
                                            units: null,
                                            uuid: 'd0490af4-72eb-4090-9b43-ac3487ba7474',
                                        },
                                        hiAbsolute: null,
                                        hiNormal: null,
                                        id: '3',
                                        label: {
                                            type: 'label',
                                            value: 'TestObs',
                                        },
                                        lowAbsolute: null,
                                        lowNormal: null,
                                        properties: {
                                            addMore: true,
                                            hideLabel: false,
                                            location: {
                                                column: 0,
                                                row: 0,
                                            },
                                            mandatory: false,
                                            notes: false,
                                        },
                                        type: 'obsControl',
                                        units: null,
                                    },
                                ],
                                id: '2',
                                label: {
                                    type: 'label',
                                    value: 'TestGroup',
                                },
                                properties: {
                                    abnormal: false,
                                    addMore: false,
                                    location: {
                                        column: 0,
                                        row: 0,
                                    },
                                },
                                type: 'obsGroupControl',
                            },
                        ],
                        id: '1',
                        label: {
                            type: 'label',
                            value: 'Section',
                        },
                        properties: {
                            location: {
                                column: 0,
                                row: 0,
                            },
                        },
                        type: 'section',
                    },
                    value: {},
                    formFieldPath: 'obsGroupInSection.1/1-0',
                    dataSource: {
                        formFieldPath: 'SectionWithObsGroup.1/1-0',
                        obsList: [],
                    },
                    children: List.of(obsGroupRecord),
                });
                const obsTree = new ControlRecord({children: List.of(sectionRecord)});

                const wrapper = mount(
                    <Container
                        collapse
                        metadata={metadata}
                        observations={[]}
                        validate={false}
                    />
                );
                wrapper.setState({data: obsTree});
                wrapper.instance().onControlAdd(obsFormFieldPath);

                const updatedRootTree = wrapper.state().data;
                const sectionTree = updatedRootTree.children.get(0);

                expect(sectionTree.children.get(0).children.size).to.equal(2);
            });

            it('should remove one obs when onControlRemove is triggered ' +
                'with obs of obs group in section', () => {
                const removableFormFieldPath = 'SectionWithObsGroup.1/3-1';
                const removableObsRecord = new ControlRecord({
                    control: {
                        concept: obsConcept,
                        hiAbsolute: null,
                        hiNormal: null,
                        id: '3',
                        label: {
                            type: 'label',
                            value: 'TestObs',
                        },
                        lowAbsolute: null,
                        lowNormal: null,
                        properties: {
                            addMore: true,
                            hideLabel: false,
                            location: {
                                column: 0,
                                row: 0,
                            },
                            mandatory: false,
                            notes: false,
                        },
                        type: 'obsControl',
                        units: null,
                    },
                    value: {},
                    dataSource: {
                        concept: obsConcept,
                        formFieldPath: obsFormFieldPath,
                        formNamespace: 'Bahmni',
                        voided: true,
                    },
                    formFieldPath: removableFormFieldPath,
                });
                const obsGroupRecord = new ControlRecord({
                    control: {
                        concept: obsGroupConcept,
                        controls: [
                            {
                                concept: obsConcept,
                                hiAbsolute: null,
                                hiNormal: null,
                                id: '3',
                                label: {
                                    type: 'label',
                                    value: 'TestObs',
                                },
                                lowAbsolute: null,
                                lowNormal: null,
                                properties: {
                                    addMore: true,
                                    hideLabel: false,
                                    location: {
                                        column: 0,
                                        row: 0,
                                    },
                                    mandatory: false,
                                    notes: false,
                                },
                                type: 'obsControl',
                                units: null,
                            },
                        ],
                        id: '2',
                        label: {
                            type: 'label',
                            value: 'TestGroup',
                        },
                        properties: {
                            abnormal: false,
                            addMore: false,
                            location: {
                                column: 0,
                                row: 0,
                            },
                        },
                        type: 'obsGroupControl',
                    },
                    formFieldPath: 'SectionWithObsGroup.1/2-0',
                    value: {},
                    children: List.of(obsRecord, removableObsRecord),
                    dataSource: {
                        concept: obsGroupConcept,
                        formFieldPath: 'SectionWithObsGroup.1/2-0',
                        formNamespace: 'Bahmni',
                        voided: true,
                    },
                });
                const sectionRecord = new ControlRecord({
                    control: {
                        controls: [
                            {
                                concept: obsGroupConcept,
                                controls: [
                                    {
                                        concept: {
                                            answers: [],
                                            datatype: 'Numeric',
                                            description: [],
                                            hiAbsolute: null,
                                            hiNormal: null,
                                            lowAbsolute: null,
                                            lowNormal: null,
                                            name: 'TestObs',
                                            properties: {
                                                allowDecimal: false,
                                            },
                                            units: null,
                                            uuid: 'd0490af4-72eb-4090-9b43-ac3487ba7474',
                                        },
                                        hiAbsolute: null,
                                        hiNormal: null,
                                        id: '3',
                                        label: {
                                            type: 'label',
                                            value: 'TestObs',
                                        },
                                        lowAbsolute: null,
                                        lowNormal: null,
                                        properties: {
                                            addMore: true,
                                            hideLabel: false,
                                            location: {
                                                column: 0,
                                                row: 0,
                                            },
                                            mandatory: false,
                                            notes: false,
                                        },
                                        type: 'obsControl',
                                        units: null,
                                    },
                                ],
                                id: '2',
                                label: {
                                    type: 'label',
                                    value: 'TestGroup',
                                },
                                properties: {
                                    abnormal: false,
                                    addMore: false,
                                    location: {
                                        column: 0,
                                        row: 0,
                                    },
                                },
                                type: 'obsGroupControl',
                            },
                        ],
                        id: '1',
                        label: {
                            type: 'label',
                            value: 'Section',
                        },
                        properties: {
                            location: {
                                column: 0,
                                row: 0,
                            },
                        },
                        type: 'section',
                    },
                    value: {},
                    formFieldPath: 'obsGroupInSection.1/1-0',
                    dataSource: {
                        formFieldPath: 'SectionWithObsGroup.1/1-0',
                        obsList: [],
                    },
                    children: List.of(obsGroupRecord),
                });
                const obsTree = new ControlRecord({children: List.of(sectionRecord)});

                const wrapper = mount(
                    <Container
                        collapse
                        metadata={metadata}
                        observations={[]}
                        validate={false}
                    />
                );
                wrapper.setState({data: obsTree});
                wrapper.instance().onControlRemove(removableFormFieldPath);

                const updatedRootTree = wrapper.state().data;
                const obsGroupTree = updatedRootTree.children.get(0).children.get(0);

                expect(obsGroupTree.children.get(0).active).to.equal(true);
                expect(obsGroupTree.children.get(1).active).to.equal(false);
                expect(obsGroupTree.children.get(1).formFieldPath).to.equal(removableFormFieldPath);
            });
        });

        describe('obsGroupInSection', () => {
           it('should add one obs group when onControlAdd is triggered with obs group in section', () => {
               let concept = {
                   "datatype": "N/A",
                   "name": "Pulse Data",
                   "set": true,
                   "setMembers": [
                       {
                           "answers": [],
                           "datatype": "Numeric",
                           "description": [],
                           "hiAbsolute": null,
                           "hiNormal": 72,
                           "lowAbsolute": null,
                           "lowNormal": 72,
                           "name": "Pulse(/min)",
                           "properties": {
                               "allowDecimal": true
                           },
                           "units": "/min",
                           "uuid": "c36bc411-3f10-11e4-adec-0800271c1b75"
                       },
                       {
                           "answers": [],
                           "datatype": "Boolean",
                           "description": [],
                           "hiAbsolute": null,
                           "hiNormal": null,
                           "lowAbsolute": null,
                           "lowNormal": null,
                           "name": "Pulse Abnormal",
                           "properties": {
                               "allowDecimal": null
                           },
                           "units": null,
                           "uuid": "c36c7c98-3f10-11e4-adec-0800271c1b75"
                       }
                   ],
                   "uuid": "c36af094-3f10-11e4-adec-0800271c1b75"
               };
               let obsGroupConcept = {
                   "datatype": "N/A",
                   "name": "Pulse Data",
                   "set": true,
                   "setMembers": [
                       {
                           "answers": [],
                           "datatype": "Numeric",
                           "description": [],
                           "hiAbsolute": null,
                           "hiNormal": 72,
                           "lowAbsolute": null,
                           "lowNormal": 72,
                           "name": "Pulse(/min)",
                           "properties": {
                               "allowDecimal": true
                           },
                           "units": "/min",
                           "uuid": "c36bc411-3f10-11e4-adec-0800271c1b75"
                       },
                       {
                           "answers": [],
                           "datatype": "Boolean",
                           "description": [],
                           "hiAbsolute": null,
                           "hiNormal": null,
                           "lowAbsolute": null,
                           "lowNormal": null,
                           "name": "Pulse Abnormal",
                           "properties": {
                               "allowDecimal": null
                           },
                           "units": null,
                           "uuid": "c36c7c98-3f10-11e4-adec-0800271c1b75"
                       }
                   ],
                   "uuid": "c36af094-3f10-11e4-adec-0800271c1b75"
               };
               let addedFormFieldPath = 'obsGroupInSection.1/2-0';
               const obsGroupRecord = new ControlRecord({
                   value: {},
                   control:{
                       "concept": obsGroupConcept,
                       "controls": [
                           {
                               "concept": {
                                   "answers": [],
                                   "datatype": "Numeric",
                                   "description": [],
                                   "hiAbsolute": null,
                                   "hiNormal": 72,
                                   "lowAbsolute": null,
                                   "lowNormal": 72,
                                   "name": "Pulse(/min)",
                                   "properties": {
                                       "allowDecimal": true
                                   },
                                   "units": "/min",
                                   "uuid": "c36bc411-3f10-11e4-adec-0800271c1b75"
                               },
                               "hiAbsolute": null,
                               "hiNormal": 72,
                               "id": "3",
                               "label": {
                                   "type": "label",
                                   "value": "Pulse(/min)"
                               },
                               "lowAbsolute": null,
                               "lowNormal": 72,
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
                               "units": "/min"
                           },
                           {
                               "concept": {
                                   "answers": [],
                                   "datatype": "Boolean",
                                   "description": [],
                                   "hiAbsolute": null,
                                   "hiNormal": null,
                                   "lowAbsolute": null,
                                   "lowNormal": null,
                                   "name": "Pulse Abnormal",
                                   "properties": {
                                       "allowDecimal": null
                                   },
                                   "units": null,
                                   "uuid": "c36c7c98-3f10-11e4-adec-0800271c1b75"
                               },
                               "hiAbsolute": null,
                               "hiNormal": null,
                               "id": "4",
                               "label": {
                                   "type": "label",
                                   "value": "Pulse Abnormal"
                               },
                               "lowAbsolute": null,
                               "lowNormal": null,
                               "options": [
                                   {
                                       "name": "Yes",
                                       "value": true
                                   },
                                   {
                                       "name": "No",
                                       "value": false
                                   }
                               ],
                               "properties": {
                                   "addMore": false,
                                   "hideLabel": false,
                                   "location": {
                                       "column": 0,
                                       "row": 1
                                   },
                                   "mandatory": false,
                                   "notes": false
                               },
                               "type": "obsControl",
                               "units": null
                           }
                       ],
                       "id": "2",
                       "label": {
                           "type": "label",
                           "value": "Pulse Data"
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
                   formFieldPath: addedFormFieldPath,
                   dataSource:{
                       "concept": obsGroupConcept,
                       "formFieldPath": "obsGroupInSection.1/2-0",
                       "formNamespace": "Bahmni",
                       "voided": true
                   }
               });
               const sectionRecord = new ControlRecord({
                   value: {},
                   control:{
                       "controls": [
                           {
                               "concept": concept,
                               "controls": [
                                   {
                                       "concept": {
                                           "answers": [],
                                           "datatype": "Numeric",
                                           "description": [],
                                           "hiAbsolute": null,
                                           "hiNormal": 72,
                                           "lowAbsolute": null,
                                           "lowNormal": 72,
                                           "name": "Pulse(/min)",
                                           "properties": {
                                               "allowDecimal": true
                                           },
                                           "units": "/min",
                                           "uuid": "c36bc411-3f10-11e4-adec-0800271c1b75"
                                       },
                                       "hiAbsolute": null,
                                       "hiNormal": 72,
                                       "id": "3",
                                       "label": {
                                           "type": "label",
                                           "value": "Pulse(/min)"
                                       },
                                       "lowAbsolute": null,
                                       "lowNormal": 72,
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
                                       "units": "/min"
                                   },
                                   {
                                       "concept": {
                                           "answers": [],
                                           "datatype": "Boolean",
                                           "description": [],
                                           "hiAbsolute": null,
                                           "hiNormal": null,
                                           "lowAbsolute": null,
                                           "lowNormal": null,
                                           "name": "Pulse Abnormal",
                                           "properties": {
                                               "allowDecimal": null
                                           },
                                           "units": null,
                                           "uuid": "c36c7c98-3f10-11e4-adec-0800271c1b75"
                                       },
                                       "hiAbsolute": null,
                                       "hiNormal": null,
                                       "id": "4",
                                       "label": {
                                           "type": "label",
                                           "value": "Pulse Abnormal"
                                       },
                                       "lowAbsolute": null,
                                       "lowNormal": null,
                                       "options": [
                                           {
                                               "name": "Yes",
                                               "value": true
                                           },
                                           {
                                               "name": "No",
                                               "value": false
                                           }
                                       ],
                                       "properties": {
                                           "addMore": false,
                                           "hideLabel": false,
                                           "location": {
                                               "column": 0,
                                               "row": 1
                                           },
                                           "mandatory": false,
                                           "notes": false
                                       },
                                       "type": "obsControl",
                                       "units": null
                                   }
                               ],
                               "id": "2",
                               "label": {
                                   "type": "label",
                                   "value": "Pulse Data"
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
                       "id": "1",
                       "label": {
                           "type": "label",
                           "value": "Section"
                       },
                       "properties": {
                           "location": {
                               "column": 0,
                               "row": 0
                           }
                       },
                       "type": "section"
                   },
                   formFieldPath: 'obsGroupInSection.1/1-0',
                   dataSource:{
                       "formFieldPath": "obsGroupInSection.1/1-0",
                       "obsList": []
                   },
                   children: List.of(obsGroupRecord)
               });
               const rootTree = new ControlRecord({children: List.of(sectionRecord)});
               const wrapper = mount(
                   <Container
                       collapse
                       metadata={metadata}
                       observations={[]}
                       validate={false}
                   />
               );
               wrapper.setState({data: rootTree});
               wrapper.instance().onControlAdd(addedFormFieldPath);

               const updatedRootTree = wrapper.state().data;

               const sectionTree = updatedRootTree.children.get(0);

               expect(sectionTree.children.size).to.equal(2);
           });

           // it('should remove one obs group when onControlAdd is triggered with obs group in section', () => {
           //     const sectionRecord = new ControlRecord({
           //         value: {},
           //         formFieldPath: 'obsGroupInSection.2/1-0',
           //         control:,
           //         dataSource:,
           //         children: List.of(obsGroupRecord)
           //     });
           //     const rootTree = new ControlRecord({children: List.of(sectionRecord)});
           //     const wrapper = mount(
           //         <Container
           //             collapse
           //             metadata={metadata}
           //             observations={[]}
           //             validate={false}
           //         />
           //     );
           //     wrapper.setState({data: rootTree});
           //     wrapper.instance().onControlAdd(addedFormFieldPath);
           //
           //     const updatedRootTree = wrapper.state().data;
           // });
        });
    });
});
