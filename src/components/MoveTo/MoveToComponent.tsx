import React, { useEffect, useState } from 'react';
import './MoveTo.css';
import {
  DownArrow,
  SearchIcon,
  SearchShortCut,
  SideArrow,
  UpArrow,
} from './MoveToIcons';
import Directory from './Directory/Directory';
import Spaces from './Spaces/Spaces';
import { setIsMoveTo } from 'redux/slices/activestate';
import { useDispatch, useSelector } from 'react-redux';
import { copyFolderRedux, moveFolderRedux } from 'redux/slices/workspace';

const MoveToComponent = () => {
  const dispatch = useDispatch();
  const [isSpaceVisible, setIsSpacesVisible] = useState(false);
  const { workspace, activestate }: any = useSelector((state) => state);
  const { currentMoveToItem, copyOrMove } = activestate;
  const { color } = workspace;
  console.log(currentMoveToItem);

  const [currentWorkSpaceState, setCurrentWorkSpaceState] = useState(() => {
    return workspace.workSpaceItems.find(
      (item) => item?.uuid === currentMoveToItem?.workspaceUUID
    );
  });
  // console.log(workspace, activestate, currentWorkSpaceState, 'fghd');

  const [filteredFolders, setFilteredFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);

  useEffect(() => {
    // if (currentWorkSpaceState?.name === 'Private') {
    //   const filtered = workspace.workspaceFolders.filter(
    //     (item) => item.workSPaceId === 'Private'
    //   );
    //   setFilteredFolders(filtered);
    // } else {

    // }
    const filtered = workspace.workspaceFolders.filter(
      (item) => item.workSpaceUUID === currentWorkSpaceState?.uuid
    );
    setFilteredFolders(filtered);
  }, [currentWorkSpaceState, workspace.workspaceFiles]);
  // console.log(filteredFolders, 'asdgf');
  // console.log(selectedFolder, 'po');

  // const
  // const otherWorkspaces = workspace.workSpaceItems.filter(
  //   (item) => item.uuid !== currentWorkSpaceState.uuid
  // );
  // console.log(workspace, currentWorkSpace, otherWorkspaces);

  const copyOrMoveHandler = () => {
    if (copyOrMove === 'move') {
      dispatch(
        moveFolderRedux({ dest: selectedFolder, source: currentMoveToItem })
      );
    } else if (copyOrMove === 'copy') {
      dispatch(
        copyFolderRedux({ dest: selectedFolder, source: currentMoveToItem })
      );
    }
    dispatch(setIsMoveTo(false));
  };

  return (
    <div className="moveToContainer">
      <div className="moveToWrapper">
        <div className="movetoMainContainer">
          <p className="movetotext">
            {copyOrMove === 'copy' ? 'Copy to' : 'Move to'}
          </p>
          <p className="movetobelowtext">
            {copyOrMove === 'copy' ? 'Copy' : 'Move'}{' '}
            <span style={{ color: activestate.workspaceItem?.color }}>
              {currentMoveToItem?.name}
            </span>{' '}
            to:
          </p>
          <div className="folderBox">
            <div className="internalBox">
              <p className="spaceText">Space</p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: '10px',
                  position: 'relative',
                }}
              >
                <p
                  className="folderName"
                  onClick={() => setIsSpacesVisible(!isSpaceVisible)}
                >
                  {currentWorkSpaceState?.name}
                </p>
                <div
                  style={{
                    transform: isSpaceVisible ? 'rotate(90deg)' : '',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  <SideArrow />
                </div>
              </div>
              {isSpaceVisible && (
                <Spaces
                  setIsSpacesVisible={setIsSpacesVisible}
                  currentWorkSpaceState={currentWorkSpaceState}
                  setCurrentWorkSpaceState={setCurrentWorkSpaceState}
                />
              )}

              <div
                className="moveToSearchBar"
                style={{
                  border: `0.5px solid ${activestate.workspaceItem.color}`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginLeft: '17px',
                  }}
                >
                  <SearchIcon />
                </div>
                <input
                  className="movetoSearchInput"
                  type="text"
                  placeholder="Search Folders Here"
                  // onInput={filterNode}
                  // ref={searchInputFieldRef}
                  id="searchFlyout"
                />
                <SearchShortCut />
              </div>
            </div>
            <div className="foldersContainer">
              {currentWorkSpaceState.folders.map(
                (folder, i) =>
                  folder?.uuid !== currentMoveToItem?.id && (
                    <Directory
                      folder={folder}
                      selectedFolder={selectedFolder}
                      setSelectedFolder={setSelectedFolder}
                      workspaceColor={activestate.workspaceItem.color}
                      currentMoveToItem={currentMoveToItem}
                    />
                  )
              )}
            </div>
          </div>
          <div className="buttonDiv">
            <div className="textContainer">
              <p>Use arrow keys</p>
              <div
                className="arrowContainer"
                style={{ marginLeft: '8px', transform: 'rotate(180deg)' }}
              >
                <UpArrow />
              </div>
              <div
                className="arrowContainer"
                style={{
                  marginLeft: '4px',
                  marginRight: '8px',
                  transform: 'rotate(180deg)',
                }}
              >
                <DownArrow />
              </div>
              <p>to navigate</p>
            </div>
            <div className="buttonContainer">
              <div
                className="cancelButton"
                onClick={() => dispatch(setIsMoveTo(false))}
              >
                Cancel
              </div>
              <div
                className="moveButton"
                style={{ background: activestate.workspaceItem.color }}
                onClick={copyOrMoveHandler}
              >
                {copyOrMove === 'copy' ? 'Copy' : 'Move'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoveToComponent;
