import { expect } from 'chai';
import { TextBox } from 'components/TextBox';
import { Label } from 'components/Label';
import 'src/helpers/componentStore';

describe('ComponentStore', () => {
  const registerComponent = (type, component) => componentStore.registerComponent(type, component); // eslint-disable-line no-undef
  const getRegisteredComponent = (type) => componentStore.getRegisteredComponent(type); // eslint-disable-line no-undef
  const deRegisteredComponent = (type) => componentStore.deRegisterComponent(type); // eslint-disable-line no-undef
  const componentList = componentStore.componentList;  // eslint-disable-line no-undef

  describe('registerComponent', () => {
    it('should register a component', () => {
      registerComponent('textBox', TextBox);
      expect(componentList).to.deep.eql({ textBox: TextBox });
    });

    it('should override a component if type is same', () => {
      registerComponent('textBox', TextBox);
      expect(componentList).to.deep.eql({ textBox: TextBox });
      registerComponent('textBox', Label);
      expect(componentList).to.deep.eql({ textBox: Label });
    });
  });

  describe('getRegisteredComponent', () => {
    it('should return the registered component', () => {
      registerComponent('textBox', TextBox);
      const registeredComponent = getRegisteredComponent('textBox');
      expect(registeredComponent).to.eql(TextBox);
    });

    it('should return undefined when no matching component found', () => {
      const registeredComponent = getRegisteredComponent('something');
      expect(registeredComponent).to.eql(undefined);
    });
  });

  describe('deRegisterComponent', () => {
    it('should deRegisterComponent component', () => {
      registerComponent('textBox', TextBox);
      expect(componentList).to.deep.eql({ textBox: TextBox });
      deRegisteredComponent('textBox');
      deRegisteredComponent('someRandomThing');
      expect(componentList).to.deep.eql({});
    });
  });
});
