import { RequestStatus } from '../../data/constants';
import { NOTIFICATION_MESSAGES } from '../../constants';
import {
  hideProcessingNotification,
  showProcessingNotification,
} from '../../generic/processing-notification/data/slice';
import { handleResponseErrors } from '../../generic/saving-error-alert';

import * as api from './api';
import {
  updateLoadingStatus,
  updateSavingStatus,
  updateDeletingStatus,
  fetchPathsSuccess,
  fetchPathsFailed,
  fetchPathSuccess,
  createPathSuccess,
  updatePathSuccess,
  deletePathSuccess,
} from './slice';

/**
 * Fetch all learning paths visible to the current user.
 */
export function fetchLearningPathsQuery() {
  return async (dispatch) => {
    dispatch(updateLoadingStatus({ status: RequestStatus.IN_PROGRESS }));

    try {
      const data = await api.getLearningPaths();
      // The API returns paginated results with 'results' array
      const paths = data.results || data;
      dispatch(fetchPathsSuccess({ paths }));
    } catch (error) {
      dispatch(fetchPathsFailed());
    }
  };
}

/**
 * Fetch a specific learning path by key.
 * @param {string} pathKey - Learning path key
 */
export function fetchLearningPathQuery(pathKey) {
  return async (dispatch) => {
    try {
      const path = await api.getLearningPath(pathKey);
      dispatch(fetchPathSuccess({ path }));
    } catch (error) {
      // Handle error silently or show notification
      console.error('Failed to fetch learning path:', error);
    }
  };
}

/**
 * Create a new learning path.
 * @param {Object} pathData - Learning path data
 */
export function createLearningPathQuery(pathData) {
  return async (dispatch) => {
    dispatch(updateSavingStatus({ status: RequestStatus.PENDING }));
    dispatch(showProcessingNotification(NOTIFICATION_MESSAGES.saving));

    try {
      const path = await api.createLearningPath(pathData);
      dispatch(createPathSuccess({ path }));
      return path;
    } catch (error) {
      handleResponseErrors(error, dispatch, updateSavingStatus);
      throw error;
    } finally {
      dispatch(hideProcessingNotification());
    }
  };
}

/**
 * Update an existing learning path.
 * @param {string} pathKey - Learning path key to update
 * @param {Object} pathData - Updated learning path data
 */
export function updateLearningPathQuery(pathKey, pathData) {
  return async (dispatch) => {
    dispatch(updateSavingStatus({ status: RequestStatus.PENDING }));
    dispatch(showProcessingNotification(NOTIFICATION_MESSAGES.saving));

    try {
      const path = await api.updateLearningPath(pathKey, pathData);
      dispatch(updatePathSuccess({ path }));
      return path;
    } catch (error) {
      handleResponseErrors(error, dispatch, updateSavingStatus);
      throw error;
    } finally {
      dispatch(hideProcessingNotification());
    }
  };
}

/**
 * Delete a learning path.
 * @param {string} pathKey - Learning path key to delete
 */
export function deleteLearningPathQuery(pathKey) {
  return async (dispatch) => {
    dispatch(updateDeletingStatus({ status: RequestStatus.PENDING }));
    dispatch(showProcessingNotification(NOTIFICATION_MESSAGES.deleting));

    try {
      await api.deleteLearningPath(pathKey);
      dispatch(deletePathSuccess({ pathKey }));
    } catch (error) {
      handleResponseErrors(error, dispatch, updateDeletingStatus);
      throw error;
    } finally {
      dispatch(hideProcessingNotification());
    }
  };
}
