/**
 * Get all learning paths from state.
 * @param {Object} state - Redux state
 * @returns {Array} Array of learning paths
 */
export const getLearningPaths = (state) => state.learningPaths?.paths || [];

/**
 * Get the loading status for fetching learning paths.
 * @param {Object} state - Redux state
 * @returns {string} Loading status
 */
export const getLoadingStatus = (state) => state.learningPaths?.loadingStatus || '';

/**
 * Get the saving status for create/update operations.
 * @param {Object} state - Redux state
 * @returns {string} Saving status
 */
export const getSavingStatus = (state) => state.learningPaths?.savingStatus || '';

/**
 * Get the deleting status for delete operations.
 * @param {Object} state - Redux state
 * @returns {string} Deleting status
 */
export const getDeletingStatus = (state) => state.learningPaths?.deletingStatus || '';

/**
 * Get the current error message if any.
 * @param {Object} state - Redux state
 * @returns {string} Error message
 */
export const getErrorMessage = (state) => state.learningPaths?.errorMessage || '';

/**
 * Get the currently selected/editing learning path.
 * @param {Object} state - Redux state
 * @returns {Object|null} Current learning path or null
 */
export const getCurrentPath = (state) => state.learningPaths?.currentPath || null;

/**
 * Get a specific learning path by key.
 * @param {Object} state - Redux state
 * @param {string} pathKey - Learning path key to find
 * @returns {Object|undefined} Learning path or undefined
 */
export const getLearningPathByKey = (state, pathKey) => {
  const paths = getLearningPaths(state);
  return paths.find((path) => path.key === pathKey);
};
