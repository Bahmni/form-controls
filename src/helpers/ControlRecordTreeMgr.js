import { Util } from './Util';

export default class ControlRecordTreeMgr {

  generateNextTree(brotherTree) {
    const nextSuffix = Util.increment(brotherTree.formFieldPath.split('-')[1]);
    const nextFormFieldPath = `${brotherTree.formFieldPath.split('-')[0]}-${nextSuffix}`;
    let updatedTree = brotherTree;
    if (brotherTree.children && brotherTree.children.size > 0) {
      const clonedChildTree = brotherTree.children.map(r => this.generateNextTree(r));
      updatedTree = brotherTree.set('children', clonedChildTree);
    }
    return updatedTree.set('formFieldPath', nextFormFieldPath).set('value', {}).set('active', true);
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

  getBrotherTree(parentTree, targetFormFieldPath) {
    const getPrefix = (formFieldPath) => (formFieldPath.split('-')[0]);
    const getSuffix = (record) => (Util.toInt(record.formFieldPath.split('-')[1]));

    const isLatestBrotherTree = (originalRecord, newRecord) => (
      (getPrefix(targetFormFieldPath) === getPrefix(newRecord.formFieldPath)) &&
      (!originalRecord || (getSuffix(originalRecord) < getSuffix(newRecord)))
    );

    let latestSimilarTree = undefined;

    parentTree.children.forEach(childTree => {
      if (isLatestBrotherTree(latestSimilarTree, childTree)) {
        latestSimilarTree = childTree;
      } else if (childTree.children) {
        const foundSimilarRecord = this.getBrotherTree(childTree, targetFormFieldPath);
        if (foundSimilarRecord) {
          latestSimilarTree = foundSimilarRecord;
        }
      }
    });
    return latestSimilarTree;
  }

  static add(rootTree, formFieldPath) {
    const treeMgr = new ControlRecordTreeMgr();
    const parentTree = treeMgr.findParentTree(rootTree, formFieldPath);
    const brotherTree = treeMgr.getBrotherTree(rootTree, formFieldPath);
    const addedTree = treeMgr.generateNextTree(brotherTree);
    return treeMgr.addToRootTree(rootTree, parentTree, addedTree);
  }
}
