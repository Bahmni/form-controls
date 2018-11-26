import { Util } from './Util';
import sortBy from 'lodash/sortBy';
import { getUpdatedFormFieldPath } from 'src/helpers/formNamespace';

export default class ControlRecordTreeMgr {

  generateNextTree(rootTree, formFieldPath, parentFormFieldPath) {
    let updatedTree = this.getLatestBrotherTree(rootTree, formFieldPath);
    const updatedFormFieldPath = parentFormFieldPath === undefined ?
        this.getNextFormFieldPath(formFieldPath)
        : getUpdatedFormFieldPath(updatedTree, parentFormFieldPath);
    updatedTree = updatedTree.set('formFieldPath', updatedFormFieldPath);
    if (updatedTree.children && updatedTree.children.size > 0) {
      const filteredTree = this.filterChildTree(updatedTree);
      const clonedChildTree = filteredTree.map(r => (
                this.generateNextTree(rootTree, r.formFieldPath, updatedTree.formFieldPath)
            ));
      updatedTree = updatedTree.set('children', clonedChildTree);
    }
    return updatedTree.set('value', {}).set('active', true);
  }

  filterChildTree(updatedTree) {
    const getPrefix = (formFieldPath) =>
        (formFieldPath.substring(0, formFieldPath.lastIndexOf('-')));

    return updatedTree.children.groupBy(r => getPrefix(r.formFieldPath))
                      .map(x => x.first()).toList();
  }

  getNextFormFieldPath(formFieldPath) {
    const lastIndex = formFieldPath.lastIndexOf('-');
    const nextSuffix = Util.increment(formFieldPath.substring(lastIndex + 1, formFieldPath.length));
    return `${formFieldPath.substring(0, lastIndex)}-${nextSuffix}`;
  }

  findParentTree(parentTree, formFieldPath) {
    let targetTree = undefined;
    parentTree.children.forEach(childTree => {
      if (childTree.formFieldPath === formFieldPath) {
        targetTree = parentTree;
      } else if (!targetTree && childTree.children) {
        const foundTree = this.findParentTree(childTree, formFieldPath);
        if (foundTree) {
          targetTree = foundTree;
        }
      }
    });

    return targetTree;
  }

  addToRootTree(rootTree, parentTree, addedTree) {
    if (rootTree === parentTree) {
      return rootTree.set('children', rootTree.children.push(addedTree));
    }

    const tree = rootTree.children.map(childTree => {
      if (childTree.children) {
        const updatedChildTree = this.addToRootTree(childTree, parentTree, addedTree);
        return updatedChildTree || childTree;
      }
      return childTree;
    });

    return rootTree.set('children', tree);
  }

  getLatestBrotherTree(parentTree, targetFormFieldPath) {
    const brotherTrees = this.getBrotherTrees(parentTree, targetFormFieldPath);
    const sortedTrees = sortBy(brotherTrees, (t) => Util.toInt(t.formFieldPath.split('-')[1]));
    return sortedTrees[sortedTrees.length - 1];
  }

  getBrotherTrees(parentTree, targetFormFieldPath) {
    let brotherTrees = [];
    const getPrefix = (formFieldPath) =>
        (formFieldPath.substring(0, formFieldPath.lastIndexOf('-')));

    if (getPrefix(parentTree.formFieldPath) === getPrefix(targetFormFieldPath)) {
      brotherTrees.push(parentTree);
    }

    if (parentTree.children) {
      parentTree.children.forEach(childTree => {
        brotherTrees = brotherTrees.concat(this.getBrotherTrees(childTree, targetFormFieldPath));
      });
    }

    return brotherTrees;
  }

  static add(rootTree, formFieldPath) {
    const treeMgr = new ControlRecordTreeMgr();
    const parentTree = treeMgr.findParentTree(rootTree, formFieldPath);
    const addedTree = treeMgr.generateNextTree(rootTree, formFieldPath);
    return treeMgr.addToRootTree(rootTree, parentTree, addedTree);
  }

  static update(rootTree, nodeTree) {
    if (rootTree.formFieldPath === nodeTree.formFieldPath) {
      return nodeTree;
    }

    if (rootTree.children) {
      const updatedChild = rootTree.children.map(r => (
        ControlRecordTreeMgr.update(r, nodeTree) || r
      ));
      return rootTree.set('children', updatedChild);
    }

    return null;
  }

  static find(rootTree, formFieldPath) {
    const parentTree = new ControlRecordTreeMgr().findParentTree(rootTree, formFieldPath);
    if (parentTree) {
      const filteredList = parentTree.children.filter(r => r.formFieldPath === formFieldPath);
      return filteredList.get(0);
    }
    return null;
  }

  static getBrothers(rootTree, targetTree) {
    if (targetTree) {
      return new ControlRecordTreeMgr().getBrotherTrees(rootTree, targetTree.formFieldPath);
    }
    return [];
  }
}
