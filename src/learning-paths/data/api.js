import { camelCaseObject, getConfig, snakeCaseObject } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

/**
 * Get the base URL for the Learning Paths API.
 * The learning-paths-plugin is assumed to be running on the LMS.
 * @returns {string} Base URL for the API
 */
const getApiBaseUrl = () => getConfig().LMS_BASE_URL;

/**
 * Get the full URL for learning paths API endpoints
 * @returns {string} Full API URL
 */
export const getLearningPathsApiUrl = () => `${getApiBaseUrl()}/api/learning_paths/v1/learning-paths`;

/**
 * Get all learning paths visible to the current user.
 * Staff users see all paths, non-staff see non-invite-only paths and paths they're enrolled in.
 * @returns {Promise<Object>} Object containing array of learning paths
 */
export async function getLearningPaths() {
  const { data } = await getAuthenticatedHttpClient()
    .get(`${getLearningPathsApiUrl()}/`);
  return camelCaseObject(data);
}

/**
 * Get detailed information about a specific learning path.
 * @param {string} pathKey - Learning path key (format: path-v1:ORG+NUM+RUN+GRP)
 * @returns {Promise<Object>} Learning path details
 */
export async function getLearningPath(pathKey) {
  const { data } = await getAuthenticatedHttpClient()
    .get(`${getLearningPathsApiUrl()}/${pathKey}/`);
  return camelCaseObject(data);
}

/**
 * Create a new learning path.
 * @param {Object} pathData - Learning path data
 * @param {string} pathData.key - Unique key (format: path-v1:ORG+NUM+RUN+GRP)
 * @param {string} pathData.displayName - Display name
 * @param {string} [pathData.subtitle] - Optional subtitle
 * @param {string} [pathData.description] - Optional description
 * @param {File|string} [pathData.image] - Optional image file or URL
 * @param {string} [pathData.level] - Optional level (beginner/intermediate/advanced)
 * @param {string} [pathData.duration] - Optional duration (e.g., "10 Weeks")
 * @param {string} [pathData.timeCommitment] - Optional time commitment (e.g., "4-6 hours/week")
 * @param {boolean} [pathData.sequential] - Whether courses must be taken in order
 * @param {boolean} [pathData.inviteOnly] - Whether path is invite-only
 * @param {Array} [pathData.steps] - Array of course steps
 * @param {Array} [pathData.requiredSkills] - Array of required skills
 * @param {Array} [pathData.acquiredSkills] - Array of acquired skills
 * @param {Object} [pathData.gradingCriteria] - Grading criteria
 * @returns {Promise<Object>} Created learning path
 */
export async function createLearningPath(pathData) {
  const formData = new FormData();

  // Convert camelCase to snake_case for backend
  const snakeCaseData = snakeCaseObject(pathData);

  // Handle image separately if it's a File object
  if (pathData.image instanceof File) {
    formData.append('image', pathData.image);
    delete snakeCaseData.image;
  } else if (pathData.image === null) {
    // Don't send image field if explicitly null
    delete snakeCaseData.image;
  }

  // Append other fields
  Object.entries(snakeCaseData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    }
  });

  const { data } = await getAuthenticatedHttpClient()
    .post(`${getLearningPathsApiUrl()}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  return camelCaseObject(data);
}

/**
 * Update an existing learning path.
 * @param {string} pathKey - Learning path key to update
 * @param {Object} pathData - Updated learning path data (same format as createLearningPath)
 * @returns {Promise<Object>} Updated learning path
 */
export async function updateLearningPath(pathKey, pathData) {
  const formData = new FormData();

  // Convert camelCase to snake_case for backend
  const snakeCaseData = snakeCaseObject(pathData);

  // Handle image separately if it's a File object
  if (pathData.image instanceof File) {
    formData.append('image', pathData.image);
    delete snakeCaseData.image;
  } else if (pathData.image === null) {
    // Explicitly remove the image by sending an empty string
    formData.append('image', '');
    delete snakeCaseData.image;
  }

  // Append other fields
  Object.entries(snakeCaseData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    }
  });

  const { data } = await getAuthenticatedHttpClient()
    .put(`${getLearningPathsApiUrl()}/${pathKey}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  return camelCaseObject(data);
}

/**
 * Delete a learning path.
 * @param {string} pathKey - Learning path key to delete
 * @returns {Promise<void>}
 */
export async function deleteLearningPath(pathKey) {
  await getAuthenticatedHttpClient()
    .delete(`${getLearningPathsApiUrl()}/${pathKey}/`);
}

/**
 * Search for courses by title or course ID.
 * This uses the LMS course search API.
 * @param {string} searchTerm - Search term
 * @returns {Promise<Array>} Array of course objects
 */
export async function searchCourses(searchTerm) {
  // TODO: Implement course search using appropriate LMS API
  // This might use the course-discovery API or a similar endpoint
  const { data } = await getAuthenticatedHttpClient()
    .get(`${getApiBaseUrl()}/api/courses/v1/courses/`, {
      params: {
        search_term: searchTerm,
      },
    });
  return camelCaseObject(data);
}

/**
 * Get available skills for autocomplete.
 * @param {string} [searchTerm] - Optional search term to filter skills
 * @returns {Promise<Array>} Array of skill objects
 */
export async function searchSkills(searchTerm = '') {
  // The learning-paths plugin should have a skills endpoint
  const { data } = await getAuthenticatedHttpClient()
    .get(`${getApiBaseUrl()}/api/learning_paths/v1/skills/`, {
      params: searchTerm ? { search: searchTerm } : {},
    });
  return camelCaseObject(data);
}

/**
 * Create a new skill.
 * @param {string} displayName - Skill display name
 * @returns {Promise<Object>} Created skill object
 */
export async function createSkill(displayName) {
  const { data } = await getAuthenticatedHttpClient()
    .post(`${getApiBaseUrl()}/api/learning_paths/v1/skills/`, {
      display_name: displayName,
    });
  return camelCaseObject(data);
}
