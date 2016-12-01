import React from 'react';
import { mount, shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { AutoComplete } from '../../src/components/AutoComplete.jsx';
import sinon from 'sinon';
import constants from 'src/constants';
import { Error } from 'src/Error';

chai.use(chaiEnzyme());

describe('AutoComplete', () => {
  before(() => {
    window.componentStore.registerComponent('autoComplete', AutoComplete);
  });

  after(() => {
    window.componentStore.deRegisterComponent('autoComplete');
  });

  const concept = [{
    uuid: '70645842-be6a-4974-8d5f-45b52990e132',
    name: 'Pulse',
    dataType: 'Text',
  }];

  const options = [
    { name: 'one', value: 'One' },
    { name: 'two', value: 'Two' },
    { name: 'three', value: 'Three' },
  ];

  context('when component is asynchronous', () => {
    it('should render asynchronous AutoComplete', () => {
      const wrapper = mount(<AutoComplete />);
      expect(wrapper.find('Select').props().valueKey).to.be.eql('uuid');
      expect(wrapper.find('Select').props().labelKey).to.be.eql('display');
      expect(wrapper.find('Select').props().minimumInput).to.be.eql(2);
      expect(wrapper.find('Select').props().disabled).to.be.eql(false);
    });

    it('should render asynchronous AutoComplete with default value', () => {
      const wrapper = mount(<AutoComplete value={concept} />);
      expect(wrapper.find('Select').props().value).to.be.eql(concept[0]);
    });

    it('should return the default value of the AutoComplete if there is no change', () => {
      const wrapper = mount(<AutoComplete value={concept} />);
      expect(wrapper.find('Select').props().value).to.be.eql(concept[0]);

      const instance = wrapper.instance();
      expect(instance.getValue()).to.eql(concept);
    });

    it('should clear the options on Focus for aysnchronous', () => {
      const wrapper = mount(<AutoComplete />);
      const instance = wrapper.instance();
      const loadOptionsSpy = sinon.spy(instance.childRef, 'loadOptions');
      wrapper.find('Select').props().onFocus();
      sinon.assert.calledOnce(loadOptionsSpy);
    });
  });

  context('when component is not asynchronous', () => {
    it('should render AutoComplete', () => {
      const wrapper = mount(<AutoComplete asynchronous={false} options={options} />);
      expect(wrapper.find('Select').props().valueKey).to.be.eql('uuid');
      expect(wrapper.find('Select').props().labelKey).to.be.eql('display');
      expect(wrapper.find('Select').props().minimumInput).to.be.eql(2);
      expect(wrapper.find('Select').props().options).to.be.eql([]);
    });

    it('should render AutoComplete with default value', () => {
      const wrapper = mount(
        <AutoComplete
          asynchronous={false}
          options={options}
          value={[options[0]]}
        />);
      expect(wrapper.find('Select').props().options).to.be.eql([]);
      expect(wrapper.find('Select').props().value).to.be.eql(options[0]);
    });

    it('should return the selected value from the AutoComplete', () => {
      const onSelectSpy = sinon.spy();
      const wrapper = mount(
        <AutoComplete
          asynchronous={false}
          onValueChange={onSelectSpy}
          options={options}
        />);

      const onChange = wrapper.find('Select').props().onChange;
      onChange(options[0]);
      const instance = wrapper.instance();
      expect(instance.getValue()).to.eql([options[0]]);
    });

    it('should call onSelect method of props on change', () => {
      const onValueChange = sinon.spy();
      const wrapper = mount(
        <AutoComplete
          asynchronous={false}
          onValueChange={onValueChange}
          options={options}
        />);
      const onChange = wrapper.find('Select').props().onChange;
      onChange(options[0]);
      sinon.assert.calledOnce(onValueChange.withArgs(options[0], []));
    });

    it('should change value on change of props', () => {
      const wrapper = shallow(
        <AutoComplete
          asynchronous={false}
          options={options}
          value={[options[0]]}
        />);
      wrapper.setProps({ value: [options[1]] });
      const instance = wrapper.instance();
      expect(instance.getValue()).to.eql([options[1]]);
    });

    it('should pass disabled value from props to the Select Component', () => {
      const wrapper = shallow(
        <AutoComplete
          asynchronous={false}
          disabled
          options={options}
          value={[options[0]]}
        />);
      expect(wrapper.find('Select').props().disabled).to.be.eql(true);
    });

    it('should run the validations for autoComplete', () => {
      const onValueChange = sinon.spy();
      const validations = [constants.validations.mandatory];
      const wrapper = mount(
        <AutoComplete
          asynchronous={false}
          onValueChange={onValueChange}
          options={options}
          validations={validations}
          value={[options[0]]}
        />);

      const onChange = wrapper.find('Select').props().onChange;
      onChange(undefined);
      const mandatoryError = new Error({ message: constants.validations.mandatory });
      sinon.assert.calledOnce(onValueChange.withArgs(undefined, [mandatoryError]));
    });

    it('should test onInputChange', () => {
      const wrapper = mount(
        <AutoComplete
          asynchronous={false}
          options={options}
          validations={[]}
          value={[options[0]]}
        />);
      const instance = wrapper.instance();
      expect(instance.state.options.length).to.eql(0);
      expect(instance.state.noResultsText).to.eql('');

      wrapper.find('input').simulate('change', { target: { value: 'aa' } });
      expect(instance.state.options.length).to.eql(3);
      expect(instance.state.noResultsText).to.eql('No Results Found');

      wrapper.find('input').simulate('change', { target: { value: 'a' } });
      expect(instance.state.options.length).to.eql(0);
      expect(instance.state.noResultsText).to.eql('Type to search');

      wrapper.find('input').simulate('change', { target: { value: 'akkk' } });
      expect(instance.state.noResultsText).to.eql('No Results Found');
    });
  });
});
