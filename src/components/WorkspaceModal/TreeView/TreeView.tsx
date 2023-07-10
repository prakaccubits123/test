/* eslint-disable no-console */
import { useEffect, useState, useCallback } from 'react';
import Tree from './Tree/Tree';
import {
  changeColor,
  createWorkspaces,
  editWorkspaceItem,
} from 'redux/slices/workspace';
import { useDispatch, useSelector } from 'react-redux';
import './TreeView.css';
import { v4 as uuidv4 } from 'uuid';

function TreeView({
  filter,
  setShowColorDots,
  showDocumentOptions,
  setShowDocumentOptions,
  workSpaceDetails,
}: any) {
  const { tree, workspace }: any = useSelector((state) => state);
  console.log('workspace', workspace);
  const [treeDataState, setTreeDataState] = useState([]);
  const [treeDataStateCopy, setTreeDataStateCopy] = useState([]);
  useEffect(() => {
    if (tree) {
      console.log(tree);
    }
    if (workspace) {
      const treeStructureObject: any = [];
      const { workspaceFolders, workSpaceDocs } = workspace;
      const { uuid: name } = workSpaceDetails;
      const workSpaceFolderDetails = workspaceFolders.filter(
        (data: any) => data.workSPaceId === name
      );
      const workSpaceDOcDetails = workSpaceDocs.filter(
        (data: any) => data.workSPaceId === name && data.childOf === null
      );

      if (workSpaceFolderDetails.length > 0) {
        workSpaceFolderDetails.forEach((folderData: any, folderIndex: any) => {
          const { key } = folderData;
          const workSpaceDocsDetails = workSpaceDocs.filter(
            (data: any) => data.childOf === key && data.workSPaceId === name
          );
          const childData: any = [];
          const newSampleTreeObject: {
            key: any;
            label: any;
            isParent: any;
            children: any;
            type: any;
          } = {
            key: `${folderIndex}`,
            label: folderData.name,
            isParent: workSpaceDocsDetails.length > 0,
            children: [],
            type: 'folder',
            uuid: folderData.uuid,
          };
          workSpaceDocsDetails.forEach((docData: any, docIndex: any) => {
            const sampleChildObject = {
              key: `${folderIndex}-${docIndex}`,
              label: docData.name,
              uuid: docData.uuid,
            };
            childData.push(sampleChildObject);
          });
          newSampleTreeObject.children = childData;
          treeStructureObject.push(newSampleTreeObject);
        });
      }
      if (workSpaceDOcDetails.length > 0) {
        workSpaceDOcDetails.forEach((eachDoc: any) => {
          const newDocData = {
            children: [],
            isParent: false,
            key: treeStructureObject.length + 1,
            label: eachDoc.name,
            type: 'doc',
            uuid: eachDoc.uuid,
          };
          treeStructureObject.push(newDocData);
        });
      }
      setTreeDataStateCopy(treeStructureObject);
      console.log('workspace - treeStructureObject', treeStructureObject);
    }
  }, [tree, workspace, workSpaceDetails, setTreeDataState]);
  const filterTreeData = (filter: string) => {
    if (filter) {
      const filterTree = (text: string, list: any[]) => {
        return list.map((t) => {
          let searchMatch = false;
          let children = t.children ?? [];
          if (t.children && t.children.length) {
            children = filterTree(text, t.children);
            searchMatch = children.some((ch: any) => ch.searchMatch);
          }
          return {
            ...t,
            filterApplied: true,
            searchMatch:
              t.label.toLowerCase().includes(text.toLowerCase()) || searchMatch,
            children,
          };
        });
      };

      const filtered = filterTree(filter, treeDataState);
      const setVisibilityIfParent = (list: any[]) => {
        return list.map((ls) => {
          let children = ls.children ?? [];
          const setNodeAsTrue = (list: any[]) => {
            return list.map((x) => {
              return {
                ...x,
                searchMatch: true,
              };
            });
          };
          const isAnyChild = children.some((x) => x.searchMatch);
          if (ls.searchMatch && !isAnyChild) {
            children = setNodeAsTrue(children);
          }
          return {
            ...ls,
            children,
          };
        });
      };
      setTreeDataState(setVisibilityIfParent(filtered));
    } else {
      setTreeDataState(treeDataState);
    }
  };
  const getNode = (list, id) => {
    let item;
    const getArrayItem = (list) => {
      list.map((t) => {
        if (t.tId === id) {
          item = t;
        } else if (t.children.length) {
          getArrayItem(t.children ?? []);
        }
      });
    };
    getArrayItem(list);
    return item;
  };
  const addedNode = useCallback(
    (node: any, newNode: any) => {
      const temp = JSON.parse(JSON.stringify(treeDataState));
      const item: any = getNode(temp, node.tId);
      if (item) {
        item.children = item.children ?? [];
        const nodeObj = {
          ...newNode,
          tId: uuidv4(),
          children: [],
        };
        item.children.push(nodeObj);
      }
      setTreeDataState(temp);
    },
    [treeDataState]
  );
  useEffect(() => {
    filterTreeData(filter);
  }, [filter]);
  return (
    <div className="tree">
      <Tree
        data={treeDataStateCopy}
        addedNode={addedNode}
        setShowColorDots={setShowColorDots}
        showDocumentOptions={showDocumentOptions}
        setShowDocumentOptions={setShowDocumentOptions}
        workSpaceDetails={workSpaceDetails}
      />
    </div>
  );
}

export default TreeView;
