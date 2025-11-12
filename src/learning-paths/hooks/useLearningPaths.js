import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToggle } from '@openedx/paragon';

import { RequestStatus } from '../../data/constants';
import {
  getLearningPaths,
  getLoadingStatus,
  getSavingStatus,
  getDeletingStatus,
  getErrorMessage,
  getCurrentPath,
} from '../data/selectors';
import {
  fetchLearningPathsQuery,
  createLearningPathQuery,
  updateLearningPathQuery,
  deleteLearningPathQuery,
} from '../data/thunk';
import {
  clearCurrentPath,
  setCurrentPath,
  clearErrorMessage,
} from '../data/slice';

/**
 * Custom hook to manage learning paths state and operations.
 */
export const useLearningPaths = () => {
  const dispatch = useDispatch();
  const paths = useSelector(getLearningPaths);
  const loadingStatus = useSelector(getLoadingStatus);
  const savingStatus = useSelector(getSavingStatus);
  const deletingStatus = useSelector(getDeletingStatus);
  const errorMessage = useSelector(getErrorMessage);
  const currentPath = useSelector(getCurrentPath);

  const [isFormOpen, openForm, closeForm] = useToggle(false);
  const [pathToDelete, setPathToDelete] = useState(null);

  // Fetch paths on mount
  useEffect(() => {
    dispatch(fetchLearningPathsQuery());
  }, [dispatch]);

  // Close form and clear current path when save is successful
  useEffect(() => {
    if (savingStatus === RequestStatus.SUCCESSFUL) {
      closeForm();
      dispatch(clearCurrentPath());
    }
  }, [savingStatus, closeForm, dispatch]);

  const handleCreate = async (pathData) => {
    try {
      await dispatch(createLearningPathQuery(pathData));
      return true;
    } catch (error) {
      // Error is handled by the thunk
      console.error('Failed to create learning path:', error);
      return false;
    }
  };

  const handleUpdate = async (pathKey, pathData) => {
    try {
      await dispatch(updateLearningPathQuery(pathKey, pathData));
      return true;
    } catch (error) {
      // Error is handled by the thunk
      console.error('Failed to update learning path:', error);
      return false;
    }
  };

  const handleDelete = async (pathKey) => {
    try {
      await dispatch(deleteLearningPathQuery(pathKey));
      setPathToDelete(null);
    } catch (error) {
      // Error is handled by the thunk
      console.error('Failed to delete learning path:', error);
    }
  };

  const handleEdit = (path) => {
    dispatch(setCurrentPath({ path }));
    openForm();
  };

  const handleCancelEdit = () => {
    dispatch(clearCurrentPath());
    dispatch(clearErrorMessage());
    closeForm();
  };

  const handleConfirmDelete = (path) => {
    setPathToDelete(path);
  };

  const handleCancelDelete = () => {
    setPathToDelete(null);
  };

  return {
    // Data
    paths,
    currentPath,
    errorMessage,

    // Status flags
    isLoading: loadingStatus === RequestStatus.IN_PROGRESS,
    isLoadingFailed: loadingStatus === RequestStatus.FAILED,
    isSaving: savingStatus === RequestStatus.PENDING,
    isDeleting: deletingStatus === RequestStatus.PENDING,

    // Form state
    isFormOpen,
    isEditMode: currentPath !== null,

    // Delete confirmation state
    pathToDelete,

    // Actions
    handleCreate,
    handleUpdate,
    handleDelete,
    handleEdit,
    handleCancelEdit,
    handleConfirmDelete,
    handleCancelDelete,
    openForm,
    closeForm,
  };
};
