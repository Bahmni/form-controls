import React from 'react';
import { mount, shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { CodedControlDesigner } from 'components/designer/CodedControl.jsx';
import ComponentStore from 'src/helpers/componentStore';
import cloneDeep from 'lodash/cloneDeep';
import sinon from 'sinon';
import { httpInterceptor } from 'src/helpers/httpInterceptor';

chai.use(chaiEnzyme());
const sinonStubPromise = require('sinon-stub-promise');
sinonStubPromise(sinon);

describe('Coded Control Designer', () => {
  const DummyControl = () => <input />;

  let metadata;
  let codedDataStub;

  context('when FHIR Value set url is provided', () => {
    beforeEach(() => {
      metadata = {
        id: '100',
        type: 'obsControl',
        concept: {
          uuid: '70645842-be6a-4974-8d5f-45b52990e132',
          name: 'Pulse',
          datatype: 'Coded',
          answers: [],
        },
        properties: {
          URL: 'someUrl',
        },
      };
      codedDataStub = sinon.stub(httpInterceptor, 'get');
    });

    afterEach(() => codedDataStub.restore());

    it('should throw error if given URL is invalid', () => {
      const setErrorSpy = sinon.spy();
      codedDataStub.returnsPromise().rejects('error');
      mount(
        <CodedControlDesigner metadata={metadata} setError={setErrorSpy} />
      );
      sinon.assert.calledOnce(
        setErrorSpy.withArgs({ message: 'Something unexpected happened.' })
      );
    });
  });

  context('when FHIR Value set url is not provided', () => {
    before(() => {
      ComponentStore.registerDesignerComponent('button', {
        control: DummyControl,
      });
    });

    after(() => {
      ComponentStore.deRegisterDesignerComponent('button');
    });

    beforeEach(() => {
      metadata = {
        id: '100',
        type: 'obsControl',
        concept: {
          uuid: '70645842-be6a-4974-8d5f-45b52990e132',
          name: 'Pulse',
          datatype: 'Coded',
          answers: [
            {
              name: {
                display: 'answer1',
              },
              uuid: 'uuid',
            },
          ],
        },
        properties: {},
      };
    });

    it('should render Dummy Control with concept answers', () => {
      const wrapper = shallow(<CodedControlDesigner metadata={metadata} />);

      expect(wrapper).to.have.exactly(1).descendants('DummyControl');
      expect(wrapper.find('DummyControl').props().options).to.deep.eql([
        { name: 'answer1', value: 'uuid' },
      ]);
    });

    it('should return the JSON Definition', () => {
      const wrapper = mount(<CodedControlDesigner metadata={metadata} />);
      const instance = wrapper.instance();
      const clonedMetadata = cloneDeep(metadata);
      clonedMetadata.concept.answers[0].translationKey = 'ANSWER1_100';
      expect(instance.getJsonDefinition()).to.deep.eql(clonedMetadata);
    });

    it('should render Dummy Control of displayType button by default', () => {
      const wrapper = mount(<CodedControlDesigner metadata={metadata} />);

      expect(wrapper).to.have.exactly(1).descendants('DummyControl');
      expect(Object.keys(wrapper.find('DummyControl').props())).to.have.length(
        3
      );
    });

    it('should return null when registered component not found', () => {
      ComponentStore.deRegisterDesignerComponent('button');

      const wrapper = shallow(<CodedControlDesigner metadata={metadata} />);
      expect(wrapper).to.be.blank();

      ComponentStore.registerDesignerComponent('button', {
        control: DummyControl,
      });
    });

    it('should return autocomplete/dropdown when metadata is passed to _getDisplayType', () => {
      const wrapper = shallow(<CodedControlDesigner metadata={metadata} />);
      const instance = wrapper.instance();
      const newMetadata = cloneDeep(metadata);
      newMetadata.properties.autoComplete = true;
      expect(instance._getDisplayType(newMetadata.properties)).to.eql(
        'autoComplete'
      );
      newMetadata.properties.autoComplete = false;
      newMetadata.properties.dropDown = true;
      expect(instance._getDisplayType(newMetadata.properties)).to.eql(
        'dropDown'
      );
    });
  });
});
