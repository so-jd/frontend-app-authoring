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

/**
 * Bulk enroll users in learning paths.
 * @param {Object} enrollmentData - Enrollment data
 * @param {Array<string>} enrollmentData.learningPaths - Array of learning path keys
 * @param {Array<string>} [enrollmentData.emails] - Array of user email addresses
 * @param {Array<number>} [enrollmentData.groupIds] - Array of Django group IDs
 * @param {string} [enrollmentData.reason] - Optional reason for enrollment (for audit trail)
 * @param {string} [enrollmentData.org] - Optional organization (for audit trail)
 * @param {string} [enrollmentData.role] - Optional role (for audit trail)
 * @returns {Promise<Object>} Object with enrollment counts
 * @example
 * bulkEnroll({
 *   learningPaths: ['path-v1:edX+LP101+2024+T1'],
 *   emails: ['user1@example.com', 'user2@example.com'],
 *   groupIds: [1, 2],
 *   reason: 'Q1 2024 cohort enrollment',
 *   org: 'edX',
 *   role: 'learner'
 * })
 * // Returns: { enrollmentsCreated: 2, enrollmentAllowedCreated: 0 }
 */
export async function bulkEnroll(enrollmentData) {
  const requestData = {
    learning_paths: enrollmentData.learningPaths.join(','),
  };

  // Add emails if provided
  if (enrollmentData.emails && enrollmentData.emails.length > 0) {
    requestData.emails = enrollmentData.emails.join(',');
  }

  // Add group IDs if provided
  if (enrollmentData.groupIds && enrollmentData.groupIds.length > 0) {
    requestData.group_ids = enrollmentData.groupIds.join(',');
  }

  // Add optional metadata fields if provided
  if (enrollmentData.reason) {
    requestData.reason = enrollmentData.reason;
  }
  if (enrollmentData.org) {
    requestData.org = enrollmentData.org;
  }
  if (enrollmentData.role) {
    requestData.role = enrollmentData.role;
  }

  const { data } = await getAuthenticatedHttpClient()
    .post(`${getApiBaseUrl()}/api/learning_paths/v1/enrollments/bulk-enroll/`, requestData);
  return camelCaseObject(data);
}

/**
 * Get all available Django groups for bulk enrollment.
 * @returns {Promise<Array>} Array of group objects with id, name, and member_count
 * @example
 * fetchGroups()
 * // Returns: [{ id: 1, name: 'Staff', memberCount: 25 }, ...]
 */
export async function fetchGroups() {
  const { data } = await getAuthenticatedHttpClient()
    .get(`${getApiBaseUrl()}/api/learning_paths/v1/groups/`);
  return camelCaseObject(data);
}

/**
 * Bulk unenroll users from learning paths.
 * @param {Object} unenrollmentData - Unenrollment data
 * @param {Array<string>} unenrollmentData.learningPaths - Array of learning path keys
 * @param {Array<string>} [unenrollmentData.emails] - Array of user email addresses
 * @param {Array<number>} [unenrollmentData.groupIds] - Array of Django group IDs
 * @param {string} [unenrollmentData.reason] - Optional reason for unenrollment (for audit trail)
 * @param {string} [unenrollmentData.org] - Optional organization (for audit trail)
 * @param {string} [unenrollmentData.role] - Optional role (for audit trail)
 * @returns {Promise<Object>} Object with unenrollment counts
 * @example
 * bulkUnenroll({
 *   learningPaths: ['path-v1:edX+LP101+2024+T1'],
 *   emails: ['user1@example.com', 'user2@example.com'],
 *   groupIds: [1, 2],
 *   reason: 'Course completion',
 * })
 * // Returns: { enrollmentsUnenrolled: 2, enrollmentAllowedDeactivated: 0 }
 */
export async function bulkUnenroll(unenrollmentData) {
  const requestData = {
    learning_paths: unenrollmentData.learningPaths.join(','),
  };

  // Add emails if provided
  if (unenrollmentData.emails && unenrollmentData.emails.length > 0) {
    requestData.emails = unenrollmentData.emails.join(',');
  }

  // Add group IDs if provided
  if (unenrollmentData.groupIds && unenrollmentData.groupIds.length > 0) {
    requestData.group_ids = unenrollmentData.groupIds.join(',');
  }

  // Add optional metadata fields if provided
  if (unenrollmentData.reason) {
    requestData.reason = unenrollmentData.reason;
  }
  if (unenrollmentData.org) {
    requestData.org = unenrollmentData.org;
  }
  if (unenrollmentData.role) {
    requestData.role = unenrollmentData.role;
  }

  const { data} = await getAuthenticatedHttpClient()
    .delete(`${getApiBaseUrl()}/api/learning_paths/v1/enrollments/bulk-enroll/`, {
      data: requestData,
    });
  return camelCaseObject(data);
}

