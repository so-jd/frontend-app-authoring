/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import { RequestStatus } from '../../data/constants';

const initialState = {
  loadingStatus: RequestStatus.IN_PROGRESS,
  savingStatus: '',
  deletingStatus: '',
  paths: [],
  currentPath: null,
  errorMessage: '',
};

const slice = createSlice({
  name: 'learningPaths',
  initialState,
  reducers: {
    updateLoadingStatus: (state, { payload }) => {
      state.loadingStatus = payload.status;
    },
    updateSavingStatus: (state, { payload }) => {
      state.savingStatus = payload.status;
      if (payload.errorMessage) {
        state.errorMessage = payload.errorMessage;
      }
    },
    updateDeletingStatus: (state, { payload }) => {
      state.deletingStatus = payload.status;
      if (payload.errorMessage) {
        state.errorMessage = payload.errorMessage;
      }
    },
    clearErrorMessage: (state) => {
      state.errorMessage = '';
    },
    fetchPathsSuccess: (state, { payload }) => {
      state.paths = payload.paths;
      state.loadingStatus = RequestStatus.SUCCESSFUL;
    },
    fetchPathsFailed: (state) => {
      state.loadingStatus = RequestStatus.FAILED;
    },
    fetchPathSuccess: (state, { payload }) => {
      state.currentPath = payload.path;
    },
    createPathSuccess: (state, { payload }) => {
      state.paths = [...state.paths, payload.path];
      state.savingStatus = RequestStatus.SUCCESSFUL;
      state.errorMessage = '';
    },
    updatePathSuccess: (state, { payload }) => {
      state.paths = state.paths.map((path) => (path.key === payload.path.key ? payload.path : path));
      state.currentPath = payload.path;
      state.savingStatus = RequestStatus.SUCCESSFUL;
      state.errorMessage = '';
    },
    deletePathSuccess: (state, { payload }) => {
      state.paths = state.paths.filter((path) => path.key !== payload.pathKey);
      state.deletingStatus = RequestStatus.SUCCESSFUL;
      state.errorMessage = '';
    },
    setCurrentPath: (state, { payload }) => {
      state.currentPath = payload.path;
    },
    clearCurrentPath: (state) => {
      state.currentPath = null;
    },
  },
});

export const {
  updateLoadingStatus,
  updateSavingStatus,
  updateDeletingStatus,
  clearErrorMessage,
  fetchPathsSuccess,
  fetchPathsFailed,
  fetchPathSuccess,
  createPathSuccess,
  updatePathSuccess,
  deletePathSuccess,
  setCurrentPath,
  clearCurrentPath,
} = slice.actions;

export const {
  reducer,
} = slice;
