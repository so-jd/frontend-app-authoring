import React, { useState, useEffect, useCallback } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Button,
  Tabs,
  Tab,
  Form,
  Alert,
  Spinner,
  AlertModal,
  OverlayTrigger,
  Tooltip,
  Icon,
  Card,
  Badge,
} from '@openedx/paragon';
import { ArrowBack, InfoOutline } from '@openedx/paragon/icons';
import { StudioFooterSlot } from '@edx/frontend-component-footer';

import Header from '../../header';
import CsvUpload from '../components/CsvUpload';
import {
  getLearningPaths,
  bulkEnroll,
  bulkUnenroll,
  fetchGroups,
  enrollUser,
  unenrollUser,
  getUserEnrollments,
  getLearningPathEnrollments,
} from '../data/api';
import messages from '../messages';

const BulkEnrollmentPage = () => {
  const intl = useIntl();
  const navigate = useNavigate();

  // Data state
  const [learningPaths, setLearningPaths] = useState([]);
  const [isLoadingPaths, setIsLoadingPaths] = useState(true);
  const [groups, setGroups] = useState([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);

  // Form state
  const [activeTab, setActiveTab] = useState('enroll');
  const [inputMethod, setInputMethod] = useState('paste');
  const [selectedPaths, setSelectedPaths] = useState([]);
  const [emailsText, setEmailsText] = useState('');
  const [csvEmails, setCsvEmails] = useState([]);
  const [csvPaths, setCsvPaths] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [reason, setReason] = useState('');
  const [org, setOrg] = useState('');
  const [role, setRole] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Search tab state
  const [searchType, setSearchType] = useState('user'); // 'user' | 'path' | 'group'
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [userResults, setUserResults] = useState(null);
  const [pathResults, setPathResults] = useState(null);
  const [groupResults, setGroupResults] = useState(null);
  const [pathEnrollmentsPage, setPathEnrollmentsPage] = useState(1);
  const [pathEnrollmentsPageSize] = useState(50);
  const [quickEnrollPath, setQuickEnrollPath] = useState('');
  const [quickEnrollReason, setQuickEnrollReason] = useState('');

  const loadLearningPaths = useCallback(async () => {
    setIsLoadingPaths(true);
    try {
      const response = await getLearningPaths();
      setLearningPaths(response.results || []);
    } catch (err) {
      setError(intl.formatMessage(messages.errorLoadingPaths));
    } finally {
      setIsLoadingPaths(false);
    }
  }, [intl]);

  const loadGroups = useCallback(async () => {
    if (groups.length > 0) {
      return; // Already loaded
    }
    setIsLoadingGroups(true);
    try {
      const groupsData = await fetchGroups();
      setGroups(groupsData || []);
    } catch (err) {
      setError('Failed to load groups');
    } finally {
      setIsLoadingGroups(false);
    }
  }, [groups.length]);

  useEffect(() => {
    loadLearningPaths();
  }, [loadLearningPaths]);

  // Load groups when switching to groups input method
  useEffect(() => {
    if (inputMethod === 'groups') {
      loadGroups();
    }
  }, [inputMethod, loadGroups]);

  const parseEmails = (text) => {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const matches = text.match(emailRegex) || [];
    return [...new Set(matches)];
  };

  const handleSelectAllPaths = () => {
    if (selectedPaths.length === learningPaths.length) {
      // Deselect all
      setSelectedPaths([]);
    } else {
      // Select all
      setSelectedPaths(learningPaths.map((path) => path.key));
    }
  };

  const handlePathCheckboxChange = (pathKey) => {
    if (selectedPaths.includes(pathKey)) {
      setSelectedPaths(selectedPaths.filter((key) => key !== pathKey));
    } else {
      setSelectedPaths([...selectedPaths, pathKey]);
    }
  };

  const handleSelectAllGroups = () => {
    if (selectedGroups.length === groups.length) {
      // Deselect all
      setSelectedGroups([]);
    } else {
      // Select all
      setSelectedGroups(groups.map((group) => group.id));
    }
  };

  const handleGroupCheckboxChange = (groupId) => {
    if (selectedGroups.includes(groupId)) {
      setSelectedGroups(selectedGroups.filter((id) => id !== groupId));
    } else {
      setSelectedGroups([...selectedGroups, groupId]);
    }
  };

  // Search handlers
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a search term');
      return;
    }

    setIsSearching(true);
    setError('');
    setSuccessMessage('');
    setUserResults(null);
    setPathResults(null);

    try {
      if (searchType === 'user') {
        // Search by username
        const response = await getUserEnrollments(searchQuery.trim());
        const enrollments = response.results || response;
        setUserResults({
          username: searchQuery.trim(),
          enrollments: Array.isArray(enrollments) ? enrollments : [],
        });
      } else {
        // Search by learning path
        const response = await getLearningPathEnrollments(searchQuery.trim());
        const enrollments = response.results || response;
        const path = learningPaths.find((p) => p.key === searchQuery);
        setPathResults({
          path,
          enrollments: Array.isArray(enrollments) ? enrollments : [],
        });
      }
    } catch (err) {
      setError(err.customAttributes?.httpErrorResponseData?.message || 'Failed to search enrollments');
    } finally {
      setIsSearching(false);
    }
  };

  const handleToggleEnrollment = async (enrollment, username) => {
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      // Get username from various possible locations
      const enrollmentUsername = username || enrollment.user?.username || enrollment.username;
      const pathKey = enrollment.learningPath?.key || enrollment.learningPathKey;
      const pathName = enrollment.learningPath?.displayName || enrollment.learningPathName || 'the learning path';

      if (enrollment.isActive) {
        await unenrollUser(pathKey, enrollmentUsername);
        setSuccessMessage(`Unenrolled from ${pathName}`);
      } else {
        await enrollUser(pathKey, enrollmentUsername);
        setSuccessMessage(`Enrolled in ${pathName}`);
      }

      // Refresh search results
      await handleSearch();
    } catch (err) {
      setError(err.customAttributes?.httpErrorResponseData?.message || 'Failed to update enrollment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickEnroll = async () => {
    if (!quickEnrollPath || !userResults) {
      setError('Please select a learning path');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      await enrollUser(quickEnrollPath, userResults.username, {
        reason: quickEnrollReason,
      });

      const pathName = learningPaths.find((p) => p.key === quickEnrollPath)?.displayName || quickEnrollPath;
      setSuccessMessage(`Enrolled ${userResults.username} in ${pathName}`);

      // Clear form and refresh
      setQuickEnrollPath('');
      setQuickEnrollReason('');
      await handleSearch();
    } catch (err) {
      setError(err.customAttributes?.httpErrorResponseData?.message || 'Failed to enroll user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = () => {
    setError('');

    const emails = inputMethod === 'paste' ? parseEmails(emailsText) : csvEmails;
    const hasEmails = emails.length > 0;
    const hasGroups = selectedGroups.length > 0;
    const paths = inputMethod === 'csv' && csvPaths.length > 0 ? csvPaths : selectedPaths;

    // Check if we have either emails or groups
    if (!hasEmails && !hasGroups) {
      setError(intl.formatMessage(messages.bulkEnrollErrorNoEmails));
      return false;
    }

    if (paths.length === 0) {
      setError(intl.formatMessage(messages.bulkEnrollErrorNoPaths));
      return false;
    }

    return true;
  };

  const processSubmission = async () => {
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');
    setShowConfirmModal(false);

    try {
      const emails = inputMethod === 'paste' ? parseEmails(emailsText) : csvEmails;
      const paths = inputMethod === 'csv' && csvPaths.length > 0 ? csvPaths : selectedPaths;

      const enrollmentData = {
        learningPaths: paths,
      };

      // Add emails if we have any
      if (emails.length > 0) {
        enrollmentData.emails = emails;
      }

      // Add group IDs if we have any
      if (selectedGroups.length > 0) {
        enrollmentData.groupIds = selectedGroups;
      }

      if (reason.trim()) {
        enrollmentData.reason = reason.trim();
      }
      if (org.trim()) {
        enrollmentData.org = org.trim();
      }
      if (role.trim()) {
        enrollmentData.role = role.trim();
      }

      let result;
      if (activeTab === 'enroll') {
        result = await bulkEnroll(enrollmentData);
        setSuccessMessage(
          intl.formatMessage(messages.bulkEnrollSuccessEnroll, {
            enrollmentsCreated: result.enrollmentsCreated || 0,
            enrollmentAllowedCreated: result.enrollmentAllowedCreated || 0,
          }),
        );
      } else {
        result = await bulkUnenroll(enrollmentData);
        setSuccessMessage(
          intl.formatMessage(messages.bulkEnrollSuccessUnenroll, {
            enrollmentsUnenrolled: result.enrollmentsUnenrolled || 0,
            enrollmentAllowedDeactivated: result.enrollmentAllowedDeactivated || 0,
          }),
        );
      }

      setEmailsText('');
      setCsvEmails([]);
      setCsvPaths([]);
      setSelectedPaths([]);
      setReason('');
      setOrg('');
      setRole('');
    } catch (err) {
      setError(
        err.response?.data?.detail
          || intl.formatMessage(messages.bulkEnrollErrorGeneric),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (activeTab === 'unenroll') {
      setShowConfirmModal(true);
      return;
    }

    await processSubmission();
  };

  const handleCsvParsed = ({ emails, learningPaths: paths }) => {
    setCsvEmails(emails);
    if (paths.length > 0) {
      setCsvPaths(paths);
    }
    setError('');
  };

  const handleCsvError = (errorMessage) => {
    setError(errorMessage);
  };

  if (isLoadingPaths) {
    return (
      <>
        <Helmet>
          <title>{intl.formatMessage(messages.bulkEnrollTitle)}</title>
        </Helmet>
        <Header isHiddenMainMenu showPageNavigation />
        <Container size="xl" className="px-4 py-5 text-center">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </Container>
        <StudioFooterSlot />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{intl.formatMessage(messages.bulkEnrollTitle)}</title>
      </Helmet>
      <Header isHiddenMainMenu showPageNavigation />
      <Container size="lg" className="px-4 mt-2 mb-3">
        <Button
          variant="tertiary"
          iconBefore={ArrowBack}
          onClick={() => navigate('/learning-paths')}
          className="mb-1 font-weight-bold"
          style={{ fontSize: '0.95rem' }}
        >
          Back to Learning Paths
        </Button>
        <div className="mb-3">
          <h1 className="h2 font-weight-bold mb-1">
            {intl.formatMessage(messages.bulkEnrollTitle)}
          </h1>
          <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>
            {intl.formatMessage(messages.bulkEnrollSubtitle)}
          </p>
        </div>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {successMessage && (
          <Alert variant="success" dismissible onClose={() => setSuccessMessage('')}>
            {successMessage}
          </Alert>
        )}

        <Tabs
          activeKey={activeTab}
          onSelect={(k) => {
            setActiveTab(k);
            setError('');
            setSuccessMessage('');
          }}
          className="mb-4"
        >
          <Tab
            eventKey="enroll"
            title={intl.formatMessage(messages.bulkEnrollTabEnroll)}
          >
            <div className="bg-white p-4 border rounded">
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="d-flex align-items-center">
                    <span>{intl.formatMessage(messages.bulkEnrollSelectPaths)}</span>
                    <OverlayTrigger
                      placement="right"
                      overlay={(
                        <Tooltip id="select-paths-tooltip">
                          Click checkboxes to select multiple learning paths.
                        </Tooltip>
                      )}
                    >
                      <Icon
                        src={InfoOutline}
                        style={{ fontSize: '1rem', cursor: 'help', marginLeft: '0.5rem' }}
                      />
                    </OverlayTrigger>
                  </Form.Label>
                  <div className="mb-2">
                    <Button
                      variant="link"
                      size="sm"
                      onClick={handleSelectAllPaths}
                      disabled={inputMethod === 'csv' && csvPaths.length > 0}
                      className="p-0"
                    >
                      {selectedPaths.length === learningPaths.length ? 'Deselect All' : 'Select All'}
                    </Button>
                  </div>
                  <div
                    style={{
                      maxHeight: '250px',
                      overflowY: 'auto',
                      border: '1px solid #dee2e6',
                      borderRadius: '4px',
                      padding: '0.75rem',
                    }}
                  >
                    {learningPaths.map((path) => (
                      <Form.Check
                        key={path.key}
                        type="checkbox"
                        id={`path-${path.key}`}
                        label={path.displayName}
                        checked={selectedPaths.includes(path.key)}
                        onChange={() => handlePathCheckboxChange(path.key)}
                        disabled={inputMethod === 'csv' && csvPaths.length > 0}
                        className="mb-2"
                      />
                    ))}
                  </div>
                  {selectedPaths.length > 0 && (
                    <div className="mt-2 p-2 bg-success-100 border border-success rounded">
                      <small className="text-success font-weight-bold">
                        ✓ {selectedPaths.length} learning path{selectedPaths.length !== 1 ? 's' : ''} selected
                      </small>
                    </div>
                  )}
                  <Form.Text className="text-muted">
                    {intl.formatMessage(messages.bulkEnrollSelectPathsHelp)}
                    {inputMethod === 'csv' && csvPaths.length > 0 && (
                      <span> (Using paths from CSV)</span>
                    )}
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>
                    {intl.formatMessage(messages.bulkEnrollInputMethod)}
                  </Form.Label>
                  <Tabs
                    activeKey={inputMethod}
                    onSelect={(k) => setInputMethod(k)}
                    className="mb-3"
                  >
                    <Tab
                      eventKey="paste"
                      title={intl.formatMessage(messages.bulkEnrollTabPasteEmails)}
                    >
                      <Form.Control
                        as="textarea"
                        rows={8}
                        value={emailsText}
                        onChange={(e) => setEmailsText(e.target.value)}
                        placeholder={intl.formatMessage(messages.bulkEnrollEmailsPlaceholder)}
                      />
                      <Form.Text className="text-muted">
                        {intl.formatMessage(messages.bulkEnrollEmailsHelp)}
                      </Form.Text>
                    </Tab>
                    <Tab
                      eventKey="csv"
                      title={intl.formatMessage(messages.bulkEnrollTabUploadCsv)}
                    >
                      <CsvUpload
                        onDataParsed={handleCsvParsed}
                        onError={handleCsvError}
                      />
                    </Tab>
                    <Tab
                      eventKey="groups"
                      title={intl.formatMessage(messages.bulkEnrollTabSelectGroups)}
                    >
                      {isLoadingGroups ? (
                        <div className="text-center py-4">
                          <Spinner animation="border" size="sm" className="mr-2" />
                          {intl.formatMessage(messages.bulkEnrollLoadingGroups)}
                        </div>
                      ) : (
                        <>
                          {groups.length === 0 ? (
                            <Alert variant="info">
                              {intl.formatMessage(messages.bulkEnrollNoGroups)}
                            </Alert>
                          ) : (
                            <>
                              <div className="mb-2">
                                <Button
                                  variant="link"
                                  size="sm"
                                  onClick={handleSelectAllGroups}
                                  className="p-0"
                                >
                                  {selectedGroups.length === groups.length ? 'Deselect All' : 'Select All'}
                                </Button>
                              </div>
                              <div
                                style={{
                                  maxHeight: '250px',
                                  overflowY: 'auto',
                                  border: '1px solid #dee2e6',
                                  borderRadius: '4px',
                                  padding: '0.75rem',
                                }}
                              >
                                {groups.map((group) => (
                                  <Form.Check
                                    key={group.id}
                                    type="checkbox"
                                    id={`group-${group.id}`}
                                    label={`${group.name} (${intl.formatMessage(
                                      messages.bulkEnrollGroupMemberCount,
                                      { count: group.memberCount },
                                    )})`}
                                    checked={selectedGroups.includes(group.id)}
                                    onChange={() => handleGroupCheckboxChange(group.id)}
                                    className="mb-2"
                                  />
                                ))}
                              </div>
                            </>
                          )}
                          <Form.Text className="text-muted d-block mt-2">
                            {intl.formatMessage(messages.bulkEnrollGroupsHelp)}
                          </Form.Text>
                        </>
                      )}
                    </Tab>
                  </Tabs>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    {intl.formatMessage(messages.bulkEnrollReasonLabel)}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder={intl.formatMessage(messages.bulkEnrollReasonPlaceholder)}
                  />
                  <Form.Text className="text-muted">
                    {intl.formatMessage(messages.bulkEnrollReasonHelp)}
                  </Form.Text>
                </Form.Group>

                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label>
                        {intl.formatMessage(messages.bulkEnrollOrgLabel)}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={org}
                        onChange={(e) => setOrg(e.target.value)}
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label>
                        {intl.formatMessage(messages.bulkEnrollRoleLabel)}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                      />
                    </Form.Group>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner animation="border" size="sm" className="mr-2" />
                      Processing...
                    </>
                  ) : (
                    intl.formatMessage(messages.bulkEnrollButtonSubmit)
                  )}
                </Button>
              </Form>
            </div>
          </Tab>

          <Tab
            eventKey="unenroll"
            title={intl.formatMessage(messages.bulkEnrollTabUnenroll)}
          >
            <div className="bg-white p-4 border rounded">
              <Alert variant="warning" className="mb-4">
                {intl.formatMessage(messages.bulkEnrollUnenrollWarning)}
              </Alert>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="d-flex align-items-center">
                    <span>{intl.formatMessage(messages.bulkEnrollSelectPaths)}</span>
                    <OverlayTrigger
                      placement="right"
                      overlay={(
                        <Tooltip id="select-paths-tooltip-unenroll">
                          Click checkboxes to select multiple learning paths.
                        </Tooltip>
                      )}
                    >
                      <Icon
                        src={InfoOutline}
                        style={{ fontSize: '1rem', cursor: 'help', marginLeft: '0.5rem' }}
                      />
                    </OverlayTrigger>
                  </Form.Label>
                  <div className="mb-2">
                    <Button
                      variant="link"
                      size="sm"
                      onClick={handleSelectAllPaths}
                      disabled={inputMethod === 'csv' && csvPaths.length > 0}
                      className="p-0"
                    >
                      {selectedPaths.length === learningPaths.length ? 'Deselect All' : 'Select All'}
                    </Button>
                  </div>
                  <div
                    style={{
                      maxHeight: '250px',
                      overflowY: 'auto',
                      border: '1px solid #dee2e6',
                      borderRadius: '4px',
                      padding: '0.75rem',
                    }}
                  >
                    {learningPaths.map((path) => (
                      <Form.Check
                        key={path.key}
                        type="checkbox"
                        id={`path-unenroll-${path.key}`}
                        label={path.displayName}
                        checked={selectedPaths.includes(path.key)}
                        onChange={() => handlePathCheckboxChange(path.key)}
                        disabled={inputMethod === 'csv' && csvPaths.length > 0}
                        className="mb-2"
                      />
                    ))}
                  </div>
                  {selectedPaths.length > 0 && (
                    <div className="mt-2 p-2 bg-success-100 border border-success rounded">
                      <small className="text-success font-weight-bold">
                        ✓ {selectedPaths.length} learning path{selectedPaths.length !== 1 ? 's' : ''} selected
                      </small>
                    </div>
                  )}
                  <Form.Text className="text-muted">
                    {intl.formatMessage(messages.bulkEnrollSelectPathsHelp)}
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>
                    {intl.formatMessage(messages.bulkEnrollInputMethod)}
                  </Form.Label>
                  <Tabs
                    activeKey={inputMethod}
                    onSelect={(k) => setInputMethod(k)}
                    className="mb-3"
                  >
                    <Tab
                      eventKey="paste"
                      title={intl.formatMessage(messages.bulkEnrollTabPasteEmails)}
                    >
                      <Form.Control
                        as="textarea"
                        rows={8}
                        value={emailsText}
                        onChange={(e) => setEmailsText(e.target.value)}
                        placeholder={intl.formatMessage(messages.bulkEnrollEmailsPlaceholder)}
                      />
                      <Form.Text className="text-muted">
                        {intl.formatMessage(messages.bulkEnrollEmailsHelp)}
                      </Form.Text>
                    </Tab>
                    <Tab
                      eventKey="csv"
                      title={intl.formatMessage(messages.bulkEnrollTabUploadCsv)}
                    >
                      <CsvUpload
                        onDataParsed={handleCsvParsed}
                        onError={handleCsvError}
                      />
                    </Tab>
                    <Tab
                      eventKey="groups"
                      title={intl.formatMessage(messages.bulkEnrollTabSelectGroups)}
                    >
                      {isLoadingGroups ? (
                        <div className="text-center py-4">
                          <Spinner animation="border" size="sm" className="mr-2" />
                          {intl.formatMessage(messages.bulkEnrollLoadingGroups)}
                        </div>
                      ) : (
                        <>
                          {groups.length === 0 ? (
                            <Alert variant="info">
                              {intl.formatMessage(messages.bulkEnrollNoGroups)}
                            </Alert>
                          ) : (
                            <>
                              <div className="mb-2">
                                <Button
                                  variant="link"
                                  size="sm"
                                  onClick={handleSelectAllGroups}
                                  className="p-0"
                                >
                                  {selectedGroups.length === groups.length ? 'Deselect All' : 'Select All'}
                                </Button>
                              </div>
                              <div
                                style={{
                                  maxHeight: '250px',
                                  overflowY: 'auto',
                                  border: '1px solid #dee2e6',
                                  borderRadius: '4px',
                                  padding: '0.75rem',
                                }}
                              >
                                {groups.map((group) => (
                                  <Form.Check
                                    key={group.id}
                                    type="checkbox"
                                    id={`group-${group.id}`}
                                    label={`${group.name} (${intl.formatMessage(
                                      messages.bulkEnrollGroupMemberCount,
                                      { count: group.memberCount },
                                    )})`}
                                    checked={selectedGroups.includes(group.id)}
                                    onChange={() => handleGroupCheckboxChange(group.id)}
                                    className="mb-2"
                                  />
                                ))}
                              </div>
                            </>
                          )}
                          <Form.Text className="text-muted d-block mt-2">
                            {intl.formatMessage(messages.bulkEnrollGroupsHelp)}
                          </Form.Text>
                        </>
                      )}
                    </Tab>
                  </Tabs>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    {intl.formatMessage(messages.bulkEnrollReasonLabel)}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder={intl.formatMessage(messages.bulkEnrollReasonPlaceholder)}
                  />
                  <Form.Text className="text-muted">
                    {intl.formatMessage(messages.bulkEnrollReasonHelp)}
                  </Form.Text>
                </Form.Group>

                <Button
                  type="submit"
                  variant="danger"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner animation="border" size="sm" className="mr-2" />
                      Processing...
                    </>
                  ) : (
                    intl.formatMessage(messages.bulkUnenrollButtonSubmit)
                  )}
                </Button>
              </Form>
            </div>
          </Tab>

          <Tab
            eventKey="search"
            title="Search"
          >
            <div className="bg-white p-4 border rounded">
              <h3 className="h5 mb-3">Search Enrollments</h3>

              {/* Search Interface */}
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Search for:</Form.Label>
                  <div className="d-flex align-items-center mb-3" style={{ gap: '1.5rem' }}>
                    <Form.Check
                      inline
                      type="radio"
                      id="search-type-user"
                      name="searchType"
                      label="User"
                      checked={searchType === 'user'}
                      onChange={() => {
                        setSearchType('user');
                        setSearchQuery('');
                      }}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      id="search-type-path"
                      name="searchType"
                      label="Learning Path"
                      checked={searchType === 'path'}
                      onChange={() => {
                        setSearchType('path');
                        setSearchQuery('');
                      }}
                    />
                  </div>

                  {searchType === 'user' ? (
                    <Form.Control
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Enter username or email..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSearch();
                        }
                      }}
                    />
                  ) : (
                    <Form.Control
                      as="select"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    >
                      <option value="">Select a learning path...</option>
                      {learningPaths.map((path) => (
                        <option key={path.key} value={path.key}>
                          {path.displayName}
                        </option>
                      ))}
                    </Form.Control>
                  )}
                </Form.Group>

                <Button
                  variant="primary"
                  onClick={handleSearch}
                  disabled={isSearching || !searchQuery.trim()}
                >
                  {isSearching ? (
                    <>
                      <Spinner animation="border" size="sm" className="mr-2" />
                      Searching...
                    </>
                  ) : (
                    'Search'
                  )}
                </Button>
              </Form>

              {/* User Search Results */}
              {userResults && (
                <div className="mt-4">
                  <Card className="shadow-sm border-0" style={{ overflow: 'hidden' }}>
                    <Card.Header className="bg-white border-bottom" style={{ padding: '1.25rem 1.5rem' }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h4 className="h5 mb-1 font-weight-bold">User Enrollments</h4>
                          <div className="text-muted" style={{ fontSize: '0.9rem' }}>
                            {userResults.username}
                          </div>
                        </div>
                        {userResults.enrollments.length > 0 && (
                          <div className="d-flex align-items-center" style={{ gap: '2rem' }}>
                            <div className="text-center" style={{ minWidth: '60px' }}>
                              <div className="small text-muted mb-1" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total</div>
                              <div className="h5 mb-0 font-weight-bold">{userResults.enrollments.length}</div>
                            </div>
                            <div className="text-center" style={{ minWidth: '60px' }}>
                              <div className="small text-muted mb-1" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active</div>
                              <div className="h5 mb-0 font-weight-bold text-success">
                                {userResults.enrollments.filter((e) => e.isActive).length}
                              </div>
                            </div>
                            <div className="text-center" style={{ minWidth: '60px' }}>
                              <div className="small text-muted mb-1" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Inactive</div>
                              <div className="h5 mb-0 font-weight-bold text-secondary">
                                {userResults.enrollments.filter((e) => !e.isActive).length}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </Card.Header>
                    <Card.Body style={{ padding: 0 }}>
                      {userResults.enrollments.length === 0 ? (
                        <div style={{ padding: '2rem' }}>
                          <Alert variant="info" className="mb-0">
                            <p className="mb-0">No enrollments found for this user.</p>
                          </Alert>
                        </div>
                      ) : (
                        <div className="table-responsive">
                          <table className="table mb-0" style={{ tableLayout: 'fixed' }}>
                            <colgroup>
                              <col style={{ width: '45%' }} />
                              <col style={{ width: '15%' }} />
                              <col style={{ width: '25%' }} />
                              <col style={{ width: '15%' }} />
                            </colgroup>
                            <thead style={{ backgroundColor: '#f8f9fa' }}>
                              <tr>
                                <th
                                  className="border-0 align-middle"
                                  style={{
                                    fontWeight: 600,
                                    fontSize: '0.875rem',
                                    padding: '1rem 1.5rem',
                                    color: '#495057',
                                  }}
                                >
                                  Learning Path
                                </th>
                                <th
                                  className="border-0 align-middle"
                                  style={{
                                    fontWeight: 600,
                                    fontSize: '0.875rem',
                                    padding: '1rem 1rem',
                                    color: '#495057',
                                  }}
                                >
                                  Status
                                </th>
                                <th
                                  className="border-0 align-middle"
                                  style={{
                                    fontWeight: 600,
                                    fontSize: '0.875rem',
                                    padding: '1rem 1rem',
                                    color: '#495057',
                                  }}
                                >
                                  Enrolled Date
                                </th>
                                <th
                                  className="border-0 align-middle text-right"
                                  style={{
                                    fontWeight: 600,
                                    fontSize: '0.875rem',
                                    padding: '1rem 1.5rem',
                                    color: '#495057',
                                  }}
                                >
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {userResults.enrollments.map((enrollment) => (
                                <tr
                                  key={enrollment.learningPath.key}
                                  style={{
                                    borderTop: '1px solid #e9ecef',
                                    transition: 'background-color 0.15s ease-in-out',
                                  }}
                                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8f9fa'; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                                >
                                  <td className="align-middle" style={{ padding: '1rem 1.5rem' }}>
                                    <div className="font-weight-bold" style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                                      {enrollment.learningPath.displayName}
                                    </div>
                                    <div className="small text-muted" style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>
                                      {enrollment.learningPath.key}
                                    </div>
                                  </td>
                                  <td className="align-middle" style={{ padding: '1rem 1rem' }}>
                                    <Badge
                                      variant={enrollment.isActive ? 'success' : 'secondary'}
                                      style={{
                                        fontSize: '0.8rem',
                                        padding: '0.4em 0.75em',
                                        fontWeight: 600,
                                      }}
                                    >
                                      {enrollment.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                  </td>
                                  <td className="align-middle" style={{ padding: '1rem 1rem' }}>
                                    <div style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                                      {new Date(enrollment.created).toLocaleDateString()}
                                    </div>
                                    <div className="small text-muted" style={{ fontSize: '0.8rem' }}>
                                      {new Date(enrollment.created).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                  </td>
                                  <td className="align-middle text-right" style={{ padding: '1rem 1.5rem' }}>
                                    <Button
                                      variant={enrollment.isActive ? 'outline-danger' : 'outline-success'}
                                      size="sm"
                                      onClick={() => handleToggleEnrollment(enrollment, userResults.username)}
                                      disabled={isSubmitting}
                                      style={{ minWidth: '85px' }}
                                    >
                                      {enrollment.isActive ? 'Unenroll' : 'Enroll'}
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </Card.Body>
                  </Card>

                  {/* Quick Enroll Section */}
                  <Card className="shadow-sm border-0 mt-4" style={{ overflow: 'hidden' }}>
                    <Card.Header className="bg-light border-bottom" style={{ padding: '1rem 1.5rem' }}>
                      <h5 className="h6 mb-0 font-weight-bold">
                        Quick Enroll: {userResults.username}
                      </h5>
                    </Card.Header>
                    <Card.Body style={{ padding: '1.5rem' }}>
                      <Form onSubmit={(e) => { e.preventDefault(); handleQuickEnroll(); }}>
                        <div className="row">
                          <div className="col-md-5">
                            <Form.Group className="mb-3">
                              <Form.Label className="font-weight-bold" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                Learning Path <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                as="select"
                                value={quickEnrollPath}
                                onChange={(e) => setQuickEnrollPath(e.target.value)}
                              >
                                <option value="">Select a learning path...</option>
                                {learningPaths.map((path) => (
                                  <option key={path.key} value={path.key}>
                                    {path.displayName}
                                  </option>
                                ))}
                              </Form.Control>
                            </Form.Group>
                          </div>
                          <div className="col-md-5">
                            <Form.Group className="mb-3">
                              <Form.Label className="font-weight-bold" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                Reason <span className="text-muted">(Optional)</span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                value={quickEnrollReason}
                                onChange={(e) => setQuickEnrollReason(e.target.value)}
                                placeholder="e.g., Requested by instructor"
                              />
                            </Form.Group>
                          </div>
                          <div className="col-md-2 d-flex align-items-end">
                            <Form.Group className="mb-3 w-100">
                              <Button
                                type="submit"
                                variant="primary"
                                onClick={handleQuickEnroll}
                                disabled={isSubmitting || !quickEnrollPath}
                                className="w-100"
                                style={{ height: '38px' }}
                              >
                                {isSubmitting ? (
                                  <>
                                    <Spinner animation="border" size="sm" className="mr-2" />
                                    Enrolling...
                                  </>
                                ) : (
                                  'Enroll'
                                )}
                              </Button>
                            </Form.Group>
                          </div>
                        </div>
                      </Form>
                    </Card.Body>
                  </Card>
                </div>
              )}

              {/* Path Search Results */}
              {pathResults && (
                <div className="mt-4">
                  <Card className="shadow-sm border-0" style={{ overflow: 'hidden' }}>
                    <Card.Header className="bg-white border-bottom" style={{ padding: '1.25rem 1.5rem' }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h4 className="h5 mb-1 font-weight-bold">
                            {pathResults.path?.displayName || 'Learning Path'}
                          </h4>
                          <div className="small text-muted" style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                            {pathResults.path?.key}
                          </div>
                        </div>
                        {pathResults.enrollments.length > 0 && (
                          <div className="d-flex align-items-center" style={{ gap: '2rem' }}>
                            <div className="text-center" style={{ minWidth: '60px' }}>
                              <div className="small text-muted mb-1" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total</div>
                              <div className="h5 mb-0 font-weight-bold">{pathResults.enrollments.length}</div>
                            </div>
                            <div className="text-center" style={{ minWidth: '60px' }}>
                              <div className="small text-muted mb-1" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active</div>
                              <div className="h5 mb-0 font-weight-bold text-success">
                                {pathResults.enrollments.filter((e) => e.isActive).length}
                              </div>
                            </div>
                            <div className="text-center" style={{ minWidth: '60px' }}>
                              <div className="small text-muted mb-1" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Inactive</div>
                              <div className="h5 mb-0 font-weight-bold text-secondary">
                                {pathResults.enrollments.filter((e) => !e.isActive).length}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </Card.Header>
                    <Card.Body style={{ padding: 0 }}>
                      {pathResults.enrollments.length === 0 ? (
                        <div style={{ padding: '2rem' }}>
                          <Alert variant="info" className="mb-0">
                            <p className="mb-0">No users enrolled in this learning path.</p>
                          </Alert>
                        </div>
                      ) : (
                        <div className="table-responsive">
                          <table className="table mb-0" style={{ tableLayout: 'fixed' }}>
                            <colgroup>
                              <col style={{ width: '20%' }} />
                              <col style={{ width: '30%' }} />
                              <col style={{ width: '15%' }} />
                              <col style={{ width: '20%' }} />
                              <col style={{ width: '15%' }} />
                            </colgroup>
                            <thead style={{ backgroundColor: '#f8f9fa' }}>
                              <tr>
                                <th
                                  className="border-0 align-middle"
                                  style={{
                                    fontWeight: 600,
                                    fontSize: '0.875rem',
                                    padding: '1rem 1.5rem',
                                    color: '#495057',
                                  }}
                                >
                                  User
                                </th>
                                <th
                                  className="border-0 align-middle"
                                  style={{
                                    fontWeight: 600,
                                    fontSize: '0.875rem',
                                    padding: '1rem 1rem',
                                    color: '#495057',
                                  }}
                                >
                                  Email
                                </th>
                                <th
                                  className="border-0 align-middle"
                                  style={{
                                    fontWeight: 600,
                                    fontSize: '0.875rem',
                                    padding: '1rem 1rem',
                                    color: '#495057',
                                  }}
                                >
                                  Status
                                </th>
                                <th
                                  className="border-0 align-middle"
                                  style={{
                                    fontWeight: 600,
                                    fontSize: '0.875rem',
                                    padding: '1rem 1rem',
                                    color: '#495057',
                                  }}
                                >
                                  Enrolled Date
                                </th>
                                <th
                                  className="border-0 align-middle text-right"
                                  style={{
                                    fontWeight: 600,
                                    fontSize: '0.875rem',
                                    padding: '1rem 1.5rem',
                                    color: '#495057',
                                  }}
                                >
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {pathResults.enrollments.map((enrollment) => (
                                <tr
                                  key={enrollment.user.username}
                                  style={{
                                    borderTop: '1px solid #e9ecef',
                                    transition: 'background-color 0.15s ease-in-out',
                                  }}
                                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8f9fa'; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                                >
                                  <td className="align-middle" style={{ padding: '1rem 1.5rem' }}>
                                    <div className="font-weight-bold" style={{ fontSize: '0.9rem' }}>
                                      {enrollment.user?.username || enrollment.username || 'N/A'}
                                    </div>
                                  </td>
                                  <td className="align-middle" style={{ padding: '1rem 1rem' }}>
                                    <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                                      {enrollment.user?.email || enrollment.email || 'N/A'}
                                    </div>
                                  </td>
                                  <td className="align-middle" style={{ padding: '1rem 1rem' }}>
                                    <Badge
                                      variant={enrollment.isActive ? 'success' : 'secondary'}
                                      style={{
                                        fontSize: '0.8rem',
                                        padding: '0.4em 0.75em',
                                        fontWeight: 600,
                                      }}
                                    >
                                      {enrollment.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                  </td>
                                  <td className="align-middle" style={{ padding: '1rem 1rem' }}>
                                    <div style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                                      {new Date(enrollment.created).toLocaleDateString()}
                                    </div>
                                    <div className="small text-muted" style={{ fontSize: '0.8rem' }}>
                                      {new Date(enrollment.created).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                  </td>
                                  <td className="align-middle text-right" style={{ padding: '1rem 1.5rem' }}>
                                    {enrollment.isActive && (
                                      <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleToggleEnrollment(enrollment)}
                                        disabled={isSubmitting}
                                        style={{ minWidth: '85px' }}
                                      >
                                        Unenroll
                                      </Button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </div>
              )}
            </div>
          </Tab>
        </Tabs>

        <AlertModal
          title="Confirm Unenrollment"
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          footerNode={(
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <Button variant="tertiary" onClick={() => setShowConfirmModal(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={processSubmission}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Confirm Unenrollment'}
              </Button>
            </div>
          )}
        >
          <p>
            Are you sure you want to unenroll these users? This action will remove their access
            to the selected learning paths.
          </p>
        </AlertModal>
      </Container>
      <StudioFooterSlot />
    </>
  );
};

export default BulkEnrollmentPage;