/**
 * Enroll a single user in a learning path.
 * @param {string} learningPathKey - Learning path key
 * @param {string} username - Username or email of the user to enroll
 * @param {Object} [metadata] - Optional enrollment metadata
 * @param {string} [metadata.reason] - Reason for enrollment (for audit trail)
 * @param {string} [metadata.org] - Organization (for audit trail)
 * @param {string} [metadata.role] - Role (for audit trail)
 * @returns {Promise<Object>} Enrollment details
 * @example
 * enrollUser('path-v1:edX+LP101+2024+T1', 'john.doe', {
 *   reason: 'Manual enrollment by instructor',
 *   org: 'edX',
 *   role: 'learner'
 * })
 */
export async function enrollUser(learningPathKey, username, metadata = {}) {
  const requestData = {
    username,
  };

  // Add optional metadata fields if provided
  if (metadata.reason) {
    requestData.reason = metadata.reason;
  }
  if (metadata.org) {
    requestData.org = metadata.org;
  }
  if (metadata.role) {
    requestData.role = metadata.role;
  }

  const { data } = await getAuthenticatedHttpClient()
    .post(`${getApiBaseUrl()}/api/learning_paths/v1/${learningPathKey}/enrollments/`, requestData);
  return camelCaseObject(data);
}

/**
 * Unenroll a single user from a learning path.
 * @param {string} learningPathKey - Learning path key
 * @param {string} username - Username of the user to unenroll
 * @param {Object} [metadata] - Optional unenrollment metadata
 * @param {string} [metadata.reason] - Reason for unenrollment (for audit trail)
 * @param {string} [metadata.org] - Organization (for audit trail)
 * @param {string} [metadata.role] - Role (for audit trail)
 * @returns {Promise<void>}
 * @example
 * unenrollUser('path-v1:edX+LP101+2024+T1', 'john.doe', {
 *   reason: 'User requested removal'
 * })
 */
export async function unenrollUser(learningPathKey, username, metadata = {}) {
  const requestData = {
    username,
  };

  // Add optional metadata fields if provided
  if (metadata.reason) {
    requestData.reason = metadata.reason;
  }
  if (metadata.org) {
    requestData.org = metadata.org;
  }
  if (metadata.role) {
    requestData.role = metadata.role;
  }

  await getAuthenticatedHttpClient()
    .delete(`${getApiBaseUrl()}/api/learning_paths/v1/${learningPathKey}/enrollments/`, {
      data: requestData,
    });
}

/**
 * Get enrollments for a specific learning path.
 * @param {string} learningPathKey - Learning path key
 * @param {string} [username] - Optional username to filter enrollments
 * @returns {Promise<Array>} Array of enrollment objects
 * @example
 * getLearningPathEnrollments('path-v1:edX+LP101+2024+T1')
 * // Returns: [{ user: {...}, learningPath: {...}, isActive: true, created: '...' }, ...]
 */
export async function getLearningPathEnrollments(learningPathKey, username = null) {
  const params = {};
  if (username) {
    params.username = username;
  }

  const { data } = await getAuthenticatedHttpClient()
    .get(`${getApiBaseUrl()}/api/learning_paths/v1/${learningPathKey}/enrollments/`, { params });
  return camelCaseObject(data);
}

/**
 * Get all enrollments for the current user or search by username (staff only).
 * @param {string} [username] - Optional username to search for (staff only)
 * @returns {Promise<Array>} Array of enrollment objects
 * @example
 * getUserEnrollments('john.doe')
 * // Returns: [{ user: {...}, learningPath: {...}, isActive: true, created: '...' }, ...]
 */
export async function getUserEnrollments(username = null) {
  const params = {};
  if (username) {
    params.username = username;
  }

  const { data } = await getAuthenticatedHttpClient()
    .get(`${getApiBaseUrl()}/api/learning_paths/v1/enrollments/`, { params });
  return camelCaseObject(data);
}
