/* eslint-disable no-undef */

import { expect } from 'chai';
import { TextBox } from 'components/TextBox.jsx';
import { Label } from 'components/Label.jsx';
import 'src/helpers/componentStore';

describe('ComponentStore', () => {
  beforeEach(() => {
    componentStore.deRegisterComponent('text');
    componentStore.deRegisterComponent('label');
    componentStore.deRegisterDesignerComponent('text');
    componentStore.deRegisterDesignerComponent('label');
  });

  after(() => {
    componentStore.deRegisterComponent('text');
    componentStore.deRegisterComponent('label');
    componentStore.deRegisterDesignerComponent('text');
    componentStore.deRegisterDesignerComponent('label');
  });

  describe('registerComponent', () => {
    it('should register a component', () => {
      componentStore.registerComponent('text', TextBox);
      expect(componentStore.componentList).to.deep.eql({ text: TextBox });
    });

    it('should override a component if type is same', () => {

      const type = 'text';
      componentStore.registerComponent(type, TextBox);
      expect(componentStore.getRegisteredComponent(type)).to.deep.eql(TextBox);
      componentStore.registerComponent(type, Label);
      expect(componentStore.getRegisteredComponent(type)).to.deep.eql(Label);
    });
  });

  describe('registerDesignerComponent', () => {
    it('should register a designer component', () => {
      const type = 'teXt';
      componentStore.registerDesignerComponent(type, TextBox);
      expect(componentStore.getDesignerComponent(type)).to.deep.eql(TextBox);
    });

    it('should override a designer component if type is same', () => {
      const type = 'text';
      componentStore.registerDesignerComponent(type, TextBox);
      expect(componentStore.getDesignerComponent(type)).to.deep.eql(TextBox);
      componentStore.registerDesignerComponent(type, Label);
      expect(componentStore.getDesignerComponent(type)).to.deep.eql(Label);
    });
  });

  describe('getRegisteredComponent', () => {
    it('should return the registered component', () => {
      const type = 'text';
      componentStore.registerComponent(type, TextBox);
      const registeredComponent = componentStore.getRegisteredComponent(type);
      expect(registeredComponent).to.eql(TextBox);
    });

    it('should return the registered component irrespective of case of type', () => {
      const type = 'TexT';
      componentStore.registerComponent(type, TextBox);
      expect(componentStore.getRegisteredComponent(type)).to.deep.eql(TextBox);

      const registeredComponent = componentStore.getRegisteredComponent('tEXt');
      expect(registeredComponent).to.eql(TextBox);
    });

    it('should return undefined when no matching component found', () => {
      const registeredComponent = componentStore.getRegisteredComponent('something');
      expect(registeredComponent).to.eql(undefined);
    });
  });

  describe('getRegisteredDesignerComponent', () => {
    it('should return the registered designer component', () => {
      componentStore.registerDesignerComponent('text', TextBox);
      const registeredDesignerComponent = componentStore.getDesignerComponent('text');
      expect(registeredDesignerComponent).to.eql(TextBox);
    });

    it('should return the registered designer component irrespective of case of type', () => {
      const type = 'TexT';
      componentStore.registerDesignerComponent(type, TextBox);
      expect(componentStore.getDesignerComponent(type)).to.deep.eql(TextBox);

      const registeredDesignerComponent = componentStore.getDesignerComponent('tEXt');
      expect(registeredDesignerComponent).to.eql(TextBox);
    });

    it('should return undefined when no matching designer component found', () => {
      const registeredDesignerComponent = componentStore.getDesignerComponent('something');
      expect(registeredDesignerComponent).to.eql(undefined);
    });
  });

  describe('deRegisterComponent', () => {
    it('should deRegisterComponent component irrespective of case', () => {
      componentStore.registerComponent('tEXt', TextBox);
      expect(componentStore.getRegisteredComponent('tEXt')).to.deep.eql(TextBox);
      componentStore.deRegisterComponent('TexT');
      componentStore.deRegisterComponent('someRandomThing');
      expect(componentStore.getRegisteredComponent('TexT')).to.eql(undefined);
      expect(componentStore.getRegisteredComponent('someRandomThing')).to.deep.eql(undefined);
    });
  });

  describe('deRegisterDesignerComponent', () => {
    it('should deRegisterComponent designer component irrespective of case', () => {
      componentStore.registerDesignerComponent('tEXt', TextBox);
      expect(componentStore.getDesignerComponent('tEXt')).to.deep.eql(TextBox);
      componentStore.deRegisterDesignerComponent('TexT');
      componentStore.deRegisterDesignerComponent('someRandomThing');
      expect(componentStore.getRegisteredComponent('TexT')).to.eql(undefined);
      expect(componentStore.getRegisteredComponent('someRandomThing')).to.eql(undefined);
    });
  });

  describe('getAllRegisteredComponents', () => {
    it('should return all the registered components', () => {
      const expectedComponents = { text: TextBox, label: Label };
      componentStore.registerComponent('text', TextBox);
      componentStore.registerComponent('label', Label);
      expect(componentStore.getAllRegisteredComponents()).to.deep.eql(expectedComponents);
    });
  });

  describe('getAllDesignerComponents', () => {
    it('should return all the registered designer components', () => {
      const expectedComponents = { text: TextBox, label: Label };
      componentStore.registerDesignerComponent('text', TextBox);
      componentStore.registerDesignerComponent('label', Label);
      expect(componentStore.getAllDesignerComponents()).to.deep.eql(expectedComponents);
    });
  });
});
