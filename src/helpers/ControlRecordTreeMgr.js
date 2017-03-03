import {Util} from "./Util";
import isEmpty from 'lodash/isEmpty';
import constants from 'src/constants';

export default class ControlRecordTreeMgr {

  generateNextTree(brotherTree) {
    const nextFormFieldPath = `${brotherTree.formFieldPath.split('-')[0]}-${Util.increment(brotherTree.formFieldPath.split('-')[1])}`;
    return brotherTree.set('formFieldPath', nextFormFieldPath).set('value', undefined);
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
        return updatedChildTree ? updatedChildTree : childTree;
      }
      return childTree;
    });

    return rootTree.set('children', tree);
  }

  getBrotherTree(parentTree, formFieldPath) {
    const prefix = formFieldPath.split('-')[0];

    const isLatestBrotherTree = function (originalRecord, newRecord) {
      return newRecord.formFieldPath.startsWith(prefix) &&
        !originalRecord || originalRecord.formFieldPath.split('-')[1] < newRecord.formFieldPath.split('-')[1];
    };

    let latestSimilarTree = undefined;

    parentTree.children.forEach(childTree => {
      if (isLatestBrotherTree(latestSimilarTree, childTree)) {
        latestSimilarTree = childTree;
      } else if(childTree.children) {
        const foundSimilarRecord = this.getBrotherTree(childTree, formFieldPath);
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
    return treeMgr.addToRootTree(rootTree, parentTree, addedTree)
  }

  static getErrors(records) {
    let errorArray = [];
    const errors = records.get('errors');
    if (errors && !isEmpty(errors.filter((err) => err.type === constants.errorTypes.error))) {
      errorArray.push(errors);
    }

    if (records.children) {
      return errorArray.concat(...records.children.map(r => ControlRecordTreeMgr.getErrors(r)));
    }

    return errorArray;
  }
}