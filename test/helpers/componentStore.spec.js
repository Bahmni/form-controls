import { expect } from 'chai';
import { TextBox } from 'components/TextBox/TextBox.jsx';
import { Label } from 'components/Label.jsx';
import ComponentStore from 'src/helpers/componentStore';

describe('ComponentStore', () => {
  beforeEach(() => {
    ComponentStore.componentList = {};
    ComponentStore.designerComponentList = {};
  });

  describe('registerComponent', () => {
    it('should register a component', () => {
      ComponentStore.registerComponent('text', TextBox);
      expect(ComponentStore.componentList).to.deep.eql({ text: TextBox });
    });

    it('should override a component if type is same', () => {
      const type = 'text';
      ComponentStore.registerComponent(type, TextBox);
      expect(ComponentStore.getRegisteredComponent(type)).to.deep.eql(TextBox);
      ComponentStore.registerComponent(type, Label);
      expect(ComponentStore.getRegisteredComponent(type)).to.deep.eql(Label);
    });
  });

  describe('registerDesignerComponent', () => {
    it('should register a designer component', () => {
      const type = 'teXt';
      ComponentStore.registerDesignerComponent(type, TextBox);
      expect(ComponentStore.getDesignerComponent(type)).to.deep.eql(TextBox);
    });

    it('should override a designer component if type is same', () => {
      const type = 'text';
      ComponentStore.registerDesignerComponent(type, TextBox);
      expect(ComponentStore.getDesignerComponent(type)).to.deep.eql(TextBox);
      ComponentStore.registerDesignerComponent(type, Label);
      expect(ComponentStore.getDesignerComponent(type)).to.deep.eql(Label);
    });
  });

  describe('getRegisteredComponent', () => {
    it('should return the registered component', () => {
      const type = 'text';
      ComponentStore.registerComponent(type, TextBox);
      const registeredComponent = ComponentStore.getRegisteredComponent(type);
      expect(registeredComponent).to.eql(TextBox);
    });

    it('should return the registered component irrespective of case of type', () => {
      const type = 'TexT';
      ComponentStore.registerComponent(type, TextBox);
      expect(ComponentStore.getRegisteredComponent(type)).to.deep.eql(TextBox);

      const registeredComponent = ComponentStore.getRegisteredComponent('tEXt');
      expect(registeredComponent).to.eql(TextBox);
    });

    it('should return undefined when no matching component found', () => {
      const registeredComponent = ComponentStore.getRegisteredComponent('something');
      expect(registeredComponent).to.eql(undefined);
    });
  });

  describe('getRegisteredDesignerComponent', () => {
    it('should return the registered designer component', () => {
      ComponentStore.registerDesignerComponent('text', TextBox);
      const registeredDesignerComponent = ComponentStore.getDesignerComponent('text');
      expect(registeredDesignerComponent).to.eql(TextBox);
    });

    it('should return the registered designer component irrespective of case of type', () => {
      const type = 'TexT';
      ComponentStore.registerDesignerComponent(type, TextBox);
      expect(ComponentStore.getDesignerComponent(type)).to.deep.eql(TextBox);

      const registeredDesignerComponent = ComponentStore.getDesignerComponent('tEXt');
      expect(registeredDesignerComponent).to.eql(TextBox);
    });

    it('should return undefined when no matching designer component found', () => {
      const registeredDesignerComponent = ComponentStore.getDesignerComponent('something');
      expect(registeredDesignerComponent).to.eql(undefined);
    });
  });

  describe('deRegisterComponent', () => {
    it('should deRegisterComponent component irrespective of case', () => {
      ComponentStore.registerComponent('tEXt', TextBox);
      expect(ComponentStore.getRegisteredComponent('tEXt')).to.deep.eql(TextBox);
      ComponentStore.deRegisterComponent('TexT');
      ComponentStore.deRegisterComponent('someRandomThing');
      expect(ComponentStore.getRegisteredComponent('TexT')).to.eql(undefined);
      expect(ComponentStore.getRegisteredComponent('someRandomThing')).to.deep.eql(undefined);
    });
  });

  describe('deRegisterDesignerComponent', () => {
    it('should deRegisterComponent designer component irrespective of case', () => {
      ComponentStore.registerDesignerComponent('tEXt', TextBox);
      expect(ComponentStore.getDesignerComponent('tEXt')).to.deep.eql(TextBox);
      ComponentStore.deRegisterDesignerComponent('TexT');
      ComponentStore.deRegisterDesignerComponent('someRandomThing');
      expect(ComponentStore.getRegisteredComponent('TexT')).to.eql(undefined);
      expect(ComponentStore.getRegisteredComponent('someRandomThing')).to.eql(undefined);
    });
  });

  describe('getAllRegisteredComponents', () => {
    it('should return all the registered components', () => {
      const expectedComponents = { text: TextBox, label: Label };
      ComponentStore.registerComponent('text', TextBox);
      ComponentStore.registerComponent('label', Label);
      expect(ComponentStore.getAllRegisteredComponents()).to.deep.eql(expectedComponents);
    });
  });

  describe('getAllDesignerComponents', () => {
    it('should return all the registered designer components', () => {
      const expectedComponents = { text: TextBox, label: Label };
      ComponentStore.registerDesignerComponent('text', TextBox);
      ComponentStore.registerDesignerComponent('label', Label);
      expect(ComponentStore.getAllDesignerComponents()).to.deep.eql(expectedComponents);
    });
  });
});
