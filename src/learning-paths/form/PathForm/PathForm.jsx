import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  Form,
  Button,
  ActionRow,
  Card,
  Image,
  Dropdown,
  SearchField,
  Spinner,
  Alert,
} from '@openedx/paragon';
import PromptIfDirty from '../../../generic/prompt-if-dirty/PromptIfDirty';

import { CourseStepsList } from '../components/CourseStepsList';
import { SkillsSection } from '../components/SkillsSection';
import GradingCriteriaSection from '../components/GradingCriteriaSection';
import CertificateSection from '../components/CertificateSection';
import messages from '../../messages';

/**
 * Form for creating or editing a learning path with all metadata and settings.
 */
const PathForm = ({ initialValues, isEditMode, onSubmit, onCancel, isSaving }) => {
  const intl = useIntl();
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showCustomOrg, setShowCustomOrg] = useState(false);
  const [orgSearchQuery, setOrgSearchQuery] = useState('');
  const [availableOrgs, setAvailableOrgs] = useState([]);
  const [isLoadingOrgs, setIsLoadingOrgs] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  // Handle initial image - convert File object to data URL for preview
  useEffect(() => {
    if (initialValues.image instanceof File) {
      // If it's a File object, read it as data URL for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(initialValues.image);
    } else if (typeof initialValues.image === 'string') {
      // If it's a URL string, use it directly
      setImagePreview(initialValues.image);
    } else {
      setImagePreview(null);
    }
  }, [initialValues.image]);

  // Fetch available organizations from courses
  useEffect(() => {
    const fetchOrganizations = async () => {
      setIsLoadingOrgs(true);
      try {
        const { data } = await getAuthenticatedHttpClient().get(
          `${getConfig().LMS_BASE_URL}/api/courses/v1/courses/`,
          {
            params: {
              page_size: 100,
            },
          }
        );

        // Extract unique organizations from courses
        const orgsSet = new Set();
        (data.results || []).forEach(course => {
          if (course.org) {
            orgsSet.add(course.org);
          }
        });

        // Convert to array and create options
        const orgOptions = Array.from(orgsSet)
          .sort()
          .map(org => ({
            value: org,
            label: org,
          }));

        // Add "Other" option at the end
        orgOptions.push({ value: 'custom', label: 'Other (Custom Organization)' });

        setAvailableOrgs(orgOptions);
      } catch (error) {
        console.error('Failed to fetch organizations:', error);
        // Fallback to default organizations
        setAvailableOrgs(organizationOptions);
      } finally {
        setIsLoadingOrgs(false);
      }
    };

    fetchOrganizations();
  }, []);

  const validationSchema = Yup.object().shape({
    organization: Yup.string()
      .required('Organization is required')
      .matches(/^[a-zA-Z0-9_-]+$/, 'Only letters, numbers, hyphens, and underscores allowed'),
    pathNumber: Yup.string()
      .required('Path number/ID is required')
      .matches(/^[a-zA-Z0-9_-]+$/, 'Only letters, numbers, hyphens, and underscores allowed'),
    pathRun: Yup.string()
      .required('Run is required')
      .matches(/^[a-zA-Z0-9_-]+$/, 'Only letters, numbers, hyphens, and underscores allowed'),
    pathGroup: Yup.string()
      .required('Group is required')
      .matches(/^[a-zA-Z0-9_-]+$/, 'Only letters, numbers, hyphens, and underscores allowed'),
    key: Yup.string()
      .required('Learning path key is required'),
    displayName: Yup.string()
      .required('Display name is required')
      .max(255, 'Display name must be 255 characters or less'),
    subtitle: Yup.string().max(500, 'Subtitle must be 500 characters or less'),
    description: Yup.string(),
    level: Yup.string().oneOf(['beginner', 'intermediate', 'advanced', ''], 'Invalid level'),
    duration: Yup.string(),
    timeCommitment: Yup.string(),
    sequential: Yup.boolean(),
    inviteOnly: Yup.boolean(),
    steps: Yup.array().of(
      Yup.object().shape({
        courseKey: Yup.string().required('Course key is required'),
        order: Yup.number().min(1, 'Order must be at least 1'),
        weight: Yup.number()
          .min(0, 'Weight must be between 0 and 1')
          .max(1, 'Weight must be between 0 and 1'),
      })
    ).min(1, 'At least one course is required'),
    requiredSkills: Yup.array().of(
      Yup.object().shape({
        displayName: Yup.string().required('Skill name is required'),
        level: Yup.number().min(1).max(10),
      })
    ),
    acquiredSkills: Yup.array().of(
      Yup.object().shape({
        displayName: Yup.string().required('Skill name is required'),
        level: Yup.number().min(1).max(10),
      })
    ),
    requiredCompletion: Yup.number()
      .min(0, 'Must be between 0 and 100')
      .max(100, 'Must be between 0 and 100'),
    requiredGrade: Yup.number()
      .min(0, 'Must be between 0 and 100')
      .max(100, 'Must be between 0 and 100'),
    programCertificateId: Yup.number()
      .nullable()
      .integer('Certificate ID must be a valid number'),
  });

  const handleImageChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setFieldValue('image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (setFieldValue) => {
    setFieldValue('image', null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Build the learning path key from its parts.
   * Format: path-v1:ORG+NUM+RUN+GRP
   */
  const buildPathKey = (org, num, run, group) => {
    if (org && num && run && group) {
      return `path-v1:${org}+${num}+${run}+${group}`;
    }
    return '';
  };

  /**
   * Parse an existing key into its parts.
   * Returns {organization, pathNumber, pathRun, pathGroup}
   */
  const parsePathKey = (key) => {
    if (!key) {
      return { organization: '', pathNumber: '', pathRun: '', pathGroup: '' };
    }
    const match = key.match(/^path-v1:([^+]+)\+([^+]+)\+([^+]+)\+([^+]+)$/);
    if (match) {
      return {
        organization: match[1],
        pathNumber: match[2],
        pathRun: match[3],
        pathGroup: match[4],
      };
    }
    return { organization: '', pathNumber: '', pathRun: '', pathGroup: '' };
  };

  /**
   * Get all validation errors as a flat list of messages
   */
  const getErrorMessages = (errors) => {
    const errorList = [];

    // Simple field errors
    const simpleFields = {
      displayName: 'Display Name',
      organization: 'Organization',
      pathNumber: 'Path ID',
      pathRun: 'Run',
      pathGroup: 'Group',
      key: 'Learning Path Key',
      subtitle: 'Subtitle',
      description: 'Description',
      level: 'Level',
      duration: 'Duration',
      timeCommitment: 'Time Commitment',
      requiredCompletion: 'Required Completion',
      requiredGrade: 'Required Grade',
    };

    Object.keys(simpleFields).forEach(field => {
      if (errors[field]) {
        errorList.push(`${simpleFields[field]}: ${errors[field]}`);
      }
    });

    // Steps/courses errors
    if (errors.steps) {
      if (typeof errors.steps === 'string') {
        errorList.push(`Courses: ${errors.steps}`);
      } else if (Array.isArray(errors.steps)) {
        errors.steps.forEach((stepError, index) => {
          if (stepError && typeof stepError === 'object') {
            Object.keys(stepError).forEach(field => {
              errorList.push(`Course ${index + 1} - ${field}: ${stepError[field]}`);
            });
          }
        });
      }
    }

    // Skills errors
    const processSkillErrors = (skillErrors, prefix) => {
      if (Array.isArray(skillErrors)) {
        skillErrors.forEach((skillError, index) => {
          if (skillError && typeof skillError === 'object') {
            Object.keys(skillError).forEach(field => {
              errorList.push(`${prefix} ${index + 1} - ${field}: ${skillError[field]}`);
            });
          }
        });
      }
    };

    if (errors.requiredSkills) {
      processSkillErrors(errors.requiredSkills, 'Required Skill');
    }

    if (errors.acquiredSkills) {
      processSkillErrors(errors.acquiredSkills, 'Acquired Skill');
    }

    return errorList;
  };

  /**
   * Generate a URL-friendly slug from display name.
   * Converts to lowercase and replaces spaces with hyphens.
   */
  const generatePathIdFromName = (displayName) => {
    if (!displayName) return '';
    return displayName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  };

  // Common organizations - can be extended
  const organizationOptions = [
    { value: 'edX', label: 'edX' },
    { value: 'MIT', label: 'MIT' },
    { value: 'Harvard', label: 'Harvard' },
    { value: 'Stanford', label: 'Stanford' },
    { value: 'Berkeley', label: 'Berkeley' },
    { value: 'custom', label: 'Other (Custom Organization)' },
  ];

  return (
    <Card className="learning-path-form mb-4">
      <Card.Section>
        <h2 className="h4 mb-3">
          {isEditMode
            ? intl.formatMessage(messages.formTitleEdit)
            : intl.formatMessage(messages.formTitleCreate)}
        </h2>
        <p className="text-muted mb-4">
          <small>
            Fields marked with <span className="text-danger">*</span> are required.
          </small>
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          validateOnBlur
          validateOnChange
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isValid,
            dirty,
            setFieldValue,
          }) => {
            // Check if current org is in predefined list
            useEffect(() => {
              const isCustomOrg = values.organization &&
                availableOrgs.length > 0 &&
                !availableOrgs.slice(0, -1).some(opt => opt.value === values.organization);
              setShowCustomOrg(isCustomOrg);
            }, [values.organization, availableOrgs]);

            // Auto-generate Path ID from display name
            useEffect(() => {
              if (!isEditMode && values.displayName && !touched.pathNumber) {
                const generatedId = generatePathIdFromName(values.displayName);
                if (generatedId) {
                  setFieldValue('pathNumber', generatedId);
                }
              }
            }, [values.displayName, isEditMode, touched.pathNumber, setFieldValue]);

            // Auto-build the key when component parts change
            useEffect(() => {
              const newKey = buildPathKey(
                values.organization,
                values.pathNumber,
                values.pathRun,
                values.pathGroup
              );
              if (newKey && newKey !== values.key) {
                setFieldValue('key', newKey);
              }
            }, [values.organization, values.pathNumber, values.pathRun, values.pathGroup, values.key, setFieldValue]);

            const handleOrgSelectChange = (e) => {
              const selectedValue = e.target.value;
              if (selectedValue === 'custom') {
                setShowCustomOrg(true);
                setFieldValue('organization', '');
              } else {
                setShowCustomOrg(false);
                setFieldValue('organization', selectedValue);
              }
            };

            const handleFormSubmit = (e) => {
              e.preventDefault();

              // Show validation errors if form is invalid
              if (Object.keys(errors).length > 0) {
                setShowValidationErrors(true);
              } else {
                setShowValidationErrors(false);
              }

              handleSubmit(e);
            };

            const errorMessages = getErrorMessages(errors);

            return (
              <Form onSubmit={handleFormSubmit}>
                {/* Validation Summary */}
                {showValidationErrors && errorMessages.length > 0 && (
                  <Alert
                    variant="danger"
                    className="mb-4 border-danger"
                    dismissible
                    onClose={() => setShowValidationErrors(false)}
                    style={{
                      borderWidth: '2px',
                      boxShadow: '0 2px 8px rgba(220, 53, 69, 0.2)'
                    }}
                  >
                    <Alert.Heading className="h5">
                      <strong>⚠ Validation Errors</strong>
                    </Alert.Heading>
                    <p className="mb-2">Please fix the following errors before submitting:</p>
                    <ul className="mb-0 pl-3">
                      {errorMessages.map((error, index) => (
                        <li key={index} className="mb-1">{error}</li>
                      ))}
                    </ul>
                  </Alert>
                )}

                {/* Display Name First */}
                <Form.Group className="mb-4">
                  <Form.Label>
                    {intl.formatMessage(messages.formLabelDisplayName)} <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="displayName"
                    placeholder="e.g., Data Science Learning Path"
                    value={values.displayName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {(touched.displayName || showValidationErrors) && errors.displayName && (
                    <div className="text-danger small mt-1">
                      {errors.displayName}
                    </div>
                  )}
                </Form.Group>

                <hr className="my-4" />

                {/* Learning Path Key Builder */}
                <h3 className="h6 mb-3">Learning Path Identifier</h3>

                <div className="row">
                  <div className="col-md-6">
                    {!showCustomOrg ? (
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Organization <span className="text-danger">*</span>
                        </Form.Label>
                        <Dropdown className="bg-white w-100">
                          <Dropdown.Toggle
                            id="organization-dropdown-toggle"
                            variant="outline-primary"
                            disabled={isEditMode}
                            className="w-100 d-flex justify-content-between align-items-center"
                          >
                            {values.organization || 'Select organization...'}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <div className="px-3 py-2">
                              <SearchField
                                onClear={() => {
                                  setOrgSearchQuery('');
                                }}
                                onSubmit={(value) => setOrgSearchQuery(value)}
                                onChange={(value) => setOrgSearchQuery(value)}
                                value={orgSearchQuery}
                                placeholder="Search organizations..."
                              />
                            </div>
                            <div className="dropdown-divider" />
                            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                              {isLoadingOrgs ? (
                                <div className="px-3 py-3 text-center">
                                  <Spinner animation="border" size="sm" className="mr-2" />
                                  <span className="text-muted">Loading organizations...</span>
                                </div>
                              ) : (
                                <>
                                  {availableOrgs
                                    .filter(org =>
                                      org.label.toLowerCase().includes(orgSearchQuery.toLowerCase())
                                    )
                                    .map((org) => (
                                      <Dropdown.Item
                                        key={org.value}
                                        onClick={() => {
                                          if (org.value === 'custom') {
                                            setShowCustomOrg(true);
                                            setFieldValue('organization', '');
                                          } else {
                                            setShowCustomOrg(false);
                                            setFieldValue('organization', org.value);
                                          }
                                          setOrgSearchQuery('');
                                        }}
                                      >
                                        {org.label}
                                      </Dropdown.Item>
                                    ))}
                                  {availableOrgs.filter(org =>
                                    org.label.toLowerCase().includes(orgSearchQuery.toLowerCase())
                                  ).length === 0 && (
                                    <div className="px-3 py-2 text-muted">
                                      No results found
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </Dropdown.Menu>
                        </Dropdown>
                        {(touched.organization || showValidationErrors) && errors.organization && (
                          <div className="invalid-feedback d-block">
                            {errors.organization}
                          </div>
                        )}
                      </Form.Group>
                    ) : (
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Organization <span className="text-danger">*</span> <Button
                            variant="link"
                            size="sm"
                            onClick={() => {
                              setShowCustomOrg(false);
                              setFieldValue('organization', '');
                            }}
                            disabled={isEditMode}
                          >
                            (select from list)
                          </Button>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="organization"
                          placeholder="Enter organization name..."
                          value={values.organization}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={isEditMode}
                        />
                        {(touched.organization || showValidationErrors) && errors.organization && (
                          <div className="text-danger small mt-1">
                            {errors.organization}
                          </div>
                        )}
                      </Form.Group>
                    )}
                  </div>

                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Path ID <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="pathNumber"
                        placeholder="e.g., data-science-learning-path"
                        value={values.pathNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={isEditMode}
                      />
                      {(touched.pathNumber || showValidationErrors) && errors.pathNumber ? (
                        <div className="text-danger small mt-1">
                          {errors.pathNumber}
                        </div>
                      ) : (
                        <Form.Text className="text-muted small">
                          This will be the unique identifier for this learning path. Auto-generated from the display name.
                        </Form.Text>
                      )}
                    </Form.Group>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Run <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="pathRun"
                        placeholder="e.g., 2025, Fall2025"
                        value={values.pathRun}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={isEditMode}
                      />
                      {(touched.pathRun || showValidationErrors) && errors.pathRun && (
                        <div className="text-danger small mt-1">
                          {errors.pathRun}
                        </div>
                      )}
                    </Form.Group>
                  </div>

                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Group <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="pathGroup"
                        placeholder="e.g., default, cohort1"
                        value={values.pathGroup}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={isEditMode}
                      />
                      {(touched.pathGroup || showValidationErrors) && errors.pathGroup ? (
                        <div className="text-danger small mt-1">
                          {errors.pathGroup}
                        </div>
                      ) : (
                        <Form.Text className="text-muted small">
                          Leave as "default" for standard learning paths.
                        </Form.Text>
                      )}
                    </Form.Group>
                  </div>
                </div>

                {/* Generated Key Preview */}
                {values.key && (
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Generated Learning Path Key
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={values.key}
                      readOnly
                      disabled
                      className="bg-light"
                    />
                    <Form.Text className="text-muted">
                      This key is automatically generated from the fields above
                    </Form.Text>
                  </Form.Group>
                )}

                <hr className="my-4" />

                {/* Basic Information */}
                <h3 className="h6 mb-3">Basic Information</h3>

              <Form.Group className="mb-3">
                <Form.Label>
                  {intl.formatMessage(messages.formLabelSubtitle)}
                </Form.Label>
                <Form.Control
                  type="text"
                  name="subtitle"
                  value={values.subtitle}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  {intl.formatMessage(messages.formLabelDescription)}
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Form.Group>

              {/* Image Upload */}
              <Form.Group className="mb-3">
                <Form.Label>
                  {intl.formatMessage(messages.formLabelImage)}
                </Form.Label>
                {imagePreview && (
                  <div className="mb-2">
                    <Image
                      src={imagePreview}
                      alt="Learning path"
                      style={{ maxWidth: '300px', maxHeight: '200px' }}
                      thumbnail
                    />
                    <div className="mt-2">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleRemoveImage(setFieldValue)}
                      >
                        Remove Image
                      </Button>
                    </div>
                  </div>
                )}
                <Form.Control
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, setFieldValue)}
                />
              </Form.Group>

              {/* Additional Metadata */}
              <Form.Group className="mb-3">
                <Form.Label>
                  {intl.formatMessage(messages.formLabelLevel)}
                </Form.Label>
                <Form.Control
                  as="select"
                  name="level"
                  value={values.level}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="">Select level</option>
                  <option value="beginner">
                    {intl.formatMessage(messages.formLevelBeginner)}
                  </option>
                  <option value="intermediate">
                    {intl.formatMessage(messages.formLevelIntermediate)}
                  </option>
                  <option value="advanced">
                    {intl.formatMessage(messages.formLevelAdvanced)}
                  </option>
                </Form.Control>
              </Form.Group>

              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>
                      {intl.formatMessage(messages.formLabelDuration)}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="duration"
                      placeholder="e.g., 10 Weeks"
                      value={values.duration}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Form.Group>
                </div>

                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>
                      {intl.formatMessage(messages.formLabelTimeCommitment)}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="timeCommitment"
                      placeholder="e.g., 4-6 hours/week"
                      value={values.timeCommitment}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Form.Group>
                </div>
              </div>

              {/* Toggles */}
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  name="sequential"
                  label={intl.formatMessage(messages.formLabelSequential)}
                  checked={values.sequential}
                  onChange={handleChange}
                />
                <Form.Text>
                  {intl.formatMessage(messages.formHelpTextSequential)}
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Check
                  type="checkbox"
                  name="inviteOnly"
                  label={intl.formatMessage(messages.formLabelInviteOnly)}
                  checked={values.inviteOnly}
                  onChange={handleChange}
                />
                <Form.Text>
                  {intl.formatMessage(messages.formHelpTextInviteOnly)}
                </Form.Text>
              </Form.Group>

              <hr className="my-4" />

              {/* Course Steps */}
              <CourseStepsList />

              <hr className="my-4" />

              {/* Required Skills */}
              <SkillsSection
                fieldName="requiredSkills"
                title={intl.formatMessage(messages.skillsRequiredTitle)}
              />

              {/* Acquired Skills */}
              <SkillsSection
                fieldName="acquiredSkills"
                title={intl.formatMessage(messages.skillsAcquiredTitle)}
              />

              <hr className="my-4" />

              {/* Grading Criteria */}
              <GradingCriteriaSection />

              <hr className="my-4" />

              {/* Certificate Attachment */}
              <CertificateSection />

              <hr className="my-4" />

              {/* Action Buttons */}
              <ActionRow>
                <Button variant="tertiary" onClick={onCancel} disabled={isSaving}>
                  {intl.formatMessage(messages.formButtonCancel)}
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  variant="primary"
                >
                  {isSaving ? (
                    <>
                      <Spinner animation="border" size="sm" className="mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      {isEditMode
                        ? intl.formatMessage(messages.formButtonSave)
                        : intl.formatMessage(messages.formButtonCreate)}
                    </>
                  )}
                </Button>
              </ActionRow>
              {showValidationErrors && !isValid && Object.keys(errors).length > 0 && (
                <div className="text-danger text-center mt-2 small">
                  <strong>Please fix validation errors before submitting</strong>
                </div>
              )}

              <PromptIfDirty dirty={dirty} />
            </Form>
            );
          }}
        </Formik>
      </Card.Section>
    </Card>
  );
};

PathForm.propTypes = {
  initialValues: PropTypes.shape({
    key: PropTypes.string,
    organization: PropTypes.string,
    pathNumber: PropTypes.string,
    pathRun: PropTypes.string,
    pathGroup: PropTypes.string,
    displayName: PropTypes.string,
    subtitle: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    level: PropTypes.string,
    duration: PropTypes.string,
    timeCommitment: PropTypes.string,
    sequential: PropTypes.bool,
    inviteOnly: PropTypes.bool,
    steps: PropTypes.arrayOf(PropTypes.object),
    requiredSkills: PropTypes.arrayOf(PropTypes.object),
    acquiredSkills: PropTypes.arrayOf(PropTypes.object),
    requiredCompletion: PropTypes.number,
    requiredGrade: PropTypes.number,
  }).isRequired,
  isEditMode: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isSaving: PropTypes.bool,
};

PathForm.defaultProps = {
  isEditMode: false,
  isSaving: false,
};

export default PathForm;
