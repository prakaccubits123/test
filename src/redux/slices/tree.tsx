import { createSlice } from '@reduxjs/toolkit';

const generateInitialState = () => {
  return {
    createNewTreeFolder: false,
    createNewTreeDocument: false,
    showAddFolder: false,
    showAddFile: false,
  };
};
export const treeSlice = createSlice({
  name: 'tree',
  initialState: generateInitialState,
  reducers: {
    createTreeNode: (state, action) => {
      const { type, content } = action.payload;
      if (type === 'doc') {
        console.log('doc', content);
      }
      if (type === 'folder') {
        console.log('folder', content);
      }
    },
    enableCreateNewTreeNode: (state, action) => {
      const { type } = action.payload;
      if (type === 'doc') {
        state.createNewTreeDocument = true;
      }
      if (type === 'folder') {
        state.createNewTreeFolder = true;
      }
    },
    disableCreateNewTreeNode: (state, action) => {
      const { type } = action.payload;
      if (type === 'doc') {
        state.createNewTreeDocument = false;
      }
      if (type === 'folder') {
        state.createNewTreeFolder = false;
      }
    },
    setShowAddFolder: (state, action) => {
      state.showAddFolder = action.payload;
    },
    setShowAddFile: (state, action) => {
      state.showAddFile = action.payload;
    },
  },
});

export const {
  createTreeNode,
  enableCreateNewTreeNode,
  disableCreateNewTreeNode,
  setShowAddFolder,
  setShowAddFile,
} = treeSlice.actions;
export default treeSlice.reducer;
