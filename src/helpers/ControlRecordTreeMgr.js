import {Util} from './Util';
import {sortBy, last} from "lodash";
import {List} from "immutable";

export default class ControlRecordTreeMgr {

    generateNextTree(rootTree, brotherTree, nextFormFieldPath) {
        let updatedTree = brotherTree;
        if (brotherTree.children && brotherTree.children.size > 0) {
            const clonedChildTree = brotherTree.children.map(r => {
                const newFormFieldPath = this.getNextFormFieldPath(rootTree, r.formFieldPath);
                this.generateNextTree(rootTree, r, newFormFieldPath)
            });
            updatedTree = brotherTree.set('children', clonedChildTree);
        }
        return updatedTree.set('formFieldPath', nextFormFieldPath).set('value', {}).set('active', true);
    }

    getPrefix(formFieldPath) {
        return formFieldPath.split('-')[0];
    }

    getNextFormFieldPath(rootTree, formFieldPath) {
        let samePrefixTreeList = new List();
        rootTree.children.forEach(childTree => {
            if (this.getPrefix(childTree.formFieldPath) === this.getPrefix(formFieldPath)) {
                samePrefixTreeList = samePrefixTreeList.concat(childTree.formFieldPath);
            } else if (childTree.children) {
                const targetPath = this.getNextFormFieldPath(childTree, formFieldPath);
                if(targetPath){
                    samePrefixTreeList = samePrefixTreeList.concat(targetPath);
                }
            }
        });

        const sortBySuffixTreeList = samePrefixTreeList.sortBy(r => r.split('-')[1]);
        const maxSuffixTree = sortBySuffixTreeList.last();

        return this.generateFormFieldPath(maxSuffixTree);
    }

    generateFormFieldPath(maxSuffixTree) {
        const nextSuffix = Util.increment(maxSuffixTree.split('-')[1]);
        return `${maxSuffixTree.split('-')[0]}-${nextSuffix}`;
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
        const nextFormFieldPath = treeMgr.getNextFormFieldPath(rootTree, formFieldPath);
        const addedTree = treeMgr.generateNextTree(rootTree, brotherTree, nextFormFieldPath);
        return treeMgr.addToRootTree(rootTree, parentTree, addedTree);
    }
}
